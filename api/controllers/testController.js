'use strict';
const obj={};

//引入db对象
const db=require('../models/db.js');

obj.test=function(req,res,next){

  //先添加数据到数据库
  // db.insert([{ name: '小红' }, { name: '小明' }], function(err, result) {
  //   if (err) console.log('出异常了');
  //   console.log(result.insertedCount);
  // });



  //随便查询数据库  调用封装的对数据库操作的对象db
  // db.find({name:/小/},function(err,users){
  //   // if(err) throw err;
  //   if(err) return next(err);//错误处理中间件 通过netx传递给express统一处理错误
  //
  //   //如果没有异常
  //   //将数据通过模板渲染到页面
  //   console.log(users);
  //   res.render('test.html', {   //express-art-template会默认会去找view文件夹下的文件 test.html
  //       users: users,//查询到的数据渲染到页面
  //   });
  //
  // })


  //数据库连接出了问题 暂时先用假数据
  var users=[{name:'小红'},{name:'小明'}];
  res.render('test.html', {   //express-art-template会默认会去找view文件夹下的文件 test.html
        users: users,//查询到的数据渲染到页面
  });



}




module.exports=obj;//将此模块导出 供使用
