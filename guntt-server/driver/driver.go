package driver

import (
	"database/sql"
	"log"
)

var db *sql.DB

func logFatal(err error) {
	if err != nil {
		log.Fatal(err)
	}
}

// ConnectDB connects to database
func ConnectDB() *sql.DB {
	var err error
	db, err = sql.Open("sqlite3", "./gunnt.db")
	logFatal(err)

	err = db.Ping()

	logFatal(err)

	return db
}
