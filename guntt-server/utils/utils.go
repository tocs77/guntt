package utils

import (
	"crypto/rand"
	"fmt"
	"log"
	"time"

	"golang.org/x/crypto/bcrypt"
)

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

// GenerateToken returns random token for authentication purposes
func GenerateToken() string {
	b := make([]byte, 10)
	rand.Read(b)
	return fmt.Sprintf("%x", b)

}

// CalculateHash function to calculte hash for password
func CalculateHash(pwd string) string {
	return hashAndSalt([]byte(pwd))
}

// ComparePasswords compares plain password and hash returns true id matches
func ComparePasswords(hashedPwd string, plainPwd string) bool {

	byteHash := []byte(hashedPwd)
	bytePwd := []byte(plainPwd)
	err := bcrypt.CompareHashAndPassword(byteHash, bytePwd)
	if err != nil {
		log.Println(err)
		return false
	}

	return true
}

func hashAndSalt(pwd []byte) string {

	// Use GenerateFromPassword to hash & salt pwd
	// MinCost is just an integer constant provided by the bcrypt
	// package along with DefaultCost & MaxCost.
	hash, err := bcrypt.GenerateFromPassword(pwd, bcrypt.MinCost)
	if err != nil {
		log.Println(err)
	} // GenerateFromPassword returns a byte slice so we need to
	// convert the bytes to a string and return it
	return string(hash)
}
