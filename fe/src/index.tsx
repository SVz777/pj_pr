import React from 'react';
import ReactDOM from 'react-dom'
import {Button, Form, Input, Icon} from 'antd'
import {MainLayout} from "./components/common/MainLayout";
import {checkErrorCode, checkStatus, toast} from "./components/common/util";


class NormalLoginForm extends React.Component {
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
        fetch('/api/auth/login?account=' + this.props.form.getFieldValue("account") + '&password=' + this.props.form.getFieldValue('password'), {
            method: 'GET',
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
            location.href = "/fe/home.html";

        }).catch((ex) => {
            toast.error(ex.toString());
        });
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                <Form.Item>
                    {getFieldDecorator('account', {
                        rules: [{
                            required: true,
                            message: 'Please input your account!'
                        }],
                    })(
                        <Input prefix={<Icon type="user"
                                             style={{color: 'rgba(0,0,0,.25)'}}/>}
                               placeholder="Account"/>
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('password', {
                        rules: [{
                            required: true,
                            message: 'Please input your Password!'
                        }],
                    })(
                        <Input prefix={<Icon type="lock"
                                             style={{color: 'rgba(0,0,0,.25)'}}/>}
                               type="password" placeholder="Password"/>
                    )}
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit"
                            className="login-form-button">
                        Log in
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}

const Index = Form.create({name: 'normal_login'})(NormalLoginForm);

function logined() {
    let cookies = document.cookie.split(";");
    for(let cookie of cookies){
        let tmp = cookie.split('=');
        let k = tmp[0].trim();
        let v = tmp[1].trim();
        if(k == "account"){
            return v != "";
        }
    }
    return false;
}

function logout() {
    fetch('/api/auth/logout', {
        method: 'GET',
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
        location.href = "/fe/index.html";

    }).catch((ex) => {
        toast.error(ex.toString());
    });
}

ReactDOM.render(
    <div>
        <MainLayout content={
            logined() ?
                <div>
                    <Button type="primary" onClick={logout}>
                        Log Out
                    </Button>
                </div>
                :
                <Index/>

        }/>

    </div>,
    document.getElementById('root')
);
