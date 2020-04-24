package main

import (
	"encoding/json"
	"fmt"
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

var tasks []Task

func main() {

	tasks = testFillTasks(tasks)
	fmt.Println(tasks)
	router := mux.NewRouter()
	router.HandleFunc("/tasks", getTasks).Methods("GET")

	http.ListenAndServe(":3030", router)
}

func getTasks(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	json.NewEncoder(w).Encode(tasks)
}

func testFillTasks(tasks []Task) []Task {

	tasks = append(tasks,
		Task{Task: "Develop SVG", StartDate: parseTime("2020-03-27T00:00:00.000Z"), EndDate: parseTime("2020-03-30T00:00:00.000Z"), Done: false, ID: "1"},
		Task{Task: "Buy Milk", StartDate: parseTime("2020-03-20T00:00:00.000Z"), EndDate: parseTime("2020-04-07T00:00:00.000Z"), Done: false, ID: "2"},
		Task{Task: "Find key", StartDate: parseTime("2020-03-15T00:00:00.000Z"), EndDate: parseTime("2020-03-29T00:00:00.000Z"), Done: false, ID: "3"},
		Task{Task: "Clear room", StartDate: parseTime("2020-03-17T00:00:00.000Z"), EndDate: parseTime("2020-03-23T00:00:00.000Z"), Done: false, ID: "4"},
		Task{Task: "Build rocket", StartDate: parseTime("2020-03-20T00:00:00.000Z"), EndDate: parseTime("2020-04-08T00:00:00.000Z"), Done: false, ID: "5"})
	return tasks
}

func parseTime(timeString string) time.Time {
	layout := "2006-01-02T15:04:05.000Z"
	t, err := time.Parse(layout, timeString)

	if err == nil {
		return t
	}
	fmt.Println("Error time parsing ", timeString, err)
	return time.Now()
}
