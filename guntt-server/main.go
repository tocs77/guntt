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
)

var db *sql.DB

func main() {

	// loads values from .env into the system
	if err := godotenv.Load(); err != nil {
		log.Print("No .env file found")
	}

	staticDir, exists := os.LookupEnv("STATIC_DIR")

	db = driver.ConnectDB()
	router := mux.NewRouter()

	//fs := http.FileServer(http.Dir("d:\\projects\\guntt\\build"))

	router.HandleFunc("/tasks", controllers.GetTasks(db)).Methods("GET")
	router.HandleFunc("/tasks", controllers.SetOptions(db)).Methods("OPTIONS")
	router.HandleFunc("/tasks", controllers.DeleteTask(db)).Methods("DELETE")
	router.HandleFunc("/tasks", controllers.AddTask(db)).Methods("POST")
	router.HandleFunc("/tasks", controllers.UpdateTask(db)).Methods("PUT")

	router.HandleFunc("/auth", controllers.Authenticate(db)).Methods("POST")
	router.HandleFunc("/auth", controllers.SetOptions(db)).Methods("OPTIONS")

	router.HandleFunc("/signup", controllers.Signup(db)).Methods("POST")
	router.HandleFunc("/signup", controllers.SetOptions(db)).Methods("OPTIONS")

	staticDir, exists := os.LookupEnv("STATIC_DIR")
	if !exists {
		log.Print("No STATIC_DIR found")
	}
	router.PathPrefix("/").Handler(http.StripPrefix("/", http.FileServer(http.Dir(staticDir))))

	fmt.Println("Guntt server started at", time.Now())

	http.ListenAndServe(":3030", router)
}
