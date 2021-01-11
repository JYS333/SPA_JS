/*
Employee主页面
 */
import React, {Component} from 'react';
import {connect} from 'react-redux'
import UserList from "../../components/user-list/user-list";
import {getUserList} from "../../redux/actions";

class Employee extends Component {

    componentDidMount() { // 上来就先把userList这个state更新好
        this.props.getUserList('Boss');
        // console.log(this.props.userList);
    }

    render() {
        return (
            // 这里直接点用更新好的状态即可
            <UserList userList={this.props.userList} />
        )
    }
}

export default connect(
    state => ({
        userList: state.userList
    }),
    {getUserList}
)(Employee)