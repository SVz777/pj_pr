package controller

import "C"
import (
	"kiuma"
	"kiuma/application/model"
)

func GetInfoList(c *kiuma.Context) {
	req := c.Request()

	page := req.ParamInt("page", 1)
	limit := req.ParamInt("limit", 10)
	status := req.ParamInt("status", -1)
	plate := req.ParamString("plate", "")

	offset := (page - 1) * limit
	data := make(map[string]interface{})

	where := make(map[string]interface{})

	if status != -1 {
		where["status"] = status
	}

	if len(plate) != 0 {
		plate = "%" + plate + "%"
		where["plate"] = plate
	}

	rows, err := model.GetInfoListByCond(c, where, offset, limit)
	total, err := model.GetInfoCountByCond(c, where)
	if err != nil {
		c.Error(err)
		return
	}
	data["total"] = total
	data["data"] = rows

	c.Success(data)
}

func GetInfo(c *kiuma.Context) {
	req := c.Request()
	id := req.ParamInt("id", 0)

	where := make(map[string]interface{})

	where["id"] = id
	info, err := model.GetInfo(c, where)
	if err != nil {
		c.Error(err)
		return
	}
	c.Success(info)
}
