import * as ReactDOM from "react-dom";
import {Alert} from "antd";
import * as React from "react";

export const toast = {
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

export function checkStatus(response: any) {
    if (response.status >= 200 && response.status < 300) {
        return response
    } else {
        toast.error(
            '请求失败',
        );
        throw new Error(response.statusText);
    }
}
export function checkErrorCode(responej: any) {
    console.log(responej);
    if(responej.errno == 301) {
        location.href=responej.data.url;
    }
}