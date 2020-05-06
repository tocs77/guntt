package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
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

var db *sql.DB

func logFatal(err error) {
	if err != nil {
		log.Fatal(err)
	}
}

func main() {
	var err error
	db, err = sql.Open("sqlite3", "./gunnt.db")
	logFatal(err)

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

	rows, err :=
		db.Query("SELECT id, task, startDate, endDate, done FROM tasks")

	logFatal(err)
	defer rows.Close()
	tasks := []Task{}
	for rows.Next() {
		task := Task{}
		err = rows.Scan(&task.ID, &task.Task, &task.StartDate, &task.EndDate, &task.Done)
		logFatal(err)
		tasks = append(tasks, task)
	}
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
	var err error
	sqlStatement := `DELETE FROM tasks where id=$1`
	_, err = db.Exec(sqlStatement, t.ID)
	logFatal(err)

	res.OperationStatus = "Success"
	cr := CombinedResponce{t, res}
	json.NewEncoder(w).Encode(cr)
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

	var err error
	sqlStatement := `INSERT INTO tasks (id, task, startDate, endDate, done) values($1, $2, $3, $4, $5)`

	_, err = db.Exec(sqlStatement, task.ID, task.Task, task.StartDate, task.EndDate, task.Done)
	logFatal(err)
	res.OperationStatus = "Success"

	cr := CombinedResponce{task, res}
	json.NewEncoder(w).Encode(cr)

}

func updateTask(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Going to update task")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	var taskString TaskString
	json.NewDecoder(r.Body).Decode(&taskString)

	res := OperationResponse{"Failed"}

	newTask := Task{}
	newTask.Task = taskString.Task
	newTask.ID = taskString.ID
	newTask.StartDate = parseTime(taskString.StartDate)
	newTask.EndDate = parseTime(taskString.EndDate)
	newTask.Done = taskString.Done

	var err error
	sqlStatement := `UPDATE tasks SET task=$1, startDate=$2, endDate=$3, done=$4 where id=$5`

	_, err = db.Exec(sqlStatement, newTask.Task, newTask.StartDate, newTask.EndDate, newTask.Done, newTask.ID)
	logFatal(err)
	res.OperationStatus = "Success"

	cr := CombinedResponce{newTask, res}
	json.NewEncoder(w).Encode(cr)

}

func parseTime(timeString string) time.Time {
	layout := "2006-01-02"
	t, err := time.Parse(layout, timeString)

	if err == nil {
		return t
	}

	layout = "2006-01-02T00:00:00.000Z"

	t, err = time.Parse(layout, timeString)

	if err == nil {
		return t
	}
	fmt.Println("Error time parsing ", timeString, err)
	return time.Now()
}
