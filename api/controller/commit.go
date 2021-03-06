package controller

import (
	"github.com/SVz777/kiuma"
	"github.com/SVz777/pj_pr/api/model"
	"time"
)

const PRICE = 4

func CarIn(c *kiuma.Context) {
	if !Auth(c){
		return
	}
	plate := c.Request().ParamString("plate", "")
	if err := model.InsertInfo(c, plate, time.Now().Unix()); err == nil {
		c.Success(nil)
	} else {
		c.Error(err.Error())
	}
}

func CarOut(c *kiuma.Context) {
	if !Auth(c){
		return
	}
	plate := c.Request().ParamString("plate", "")

	where := make(map[string]interface{})
	if len(plate) != 0 {
		where["plate"] = plate
	} else {
		c.Error(nil)
		return
	}
	where["status"] = 1

	if info, err := model.GetInfo(c, where); err == nil {
		// 没有进这辆车
		if info == nil {
			c.Format(1,"no this car",nil)
			return
		}
		now := time.Now().Unix()
		// 计价
		t := (now - info.InTime) / 3600
		if (now-info.InTime)%3600 > 1800 {
			t++
		}
		pay := int(t * PRICE) // $4/h

		if err := model.UpdateInfo(c, info.Id, now, pay); err == nil {
			c.Success(nil)
		} else {
			c.Error(err.Error())
		}
	} else {
		c.Error(err.Error())
	}
}
