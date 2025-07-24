package db

import (
	"time"
)

type Booking struct {
	ID          uint      `gorm:"primaryKey"`
	CarID       uint      `gorm:"not null"`                      
	Car         Car       `gorm:"foreignKey:CarID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	UserID      uint `gorm:"not null"`
    User        User `gorm:"foreignKey:UserID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	Contact     string    `json:"contact"`
	License     string    `json:"license"`
	Amount      float64   `json:"amount"`
	PickupTime  time.Time `json:"pickupTime"`
	ReturnTime  time.Time `json:"returnTime"`
}
