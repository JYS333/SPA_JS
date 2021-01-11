/*
入口JS
 */
import React from 'react'
import ReactDOM from 'react-dom'
// import {Button} from "antd-mobile";
import {HashRouter, Route, Switch} from 'react-router-dom'
import {Provider} from 'react-redux'

import Register from "./containers/register/register";
import Login from "./containers/login/login";
import Main from "./containers/main/main";
import store from "./redux/store";

import './assets/css/index.less'

// import './test/socketio_test'

// HashRouter路由器里渲染路由组件
ReactDOM.render((
    <Provider store={store}>
        <HashRouter>
            <Switch>
                <Route path='/Register' component={Register}></Route>
                <Route path='/Login' component={Login}></Route>
                <Route component={Main}></Route> {/*默认组件*/}
            </Switch>
        </HashRouter>
    </Provider>
), document.getElementById('root'))