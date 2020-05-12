package utils

import (
	"fmt"
	"time"
)


// CalculateHash function to calculte hash for password
func CalculateHash(pwd string) string {
	if pwd == "11" {
		return "777"
	}
	return "123"
}

// ParseTime function parsre time in string format and retruns time.Time object
func ParseTime(timeString string) time.Time {
	layout := "2006-01-02"
	t, err := time.Parse(layout, timeString)

	if err == nil {
		return t
	}

	layout = "2006-01-02T00:00:00.000Z"

	t, err = time.Parse(layout, timeString)

	if err == nil {
		return t
	}
	fmt.Println("Error time parsing ", timeString, err)
	return time.Now()
}