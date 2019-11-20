package kiuma

import (
	"encoding/json"
	"net/http"
)

type Context struct {
	request  *Request
	response *Response
	app *App
}

func (c *Context) SetRequest(req *http.Request) {
	c.request = &Request{req}
}

func (c Context) Request() *Request {
	return c.request
}

func (c *Context) SetResponse(response http.ResponseWriter) {
	c.response = &Response{w:response}
}

func (c *Context) Response() *Response {
	return c.response
}

func (c *Context) Format(errno int,errmsg string,data interface{}){
	ret := struct {
		Errno int         `json:"errno"`
		Errmsg   string      `json:"errmsg"`
		Data  interface{} `json:"data"`
	}{errno, errmsg, data}
	c.response.SetHeader("Content-type","application/json")
	if b, err := json.Marshal(ret); err == nil {
		c.response.SetStatus(200).Write(b)
	} else {
		c.response.SetStatus(500).Write([]byte(""))
	}
}

func (c *Context) Success(data interface{}) {
	c.Format(0,"ok",data)
}

func (c *Context) Error(data interface{}) {
	c.Format(1,"error",data)
}