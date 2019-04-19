package controller

import (
	"kiuma"
	"kiuma/application/model"
	"time"
)

func CarIn(c *kiuma.Context) {
	plate := c.Request().ParamString("plate", "")
	if err := model.InsertInfo(c, plate, time.Now().Unix()); err == nil {
		c.Success(nil)
	} else {
		c.Error(err.Error())
	}
}

func CarOut(c *kiuma.Context) {
	plate := c.Request().ParamString("plate", "")
	if info, err := model.GetInfo(c, plate); err == nil {
		now := time.Now().Unix()
		t := (now - info.InTime) / 3600
		if (now-info.InTime)%3600 > 1800 {
			t++
		}
		pay := int(t * 4) // $4/h

		if err := model.UpdateInfo(c, info.Id, now, pay); err == nil {
			c.Success(nil)
		} else {
			c.Error(err.Error())
		}
	} else {
		c.Error(err.Error())
	}
}
