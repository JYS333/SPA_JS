/*
包含n个action creator
  异步action
  同步action
 */

import {reqRegister, reqLogin, reqUpdateUser, reqUser, reqUserList, reqCurrentUserChatMsgList, reqReadMsg} from "../api";
import {ERROR_MSG, AUTH_SUCCESS, RECEIVE_USER, RESET_USER, RECEIVE_USER_LIST, RECEIVE_MSG_LIST, RECEIVE_MSG, READ_ALL_MSGS} from "./action-types";
import io from 'socket.io-client';

// 创造action的工厂函数，通过type找到对应的action，再读取里面的data
// 授权成功的“同步action”          传一个数据user，拼出一个对象，并返回
const authSuccess = (user) => ({type: AUTH_SUCCESS, data:user}); // 返回对象的简便写法({})
// 错误提示信息的“同步action”
const errorMsg = (msg) => ({type: ERROR_MSG, data:msg});
// 接收用户的”同步action“
const receiveUser = (user) => ({type: RECEIVE_USER, data: user});
// 重置用户的“同步action”
export const resetUser = (msg) => ({type: RESET_USER, data:msg});
// 接受用户列表的“同步action”
const receiveUserList = (userList) => ({type: RECEIVE_USER_LIST, data: userList});
// 接收消息列表的同步action
const receiveMsgList = ({users, chatMsgs, userId}) => ({type: RECEIVE_MSG_LIST, data:{users, chatMsgs, userId}});
// 接收一个消息的“同步action”
const receiveMsg = (chatMsg, userId) => ({type: RECEIVE_MSG, data: {chatMsg, userId}});
// 已读全部消息，改变已读状态
const readAllMsgs = ({count, from, to}) => ({type: READ_ALL_MSGS, data: {count, from, to}});



// 注册“异步action”
export const register = (user) => {
    const {username, password, confirmPassword, userType} = user;
    // 做表单的前台验证，如果不通过，返回一个errorMsg的同步action
    if(!username) {
        return errorMsg('Username cannot be empty.');
    }
    if(!userType) {
        return errorMsg('You must choose a userType.')
    }
    if(password !== confirmPassword) {
        return errorMsg('Inconsistent password.');
    }

    // 表单数据合法，返回一个发送ajax请求的异步action函数
    return async dispatch => { // 因为是异步action，所以return一个函数
        // 发送注册的ajax异步请求
        const response = await reqRegister(user); // 发送user到服务器端，并接收服务器端send回的数据
        const result = response.data; // {code:0/1, data:user, msg:''}
        if(result.code === 0) { // 成功
            await getMsgList(dispatch, result.data._id);
            // 分发成功的action
            dispatch(authSuccess(result.data)); // 把返回的数据:user内容，放到对应的action里，组成对象
        } else { // 失败
            // 分发失败的action
            dispatch(errorMsg(result.msg)); // 这里的data和msg名字跟服务器端的对应着
        }
    }
}

// 登录“异步action”
export const login = (user) => {
    const {username, password} = user;
    // 做表单的前台验证，如果不通过，返回一个errorMsg的同步action
    if(!username) {
        return errorMsg('Username cannot be empty.');
    }
    if(!password) {
        return errorMsg('Password cannot be empty.');
    }

    // 表单数据合法，返回一个发送ajax请求的异步action函数
    return async dispatch => { // 因为是异步action，所以return一个函数
        // 发送注册的ajax异步请求
        const response = await reqLogin(user); // 从数据库里获得用户信息
        const result = response.data;
        if(result.code === 0) { // 成功
            await getMsgList(dispatch, result.data._id);
            // 分发成功的action
            dispatch(authSuccess(result.data));
        } else { // 失败
            // 分发失败的action
            dispatch(errorMsg(result.msg));
        }
    }
}

//更新用户信息“异步action”
export const updateUser = (user) => {
    const {header} = user; // 必须保证header不为空，才能让每次计算path时不再次跳到补充Info界面
    if(!header) {
        return errorMsg('You must choose an Icon.');
    }
    return async dispatch => {
        const response = await reqUpdateUser(user);
        // console.log("actions里的:"+response.data);
        const result = response.data;

        if(result.code === 1) { // 失败
            dispatch(resetUser(result.msg));
        } else { // 成功
            dispatch(receiveUser(result.data));
        }
    }
}

// 获取用户的“异步action”
export const getUser = () => {
    return async dispatch => {
        const response = await reqUser();
        const result = response.data;
        if(result.code === 0) { // 成功
            await getMsgList(dispatch, result.data._id);
            dispatch(receiveUser(result.data));
        } else {
            dispatch(resetUser(result.msg));
        }
    }
}

// 获取用户列表的“异步action”
export const getUserList = (type) => {
    return async dispatch => {
        const response = await reqUserList(type);
        const result = response.data;
        if(result.code === 0) { // 成功
            dispatch(receiveUserList(result.data));
        } else {
            // 应该没
        }
    }
};

// 读取
export const readMsg = (targetId, userId) => {
    return async dispatch => {
        const response = await reqReadMsg(targetId);
        const result = response.data;
        if(result.code === 0) {
            const count = result.data; // 后端发来的 修改为已读的消息 的数量
            const from = targetId; // 从这个用户发来的消息
            const to = userId; // 这个用户接收的消息
            dispatch(readAllMsgs({count, from, to}))
        }
    }
};


/*
单例对象
1.创建对象之前，判断对象是否已经创建，只有没有时，才去创建
2.创建对象之后，保存对象
*/
function initIO(dispatch, userid) {
    // 连接服务器，得到连接对象
    if(!io.socket) {
        io.socket = io('ws://localhost:4000'); // 创建对象后保存
    }
    // 绑定监听，接收服务器端发送的消息
    io.socket.on('receiveMsg', function (chatMsg) {
        console.log('client received:', chatMsg);
        // 因为每次都是给全局分发，所以只有当chatMsg与当前用户相关时才会调用↓同步action保存此次分发
        if(userid === chatMsg.from || userid === chatMsg.to) {
            dispatch(receiveMsg(chatMsg, userid));
            /*
            1.用户输入消息，点发送
            2.发送的消息通过下面的sndMsg方法连接到后台并传递{from, to, content}
            3.后台保存到数据库，并把消息返回给前台
            4.前台在这个方法里判断是否跟自己相关并通过同步action保存到state里
            5.state改变，重新刷新页面，显示出刚才发送的消息
             */
        }
    });
}
// 发送消息的“异步action”
export const sendMsg = ({from, to, content}) => {
    return dispatch => {
        console.log('client sent:', {from, to, content});
        // 发消息
        io.socket.emit('sendMsg', {from, to, content});
    }
};


// 异步获取消息列表数据
async function getMsgList(dispatch, userId) { // 因为前面没有return dispatch了，所以要传一下才能用
    // 在这初始化socket，用户注册登录获取时都会初始化，所以时机最好
    initIO(dispatch, userId);

    const response = await reqCurrentUserChatMsgList();
    const result = response.data;
    if(result.code === 0) {
        const {users, chatMsgs} = result;
        // 分发action
        dispatch(receiveMsgList({users, chatMsgs, userId}));
    }
}