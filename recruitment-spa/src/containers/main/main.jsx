/*
主路由组件
 */
import React, {Component} from 'react'
import {Switch, Route} from "react-router-dom" // 需要为main界面的子路由切换
import {connect} from 'react-redux'
import {Redirect} from "react-router-dom";
import {NavBar} from "antd-mobile";

import BossInfo from "../Boss-info/boss-info";
import EmployeeInfo from "../Employee-info/employee-info";
import Boss from "../boss/boss";
import Employee from "../employee/employee";
import Message from "../message/message";
import UserCenter from "../user-center/user-center";
import Footer from "../../components/footer/footer";
import Chat from "../chat/chat";
import Cookies from 'js-cookie'; //可以操作前端cookie的对象 set()/get()/remove()

import {getDirectTo} from '../../utils';
import {getUser} from "../../redux/actions";

class Main extends Component {

    // 给组件对象添加属性
    navList = [ // 包含所有导航组件的相关信息数据
        {
            path:'/boss',
            component:Boss,
            title:'Employee',
            icon:'employee',
            text:'Employee'
        },
        {
            path:'/employee',
            component:Employee,
            title:'Boss',
            icon:'boss',
            text:'Boss'
        },
        {
            path:'/message',
            component:Message,
            title:'Messages',
            icon:'message',
            text:'Message'
        },
        {
            path:'/userCenter',
            component:UserCenter,
            title:'User Center',
            icon:'user',
            text:'Me'
        }
    ]

    // 这一整块的内容是为了 cookie里有id但网页关了以后再打开还能保证自动登录，通过当前保留的cookie中的id找到原user信息
    componentDidMount() {
        // 登陆过(cookie里有userid)，但现在没有登陆(即关了浏览器，redux管理的user里没东西，没有_id)，发送请求获取对应user
        const userid = Cookies.get('userid');
        const {_id} = this.props.user;
        if(userid && !_id) {
            this.props.getUser();
        }
    }

    render () {
        // 读取cookie中的userid
        const userid = Cookies.get('userid');
        // 没有，重定向到登陆界面
        if(!userid) {
            return <Redirect to='/login'/>
        }
        // 有，读取redux中的user状态
        const {user, unReadCount} = this.props;
        // 如果user里没有_id，返回null
        // debugger
        if(!user._id) { // 应该就不会走到了
            return null;
        } else { // 如果有_id，显示对应界面
            // 如果请求的根路径，根据userType和header计算重定向路径
            let path = this.props.location.pathname; // 保留着当前页面的url后面path的部分
            if(path === '/') { // 只有在没有route path时才会进去，一般是在页面因为没有_id而获取user后的那次进入，因为当时的path还是“/”
                path = getDirectTo(user.userType, user.header);
                return <Redirect to={path}/>
            } // 如果没进来就直接走下面的Route
        }

        const {navList} = this;
        const path = this.props.location.pathname;
        const currentNav = navList.find((nav) => nav.path === path); // 去navList里面找跟当前路径相同的路径

        if(currentNav) {
            if(user.userType === 'Boss') {
                navList[1].hidden = true; // 当前用户是boss，则把'/employee'隐藏
            }  else {
                navList[0].hidden = true; // 否则，把'/boss'隐藏
            }
        }

        return (
            <div>
                {currentNav ? (<NavBar className='fix-Top'>{currentNav.title}</NavBar>) : null}
                <Switch>
                    {
                        navList.map((nav, index) => <Route key={index} path={nav.path} component={nav.component}/>)
                    } {/*映射了4个路由*/}
                    <Route path='/bossInfo' component={BossInfo}/>
                    <Route path='/employeeInfo' component={EmployeeInfo}/>
                    <Route path='/chat/:userid' component={Chat}/>
                </Switch>
                {currentNav ? (<Footer unReadCount={unReadCount} navList={navList}/>) : null}
            </div>
        )
    }
}

export default connect(
    state => ({
        user: state.user,
        unReadCount: state.chat.unReadCount
    }),
    {getUser}
)(Main)