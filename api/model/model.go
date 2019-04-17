package model

import (
	"kiuma"
)

type Info struct {
	Id      int    `json:"id"`
	InTime  int64  `json:"in_time"`
	OutTime int64  `json:"out_time"`
	Plate   string `json:"plate"`
	Status  int8   `json:"status"`
	Pay     int    `json:"pay"`
}

func GetInfo(c *kiuma.Context, plate string) (*Info, error) {
	info := &Info{}
	sql := "select id,in_time,out_time,plate,status,pay from info where plate = ? order by id desc"
	if err := c.GetDb("info").QueryRow(sql, plate).Scan(&info.Id, &info.InTime, &info.OutTime, &info.Plate, &info.Status, &info.Pay); err == nil {
		return info, nil
	}
	return nil, nil
}

func InsertInfo(c *kiuma.Context, plate string, inTime int64) error {
	_, err := c.GetDb("info").Exec("insert into info(in_time,out_time,plate) values(?,?,?)", inTime, 0, plate)
	return err

}

func UpdateInfo(c *kiuma.Context, id int, outTime int64, pay int) error {
	_, err := c.GetDb("info").Exec("update info set out_time=?,pay=?,status = 1 where id=?", outTime, pay, id)
	return err
}
