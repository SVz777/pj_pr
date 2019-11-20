package kiuma

import (
	_ "github.com/go-sql-driver/mysql"
	"database/sql"
	"time"
	"fmt"
)

func (app *App) initDb(dbConfig string) error {
	app.db = make(map[string]*sql.DB)
	if db, err := sql.Open("mysql", dbConfig); err == nil {
		db.SetConnMaxLifetime(time.Second * 20)
		db.SetMaxIdleConns(10)
		db.SetMaxOpenConns(20)
		if err := db.Ping(); err == nil {
			fmt.Println("init db success")
			app.db["info"] = db
		} else {
			fmt.Println("init db error")
			return err
		}
	} else {
		return err
	}
	return nil
}

func (c *Context) GetDb(key string) *sql.DB {
	return c.app.db[key]
}
