package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/google/uuid"
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

//TaskString to fill from JSON to utilize all time formats
type TaskString struct {
	Task      string `json:"task"`
	ID        string `json:"id"`
	Done      bool   `json:"done"`
	StartDate string `json:"startDate"`
	EndDate   string `json:"endDate"`
}

// OperationResponce send to frontend operation status
type OperationResponce struct {
	OperationStatus string `json:"OperationStatus"`
}

// CombinedResponce Task and OperationResponce to encode combined JSON
type CombinedResponce struct {
	Task              Task              `json:"task"`
	OperationResponce OperationResponce `json:"operationResponce"`
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
	res := OperationResponce{"Failed"}
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

	res := OperationResponce{"Failed"}
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

	res := OperationResponce{"Failed"}
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

	tasks = append(tasks,
		Task{Task: "Develop SVG", StartDate: parseTime("2020-03-27"), EndDate: parseTime("2020-03-30"), Done: false, ID: "1"},
		Task{Task: "Buy Milk", StartDate: parseTime("2020-03-20"), EndDate: parseTime("2020-04-07"), Done: false, ID: "2"},
		Task{Task: "Find key", StartDate: parseTime("2020-03-15"), EndDate: parseTime("2020-03-29"), Done: false, ID: "3"},
		Task{Task: "Clear room", StartDate: parseTime("2020-03-17"), EndDate: parseTime("2020-03-23"), Done: false, ID: "4"},
		Task{Task: "Build rocket", StartDate: parseTime("2020-03-20"), EndDate: parseTime("2020-04-08"), Done: false, ID: "5"})
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
