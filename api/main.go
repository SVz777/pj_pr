package main

import (
	"github.com/SVz777/kiuma"

	"github.com/SVz777/pj_pr/api/controller"
)

var dbConfig string

func init() {
	dbConfig = "root:password@tcp(127.0.0.1:3306)/pr?charset=utf8mb4"
}

func main() {
	app := kiuma.New(dbConfig)

	app.GET("/commit/carin", controller.CarIn)
	app.GET("/commit/carout", controller.CarOut)

	app.GET("/query/getinfo", controller.GetInfo)
	app.GET("/query/getinfolist", controller.GetInfoList)

	app.GET("/auth/login", controller.Login)
	app.GET("/auth/logout", controller.Logout)

	err := app.Run(":8001")
	if err != nil {
		panic(err)
	}
}
