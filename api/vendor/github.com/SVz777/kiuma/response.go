package kiuma

import (
	"net/http"
	"time"
)

const MaxAge = int(time.Hour * 24 / time.Second)

type Response struct {
	w      http.ResponseWriter
	Status int
	Size   int64
}

func (r *Response) SetStatus(code int) *Response {
	r.Status = code
	r.w.WriteHeader(code)
	return r
}

func (r *Response) SetHeader(key string, value string) *Response {
	r.w.Header().Set(key, value)
	return r
}

func (r *Response) SetHeaders(dic map[string]string) *Response {
	for k, v := range dic {
		r.SetHeader(k, v)
	}
	return r
}

func (r *Response) Write(b []byte) {
	if r.Status == 0 {
		r.SetStatus(http.StatusOK)
	}
	r.w.Write(b)
}

func (r *Response) SetCookieMaxAge(key, value string) {
	cookie := &http.Cookie{
		Name:     key,
		Value:    value,
		Path:     "/",
		HttpOnly: false,
		MaxAge:   MaxAge,
	}
	http.SetCookie(r.w, cookie)
}

func (r *Response) SetCookie(key, value string,maxAge int) {
	cookie := &http.Cookie{
		Name:     key,
		Value:    value,
		Path:     "/",
		HttpOnly: false,
		MaxAge:   maxAge,
	}
	http.SetCookie(r.w, cookie)
}