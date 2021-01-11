项目描述：
1）此项目为一个 前后端分离的 招聘的SPA，包括前端应用和后端应用
2）包括用户注册/登录，大神/老板列表，实时聊天等模块
3）前端：使用React全家桶 + ES6 + Webpack（打包工具）等技术
4）后端：使用Node + express（路由管理） + mongodb（数据库） + socketIO（实时聊天，是一个库，有专门做聊天的模块）等技术
5）采用模块化，组件化，工程化的模式开发

3） 4）并称为技术栈，就是用到的技术的总和


1.3
技术选型：做项目前的准备工作
确定当前项目主要需要哪些技术

1.4
拆分路由：
前端路由，相当于决定该项目有几个端口页面，都是什么

1.5
API接口：写接口文档
API： URL，post/get，参数

前后台分离：
不分离，大部分情况下渲染是在后台完成，后台得到数据然后渲染，再返回给前台
分离：前后台分成两个项目，但是前台没数据，所以要用mock(模拟)数据

1.6.1
流程及开发方法：
熟悉一个项目的开发流程
学会模块化、组件化、工程化的开发模式
掌握使用create-react-app脚手架初始化react项目开发   // create-react-app 名字(不能大写)
学会使用node+express+mongoose+mongodb搭建后台开发

1.6.2
react-router-dom 路由库，开发单页应用
axios 发ajax请求，与后台进行交互
redux + react-redux + redux-thunk 管理应用组件状态
antd-mobile 组件库来构建界面
mongoose 操作mongodb数据库
express 搭建后台路由
socketIO 实现实时通信
blueimp-md5 对密码进行MD5加密处理
js-cookies 操作浏览器端cookie数据

1）编码测试                       ###这一步在create-react-app完了就做
npm start
访问 localhost：3000
编码，自动编译打包刷新(live-reload)， 查看效果
2）打包发布（频率低，1 2周做一次）
npm run build(对项目进行本地打包，省成本地打包文件，并没有运行打包项目)
npm install -g serve(下载静态服务器)
serve build(运行指定文件夹的项目，是打包的生成的项目文件夹)
访问localhost:5000


api 将ajax请求的代码封装到里面
assets 共用资源文件夹
components UI组件模块文件夹
containers 容器组件模块文件夹
redux redux相关模块文件夹
utils 工具模块文件夹
index.js 入口js（名字不能改）

###步骤，按顺序记录
引入路由包 react-router-dom 来处理路由
在containers中创建三个路由组件，登录，注册和main（一般路由都会和redux交互，所以在containers里写）
定义好组件后要将他们映射到路由

'''
ReactDOM.render((
    <HashRouter>
        <Switch> // 每次只能有一个路由加载，switch控制切换
            <Route path='/Register' component={Register}></Route>
            <Route path='/Login' component={Login}></Route>
            <Route component={Main}></Route>  // Main里不写path，这样除了上面两个其他的都要经过Main路由
        </Switch>
    </HashRouter>
), document.getElementById('root'))
'''

下载安装redux包
--save redux@3.7.2 react-redux redux-thunk
--save-dev redux-devtools-extension
在redux目录下创建那4个js文件

开始做登录/注册界面：
创建logo组件，因为不需要和redux互动所以创建在components里
写登录和注册
1.页面的组件从antd-mobile里面直接套用
2.给组件添加方法，使用onChange写回调函数将值传给state并由state更新页面
3.Radio不用写value因为不是输入的，不是变量
4.Button里面调用this.props.history.replace()方法进行跳转
