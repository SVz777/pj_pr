import React from 'react';
import ReactDOM from 'react-dom'
import {Button, Table} from 'antd'
import {MainLayout} from "./components/common/MainLayout";

interface IProps {

}

interface IState {
    name: string,
    date: Date,
    timerID?: number,
}

class Index extends React.Component<IProps, IState> {

    constructor(props) {
        super(props);
        this.state = {
            name: "svzzzzzzz",
            date: new Date(),
        };
    }

    componentDidMount() {
        this.setState({
            timerID: setInterval(
                () => this.tick(),
                1000
            )
        });
    }

    componentWillUnmount() {
        clearInterval(this.state.timerID);
    }

    tick = () => {
        this.setState({
            date: new Date()
        })
    };

    render() {
        return (
            <div>
                {this.state.name},{this.state.date.toLocaleTimeString()}
            </div>
        )
    }
}

ReactDOM.render(
    <div>
        <MainLayout content={
            <div>
                <Index/>
                <Button onClick={() => {
                    alert("hello world")
                }}> Hello World </Button>
            </div>
        }/>
    </div>,
    document.getElementById('root')
);
