package main

import (
	"backend/db"
	pb "backend/proto"
	"bytes"
	"context"
	"errors"
	"io"
	"log"
	"net"
	"net/http"
	"time"

	"github.com/grpc-ecosystem/grpc-gateway/v2/runtime"
	"golang.org/x/crypto/bcrypt"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/credentials/insecure"
	"google.golang.org/grpc/status"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

type server struct {
	pb.UnimplementedCarServiceServer
	db *gorm.DB
}

func (s *server) ListCars(ctx context.Context, req *pb.ListCarsRequest) (*pb.ListCarsResponse, error) {
	var cars []db.Car
	query := s.db.Model(&db.Car{})

	if req.Brand != "" {
		query = query.Where("brand = ?", req.Brand)
	}

	pickup := req.PickupTime.AsTime()
	returnTime := req.ReturnTime.AsTime()

	subQuery := s.db.Model(&db.Booking{}).
		Select("car_id").
		Where("pickup_time < ? AND return_time > ?", returnTime, pickup)

	query = query.Where("id NOT IN (?)", subQuery)

	if err := query.Find(&cars).Error; err != nil {
		return nil, err
	}

	var pbCars []*pb.Car
	for _, c := range cars {
		pbCars = append(pbCars, &pb.Car{
			Id:           uint32(c.ID),
			Brand:        c.Brand,
			Model:        c.Model,
			Image:        c.Image,
			Fuel:         c.Fuel,
			Seater:       c.Seater,
			Transmission: c.Transmission,
			PricePerDay:  c.PricePerDay,
			Description:  c.Description,
		})
	}

	var brands []string
	if err := s.db.Model(&db.Car{}).Distinct().Pluck("brand", &brands).Error; err != nil {
		return nil, err
	}

	return &pb.ListCarsResponse{
		Cars:   pbCars,
		Brands: brands,
	}, nil
}


func (s *server) CreateBooking(ctx context.Context, req *pb.CreateBookingRequest) (*pb.CreateBookingResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "request is nil")
	}

	newPickup := req.PickupTime.AsTime()
	newReturn := req.ReturnTime.AsTime()

	var conflictCount int64
	err := s.db.Model(&db.Booking{}).
		Where("car_id = ? AND pickup_time < ? AND return_time > ?", req.CarId, newReturn, newPickup).
		Count(&conflictCount).Error
	if err != nil {
		return nil, status.Errorf(codes.Internal, "failed to check existing bookings: %v", err)
	}
	if conflictCount > 0 {
		return nil, status.Error(codes.AlreadyExists, "car already booked for the selected time range")
	}

	newBooking := db.Booking{
		CarID:      uint(req.CarId),
		UserID:     uint(req.UserId),
		Contact:    req.Contact,
		License:    req.License,
		Amount:     float64(req.Amount),
		PickupTime: newPickup,
		ReturnTime: newReturn,
	}

	if err := s.db.Create(&newBooking).Error; err != nil {
		return nil, status.Errorf(codes.Internal, "insert failed: %v", err)
	}

	return &pb.CreateBookingResponse{
		Message: "Booking created successfully",
	}, nil
}

func (s * server) SignUp(ctx context.Context, req *pb.SignUpRequest) (*pb.SignUpResponse, error) {
    var existing db.User
    if err := s.db.Where("email = ?", req.Email).First(&existing).Error; err == nil {
        return nil, status.Errorf(codes.AlreadyExists, "email already registered")
    } else if !errors.Is(err, gorm.ErrRecordNotFound) {
        return nil, status.Errorf(codes.Internal, "database error: %v", err)
    }

	hashedPwd, err := bcrypt.GenerateFromPassword([]byte(req.Pwd), bcrypt.DefaultCost)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "failed to hash password: %v", err)
	}

    newUser := db.User{
        Name:  req.Name,
        Email: req.Email,
        Pwd:   string(hashedPwd), 
    }

    if err := s.db.Create(&newUser).Error; err != nil {
        return nil, status.Errorf(codes.Internal, "failed to create user: %v", err)
    }

    return &pb.SignUpResponse{
        Message: "Signup successful",
        User: &pb.User{
            Id:    int64(newUser.ID),
            Name:  newUser.Name,
            Email: newUser.Email,
            Pwd:   "",
        },
    }, nil
}

func (s * server) Login(ctx context.Context, req *pb.LoginRequest) (*pb.LoginResponse, error) {
    var user db.User
    if err := s.db.Where("email = ?", req.Email).First(&user).Error; err != nil {
        if errors.Is(err, gorm.ErrRecordNotFound) {
            return &pb.LoginResponse{
                Success: false,
                Message: "Email not registered",
            }, nil
        }
        return nil, status.Errorf(codes.Internal, "failed to query user: %v", err)
    }

   if err := bcrypt.CompareHashAndPassword([]byte(user.Pwd), []byte(req.Pwd)); err != nil {
		return &pb.LoginResponse{
			Success: false,
			Message: "Incorrect password",
		}, nil
	}

    return &pb.LoginResponse{
        Success: true,
        Message: "Login successful",
        User: &pb.User{
            Id:    int64(user.ID),
            Name:  user.Name,
            Email: user.Email,
            Pwd:   "",
        },
    }, nil
}


func connectDB() (*gorm.DB, error) {
	dsn := "testuser:testpass@tcp(db:3306)/testdb?charset=utf8mb4&parseTime=True&loc=Local"
	var dbConn *gorm.DB
	var err error

	for i := 0; i < 10; i++ {
		dbConn, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
		if err == nil {
			sqlDB, _ := dbConn.DB()
			if pingErr := sqlDB.Ping(); pingErr == nil {
				log.Println("Connected to MySQL database")
				return dbConn, nil
			}
		}
		log.Println("Retrying DB connection...")
		time.Sleep(3 * time.Second)
	}
	return nil, err
}

func main() {
	dbConn, err := connectDB()
	if err != nil {
		log.Fatal("DB connection failed:", err)
	}

	dbConn.AutoMigrate(&db.Car{}, &db.Booking{},&db.User{})
	


	db.SeedCars(dbConn)

	grpcServer := grpc.NewServer()
	pb.RegisterCarServiceServer(grpcServer, &server{db: dbConn})

	go func() {
		lis, err := net.Listen("tcp", ":50051")
		if err != nil {
			log.Fatalf("Failed to listen on port 50051: %v", err)
		}
		log.Println("gRPC server listening on :50051")
		if err := grpcServer.Serve(lis); err != nil {
			log.Fatalf("Failed to serve gRPC: %v", err)
		}
	}()

	ctx := context.Background()
	mux := runtime.NewServeMux()
	err = pb.RegisterCarServiceHandlerFromEndpoint(ctx, mux, "localhost:50051", []grpc.DialOption{
		grpc.WithTransportCredentials(insecure.NewCredentials()),
	})
	if err != nil {
		log.Fatalf("Failed to start HTTP gateway: %v", err)
	}

	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	log.Printf("Incoming request: %s %s", r.Method, r.URL.Path)
	body, _ := io.ReadAll(r.Body)
	log.Printf("Request body: %s", string(body))
	r.Body = io.NopCloser(bytes.NewReader(body))

	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}
	mux.ServeHTTP(w, r)
})
	

	log.Println("REST API Gateway listening on :8080")
	if err := http.ListenAndServe(":8080", handler); err != nil {
		log.Fatalf("Failed to serve HTTP: %v", err)
	}
}