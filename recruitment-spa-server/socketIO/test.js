// module.exports = function (server) {
//     // 得到IOd对象
//     const io = require('socket.io')(server)
//     // 监视连接(当一个客户连接上时回调)
//     io.on('connection', function (socket) {
//         console.log('socketio connected');
//         // 绑定sendMsg监听，接收客户端发送的消息
//         socket.on('sendMsg', function (data) {
//             // 向客户端发送消息(名称， 数据)
//             io.emit('receiveMsg', data.name + '_' + data.date); // 发送给所有连接上服务器的客户端
//             // socket.emit('receiveMsg', data.name + '_' + data.date); // 发送个当前socket对应的客户端
//             console.log('Server sent msg to browser', data);
//         })
//     })
// };


module.exports = function (server) {
    const io = require('socket.io')(server); // 服务器端引入的,再在www中调用 line24

    // 监视客户端与服务器的链接
    io.on('connection', function (socket) {
        console.log('one connection.');
        // 绑定监听，接收客户端发送的消息
        socket.on('sendMsg', function (data) {
            console.log('Server received:', data);
            // 处理数据
            data.name = data.name.toUpperCase();
            // 服务器 向 客户端 发送消息
            socket.emit('receiveMsg', data);
            console.log('Server sent:', data);
        })
    })
};
