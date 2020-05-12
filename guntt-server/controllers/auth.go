package controllers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"guntt-srv/utils"
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
	OperationResponse OperationResponse `json:"operationResponse"`
}

// Authenticate function
func Authenticate(db *sql.DB) http.HandlerFunc {

	return func(w http.ResponseWriter, r *http.Request) {
		var auth authRequest

		w.Header().Set("Access-Control-Allow-Origin", "*")
		json.NewDecoder(r.Body).Decode(&auth)

		fmt.Println("Auth post", auth)

		res := OperationResponse{"Failed"}

		sqlStatement := "SELECT name, pwdHash, token FROM users WHERE name=$1"
		row := db.QueryRow(sqlStatement, auth.UserName)

		var bdAuthData authBD
		var authD authData
		err := row.Scan(&bdAuthData.userName, &bdAuthData.pwdHash, &bdAuthData.token)

		if err != nil {  // name not found in BD returns error
			cr := authResponse{authD, res}
			json.NewEncoder(w).Encode(cr)
			return
		}

		//fmt.Println("BD auth data", bdAuthData)

		if utils.CalculateHash(auth.Password) == bdAuthData.pwdHash {
			res.OperationStatus = "Success"



			authD.UserName = bdAuthData.userName
			authD.Token = bdAuthData.token
			authD.DateExpired = bdAuthData.dateExpired
		}

		cr := authResponse{authD, res}
		json.NewEncoder(w).Encode(cr)

	}
}

