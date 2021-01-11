/*
显示指定类型的用户列表
 */

import React, {Component} from 'react'
import PropTypes from 'prop-types'

import {WingBlank, WhiteSpace, Card} from "antd-mobile";
import {withRouter} from "react-router-dom";
import QueueAnim from 'rc-queue-anim';

const Header = Card.Header;
const Body = Card.Body;

class UserList extends Component {
    static propTypes = {
        userList: PropTypes.array.isRequired
    }
    render () {
        const userList = this.props.userList;
        // console.log(userList);
        return (
            <WingBlank style={{marginBottom: 80, marginTop: 45}}>
                <QueueAnim type='scale'>
                    {
                        userList.map((user) => (
                            <div key={user._id}>
                                <WhiteSpace />
                                <Card onClick={() => this.props.history.push(`/chat/${user._id}`)}>
                                    <Header
                                        thumb={require(`../../assets/imgs/${user.header}.png`)}
                                        extra={user.username}
                                    />
                                    <Body>
                                        <div>Position: {user.post}</div>
                                        <div>Info: {user.info}</div>
                                        {user.salary ? (<div>Salary: {user.salary}</div>) : null}
                                        {user.company ? (<div>Company: {user.company}</div>) : null}
                                    </Body>
                                </Card>
                            </div>
                        ))
                    }
                </QueueAnim>
            </WingBlank>
        )
    }
}

export default withRouter(UserList);