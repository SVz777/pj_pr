import React from 'react';
import ReactDOM from 'react-dom'
import * as Moment from 'moment'
import qs from 'querystring'
import {MainLayout} from "./components/common/MainLayout";
import {
    RowsTable,
    TColumn
} from './components/common/RowsTable'
import {SearchBar} from './components/common/SearchBar'
import {checkErrorCode, checkStatus, toast} from "./components/common/util";
import {Button, Upload, Icon, Row, Col} from "antd";

interface IProps {

}

interface IState {
    limit: number,
    total: number,
    page: number,
    rows: [],
    q: {
        plate: string,
        status: number
    },
    type: number
    file?: File

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
        limit: 10,
        total: 0,
        page: 1,
        rows: [],
        q: {
            plate: '',
            status: -1
        },
        type: 0,
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.getInfoList(1)

    }

    componentWillUnmount() {
    }

    public changeQ = (k: string, v: string) => {
        const {q} = this.state;
        q[k] = v;
        this.setState({q})
    };

    public location = (page: number) => {
        this.getInfoList(page);
    };

    public getInfoList = (page: number) => {
        const {limit, q} = this.state;
        q['limit'] = limit;
        q['page'] = page;

        const query = qs.stringify(q);
        fetch('/api/query/getinfolist?' + query, {
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
            if (undefined === j.errno) {
                toast.error('请求失败');
                return false
            }
            if (j.errno > 0) {
                checkErrorCode(j);
                toast.error(j.errmsg);
                return false
            }
            j.data.data.map((item: any) => {
                item.in_time = Moment.unix(item.in_time).format('YYYY-MM-DD HH:mm:ss');
                if (item.out_time != 0) {
                    item.out_time = Moment.unix(item.out_time).format('YYYY-MM-DD HH:mm:ss');
                } else {
                    item.out_time = "";
                }
            });
            this.setState({total: j.data.total, rows: j.data.data, page})
        }).catch((ex) => {
            toast.error(ex.toString());
        })
    };

    public search = () => {
        this.getInfoList(1)
    };

    public car = () => {
        const {type} = this.state;
        let method = "";
        if (type == 1) {
            method = "carin"
        } else if (type == 2) {
            method = "carout"
        } else {
            toast.error("type error");
            return
        }

        const {file} = this.state;
        const formData = new FormData();
        if (file instanceof File) {
            formData.append('file', file);
        } else {
            toast.error("file error");
            return
        }
        fetch('/be/getplate', {
            method: 'POST',
            body: formData
        })
            .then(checkStatus)
            .then((response) => {
                return response.json()
            }).then((j) => {
            if (undefined === j.errno) {
                toast.error('请求失败');
                return false;
            }
            if (j.errno > 0) {
                checkErrorCode(j);
                toast.error(j.errmsg);
                return false;
            }
            let plate = j.plate;
            fetch('/api/commit/' + method + '?plate=' + plate, {
                method: 'GET',
            }).then(checkStatus)
                .then((response) => {
                    return response.json()
                }).then((j) => {
                if (undefined === j.errno) {
                    toast.error('请求失败');
                    return false;
                }
                if (j.errno > 0) {
                    checkErrorCode(j);
                    toast.error(j.errmsg);
                    return false;
                }
                toast.info(method + ':' + plate);
                this.search();
            }).catch((ex) => {
                toast.error(ex.toString());
            });
        }).catch((ex) => {
            toast.error(ex.toString());
        });
    };

    render() {
        const pages: number = this.state.limit == 0 ? 0 : Math.ceil(this.state.total / this.state.limit);
        const inUploadProps = {
            beforeUpload: (file: File) => {
                this.setState({
                    file: file,
                    type: 1
                });
                return false;
            },
            showUploadList: false
        };
        const outUploadProps = {
            beforeUpload: (file: File) => {
                this.setState({
                    file: file,
                    type: 2
                });
                return false;
            },
            showUploadList: false
        };
        return (
            <div>
                <MainLayout content={
                    <div>
                        <Row
                            type='flex'
                            justify="space-between"
                            gutter={12}
                        >
                            <Col
                                span={4}
                            >
                                <Upload
                                    {...inUploadProps}
                                >
                                    <Button><Icon
                                        type="download"/>进入
                                    </Button>
                                </Upload>
                            </Col>
                            <Col
                                span={4}
                            >
                                < Upload
                                    {...outUploadProps}
                                >
                                    <Button><Icon
                                        type="upload"/>离开</Button>
                                </Upload>
                            </Col>
                            <Col
                                span={4}
                            >
                                <Button onClick={this.car}>确认</Button>
                            </Col>
                        </Row>
                        <hr/>
                        <SearchBar search={this.search}
                                   changeQ={this.changeQ}/>
                        <RowsTable
                            rows={this.state.rows}
                            columns={columns}
                            page={this.state.page}
                            pages={pages}
                            step={this.state.limit}
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
