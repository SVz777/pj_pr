package kiuma

func (app *App) GET(path string, fn HandlerFunc) {
	app.setRoute("GET", path, fn)
}

func (app *App) POST(path string, fn HandlerFunc) {
	app.setRoute("POST", path, fn)
}

