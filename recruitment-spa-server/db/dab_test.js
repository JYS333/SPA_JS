/*
测试使用mongoose操作mongodb
 */

const md5 = require('blueimp-md5');

//引入mongoose
const mongoose = require('mongoose');
//连接数据库
mongoose.connect('mongodb://localhost:27017/recruitment'); //最后是数据库名字
//获取连接对象
const conn = mongoose.connection;
//绑定链接完成的监听
conn.on('connected', function () { //连接成功回调
    console.log('Success!');
});


// mongoose有个Schema，用来定义文档结构
const userSchema = mongoose.Schema({ //属性名/属性值的类型，是否是必须的，默认值是多少
    username: {type: String, required:true},
    password: {type: String, required:true},
    userType: {type: String, required:true},
    header: {type: String}
});
// mongoose的model，用来定义集合
const userModel = mongoose.model('users', userSchema) //集合名称为： users； 集合内对象/文档的格式


// 通过Model实例对集合数据进行CRUD操作
// 添加
function testSave() {
    // 创建userModel实例
    const user1 = new userModel({
        username: 'Jiayi Sun',
        password: md5('333'),
        userType: 'Employee'
    });
    // 调用save()保存
    user1.save(function (error, userDoc) {
        console.log('save()', error, userDoc); // n:1/0， ok:1
    })
}
// testSave();
// 查询
function testFind() {
    userModel.find(function (error, users) { // 返回数组
        console.log('find', error, users);
    })
    userModel.findOne({_id:'5ec566cbc7abe52d944c7cf0'}, function (error, user) { // 返回对象
        console.log('findOne', error, user);
    })
}
// testFind();
// 更新
function testUpdate() {
    userModel.findByIdAndUpdate(
        {_id:'5ec566cbc7abe52d944c7cf0'},
        {username: 'Paul'},
        function (error, oldOne) {
        console.log('findByIdAndUpdate', error, oldOne);
    })
}
// testUpdate();
// 删除
function testDelete() {
    userModel.remove(
        {_id:'5ec566cbc7abe52d944c7cf0'},
        function (error, doc) {
            console.log('remove', error, doc);
        }
    )
}