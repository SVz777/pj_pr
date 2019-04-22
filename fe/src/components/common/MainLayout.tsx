import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {Menu, Icon, Button, Layout} from 'antd'

const {Header, Sider, Content} = Layout;

interface TState {
    show: boolean
}

interface TProps {
    content: JSX.Element
}

const menuList = [
    {
        name: 'default',
        icon: 'home',
        uri: './index.html'
    },
    {
        name: '首页',
        icon: 'home',
        uri: './home.html'
    },
];

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
                                padding: '0 25',
                            }}>
                                <img
                                    style={{
                                        height: '40px',
                                        width: '40px',
                                    }}
                                    src='/fe/static/logo.png'/>
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
