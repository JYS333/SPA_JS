/*
老板信息完善 的路由容器组件
 */

import React, {Component} from 'react'
import {connect} from  'react-redux'
import {Redirect} from "react-router-dom";
import {
    NavBar,
    InputItem,
    TextareaItem,
    Button
} from "antd-mobile";

import HeaderSelector from "../../components/header-selector/header-selector";
import {updateUser} from "../../redux/actions";


class BossInfo extends Component {

    state = {
        header: '',
        post: '', // position
        info: '',
        company: '',
        salary: ''
    }

    setHeader = (header) => {
        this.setState({
            header: header
        })
    }

    handleChange = (name, value) => {
        this.setState({
            [name]: value
        })
    }

    save = () => {
        this.props.updateUser(this.state);
    }

    render() {
        // 如果信息完善了，自动重定向到主页面去
        const {header, userType} = this.props.user;
        if(header) {
            const path = (userType==='Boss') ? '/boss' : '/employee';
            return <Redirect to={path}/>
        }

        return (
            <div>
                <NavBar>Complete Boss Info</NavBar>
                <HeaderSelector setHeader={this.setHeader}/> {/*把this.setHeader这个函数作为props传给它的子组件*/}
                <InputItem onChange={(value) => {this.handleChange('post', value)}} placeholder="Your open positions.">Position:</InputItem> {/*默认类型是输入框*/}
                <InputItem onChange={(value) => {this.handleChange('company', value)}} placeholder="Your company.">Company:</InputItem>
                <InputItem onChange={(value) => {this.handleChange('salary', value)}} placeholder="The salary you provide.">Salary:</InputItem>
                <TextareaItem onChange={(value) => {this.handleChange('info', value)}} placeholder="Requirements for employees." rows={3}/>
                <Button onClick={this.save} type='primary'>Save</Button>
            </div>
        )
    }
}

export default connect(
    state => ({
        user: state.user
    }),
    {updateUser}
)(BossInfo)