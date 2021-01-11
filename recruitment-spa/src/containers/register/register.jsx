/*
注册路由组件
 */

import React, {Component} from 'react'
import Logo from '../../components/logo/logo.jsx'
import {
    NavBar,
    WingBlank,
    List,
    InputItem,
    WhiteSpace,
    Radio,
    Button
} from 'antd-mobile'
import {connect} from 'react-redux';
import {Redirect} from "react-router-dom";
import {register} from "../../redux/actions"; //引入注册的异步action


const ListItem = List.Item; // 把list里面的item属性拿出来

class Register extends Component {

    state = { // 创建state用来保存数据
        username:'',
        password:'',
        confirmPassword:'',
        userType:'',
    }

    register = () => {
        // console.log(this.state);
        this.props.register(this.state);
    }

    // 处理输入数据的改变： 更新对应的状态，因为name不是状态内的属性名
    handleChange = (name, value) => {
        // 更新状态
        this.setState({
            [name]: value  // 属性名是为[name]的值，不是name, 用[]包起来相当于找到对应的那个属性名， 这是js语法(记住！)
        })
    }

    toLogin = () => {
        this.props.history.replace('./login'); // 网页端打开React找到Register组件，里面可以看到props里的history，有replace方法，替换路径，无法回去原页面（因为replace）
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
                        <div className="am-list-header">Confirm password:</div>
                        <InputItem type="password" placeholder="Password" onChange={(value) => {this.handleChange('confirmPassword', value)}}></InputItem>
                    </List>
                    <ListItem>
                        <span>User Type:</span>
                        &nbsp;&nbsp;&nbsp;
                        {/*做判断，是否是那两种*/}
                        <Radio checked={this.state.userType === 'Employee'} onChange={() => this.handleChange('userType', 'Employee')}>Employee</Radio>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <Radio checked={this.state.userType === 'Boss'} onChange={() => this.handleChange('userType', 'Boss')}>Boss</Radio>
                    </ListItem>
                    <WhiteSpace/>
                    <WhiteSpace/>
                    <Button type="primary" onClick={this.register}>Sign up</Button>
                    <WhiteSpace/>
                    <Button onClick={this.toLogin}>I have an account</Button>
                </WingBlank>
            </div>
        )
    }
}

// 把这点东西包装成props塞到Register这个component里，外面又包了一层Connect(Register)，里面才是Register组件，且它有了下面的两个props
export default connect(
    state => ({user: state.user}), // 后面的user是reducer里面的user方法，一旦有任何变化都会自动执行，生成一个新的action.data并返回，然后而给到前面的user并以对象形式返回（这句话可能不对）
    {register: register} // 异步action,前面是属性名，后面跟action工厂函数名一致
)(Register)