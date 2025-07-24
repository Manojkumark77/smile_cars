package db

type Car struct {
	ID           uint   `gorm:"primaryKey"`
	Brand        string `json:"brand"`
	Model        string `json:"model"`
	Image        string `json:"image"`
	Fuel         string `json:"fuel"`
	Seater       uint32 `json:"seater"`
	Transmission string `json:"transmission"`
	PricePerDay  uint32 `json:"pricePerDay"`
	Description  string `json:"description"`
}
