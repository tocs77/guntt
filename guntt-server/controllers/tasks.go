package controllers

import (
	"database/sql"
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"time"

	"github.com/google/uuid"

	"guntt-srv/models"
	"guntt-srv/utils"
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
		w.Header().Set("Access-Control-Allow-Origin", "*")
		tasks := []models.Task{}

		name, err := getNameByToken(db, r.Header.Get("Authorization"))

		if err != nil {
			json.NewEncoder(w).Encode(tasks)
			return
		}

		rows, err :=
			db.Query("SELECT id, task, startDate, endDate, done FROM tasks WHERE owner=$1", name)

		defer rows.Close()

		for rows.Next() {
			task := models.Task{}
			err = rows.Scan(&task.ID, &task.Task, &task.StartDate, &task.EndDate, &task.Done)
			logFatal(err)
			tasks = append(tasks, task)
		}

		json.NewEncoder(w).Encode(tasks)
	}
}

//SetOptions returns http.HandlerFunc to set allowed request options
func SetOptions(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Methods", "OPTIONS, GET, POST, DELETE, PUT")
		w.Header().Set("Access-Control-Allow-Headers", "origin, content-type, accept, Authorization")
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
		res := OperationResponse{"Failed"}

		name, err := getNameByToken(db, r.Header.Get("Authorization"))

		if err != nil {
			cr := CombinedResponse{t, res}
			json.NewEncoder(w).Encode(cr)
			return
		}

		json.NewDecoder(r.Body).Decode(&t)

		sqlStatement := `DELETE FROM tasks WHERE id=$1 AND owner=$2`
		_, err = db.Exec(sqlStatement, t.ID, name)
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

		var task models.Task

		name, err := getNameByToken(db, r.Header.Get("Authorization"))

		if err != nil {
			cr := CombinedResponse{task, res}
			json.NewEncoder(w).Encode(cr)
			return
		}

		var taskString models.TaskString
		json.NewDecoder(r.Body).Decode(&taskString)

		task.Task = taskString.Task
		task.StartDate = utils.ParseTime(taskString.StartDate)
		task.EndDate = utils.ParseTime(taskString.EndDate)
		task.Done = taskString.Done
		task.ID = uuid.New().String()

		sqlStatement := `INSERT INTO tasks (id, task, startDate, endDate, done, owner) values($1, $2, $3, $4, $5, $6)`

		_, err = db.Exec(sqlStatement, task.ID, task.Task, task.StartDate, task.EndDate, task.Done, name)

		res.OperationStatus = "Success"
		if err!= nil {
			res.OperationStatus = "Failed"
		}
		cr := CombinedResponse{task, res}
		json.NewEncoder(w).Encode(cr)

	}
}

//UpdateTask returns http.HandlerFunc to update task in db
func UpdateTask(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")

		res := OperationResponse{"Failed"}

		newTask := models.Task{}

		name, err := getNameByToken(db, r.Header.Get("Authorization"))

		if err != nil {
			cr := CombinedResponse{newTask, res}
			json.NewEncoder(w).Encode(cr)
			return
		}

		var taskString models.TaskString
		json.NewDecoder(r.Body).Decode(&taskString)

		newTask.Task = taskString.Task
		newTask.ID = taskString.ID
		newTask.StartDate = utils.ParseTime(taskString.StartDate)
		newTask.EndDate = utils.ParseTime(taskString.EndDate)
		newTask.Done = taskString.Done

		sqlStatement := `UPDATE tasks SET task=$1, startDate=$2, endDate=$3, done=$4 WHERE id=$5 AND owner=$6`

		_, err = db.Exec(sqlStatement, newTask.Task, newTask.StartDate, newTask.EndDate, newTask.Done, newTask.ID, name)
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

func getNameByToken(db *sql.DB, token string) (string, error) {
	sqlStatement := "SELECT name, expireDate FROM users WHERE token=$1"

	row := db.QueryRow(sqlStatement, token)

	var name string
	var expTime time.Time

	err := row.Scan(&name, &expTime)

	if err != nil {
		e := errors.New("Not found name")
		return "", e
	}

	if time.Now().Local().After(expTime) {
		e := errors.New("Token expired")
		return "", e
	}

	return name, nil
}
