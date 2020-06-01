package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	_ "github.com/mattn/go-sqlite3"

	"guntt-srv/controllers"
	"guntt-srv/driver"
	"guntt-srv/logger"
)

var db *sql.DB

func main() {

	// loads values from .env into the system
	if err := godotenv.Load(); err != nil {
		log.Print("No .env file found")
	}

	logChannel := make(chan string, 5)

	go logger.Logger(logChannel)

	db = driver.ConnectDB(logChannel)
	router := mux.NewRouter()

	router.HandleFunc("/tasks", logger.LogRequestHandler(controllers.GetTasks(db), logChannel)).Methods("GET")
	router.HandleFunc("/tasks", logger.LogRequestHandler(controllers.SetOptions(db), logChannel)).Methods("OPTIONS")
	router.HandleFunc("/tasks", logger.LogRequestHandler(controllers.DeleteTask(db), logChannel)).Methods("DELETE")
	router.HandleFunc("/tasks", logger.LogRequestHandler(controllers.AddTask(db), logChannel)).Methods("POST")
	router.HandleFunc("/tasks", logger.LogRequestHandler(controllers.UpdateTask(db), logChannel)).Methods("PUT")

	router.HandleFunc("/auth", logger.LogRequestHandler(controllers.Authenticate(db), logChannel)).Methods("POST")
	router.HandleFunc("/auth", logger.LogRequestHandler(controllers.CheckToken(db), logChannel)).Methods("GET")
	router.HandleFunc("/auth", logger.LogRequestHandler(controllers.SetOptions(db), logChannel)).Methods("OPTIONS")

	router.HandleFunc("/signup", logger.LogRequestHandler(controllers.Signup(db), logChannel)).Methods("POST")
	router.HandleFunc("/signup", logger.LogRequestHandler(controllers.SetOptions(db), logChannel)).Methods("OPTIONS")

	staticDir, exists := os.LookupEnv("STATIC_DIR")
	if !exists {
		log.Print("No STATIC_DIR found")
	}
	router.PathPrefix("/").Handler(http.StripPrefix("/", http.FileServer(http.Dir(staticDir))))

	logChannel <- "Guntt server started"

	fmt.Println("Guntt server started at", time.Now())

	http.ListenAndServe(":3030", router)
}
