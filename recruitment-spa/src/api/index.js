/*
包含了n个接口请求的函数的模块
函数返回值：promise
 */

import ajax from './ajax'
// 注册 接口
export const reqRegister = (user) => ajax('/register', user, 'POST');
// 登录 接口
export const reqLogin = ({username, password}) => ajax('/login', {username, password}, 'POST');
// 更新用户 接口
export const reqUpdateUser = (user) => ajax('/update', user, 'POST');
// 获取用户信息
export const reqUser = () => ajax('/user'); // GET请求不用写明
// 获取用户列表
export const reqUserList = (userType) => ajax('/userList', {userType});

// 获取当前用户的消息列表
export const reqCurrentUserChatMsgList = () => ajax('/msgList');
// 修改指定消息为 已读
export const reqReadMsg = (from) => ajax('/readMsg', {from}, 'POST');