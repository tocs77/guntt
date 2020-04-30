package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
	_ "github.com/mattn/go-sqlite3"
)

// Task structure
type Task struct {
	Task      string    `json:"task"`
	ID        string    `json:"id"`
	Done      bool      `json:"done"`
	StartDate time.Time `json:"startDate"`
	EndDate   time.Time `json:"endDate"`
}

//TaskString to fill from JSON to utilize all time formats
type TaskString struct {
	Task      string `json:"task"`
	ID        string `json:"id"`
	Done      bool   `json:"done"`
	StartDate string `json:"startDate"`
	EndDate   string `json:"endDate"`
}

// OperationResponse send to frontend operation status
type OperationResponse struct {
	OperationStatus string `json:"OperationStatus"`
}

// CombinedResponce Task and OperationResponse to encode combined JSON
type CombinedResponce struct {
	Task              Task              `json:"task"`
	OperationResponse OperationResponse `json:"operationResponce"`
}

var tasks []Task

func main() {

	tasks = testFillTasks(tasks)

	router := mux.NewRouter()
	router.HandleFunc("/tasks", getTasks).Methods("GET")
	router.HandleFunc("/tasks", setOptions).Methods("OPTIONS")
	router.HandleFunc("/tasks", deleteTask).Methods("DELETE")
	router.HandleFunc("/tasks", addTask).Methods("POST")
	router.HandleFunc("/tasks", updateTask).Methods(("PUT"))

	fmt.Println("Guntt server started at", time.Now())

	http.ListenAndServe(":3030", router)
}

func getTasks(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	json.NewEncoder(w).Encode(tasks)
}

func setOptions(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received request options")
	w.Header().Set("Access-Control-Allow-Methods", "OPTIONS, GET, POST, DELETE, PUT")
	w.Header().Set("Access-Control-Allow-Headers", "origin, content-type, accept")
	w.Header().Set("Accept", "text/html, application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.WriteHeader(http.StatusOK)
}

func deleteTask(w http.ResponseWriter, r *http.Request) {
	var t Task

	w.Header().Set("Access-Control-Allow-Origin", "*")
	json.NewDecoder(r.Body).Decode(&t)
	res := OperationResponse{"Failed"}
	for index, task := range tasks {
		if task.ID == t.ID {
			tasks[index] = tasks[len(tasks)-1]
			tasks[len(tasks)-1] = Task{}
			tasks = tasks[:len(tasks)-1]

			res.OperationStatus = "Success"
			cr := CombinedResponce{task, res}
			json.NewEncoder(w).Encode(cr)
			break

		}
	}
}

func addTask(w http.ResponseWriter, r *http.Request) {

	res := OperationResponse{"Failed"}
	w.Header().Set("Access-Control-Allow-Origin", "*")

	var taskString TaskString
	json.NewDecoder(r.Body).Decode(&taskString)

	var task Task
	task.Task = taskString.Task
	task.StartDate = parseTime(taskString.StartDate)
	task.EndDate = parseTime(taskString.EndDate)
	task.Done = taskString.Done
	task.ID = uuid.New().String()
	fmt.Println("Added task ", task)
	tasks = append(tasks, task)
	res.OperationStatus = "Success"

	cr := CombinedResponce{task, res}
	json.NewEncoder(w).Encode(cr)

}

func updateTask(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Update task")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	var taskString TaskString
	json.NewDecoder(r.Body).Decode(&taskString)

	res := OperationResponse{"Failed"}
	for index, task := range tasks {

		newTask := task
		if task.ID == taskString.ID {
			if taskString.Task != "" {
				newTask.Task = taskString.Task
			}
			if taskString.StartDate != "" {
				newTask.StartDate = parseTime(taskString.StartDate)
			}
			if taskString.EndDate != "" {
				newTask.EndDate = parseTime(taskString.EndDate)
			}
			newTask.Done = taskString.Done
			res.OperationStatus = "Success"
			cr := CombinedResponce{newTask, res}
			json.NewEncoder(w).Encode(cr)
			tasks[index] = newTask
			break
		}
	}

}

func testFillTasks(tasks []Task) []Task {

	database, _ :=
		sql.Open("sqlite3", "./gunnt.db")
	rows, _ :=
		database.Query("SELECT id, task, startDate, endDate, done FROM tasks")

	for rows.Next() {
		task := Task{}
		rows.Scan(&task.ID, &task.Task, &task.StartDate, &task.EndDate, &task.Done)
		tasks = append(tasks, task)
	}

	return tasks

}

func parseTime(timeString string) time.Time {
	layout := "2006-01-02"
	t, err := time.Parse(layout, timeString)

	if err == nil {
		return t
	}
	fmt.Println("Error time parsing ", timeString, err)
	return time.Now()
}
