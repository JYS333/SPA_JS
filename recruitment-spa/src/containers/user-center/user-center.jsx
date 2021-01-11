/*
User Center主页面
 */
import React, {Component} from 'react';
import {Result, List, WhiteSpace, Button, Modal} from "antd-mobile";
import {connect} from 'react-redux'
import Cookies from 'js-cookie'; //可以操作前端cookie的对象 set()/get()/remove()

import {resetUser} from '../../redux/actions';

const Item = List.Item;
const Brief = Item.Brief;

class UserCenter extends Component {

    signout = () => {
        Modal.alert('Sign out', 'Sign out will not delete any data, you can still login with this account.',
            [
                {text:'Cancel'},
                {
                    text:'Confirm',
                    onPress: () => {
                        Cookies.remove('userid');
                        this.props.resetUser(); // 别打了不然在主页面会显示出来错误信息
                    }
                }
            ]);
    }

    render() {
        const {username, userType, header, company, post, salary, info} = this.props.user;
        return (
            <div style={{marginBottom: 80, marginTop: 45}}>
                <Result
                    img={<img src={require(`../../assets/imgs/${header}.png`)}
                              style={{width:50}} alt="header"/>}
                    title={username}
                    message={company}
                />

                <List renderHeader={() => 'Profile'}>
                    <Item multipleLine>
                        <Brief>Position:{post}</Brief>
                        {salary ? <Brief>Salary:{salary}</Brief> : null}
                        <Brief>Info:{info}</Brief>
                    </Item>
                </List>
                <WhiteSpace/>
                <List>
                    <Button type='warning' onClick={this.signout}>Sign out</Button>
                </List>
            </div>
        )
    }
}

export default connect(
    state => ({
        user: state.user
    }),
    {resetUser}
)(UserCenter)