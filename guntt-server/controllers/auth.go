package controllers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"time"

	"guntt-srv/utils"
)

const tokenValidTime = time.Second * time.Duration(300)

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

		res := OperationResponse{"Failed"}

		sqlStatement := "SELECT name, pwdHash, token FROM users WHERE name=$1"
		row := db.QueryRow(sqlStatement, auth.UserName)

		var bdAuthData authBD
		var authD authData
		err := row.Scan(&bdAuthData.userName, &bdAuthData.pwdHash, &bdAuthData.token)

		if err != nil { // name not found in BD returns error
			cr := authResponse{authD, res}
			json.NewEncoder(w).Encode(cr)
			return
		}

		if utils.ComparePasswords(bdAuthData.pwdHash, auth.Password) {
			res.OperationStatus = "Success"

			newToken := utils.GenerateToken()
			sqlStatement := `UPDATE users SET token=$1, expireDate=$2 WHERE name=$3`
			_, err = db.Exec(sqlStatement, newToken, time.Now().Local().Add(tokenValidTime), auth.UserName)
			logFatal(err)

			authD.UserName = bdAuthData.userName
			authD.Token = newToken
			authD.DateExpired = bdAuthData.dateExpired
		}

		cr := authResponse{authD, res}
		json.NewEncoder(w).Encode(cr)

	}
}


// Signup function returns handler to signup
func Signup(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var auth authRequest

		w.Header().Set("Access-Control-Allow-Origin", "*")
		json.NewDecoder(r.Body).Decode(&auth)

		res := OperationResponse{"Failed"}

		sqlStatement := "SELECT name FROM users WHERE name=$1"
		row := db.QueryRow(sqlStatement, auth.UserName)

		var authD authData

		var checkedName string
		err := row.Scan(&checkedName)

		if err == nil { // name found in BD returns error name found
			cr := authResponse{authD, res}
			json.NewEncoder(w).Encode(cr)
			return
		} 


		pwdHash := utils.CalculateHash(auth.Password)
		newToken := utils.GenerateToken()
		expireDate :=time.Now().Local().Add(tokenValidTime)

		sqlStatement = `INSERT INTO users (name, pwdHash, token, expireDate) values($1, $2, $3, $4)`

		_, err = db.Exec(sqlStatement, auth.UserName, pwdHash , newToken ,expireDate)
		if err == nil {
		authD.UserName = auth.UserName
			authD.Token = newToken
			authD.DateExpired = expireDate
			res.OperationStatus = "Success"	
		}

		cr := authResponse{authD, res}
		json.NewEncoder(w).Encode(cr)

	}
}