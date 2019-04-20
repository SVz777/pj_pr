package model

import (
	"fmt"
	"kiuma"
)

type Info struct {
	Id      int    `json:"id"`
	InTime  int64  `json:"in_time"`
	OutTime int64  `json:"out_time"`
	Plate   string `json:"plate"`
	Status  int8   `json:"status"` // 1 进 2 出
	Pay     int    `json:"pay"`
}

const (
	STATUS_IN  = 1
	STATUS_OUT = 2
)

func GetInfo(c *kiuma.Context, where map[string]interface{}) (*Info, error) {
	info := &Info{}
	whereString, field := getWhere(where)

	sql := "select id,in_time,out_time,plate,status,pay from info " + whereString
	fmt.Println(sql,field)
	if err := c.GetDb("info").QueryRow(sql, field...).Scan(&info.Id, &info.InTime, &info.OutTime, &info.Plate, &info.Status, &info.Pay); err == nil {
		return info, err
	}
	return nil, nil
}

func GetInfoListByCond(c *kiuma.Context, where map[string]interface{}, offset, limit int) ([]*Info, error) {
	infos := make([]*Info, 0)
	whereString, field := getWhere(where)

	sql := "select id,in_time,out_time,plate,status,pay from info" + whereString + "order by id desc limit ?,?  "

	field = append(field, offset)
	field = append(field, limit)
	fmt.Println(sql,field)
	if rows, err := c.GetDb("info").Query(sql, field...); err == nil {
		for rows.Next() {
			info := &Info{}
			if err = rows.Scan(&info.Id, &info.InTime, &info.OutTime, &info.Plate, &info.Status, &info.Pay); err == nil {
				infos = append(infos, info)
			} else {
				return nil, err
			}
		}
		return infos, nil
	} else {
		return nil, err
	}
}


func GetInfoCountByCond(c *kiuma.Context, where map[string]interface{}) (int64, error) {
	var count int64
	var field []interface{}
	var whereString string
	whereString, field = getWhere(where)
	sql := "select count(*) from info" + whereString
	err := c.GetDb("info").QueryRow(sql, field...).Scan(&count)
	if err != nil {
		return 0, err
	}
	return count, err
}


func InsertInfo(c *kiuma.Context, plate string, inTime int64) error {
	_, err := c.GetDb("info").Exec("insert into info(in_time,status,plate) values(?,?,?)", inTime, STATUS_IN, plate)
	return err

}

func UpdateInfo(c *kiuma.Context, id int, outTime int64, pay int) error {
	_, err := c.GetDb("info").Exec("update info set out_time=?,pay=?,status = ? where id=?", outTime, pay, STATUS_OUT, id)
	return err
}

func getWhere(where map[string]interface{}) (string, []interface{}) {
	str := " "
	var field []interface{}

	if len(where) != 0 {
		for k, v := range where {
			if k == "plate"{
				str += k + " LIKE ? "
			}else{
				str += k + " = ? "
			}
			field = append(field,v)
		}

		if len(str) != 0 {
			str = " where " + str
		}
	}


	return str,field
}
