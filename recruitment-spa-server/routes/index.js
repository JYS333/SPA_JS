var express = require('express');
var router = express.Router();
const {userModel, chatModel} = require('../db/models');
const md5 = require('blueimp-md5');

const filter = {password: 0, __v: 0}; // 查询时过滤出指定的属性

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// 读数据用get，如果也要改数据，就用post

// 注册的路由
router.post('/register', function (req, res) {
  // 1.读取请求参数
  const {username, password, userType} = req.body;
  // 2.处理
    // 判断用户是是否已经存在（根据username）
  userModel.findOne({username},function (error, user) {
    if(user) { // 如果已经有该user
      res.send({code:1, msg: 'user exists.'}); // 1 代表失败
    } else {
      new userModel({username, password: md5(password), userType}).save(function (error, user) {

        // 生成一个cookie(userid: user._id), 并交给浏览器保存
        res.cookie('userid', user._id, {maxAge: 1000 * 60 * 60 * 24}); // 时间以毫秒为单位

        const data = {username: user.username, userType: userType, _id: user._id};
        // 3.返回响应数据
        res.send({code:0, data: data});
      })
    }
  })
});

// 登陆的路由
router.post('/login', function (req, res) {
  const {username, password} = req.body;
  // 根据username和password查询数据库users,有或者没有
  userModel.findOne({username, password: md5(password)}, filter, function (error, user) { //filter为过滤的属性
    if(user) { // 登陆成功
      // 生成一个cookie(userid: user._id), 并交给浏览器保存
      res.cookie('userid', user._id, {maxAge: 1000 * 60 * 60 * 24}); // 时间以毫秒为单位

      res.send({code:0, data: user});
    } else {
      res.send({code:1, msg:'username or password is not correct.'});
    }
  })
});

// 更新用户信息的路由
router.post('/update', function (req, res) {
  const user = req.body;
  // 想要更新某个user，需要用到_id，这个_id已经存到cookie里了，发请求时会自动携带
  // 从请求的cookie中得到_id
  const userid = req.cookies.userid;

  if(!userid) {
    return res.send({code:1, msg:'You need to sign in.'})
  }
  // 根据userid更新对应的user文档
  userModel.findByIdAndUpdate({_id:userid},user, function (error, oldUser) { //返回老的数据让你看最后一眼
    if(!oldUser) {
      // 如果不存在，则通知浏览器删除userid cookie
      res.clearCookie('userid');
      res.send({code:1, msg:'You need to sign in.'})
    } else {
      const {username, userType, _id} = oldUser;
      const data = Object.assign(user, {username, userType, _id}); //合并对象，有相同名字的后者覆盖前者，user是用户提交的，后面仨是老数据有的
      res.send({code:0, data:data});
    }
  })
});

// 获取用户信息的路由(根据cookie中的userid)
router.get('/user', function (req, res) {
  const userid = req.cookies.userid;
  // 如果不存在
  if(!userid) {
    return res.send({code:1, msg:'You need to sign in.'})
  }
  // 根据userid查询
  userModel.findOne({_id: userid}, filter, function (error, user) {
    res.send({code:0, data:user});
  })
});

// 获取用户列表的路由(根据类型)
router.get('/userList', function (req, res) {
  const {userType} = req.query;
  userModel.find({userType: userType}, filter, function (error, users) {
    res.send({code:0, data:users});
  })
});


// 获取当前用户的聊天消息列表
router.get('/msgList', function (req, res) {
  const userid = req.cookies.userid;
  // 查询所有的user文档数组
  userModel.find(function (error, users) {
    const allRelUsers = {}; // 对象容器，用“对象”来存的原因是方便通过key查找
    users.forEach((doc) => {
      allRelUsers[doc._id] = {username: doc.username, header: doc.header}; // 把数组内容一个个加到对象中去
    });
    /*
    * 查询userid相关的所有聊天信息
    * 参数1：查询条件
    * 参数2：过滤条件
    * 参数3：回调函数
    * */
    // from和to的格式！！！↓，是数组包括的两个对象！这两个“对象”作为or的条件
    chatModel.find({'$or': [{from: userid}, {to: userid}]}, filter, function (error, chatMsgs) { // 用or条件去找聊天记录
      // 返回所有 包含用户和当前用户相关 的所有聊天信息的数据
      console.log({chatMsgs});
      res.send({code:0, users:allRelUsers, chatMsgs});
    });
  });
});

// 修改指定消息为已读
router.post('/readMsg',function (req, res) {
  // 得到请求中的from和to
  const from = req.body.from;
  const to = req.cookies.userid; // 修改别人发给我的
  /*
  * 修改数据库中的chat数据
  * 参数1：查询条件
  * 参数2：更新为指定的数据对象
  * 参数3：是否1次更新多条? 默认只更新1条
  * 参数4：更新完成的回调函数
  * */
  // 所有from这个用户to我的消息全部改为已读
  chatModel.update({from, to, read: false}, {read: true}, {multi: true}, function (error, doc) {
    // 一次性更新多条后台的read为false的，改为true
    console.log('/readMsg', doc);
    res.send({code:0, data: doc.nModified}); // 更新的数量
  });
});

module.exports = router;
