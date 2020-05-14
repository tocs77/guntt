package main

import (
	"database/sql"
	"fmt"
	"net/http"
	"time"

	"github.com/gorilla/mux"
	_ "github.com/mattn/go-sqlite3"

	"guntt-srv/controllers"
	"guntt-srv/driver"
)

var db *sql.DB


func main() {

	db = driver.ConnectDB()
	router := mux.NewRouter()
	router.HandleFunc("/tasks", controllers.GetTasks(db)).Methods("GET")
	router.HandleFunc("/tasks", controllers.SetOptions(db)).Methods("OPTIONS")
	router.HandleFunc("/tasks", controllers.DeleteTask(db)).Methods("DELETE")
	router.HandleFunc("/tasks", controllers.AddTask(db)).Methods("POST")
	router.HandleFunc("/tasks", controllers.UpdateTask(db)).Methods("PUT")

	router.HandleFunc("/auth", controllers.Authenticate(db)).Methods("POST")
	router.HandleFunc("/auth", controllers.SetOptions(db)).Methods("OPTIONS")

	router.HandleFunc("/signup", controllers.Signup(db)).Methods("POST")
	router.HandleFunc("/signup", controllers.SetOptions(db)).Methods("OPTIONS")

	fmt.Println("Guntt server started at", time.Now())

	http.ListenAndServe(":3030", router)
}
