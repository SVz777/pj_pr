package kiuma

import (
	"log"
	"database/sql"
	"net/http"
	"strings"
	"sync"
)

type HandlerFunc func(*Context)

type RouteInfo struct {
	Method      string
	Path        string
	HandlerFunc HandlerFunc
}
type App struct {
	pools struct {
		Context sync.Pool
	}
	routeMap map[string]RouteInfo
	log      map[string]*log.Logger
	db       map[string]*sql.DB
}

func (app *App) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	context := app.pools.Context.Get().(*Context)
	context.SetRequest(r)
	context.SetResponse(w)
	app.handlerHttp(context)
}

func (app *App) handlerHttp(c *Context) {
	r := c.Request().req
	w := c.Response().w
	method := r.Method
	path := strings.TrimRight(r.URL.Path, "/")
	if route, ok := app.routeMap[path]; ok {
		if route.Method == method {
			route.HandlerFunc(c)
			return
		} else {
			w.WriteHeader(http.StatusForbidden)
			w.Write([]byte("Method not allowed"))
		}
	} else {
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte("Path not found"))
	}
}

func (app *App) setRoute(method string, path string, fn HandlerFunc) {
	app.routeMap[path] = RouteInfo{
		method,
		path,
		fn,
	}
}

func New(dbConfig string) *App {
	app := &App{
		routeMap: make(map[string]RouteInfo),
	}
	contextPool := sync.Pool{
		New: func() interface{} {
			return app.allocateContext()
		},
	}
	app.pools = struct{ Context sync.Pool }{Context: contextPool}
	app.initDb(dbConfig)

	return app
}

func (app *App) Run(addr string) (err error) {
	err = http.ListenAndServe(addr, app)
	return
}
func (app *App) allocateContext() interface{} {
	return &Context{app:app}
}
