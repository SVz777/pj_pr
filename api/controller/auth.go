package controller

import (
	"kiuma"
)

func Login(c *kiuma.Context) {
	req := c.Request()

	account := req.ParamString("account", "")
	password := req.ParamString("password", "")

	if account == "admin" && password == "password" {
		c.Response().SetCookieMaxAge("account", account)
		c.Success(nil)
	} else {
		c.Error(nil)
	}
}

func Logout(c *kiuma.Context) {
	c.Response().SetCookie("account", "", 0)
	c.Success(nil)
}


func Auth(c *kiuma.Context) bool {
	account := c.Request().Cookie("account")
	if account != "" {
		return true
	} else {
		data :=make(map[string]interface{})
		data["url"] = "/fe/index.html"
		c.Format(301,"not login",data)

		return false
	}
}
