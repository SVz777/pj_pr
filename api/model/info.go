package model

import (
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

func GetInfo(c *kiuma.Context, plate string) (*Info, error) {
	info := &Info{}
	sql := "select id,in_time,out_time,plate,status,pay from info where plate LiKE ? order by id desc"
	if err := c.GetDb("info").QueryRow(sql, "%"+plate+"%").Scan(&info.Id, &info.InTime, &info.OutTime, &info.Plate, &info.Status, &info.Pay); err == nil {
		return info, nil
	}
	return nil, nil
}

func GetInfoListByCond(c *kiuma.Context, where map[string]interface{}, offset, limit int) ([]*Info, error) {
	infos := make([]*Info, 0)
	var field []interface{}
	var whereString string
	whereString, field = getWhere(where)

	sql := "select id,in_time,out_time,plate,status,pay from info" + whereString + " limit ?,? "

	field = append(field, offset)
	field = append(field, limit)
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
	_, err := c.GetDb("info").Exec("insert into info(in_time,out_time,plate) values(?,?,?)", inTime, STATUS_IN, plate)
	return err

}

func UpdateInfo(c *kiuma.Context, id int, outTime int64, pay int) error {
	_, err := c.GetDb("info").Exec("update info set out_time=?,pay=?,status = ? where id=?", outTime, pay, STATUS_OUT, id)
	return err
}

func getWhere(where map[string]interface{}) (string, []interface{}) {
	str := ""
	var field []interface{}

	if len(where) != 0 {
		for k, v := range where {
			str += k + " = ? "
			field = append(field,v)
		}

		if len(str) != 0 {
			str = " where " + str
		}
	}


	return str,field
}
