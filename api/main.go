package main

import (
	"kiuma"
	"kiuma/application/controller"
)

var dbConfig string

func init() {
	dbConfig = "root:password@tcp(10.179.69.3:3306)/pr?charset=utf8mb4"
}

func main() {
	app := kiuma.New(dbConfig)

	app.GET("/commit/carin", controller.CarIn)
	app.GET("/commit/carout", controller.CarOut)

	app.GET("/query/getinfo", controller.GetInfo)
	app.GET("/query/getinfolist", controller.GetInfoList)
	err := app.Run(":8888")
	if err != nil {
		panic(err)
	}
}
