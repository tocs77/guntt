package main

import (
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"

)

// Task structure
type Task struct {
	Task      string    `json:"task"`
	ID        string    `json:"id"`
	Done      bool      `json:"done"`
	StartDate time.Time `json:"startDate"`
	EndDate   time.Time `json:"endDate"`
}

func main() {
	router := mux.NewRouter()
	router.HandleFunc("/tasks", getTasks).Methods("GET")

	http.ListenAndServe(":3000", router)
}

func getTasks(w http.ResponseWriter, r *http.Request) {
	log.Println("Gets all tasks")
}
