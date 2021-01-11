/*
包含n个操作数据库集合数据的Model模块
 */

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/recruitment');

const conn = mongoose.connection;

conn.on('connected', () => {
    console.log('You have a DB now!');
});

// 确定user内应该包含哪些数据，哪些是必须的，即定义文档结构
const userSchema = mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    userType: {type: String, required: true},
    header: {type: String},
    post: {type: String},
    info: {type: String},
    company: {type: String},
    salary: {type: String}
});
// mongoose的model，用来定义集合
const userModel = mongoose.model('users', userSchema); // 集合名 users

// 向外暴露Model， Model内包含CRUD的方法
// module.exports = userModel;
exports.userModel = userModel; // 暴露多个时这样写


// 定义chats集合的文档结构
const chatSchema = mongoose.Schema({
    from: {type: String, required:true}, // 发送用户的id
    to: {type: String, required:true}, // 接收用户的id
    chat_id: {type: String, required:true}, // from和to组成的字符串
    content: {type: String, required:true}, // 内容
    read: {type: Boolean, default:false}, // 表示是否已读
    create_time: {type: Number} // 创建时间
});
// 定义能操作chats的集合数据Model
const chatModel = mongoose.model('chats', chatSchema);
// 向外暴露Model
exports.chatModel = chatModel;