/*
包含n个reducer函数：根据旧的state和指定的action返回新的state
 */
import {combineReducers} from "redux"; // 合并多个reducers
import {
    ERROR_MSG,
    AUTH_SUCCESS,
    RECEIVE_USER,
    RESET_USER,
    RECEIVE_USER_LIST,
    RECEIVE_MSG_LIST,
    RECEIVE_MSG,
    READ_ALL_MSGS
} from "./action-types";

import {getDirectTo} from "../utils";


const initUser = {
    username: '',
    userType: '',
    msg: '', // 存放错误提示信息
    redirectTo: ''
};
// 产生user状态的reducer
function user(state=initUser, action) {

    switch (action.type){
        case AUTH_SUCCESS: // data是user
            const {userType, header} = action.data;
            // console.log("reducers里AUTH_SUCCESS的"+action.data)
            return {...action.data, redirectTo: getDirectTo(userType, header)}; // 用action.data把以前的覆盖
        case ERROR_MSG: // data是msg
            return {...state, msg: action.data}; // 先把原本状态解构，再用action.data把以前的覆盖
        case RECEIVE_USER: // data是user
            return action.data;
        case RESET_USER: // data是msg
            return {...initUser, msg: action.data}; // 把user射程initial的
        default:
            return state;
    }
}

const initUserList = [];
// 产生user list状态的reducer
function userList(state=initUserList, action) {
    switch (action.type) {
        case RECEIVE_USER_LIST:
            return action.data;
        default:
            return state;
    }
}

const initChat = {
    users: {}, // 所有用户信息，对象形式
    chatMsgs: [], // 当前用户所有相关msg的数组
    unReadCount: 0 // 总的未读数量
};
// 产生聊天状态的reducer
function chat(state=initChat, action) {
    switch (action.type) {
        case RECEIVE_MSG_LIST: // {users, chatMsgs(这是所有的消息记录)}
            const {users, chatMsgs, userId} = action.data;
            return {
                users,
                chatMsgs,
                unReadCount: chatMsgs.reduce((preTotal, msg) => preTotal+ (!msg.read&&msg.to===userId ? 1 : 0),0) // 最后的0是initialValue
            };
        case RECEIVE_MSG: // {chatMsg[], userId}
            const {chatMsg} = action.data; // 如果传过来的不是个对象，就别写解构，不然会变undefined
            return {
                users: state.users,
                chatMsgs: [...state.chatMsgs, chatMsg], // 把最新一条加进去
                unReadCount: state.unReadCount + !chatMsg.read&&chatMsg.to===action.data.userId ? 1 : 0};
        case READ_ALL_MSGS:
            const {count, from, to} = action.data;
            // ？为什么不能直接改状态，而要用map？
            state.chatMsgs.forEach((msg) => {
                if(msg.from === from && msg.to === to && !msg.read) {
                    msg.read = true;
                }
            })
            return {
                users: state.users,
                // 后台的read已经改好了，但是前台的还没改，需要也改了好重新渲染页面

                // chatMsgs: state.chatMsgs.map((msg) => {
                //     if(msg.from === from && msg.to === to && !msg.read) { // 找到从哪个用户发给我的所有未读消息，改为已读，并产生一个新数组
                //         return {...msg, read:true};
                //     } else {
                //         return msg;
                //     }
                // }),
                chatMsgs: state.chatMsgs,
                unReadCount: state.unReadCount - count
            };
        default:
            return state;
    }
}

export default combineReducers({
    user,
    userList,
    chat
})
// 向外暴露的状态结构：对象{xxx: 0, yyy: 0}，里面是属性名和属性值

