import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {Menu, Icon, Button, Layout, Alert} from 'antd'

const {Header, Sider, Content} = Layout;

interface TState {
    show: boolean
}

interface TProps {
    content: JSX.Element
}

const menuList = [
    {
        name: '首页',
        icon: 'home',
        uri: './index.html'
    },
];

export const alert = {
    success: (s) => {
        ReactDOM.render(<Alert message={s} type="success"
                               closable/>, document.getElementById('msg') as HTMLElement)
    },
    info: (s) => {
        ReactDOM.render(<Alert message={s} type="info"
                               closable/>, document.getElementById('msg') as HTMLElement)
    },
    warning: (s) => {
        ReactDOM.render(<Alert message={s} type="warning"
                               closable/>, document.getElementById('msg') as HTMLElement)
    },
    error: (s) => {
        ReactDOM.render(<Alert message={s} type="error"
                               closable/>, document.getElementById('msg') as HTMLElement)
    },
};

export class MainLayout extends React.Component<TProps, TState> {
    public state: TState = {show: false};
    public toggle = () => {
        const {show} = this.state;
        this.setState({show: !show})
    };
    public change = (b: boolean) => {
        this.setState({show: b})
    };
    public genList = () => menuList.map(o => (
            <Menu.Item key={o.name}>
                <a href={o.uri}>
                    <Icon type={o.icon}/>
                    <span>{o.name}</span>
                </a>
            </Menu.Item>
        )
    );


    public render(): JSX.Element {
        const {show} = this.state;
        return (
            <Layout
                style={{height: '100%'}}
            >
                {
                    show ?
                        <Sider
                            trigger={null}
                            theme='light'
                        >
                            <div style={{
                                padding: '20px 0',
                                background: '#fa8919',
                                textAlign: 'center'
                            }}>
                                <img
                                    src='logo_url'/>
                            </div>
                            <Menu
                                mode="inline"
                                defaultSelectedKeys={['1']}
                            >


                                <Menu.Divider/>
                                {this.genList()}
                            </Menu>
                        </Sider>
                        : ''

                }
                <Layout>
                    <Header style={{background: '#fff', padding: 24}}>
                        <Button
                            className="trigger"
                            icon={show ? 'menu-fold' : 'menu-unfold'}
                            onClick={this.toggle}
                        />
                    </Header>
                    <Content style={{padding: 24, background: '#fff'}}>
                        {this.props.content}
                    </Content>
                </Layout>
            </Layout>
        )
    }
}
