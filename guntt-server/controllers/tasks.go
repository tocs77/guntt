package controllers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"guntt-srv/models"
	"log"
	"net/http"
	"time"

	"github.com/google/uuid"
)

// OperationResponse send to frontend operation status
type OperationResponse struct {
	OperationStatus string `json:"OperationStatus"`
}

// CombinedResponse Task and OperationResponse to encode combined JSON
type CombinedResponse struct {
	Task              models.Task       `json:"task"`
	OperationResponse OperationResponse `json:"operationResponce"`
}

//GetTasks returns http.HandlerFunc to get tasks from database
func GetTasks(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var name string

		name = getNameByToken(db, r.Header.Get("token"))
		fmt.Println("Name to read ", name)
		rows, err :=
			db.Query("SELECT id, task, startDate, endDate, done FROM tasks WHERE owner=$1", name)

		logFatal(err)
		defer rows.Close()
		tasks := []models.Task{}
		for rows.Next() {
			task := models.Task{}
			err = rows.Scan(&task.ID, &task.Task, &task.StartDate, &task.EndDate, &task.Done)
			logFatal(err)
			tasks = append(tasks, task)
		}
		w.Header().Set("Access-Control-Allow-Origin", "*")
		json.NewEncoder(w).Encode(tasks)
	}
}

//SetOptions returns http.HandlerFunc to set allowed request options
func SetOptions(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("Received request options")
		w.Header().Set("Access-Control-Allow-Methods", "OPTIONS, GET, POST, DELETE, PUT")
		w.Header().Set("Access-Control-Allow-Headers", "origin, content-type, accept, token")
		w.Header().Set("Accept", "text/html, application/json")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.WriteHeader(http.StatusOK)
	}
}

//DeleteTask returns http.HandlerFunc to delete task from db
func DeleteTask(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var t models.Task

		w.Header().Set("Access-Control-Allow-Origin", "*")
		json.NewDecoder(r.Body).Decode(&t)

		res := OperationResponse{"Failed"}
		var err error
		sqlStatement := `DELETE FROM tasks where id=$1`
		_, err = db.Exec(sqlStatement, t.ID)
		logFatal(err)

		res.OperationStatus = "Success"
		cr := CombinedResponse{t, res}
		json.NewEncoder(w).Encode(cr)
	}
}

//AddTask returns http.HandlerFunc to add task to db
func AddTask(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		res := OperationResponse{"Failed"}
		w.Header().Set("Access-Control-Allow-Origin", "*")

		var taskString models.TaskString
		json.NewDecoder(r.Body).Decode(&taskString)

		var task models.Task
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

		cr := CombinedResponse{task, res}
		json.NewEncoder(w).Encode(cr)

	}
}

//UpdateTask returns http.HandlerFunc to update task in db
func UpdateTask(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("Going to update task")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		var taskString models.TaskString
		json.NewDecoder(r.Body).Decode(&taskString)

		res := OperationResponse{"Failed"}

		newTask := models.Task{}
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

		cr := CombinedResponse{newTask, res}
		json.NewEncoder(w).Encode(cr)

	}
}

func logFatal(err error) {
	if err != nil {
		log.Fatal(err)
	}
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

func getNameByToken(db *sql.DB, token string) string {
	sqlStatement := "SELECT name FROM users WHERE token=$1"

	row := db.QueryRow(sqlStatement, token)

	var name string

	err := row.Scan(&name)
	logFatal(err)

	return name
}
