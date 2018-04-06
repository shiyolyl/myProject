# myProject
### 项目简介
* 此项目为一个音乐项目，用MEAN的技术栈实现。前端采用angular框架和bootstrap,jquery等框架实现，后端采用node+express框架实现，数据库采用非关系型mongodb实现用户数据的存储。包含登录，注册，我的音乐等界面，以及对音乐的增删改查功能的实现，歌曲播放，歌词滚动显示的实现等。

### 开发环境
* angular + node + express + mongodb

### 项目架构
项目分为api目录和web目录
* web目录  前端代码目录
* api目录  服务端代码目录
```
├── api 
    ├── controllers
    ├── models
    ├── node_modules
    ├── views
    ├── config.js
    ├── package.json
    ├── server.js
    ├── web_router.js
├── web 
    ├── css
    ├── file
    ├── fonts
    ├── img
    ├── js
        ├── config
        ├── controllers
        ├── directives
        ├── models
        ├── client.js
        ├── router.js
    ├── vender
    ├── views
    ├── index.html
```

项目启动：
```
cd api
```
```
npm install     //下载依赖文件
```
```
node server.js  //开启服务器
```
```
前端浏览器访问http://localhost:9997/#!/login 进入登录页
```
