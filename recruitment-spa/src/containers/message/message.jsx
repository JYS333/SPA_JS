/*
Message主页面
 */
import React, {Component} from 'react';
import {List, Badge} from "antd-mobile";
import {connect} from 'react-redux'

const Item = List.Item;
const Brief = Item.Brief;

// 获得与每个人聊天记录中的最后一条聊天内容
function getLastMsgs(chatMsgs, userId) {

    // 找到每个聊天的lastMsg，并用对象保存{chat_id: lastMsg}
    const lastMsgObjs = {};
    chatMsgs.forEach((msg) => {

        // 先判断当前这条消息是否为未读，每次循环都给当前这条消息加一个unReadCount属性，或0或1
        if(msg.to === userId && !msg.read) {
            msg.unReadCount = 1;
        } else {
            msg.unReadCount = 0;
        }

        const chatId = msg.chat_id;
        // 先判断lastMsgObjs里是否已经有了 拥有当前这个chat_id(代表同一个聊天记录) 的消息对象
        let lastMsg = lastMsgObjs[chatId];
        // 如果没有，先把这个以 对象内的键值对 chat_id: msg 的格式存进去，如果是最新的，不会被后面替换，如果不是最新的，会被后续循环替换
        if(!lastMsg) {
            lastMsgObjs[chatId] = msg;
        } else {
            // 累加的unReadCount = 已经统计的未读数量 + 当前这条是否未读
            const unReadCount = lastMsg.unReadCount + msg.unReadCount;
            if(msg.create_time > lastMsg.create_time) { // 1.有lastMsg，2.判断当前这条是否比已经有那条更新
                lastMsgObjs[chatId] = msg;
            }
            // 把累加结果保存在最新的lastMsg里，覆盖旧的。 然后每个聊天记录的未读消息就都累加好了
            lastMsgObjs[chatId].unReadCount = unReadCount;
        }
    });

    // 得到lastMsgs 转化来的数组，这个数组里面存的是每个与当前用户相关的聊天 的最后一条消息对象
    const lastMsgs = Object.values(lastMsgObjs);

    // 对数组进行排序(按create_time按降序)
    lastMsgs.sort(function (m1, m2) { // m1-m2 如果<0,m1在前面，= 不变，> m1在后面
        // 比如m1大，此时为负，m1在前面
        return m2.create_time - m1.create_time;
    });

    return lastMsgs;
}


class Message extends Component {
    render() {

        const {user} = this.props;
        const {users, chatMsgs} = this.props.chat;

        const lastMsgs = getLastMsgs(chatMsgs, user._id);

        return (
            <List style={{marginTop:45, marginBottom:45}}>
                {
                    lastMsgs.map((msg) => {

                        // 获取正在和我聊天的那个用户对象，它包括{username和header两个属性}, users里存的是全部users
                        const thatUser = users[msg.to === user._id ? msg.from : msg.to];
                        // 获取当天正在聊天的那个人的id，方便调路由
                        const thatUserId = msg.to === user._id ? msg.from : msg.to;

                        return (<Item
                            key={msg._id}
                            extra={<Badge text={msg.unReadCount}/>}
                            thumb={thatUser.header ? require(`../../assets/imgs/${thatUser.header}.png`) : null}
                            arrow='horizontal'
                            // onClick里面要写()=>{}这种格式的回调函数，不能直接写表达式
                            onClick={() => this.props.history.push(`/chat/${thatUserId}`)}
                        >
                            {msg.content}
                            <Brief>{thatUser.username}</Brief>
                        </Item>)
                })
                }
            </List>
        )
    }
}

export default connect(
    state => ({
        user: state.user,
        chat: state.chat
    }),
    {}
)(Message)