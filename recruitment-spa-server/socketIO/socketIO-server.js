const {chatModel} = require('../db/models');

module.exports = function (server) {
    const io = require('socket.io')(server); // 服务器端引入的,再在www中调用 line24

    // 监视客户端与服务器的链接
    io.on('connection', function (socket) {
        console.log('one connection.');
        // 绑定监听，接收客户端发送的消息
        socket.on('sendMsg', function ({from, to, content}) {
            console.log('Server received:', {from, to, content});
            // 处理数据(保存消息)
            // 先按照文档格式准备对象
            const chat_id = [from, to].sort().join('_'); // 排序保证无论谁给谁发都是一样的
            const create_time = Date.now();
            new chatModel({from, to, content, chat_id, create_time}).save(function (error, chatMsg) {
                // 向所有连接上的客户端发消息
                io.emit('receiveMsg', chatMsg);
            });
            // 向客户端发消息
        })
    })
};