package controllers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"math/rand"
	"net/http"
	"time"

	"github.com/google/uuid"

	"guntt-srv/utils"
)

// Demo function to create demo account and fill random tasks
func Demo(db *sql.DB) http.HandlerFunc {

	const DemoTaskAmount = 7
	const TaskPeriod = 20 // Period to random set task dates

	return func(w http.ResponseWriter, r *http.Request) {
		res := OperationResponse{"Failed"}
		w.Header().Set("Access-Control-Allow-Origin", "*")

		//Create new demo user
		demoName := "Anonimous " + utils.GenerateToken()
		demoPassword := utils.GenerateToken()

		pwdHash := utils.CalculateHash(demoPassword)
		newToken := utils.GenerateToken()
		expireDate := time.Now().Local().Add(tokenValidTime)
		sqlStatement := `INSERT INTO users (name, pwdHash, token, expireDate) values($1, $2, $3, $4)`

		_, err := db.Exec(sqlStatement, demoName, pwdHash, newToken, expireDate)

		var authD authData
		if err == nil {
			authD.UserName = demoName
			authD.Token = newToken
			authD.DateExpired = expireDate
			res.OperationStatus = "Success"
		}

		// Fill random tasks for demo user

		sqlStatement = `INSERT INTO tasks (id, task, startDate, endDate, done, owner) values($1, $2, $3, $4, $5, $6)`
		for i := 0; i < DemoTaskAmount; i++ {
			taskID := uuid.New().String()
			taskStartDate := time.Now()
			taskStartDate = taskStartDate.AddDate(0, 0, TaskPeriod/2-rand.Intn(TaskPeriod))
			taskEndDate := taskStartDate.AddDate(0, 0, rand.Intn(TaskPeriod))
			taskName := fmt.Sprintf("Some task #%d", i+1)
			db.Exec(sqlStatement, taskID, taskName, taskStartDate, taskEndDate, false, demoName)
		}

		cr := authResponse{authD, res}
		json.NewEncoder(w).Encode(cr)
	}
}
