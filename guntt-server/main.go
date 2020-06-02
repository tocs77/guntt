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
	"guntt-srv/logger"
)

var db *sql.DB

func main() {

	logChannel := make(chan string, 5)

	go logger.Logger(logChannel)

	db = driver.ConnectDB(logChannel)
	router := mux.NewRouter()

	router.HandleFunc("/gunttapi/tasks", logger.LogRequestHandler(controllers.GetTasks(db), logChannel)).Methods("GET")
	router.HandleFunc("/gunttapi/tasks", logger.LogRequestHandler(controllers.SetOptions(db), logChannel)).Methods("OPTIONS")
	router.HandleFunc("/gunttapi/tasks", logger.LogRequestHandler(controllers.DeleteTask(db), logChannel)).Methods("DELETE")
	router.HandleFunc("/gunttapi/tasks", logger.LogRequestHandler(controllers.AddTask(db), logChannel)).Methods("POST")
	router.HandleFunc("/gunttapi/tasks", logger.LogRequestHandler(controllers.UpdateTask(db), logChannel)).Methods("PUT")

	router.HandleFunc("/gunttapi/auth", logger.LogRequestHandler(controllers.Authenticate(db), logChannel)).Methods("POST")
	router.HandleFunc("/gunttapi/auth", logger.LogRequestHandler(controllers.CheckToken(db), logChannel)).Methods("GET")
	router.HandleFunc("/gunttapi/auth", logger.LogRequestHandler(controllers.SetOptions(db), logChannel)).Methods("OPTIONS")

	router.HandleFunc("/gunttapi/signup", logger.LogRequestHandler(controllers.Signup(db), logChannel)).Methods("POST")
	router.HandleFunc("/gunttapi/signup", logger.LogRequestHandler(controllers.SetOptions(db), logChannel)).Methods("OPTIONS")

	logChannel <- "Guntt server started"

	fmt.Println("Guntt server started at", time.Now())

	http.ListenAndServe(":3030", router)
}
