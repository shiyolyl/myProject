// 将路由配置提出到单独文件中：

'use strict';
const express = require('express');
//路由对象
let router=express.Router();
//引入用户的控制器userController
const userController=require('./controllers/userController.js');

router.post('/api/check/username',(req,res,next)=>{
  // console.log('/api/check/username');
  //获取请求体数据 根据body-parser对req.body的挂载
  // console.log(req.body);//打印出一个空对象 拿不到请求体数据  要在前端请求参数中设置头和transformRequest转换数据
  //{username:'111'}
  //调用userControoler操作用户是否存在的事宜
  userController.checkUsername(req,res,next);
})
.post('/api/login',(req,res,next)=>{            //登录 路由
  userController.doLogin(req,res,next);
})
.get('/api/music/list',(req,res,next)=>{       //音乐列表
  userController.getMusics(req,res,next);
})
.post('/api/music/upload',(req,res,next)=>{   //添加音乐
  userController.doUpload(req,res,next);
})
.get('/api/music/edit:id',(req,res,next)=>{   //当前要编辑歌曲的显示
  userController.getEditMusic(req,res,next);
})
.put('/api/music/update',(req,res,next)=>{    //更新音乐  编辑成功的提交
  userController.updateMusic(req,res,next);
})
.delete('/api/music/delete',(req,res,next)=>{  //删除音乐
  userController.deleteMusic(req,res,next);
})
.get('/public/getPic',(req,res,next)=>{      //注册页面生成验证码
  userController.getPicture(req,res,next);
})

module.exports=router;
