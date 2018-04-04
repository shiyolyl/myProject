'use strict';
const express = require('express');
//引入第三方 解析post请求体数据成键值对的形式
const bodyParser=require('body-parser');
//引入用户的控制器userController
// const userController=require('./controllers/userController.js');

//引入session中间件
const session=require('express-session');

//引入配置文件对象
const config=require('./config.js');

//拿到服务器对象
let server=express();

//MEAN技术栈测试代码  现在前后端分离 不需要（后端渲染） 开始
//引入模板引擎express-art-template 进行渲染
// server.engine('html', require('express-art-template'));
// server.set('view options', {
//     debug: process.env.NODE_ENV !== 'production' //5 !== 'production'  true
//         //更新静态数据不走缓存，可以立刻发生改变
//         //缓存-> 将各种字符串和{{}} 第一次解析，保存为一个函数，接受动态数据，
//         //将字符串直接拼接
// });
//
// //引入测试控制器（实现逻辑的）
// let testController=require('./controllers/testController.js');
// //配置路由规则
// router.get('/',(req,res,next)=>{
//   //查询数据库相关数据
//   testController.test(req,res,next);
//   // res.json({name:'小红'})
// });
//处理静态资源文件 （内置中间件）
// server.use(express.static('./api'));//将api文件夹暴露出来
//MEAN技术栈测试代码  现在前后端分离 不需要（后端渲染） 结束



//路由对象
// let router=express.Router();
let router=require('./web_router.js');


//解析post请求体数据 （第三方中间件）
server.use(bodyParser.urlencoded({extended:false}));

//使用中间件处理跨域
server.use('/api',(req,res,next)=>{
  //允许所有域访问我
  res.setHeader('Access-Control-Allow-Origin', config.crossOrigin);
  //允许相关的请求方式访问我
  res.setHeader('Access-Control-Allow-Methods', 'POST,DELETE,GET,OPTIONS,PUT');//后端限定请求方式

  //当跨域和post+application/json 同时出现时 会给请求自动携带一个请求头content-type
  //所以后台要允许这个特定的请求头才可以跨域成功
  //允许特定的头
  res.setHeader('Access-Control-Allow-Headers', 'content-type,mytoken');

  //服务器允许携带证书
  res.setHeader('Access-Control-Allow-Credentials','true');


  //如果不next()就会一直卡住
  next();
})

// //配置路由规则    单独提出到web_router.js文件中
// router.post('/api/check/username',(req,res,next)=>{
//   // console.log('/api/check/username');
//   //获取请求体数据 根据body-parser对req.body的挂载
//   console.log(req.body);//打印出一个空对象 拿不到请求体数据  要在前端请求参数中设置头和transformRequest转换数据
//   //{username:'111'}
//   //调用userControoler操作用户是否存在的事宜
//   userController.checkUsername(req,res,next);
// })
// .post('/api/register',(req,res,next)=>{        //注册 路由
//   userController.doRegister(req,res,next);
// })
// .post('/api/login',(req,res,next)=>{            //登录 路由
//   userController.doLogin(req,res,next);
// })
// .get('/api/music/list',(req,res,next)=>{       //音乐列表
//   userController.getMusics(req,res,next);
// })
// .post('/api/music/upload',(req,res,next)=>{   //添加音乐
//   userController.doUpload(req,res,next);
// })
// .get('/api/music/edit:id',(req,res,next)=>{   //当前要编辑歌曲的显示
//   userController.getEditMusic(req,res,next);
// })
// .put('/api/music/update',(req,res,next)=>{    //更新音乐  编辑成功的提交
//   userController.updateMusic(req,res,next);
// })
// .delete('/api/music/delete',(req,res,next)=>{  //删除音乐
//   userController.deleteMusic(req,res,next);
// })
// .get('/public/getPic',(req,res,next)=>{      //注册页面生成验证码
//   userController.getPicture(req,res,next);
// })

//挂载session中间件
server.use(session({
   secret: 'keyboard cat',
   resave: false,           //是否未修改也保存
   saveUninitialized: true, //即时不使用session也分配
}))

//后端处理token在中间件中给req挂载属性
//先给req挂载user属性
server.use(function(req,res,next){
  //1.判断当前请求是否携带头信息mytoken
  if(req.headers.mytoken){
    //2.如果ok，将mytoken的值->毫秒值 作为key从global中取对象
    let currentUser=global[req.headers.mytoken];
    //3.给req.user赋值以上对象
    req.user=currentUser;
    // console.log(req.user);
  }
  next();  //放行到路由中间件运行


})

//路由级中间件
server.use(router);

//加入错误处理中间件
server.use(function(err,req,res,next){
  console.log('出错啦',err.stack);
  next();
})

server.listen(config.myport,()=>{
  console.log("服务器启动了");
})
