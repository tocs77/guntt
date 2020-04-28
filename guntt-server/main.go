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

//
type OperationResponce struct {
	OperationStatus string `json:"OperationStatus"`
}

var tasks []Task

func main() {

	tasks = testFillTasks(tasks)
	router := mux.NewRouter()
	router.HandleFunc("/tasks", getTasks).Methods("GET")
	router.HandleFunc("/tasks", setOptions).Methods("OPTIONS")
	router.HandleFunc("/tasks", deleteTask).Methods("DELETE")

	fmt.Println("Guntt server started at", time.Now())

	http.ListenAndServe(":3030", router)
}

func getTasks(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	json.NewEncoder(w).Encode(tasks)
}

func setOptions(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received request options")
	w.Header().Set("Access-Control-Allow-Methods", "OPTIONS, GET, POST, DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "origin, content-type, accept")
	w.Header().Set("Accept", "text/html, application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.WriteHeader(http.StatusOK)
}
func deleteTask(w http.ResponseWriter, r *http.Request) {
	var t Task

	w.Header().Set("Access-Control-Allow-Origin", "*")
	json.NewDecoder(r.Body).Decode(&t)
	res := OperationResponce{"Failed"}
	for index, task := range tasks {
		if task.ID == t.ID {
			tasks[index] = tasks[len(tasks)-1]
			tasks[len(tasks)-1] = Task{}
			tasks = tasks[:len(tasks)-1]
			res.OperationStatus = "Success"
			json.NewEncoder(w).Encode(res)

		}
	}
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
