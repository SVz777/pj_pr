import * as React from 'react'
import {Row, Col, Button, Input, Select} from 'antd';

interface TRow {
    id: number,
    name: string,
    review_status: number
}

interface IProps {
    search(): void

    changeQ(k: string, v: string): void
}

interface IState {

}

export class SearchBar extends React.PureComponent<IProps, IState> {
    public search: () => void;
    public changeQ: (k: string, v: string) => void;

    constructor(props: IProps) {
        super(props);
        this.search = props.search;
        this.changeQ = props.changeQ;
    }

    public render() {
        return (
            <Row
                type='flex'
                justify="space-between"
                gutter={12}
            >
                <Col
                    span={4}
                >
                    <Input
                        name="plate"
                        placeholder="车牌搜索"
                        onChange={(event) => {
                            this.changeQ("plate", event.target.value)
                        }}
                    >
                    </Input>
                </Col>
                <Col
                    span={4}
                >
                    <Select
                        style={{width: '100%'}}
                        placeholder="状态"
                        showSearch
                        defaultValue={-1}
                        onChange={(changedItem) => {
                            this.changeQ("status", changedItem.toString())
                        }}

                    >
                        {[
                            {label: '状态', value: -1,},
                            {label: '未离开', value: 1,},
                            {label: '已离开', value: 2,},
                        ].map(o => {
                            {
                                return <Select.Option value={o.value}
                                                      key={o.label}>
                                    {o.label}
                                </Select.Option>
                            }
                        })}
                    </Select>
                </Col>
                <Col span={4}><Button onClick={this.search}>搜索</Button></Col>
            </Row>
        )
    }
}
