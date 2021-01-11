/*
老板信息完善 的路由容器组件
 */

import React, {Component} from 'react'
import {connect} from  'react-redux'
import {Redirect} from "react-router-dom";
import {Button, InputItem, NavBar, TextareaItem} from "antd-mobile";
import HeaderSelector from "../../components/header-selector/header-selector";

import {updateUser} from "../../redux/actions";

class EmployeeInfo extends Component {

    constructor(props) {
        super(props);
    }

    state = {
        header: '',
        post: '', // position
        info: '', // self introduction
    }

    handleChange = (name, value) => {
        this.setState({
            [name]: value
        })
    }

    setHeader = (header) => {
        this.setState({
            header: header
        })
    }

    save = () => {
        this.props.updateUser(this.state);
    }


    render() {
        // 如果信息完善了，自动重定向到主页面去, 否则页面不会变化（所以要给header加个必选提示）
        const {header, userType} = this.props.user;
        if(header) {
            let path = (userType === 'Employee') ? '/employee' : '/boss';
            return <Redirect to={path}/>
        }

        return (
            <div>
                <NavBar>Complete Employee Info</NavBar>
                <HeaderSelector setHeader={this.setHeader}/>
                <InputItem onChange={(value) => {this.handleChange('post', value)}} placeholder="The position you want.">Position:</InputItem> {/*默认类型是输入框*/}
                <TextareaItem onChange={(value) => {this.handleChange('info', value)}} placeholder="Self introduction." rows={5}/>
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
)(EmployeeInfo)