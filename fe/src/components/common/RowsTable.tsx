import * as React from 'react'
import {Table, Layout} from 'antd';

interface TRow {
    id: number,
    name: string,
}

interface TProps {
    page: number,
    pages: number,
    step: number,
    rows: [],
    total: number,
    columns: TColumn[],

    location(page: number): void,
}

export interface TColumn {
    width: number,
    dataIndex: string,
    title: string,
    render?: (o) => JSX.Element
}

interface TState {
    select: number,
}

export class RowsTable extends React.PureComponent<TProps, TState> {
    public props: TProps;
    public location: (page: number) => void;

    constructor(ps: TProps) {
        super(ps);
        this.props = ps;
        this.location = ps.location
    }

    public render(): JSX.Element {
        return (
            <Layout
                style={{
                    background: '#fff',
                }}
            >
                <Table
                    dataSource={this.props.rows}
                    columns={this.props.columns}
                    style={{
                        background: '#fff',
                        marginTop: 20
                    }}
                    pagination={{
                        pageSize: this.props.step,
                        current: this.props.page,
                        total: this.props.total,
                        showTotal: () => `共${this.props.total}条数据`,
                        onChange: this.props.location
                    }}
                    rowKey={this.props.columns[0].dataIndex}
                >
                </Table>
            </Layout>
        )
    }

}
