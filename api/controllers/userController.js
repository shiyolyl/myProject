'use strict';

let obj = {};

const Db = require("../models/db.js");

//mogodb中的ID生成器  将传来的id用ObjectId包裹成和数据库中存储的形式一样
const ObjectID = require('mongodb').ObjectID;

//引入第三方包 formidable  解析请求体数据
const formidable = require('formidable');

//生成验证码
const captchapng = require('captchapng');


//引入node中操作路径的核心对象path
const path = require('path');

//引入配置路径的文件
const config = require('../config.js');

let db = new Db('users');
let musicDb = new Db('songs');

/**
 * 检查用户名
 */
obj.checkUsername = (req, res, next) => {

  let username = req.body.username;
  db.find({
    username: username
  }, (err, users) => {
    if (err) next(err);
    if (users.length === 0) {
      //没有此用户名 可以注册
      res.json({
        code: '001',
        msg: '恭喜你 可以注册！',
      })
    } else {
      res.json({
        code: '002',
        msg: '用户名已存在',
      })
    }
  })


}

//提交注册
/**
 *
 */
obj.doRegister = function(req, res, next) {
  //验证
  let user = req.body;

  //验证用户验证码输入是否正确
  let vcode=req.session.vcode;  //在生成验证码的时候存储的  取出生成验证码时存储的验证码
  let formVcode=req.body.vcode; //获取请求体中用户输入的验证码
  if(vcode!=formVcode){    //如果不相等  则用户输入的验证码不正确
    return res.json({
      code:'002',
      msg:'验证码不正确'
    })
  }

  //先验证简单的 查询数据库的验证放到最后 提高性能

  //验证邮箱
  const emailRegex = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
  if (!emailRegex.test(user.email)) {
    return res.json({
      code: '003',
      msg: '邮箱不合法',
    })
  }

  //验证密码长度
  if (user.pwd.trim().length > 12 || user.pwd.trim().length < 6) {
    return res.json({
      code: '004',
      msg: '密码必须在6-12位之间!'
    })
  }

  //判断用户名是否存在
  db.find({
    username: user.username
  }, (err, users) => {
    if (err) next(err);
    if (users.length != 0) {
      //没有此用户名 可以注册
      return res.json({ //注意要renturn 如果进入里面就不走下面的代码了 无需再验证邮箱了
        code: '002',
        msg: '用户名已存在!',
      })
    }
  });

  //都验证通过 可以成功注册：
  //保存用户提交的数据到数据库
  db.insert([user], (err, result) => {
    if (err) return next(err);
    return res.json({ //必须加return 否则报错重复响应
      code: "001",
      msg: "注册成功",
    })
  })

};

//登录
obj.doLogin = function(req, res, next) {
  let user = req.body;
  //查询用户名和密码匹配的情况
  db.find(user, (err, users) => {
    if (err) next(err);
    //判断是否找到用户名并且密码都相等的情况
    if (users.length === 0) {
      //没有此用户名 提示先注册 并跳转到注册页面
      return res.json({
        code: "002",
        msg: "用户名或者密码不正确！"
      })
    };

    //如果当前users.length不等于0，一定有一个用户
    let user = users[0]; //取出用户信息
    //1.服务器生成token给用户  通过Date.now()来生成
    let token = Date.now() + '';
    //2. 根据token作为柜子（global)的编号，将数据(用户信息user)存储起来
    global[token] = user;


    //登录成功
    // console.log(users);
    res.json({
      code: '001',
      msg: '登录成功！',
      //交付钥匙token给客户端
      token: token,
      //返回当前用户的权限
      permissions: user.permissions,
    })

  });

}

//音乐列表
obj.getMusics = function(req, res, next) {

  musicDb.find({
    uid: req.user._id
  }, function(err, songs) {
    // musicDb.find({uid:req.user._id},function(err,musics){
    if (err) return next(err);
    // console.log(songs);
    res.json({
      // songs:songs,
      songs //Es6的简写形式
    })
  })
}

//添加歌曲
obj.doUpload = function(req, res, next) {
  //解析请求体文件数据 new formidable对象  写法可查npm包里搜索
  var form = new formidable.IncomingForm();
  //在解析之前设置默认的存储路径
  form.uploadDir = config.uploadDir //静态资源文件夹file的绝对路径 'D:/web_study/node/music/web/file'
  //解析请求体文件数据
  form.parse(req, function(err, fields, files) {
    // console.log(fields);
    // console.log(files);

    //设置向数据库中要插入的添加的音乐信息的对象 以便插入数据库
    let insertObj = {};
    insertObj.title = fields.title;
    insertObj.time = fields.time;
    insertObj.singer = fields.singer;

    //获取歌曲文件路径
    let filename = path.parse(files.file.path).base; //获取文件的名称，作为数据存储的路径
    //拼接歌曲文件路径
    filename = '/file/' + filename;
    insertObj.file = filename;
    //获取歌词文件路径
    let filenamelrc = path.parse(files.filelrc.path).base; //获取文件的名称，作为数据存储的路径
    //拼接歌词文件路径
    filenamelrc = '/file/' + filenamelrc;
    insertObj.filelrc = filenamelrc;
    //添加uid属性  当前用户的id
    insertObj.uid = req.user._id;

    //插入数据库
    musicDb.insert([insertObj], (err, result) => {
      if (err) return next(err);
      res.json({
        code: '001',
        msg: '上传成功'
      })
    })
  })
};

//获取当前要编辑的音乐信息
obj.getEditMusic = function(req, res, next) {
  //后台获取请求参数的id  根据其返回对应的音乐信息
  var mid = req.params.id;

  try {
    mid: ObjectID(mid)
  }
  catch (e) {
    return res.json({
      code: "002",
      msg: "没有发生更新"
    })
  }

  musicDb.find({
    _id: ObjectID(mid)
  }, function(err, result) {
    if (err) return next(err);
    console.log(result);

    if (result.length === 0) {
      res.json({
        code: "002",
        msg: "ID歌曲不可随意输入"
      })
    }
    let music = result[0]; //查询后返回的是一个数组
    res.json({
      code: "001",
      msg: "成功",
      music
    })
  })
};

//编辑之后的提交
obj.updateMusic = function(req, res, next) {

  //解析请求体数据   和添加一样

  //解析请求体文件数据 new formidable对象  写法可查npm包里搜索
  var form = new formidable.IncomingForm();
  //在解析之前设置默认的存储路径
  form.uploadDir = config.uploadDir //静态资源文件夹file的绝对路径 'D:/web_study/node/music/web/file'
  //解析请求体文件数据
  form.parse(req, function(err, fields, files) {
    console.log(fields);
    // console.log(files);

    //设置向数据库中要插入的添加的音乐信息的对象 以便插入数据库
    let insertObj = {};
    insertObj.title = fields.title;
    insertObj.time = fields.time;
    insertObj.singer = fields.singer;

    if (files.file) { //如果用户传了歌 才操作路径  否则就是原来修改前的路径 无需操作
      //获取歌曲文件路径
      let filename = path.parse(files.file.path).base; //获取文件的名称，作为数据存储的路径
      //拼接歌曲文件路径
      filename = '/file/' + filename;
      insertObj.file = filename;
    }
    if (files.filelrc) {
      //获取歌词文件路径
      let filenamelrc = path.parse(files.filelrc.path).base; //获取文件的名称，作为数据存储的路径
      //拼接歌词文件路径
      filenamelrc = '/file/' + filenamelrc;
      insertObj.filelrc = filenamelrc;
    }

    let _id;
    try {
      _id = ObjectID(fields._id);
    } catch (e) {
      return res.json({
        code: '002',
        msg: '您要修改的歌曲不存在'
      })
    }

    //修改后的对象是insertObj  根据请求体所传来的id来更新数据库
    //第一个参数为条件及修改此音乐的id  第二个参数为修改后的对象
    musicDb.update({
      _id
    }, insertObj, (err, result) => {
      if (err) return next(err);
      if (result.modifiedCount === 0) {
        return res.json({
          code: '002',
          msg: '传入的id不合法'
        })
      } else {
        res.json({
          code: '001',
          msg: '修改成功'
        })
      }
    })


  })

}

//删除音乐
obj.deleteMusic = function(req, res, next) {
  //后台获取请求参数的id  根据其删除对应的音乐信息
  var _id = req.query.id;

  try {
    _id: ObjectID(_id)
  }
  catch (e) {
    return res.json({
      code: "002",
      msg: "无效的音乐编号"
    })
  }
  //数据库操作删除
  musicDb.remove({
    _id
  }, (err, result) => {
    if (err) return next(err);
    if (result.deletedCount == 0) {
      return res.json({
        code: "002",
        msg: "您要删除的歌曲不存在"
      })
    }
    console.log(result)
    res.json({
      code: '001',
      msg: '删除成功'
    })

  })

};

//注册页面生成验证码
obj.getPicture = function(req, res, next) {
  //npm上查captchapng的用法：
  var num=parseInt(Math.random() * 9000 + 1000);
  var p = new captchapng(80, 30,num ); // width,height,numeric captcha
  p.color(0, 0, 0, 0);      // First color: background (red, green, blue, alpha)
  p.color(80, 80, 80, 255); // Second color: paint (red, green, blue, alpha)

  var img = p.getBase64();
  var imgbase64 = new Buffer(img, 'base64');
  res.writeHead(200, {
    'Content-Type': 'image/png'
  });

  //挂载验证码答案即num到session中  存储生成的此验证码
  req.session.vcode=num;

  res.end(imgbase64);
}






module.exports = obj;
