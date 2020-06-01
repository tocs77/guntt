package driver

import (
	"database/sql"
	"fmt"
	"log"
)

var db *sql.DB

var dbPath string = "./gunnt.db"

// ConnectDB connects to database
func ConnectDB(logChannel chan string) *sql.DB {
	var err error
	logChannel <- fmt.Sprintf("Try to open database at %s", dbPath)
	db, err = sql.Open("sqlite3", dbPath)
	if err != nil {
		msg := fmt.Sprintf("Error opening database %s", err)
		logChannel <- msg
		log.Fatal(err)
	}

	err = db.Ping()

	if err != nil {
		msg := fmt.Sprintf("Error ping database %s", err)
		logChannel <- msg
		log.Fatal(err)
	}

	logChannel <- "Database opened successfully"

	return db
}
