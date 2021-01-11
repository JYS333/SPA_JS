// // 引入客户端
// import io from 'socket.io-client';
//
// // 连接服务器，得到代表连接的socket对象
// const socket = io('ws://localhost:4000');
//
// // 绑定‘receiveMsg’的监听，来接受服务器发送的消息
// socket.on('receiveMsg', function (data) {
//     console.log('Browser received msg:', data);
// });
//
// // 向服务器发送消息
// socket.emit('sendMsg', {name: 'Tom', date: Date.now()});
// console.log('Browser sent msg to server:', {name: 'Tom', date: Date.now()});

import io from 'socket.io-client';

// 连接服务器，得到连接对象
const socket = io('ws://localhost:4000');
// 绑定监听，接收服务器端发送的消息
socket.on('receiveMsg', function (data) {
    console.log('client received:', data);
});

// 发送消息
socket.emit('sendMsg', {name:'this is client.'});
console.log('client sent:', {name:'this is client.'});



