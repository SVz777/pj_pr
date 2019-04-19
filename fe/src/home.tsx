import React from 'react';
import ReactDOM from 'react-dom'
import * as Moment from 'moment'
import qs from 'querystring'
import {Button, Table} from 'antd'
import {MainLayout} from "./components/common/MainLayout";
import {
    RowsTable,
    TColumn
} from './components/common/RowsTable'
import {checkErrorCode, checkStatus, alert} from "./components/common/util";

interface IProps {

}

interface IState {
    step: number,
    total: number,
    page: number,
    rows: [],
    q: {
        plate: string,
    },

}

const columns: TColumn[] = [
    {title: 'id', dataIndex: 'id', width: 100,},
    {title: '车牌', dataIndex: 'plate', width: 100,},
    {title: '进入时间', dataIndex: 'in_time', width: 50,},
    {title: '离开时间', dataIndex: 'out_time', width: 100,},
    {title: '应付款', dataIndex: 'pay', width: 100,},
];

class Home extends React.Component<IProps, IState> {

    public state: IState = {
        step: 0,
        total: 0,
        page: 0,
        rows: [],
        q: {
            plate: ''
        }
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.getInfo(1)

    }

    componentWillUnmount() {
    }

    public location = (page: number) => {
        this.getInfo(page);
    };

    private getInfo(page: number) {
        const {step} = this.state;
        const query = qs.stringify({step, page});
        fetch('/api/query/getlist?' + query, {
            credentials: 'same-origin',
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        })
            .then(checkStatus)
            .then((response) => {
                return response.json()
            }).then((j) => {
            if (undefined === j.error) {
                alert.error('请求失败');
                return false
            }
            if (j.error > 0) {
                checkErrorCode(j.error);
                alert.error(j.msg);
                return false
            }

            j.data.list.map((item: any) => {
                item.in_time = Moment.unix(item.in_time).format('YYYY-MM-DD HH:mm:ss');
                item.out_time = Moment.unix(item.out_time).format('YYYY-MM-DD HH:mm:ss');
            });
            this.setState({total: j.data.total, rows: j.data.list, page})
        }).catch((ex) => {
            return
        })
    };

    render() {
        const pages: number = this.state.step == 0 ? 0 : Math.ceil(this.state.total / this.state.step);
        return (
            <div>
                <MainLayout content={
                    <div>
                        <RowsTable
                            rows={this.state.rows}
                            columns={columns}
                            page={this.state.page}
                            pages={pages}
                            step={this.state.step}
                            total={this.state.total}
                            location={this.location}
                        />
                    </div>
                }/>
            </div>
        )
    }
}

ReactDOM.render(
    <Home/>,
    document.getElementById('root')
);
