import React, {Component} from 'react';
import {connect} from 'react-redux';
import {NavBar, List, InputItem, Grid, Icon} from "antd-mobile";
import QueueAnim from 'rc-queue-anim';

import {sendMsg, readMsg} from '../../redux/actions';

const Item = List.Item;

class Chat extends Component {

    state = {
        content:'',
        isShow: false
    };

    // 在第一次render执行之前回调
    componentWillMount() {
        // 初始化表情列表数据
        const emojis = ['😀','😃','😄','😁','😆','😅','🤣','😂','🙂','🙃','😉',
            '😊','😇','🥰','😍','🤩','😘','😗','💩','😋','😛','🤑',
            '😴','🤢','🤮','🤧','🥵','🥶','😵','🤠','😎','😲','😱'];
        this.emojis = emojis.map((emoji) => ({text:emoji}))
    }

    // 在刷新页面时跳到最下面
    componentDidMount() {
        window.scrollTo(0,document.body.scrollHeight);
    }
    // 更新时调用
    componentDidUpdate() {
        window.scrollTo(0,document.body.scrollHeight);
    }

    componentWillUnmount() {
        //退出页面时执行 更新未读消息状态 的请求
        const from = this.props.match.params.userid; // 从这个用户
        const to = this.props.user._id; // 发到这个用户
        this.props.readMsg(from, to);
    }


    toggleShow = () => {
        const isShow = this.state.isShow;
        // console.log(isShow);
        this.setState({isShow: !isShow});
        if(isShow === false) { // 是false的时候，也就是在点击打开时resize
            // 异步手动派发resize时间，解决表情列表显示bug
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'));
            }, 0)
        }
    };

    sendMsg = () => {
        const from = this.props.user._id;
        const to = this.props.match.params.userid;

        const content = this.state.content.trim();

        // 发请求（发消息）
        if(content) {
            // console.log({from, to, content});
            this.props.sendMsg({from, to, content});
        }

        // 清除输入数据 并 关闭表情栏
        this.setState({
            content:'',
            isShow: false
        });
    };

    render () {

        const {user} = this.props;
        const {users, chatMsgs} = this.props.chat;

        const myId = user._id; // 当前用户的id
        if(!users[myId]) {
            return null; // 如果users里面是空的，没数据，返回null等数据来了再刷新
        }
        const targetId = this.props.match.params.userid; // 和当前用户对话的目标用户的id
        const chatId = [myId, targetId].sort().join('_'); // 组合

        // 对chatMsg过滤，只要和目标用户的对话
        // debugger // 这个debugger纪念一下：reducer中RECEIVE_MSG里的data是数组,不需要结构获取,写成了结构所以导致最新的消息变成了undefined
        const msgs = chatMsgs.filter((msg) => msg.chat_id === chatId);

        // 得到目标用户的头像header
        const targetHeader = users[targetId].header;
        // 有header值就获取图标，没有，就返回null，不然是undefined会报错
        const targetIcon = targetHeader ? require(`../../assets/imgs/${targetHeader}.png`) : null;

        const targetUsername = users[targetId].username;

        return (
            <div id='chat-page'>
                <NavBar
                    icon={<Icon type='left'/>}
                    onLeftClick={() => this.props.history.goBack()}
                    className='fix-Top'
                >{targetUsername ? targetUsername : null}</NavBar>
                <List style={{marginTop:45, marginBottom:45}}>
                    {/*<QueueAnim type='left'>*/}
                        { // 用map把聊天记录数组铺出来
                            msgs.map((msg) => {
                                if(msg.to === myId) { // 对方发给我的
                                    return (<Item
                                        key={msg._id}
                                        thumb={targetIcon}
                                    >
                                        {msg.content}
                                    </Item>)
                                } else { // 我发给对方的
                                    return (<Item
                                        key={msg._id}
                                        className='chat-me'
                                        extra='Me'
                                    >
                                        {msg.content}
                                    </Item>)
                                }
                            })
                        }
                    {/*</QueueAnim>*/}
                </List>
                <div className='am-tab-bar'>
                    <InputItem
                        placeholder='Text here'
                        value={this.state.content}
                        onChange={(value) => this.setState({content: value})}
                        onFocus={() => {this.setState({isShow: false})}}
                        extra={
                            <span>
                                <span onClick={this.toggleShow} style={{marginRight:5}}>😉</span>
                                <span onClick={this.sendMsg}>Send</span>
                            </span>
                        }
                    />
                    {this.state.isShow ? (
                        <Grid
                            data={this.emojis}
                            columnNum={8}
                            carouselMaxRow={4}
                            isCarousel={true}
                            onClick={(item) => {
                                this.setState({content: this.state.content + item.text});
                            }}
                        />
                    ) : null}

                </div>
            </div>
        )
    }
}

export default connect(
    state => ({
        user: state.user,
        chat: state.chat
    }),
    {sendMsg, readMsg}
)(Chat)