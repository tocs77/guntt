package models

import "time"

// Task structure
type Task struct {
	Task      string    `json:"task"`
	ID        string    `json:"id"`
	Done      bool      `json:"done"`
	StartDate time.Time `json:"startDate"`
	EndDate   time.Time `json:"endDate"`
}

//TaskString to fill from JSON to utilize all time formats
type TaskString struct {
	Task      string `json:"task"`
	ID        string `json:"id"`
	Done      bool   `json:"done"`
	StartDate string `json:"startDate"`
	EndDate   string `json:"endDate"`
}
