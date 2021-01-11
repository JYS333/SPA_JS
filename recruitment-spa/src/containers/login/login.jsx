/*
登录路由组件
 */
import React, {Component} from 'react'
import Logo from '../../components/logo/logo.jsx'
import {
    NavBar,
    WingBlank,
    List,
    InputItem,
    WhiteSpace,
    Button
} from 'antd-mobile'
import {connect} from 'react-redux';
import {Redirect} from "react-router-dom";
import {login} from "../../redux/actions"; //引入登录的异步action

// const ListItem = List.Item; // 把list里面的item属性拿出来

class Login extends Component {

    state = {
        username:'',
        password:''
    }

    login = () => {
        // console.log(this.state);
        this.props.login(this.state);
    }

    toRegister = () => {
        this.props.history.replace('./register')
    }

    handleChange = (name, value) => {
        this.setState({
            [name]:value
        })
    }

    render () {
        const {msg, redirectTo} = this.props.user;
        // console.log(this.props);
        if(redirectTo) { //如果有值，重定向
            return <Redirect to={redirectTo}/>
        }

        return (
            <div>
                <NavBar>RECRUITMENT</NavBar>
                <Logo/>
                <WingBlank>
                    <List>
                        {msg ? <div className="error-msg">{msg}</div> : null}
                        <div className="am-list-header">Your UserName:</div>
                        <InputItem placeholder="User name" onChange={(value) => {this.handleChange('username', value)}}></InputItem>
                        <div className="am-list-header">Your Password:</div>
                        <InputItem type="password" placeholder="Password" onChange={(value) => {this.handleChange('password', value)}}></InputItem>
                    </List>
                    <WhiteSpace/>
                    <WhiteSpace/>
                    <Button type="primary" onClick={this.login}>Sign In</Button>
                    <WhiteSpace/>
                    <Button onClick={this.toRegister}>I don't have an account</Button>
                </WingBlank>
            </div>
        )
    }
}

export default connect(
    state => ({user: state.user}), // 后面的user是reducer里面的user方法
    {login} // 异步action
)(Login)