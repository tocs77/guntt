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

	db = driver.ConnectDB()
	router := mux.NewRouter()

	router.HandleFunc("/tasks", logger.LogRequestHandler(controllers.GetTasks(db))).Methods("GET")
	router.HandleFunc("/tasks", logger.LogRequestHandler(controllers.SetOptions(db))).Methods("OPTIONS")
	router.HandleFunc("/tasks", logger.LogRequestHandler(controllers.DeleteTask(db))).Methods("DELETE")
	router.HandleFunc("/tasks", logger.LogRequestHandler(controllers.AddTask(db))).Methods("POST")
	router.HandleFunc("/tasks", logger.LogRequestHandler(controllers.UpdateTask(db))).Methods("PUT")

	router.HandleFunc("/auth", logger.LogRequestHandler(controllers.Authenticate(db))).Methods("POST")
	router.HandleFunc("/auth", logger.LogRequestHandler(controllers.CheckToken(db))).Methods("GET")
	router.HandleFunc("/auth", logger.LogRequestHandler(controllers.SetOptions(db))).Methods("OPTIONS")

	router.HandleFunc("/signup", logger.LogRequestHandler(controllers.Signup(db))).Methods("POST")
	router.HandleFunc("/signup", logger.LogRequestHandler(controllers.SetOptions(db))).Methods("OPTIONS")

	staticDir, exists := os.LookupEnv("STATIC_DIR")
	if !exists {
		log.Print("No STATIC_DIR found")
	}
	router.PathPrefix("/").Handler(http.StripPrefix("/", http.FileServer(http.Dir(staticDir))))

	fmt.Println("Guntt server started at", time.Now())

	http.ListenAndServe(":3030", router)
}
