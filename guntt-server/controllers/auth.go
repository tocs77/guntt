package controllers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type authRequest struct {
	UserName string `json:"userName"`
	Password string `json:"password"`
}

type authData struct {
	UserName    string    `json:"userName"`
	Token       string    `json:"token"`
	DateExpired time.Time `json:"dateExpired"`
}

type authBD struct {
	userName    string
	pwdHash     string
	token       string
	dateExpired time.Time
}

type authResponse struct {
	AuthData          authData          `json:"auth"`
	OperationResponse OperationResponse `json:"operationResponce"`
}

// Authenticate function
func Authenticate(db *sql.DB) http.HandlerFunc {

	return func(w http.ResponseWriter, r *http.Request) {
		var auth authRequest

		w.Header().Set("Access-Control-Allow-Origin", "*")
		json.NewDecoder(r.Body).Decode(&auth)

		fmt.Println("Auth post", auth)

		res := OperationResponse{"Failed"}

		sqlStatement := "SELECT name, pwdCash, token FROM users WHERE name=$1"
		row := db.QueryRow(sqlStatement, auth.UserName)

		var bdAuthData authBD

		err := row.Scan(&bdAuthData.userName, &bdAuthData.pwdHash, &bdAuthData.token)
		logFatal(err)

		fmt.Println("BD auth data", bdAuthData)

		res.OperationStatus = "Success"

		var authD authData

		authD.UserName = bdAuthData.userName
		authD.Token = bdAuthData.token
		authD.DateExpired = bdAuthData.dateExpired

		cr := authResponse{authD, res}
		json.NewEncoder(w).Encode(cr)
	}

}

func calculateHash(pwd string) string {
	if pwd == "11" {
		return "777"
	}
	return "123"
}
