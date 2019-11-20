package kiuma

import (
	"net/http"
	"strconv"
	"strings"
)

type Request struct {
	req *http.Request
}

func (r *Request) ParamString(key string, dft string) string {
	if v, ok := r.req.URL.Query()[key]; ok {
		return strings.Join(v, "")
	}
	return dft
}

func (r *Request) ParamInt(k string, dft int) int {
	if v, ok := r.req.URL.Query()[k]; ok {
		if len(v) == 1 {
			if v, err := strconv.Atoi(v[0]); err == nil {
				return v
			}
		}
	}
	return dft
}

func (r *Request) Header(key string) string {
	return r.req.Header.Get(key)
}

func (r *Request) Cookie(key string) string {
	value, err := r.req.Cookie(key)
	if value != nil && err == nil {
		return value.Value
	}
	return ""
}
