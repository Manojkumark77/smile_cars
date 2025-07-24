package db

import (
	"encoding/json"
	"log"
	"os"

	"gorm.io/gorm"
)

func SeedCars(db *gorm.DB) {
	var count int64
	db.Model(&Car{}).Count(&count)
	if count > 0 {
		return
	}

	file, err := os.Open("data/cars.json")
	if err != nil {
		log.Fatalf("Failed to open cars.json: %v", err)
	}
	defer file.Close()

	var cars []Car
	if err := json.NewDecoder(file).Decode(&cars); err != nil {
		log.Fatalf("Failed to decode car data: %v", err)
	}

	if err := db.Create(&cars).Error; err != nil {
		log.Fatalf("Failed to seed car data: %v", err)
	}

	log.Printf("Seeded %d cars\n", len(cars))
}
