package db

type User struct {
	ID    uint   `gorm:"primaryKey"`
	Name  string `gorm:"not null"`
	Email string `gorm:"unique"`
	Pwd   string `gorm:"not null"`
}
