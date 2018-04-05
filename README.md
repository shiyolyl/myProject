# myProject
### 项目简介
* 此项目为一个音乐项目，用MEAN的技术栈实现。前端采用angular框架和bootstrap,jquery等框架实现，后端采用node+express框架实现，数据库采用非关系型mongodb实现用户数据的存储。包含登录，注册，我的音乐等界面，以及对音乐的增删改查功能的实现，歌曲播放，歌词滚动显示的实现等。

### 开发环境
* angular + node + express + mongodb

### 项目架构
项目分为api目录和web目录
* web目录  前端代码目录
* api目录  服务端代码目录

项目分为api目录和web目录
* 下载安装
* 全局命令行工具 `npm i -g webpack`
* 默认支持commonjs模块定义
* 运行方式通过指定命令
    - webpack 入口文件 目标文件
    - `webpack ./index.js ./build.js`
* 通过配置文件，以代码的形式来指定webpack运行的相关设置

#### 使用webpack配置文件
* 进入到当前有webpack.config.js 文件的目录下，运行命令行webpack

```javascript
module.exports =

    {
        //入口在那咯
        entry: {
            main: './index.js', //单文件入口
        },
        output: {
            filename: './build.js'
        }
        //出口文件
    }


```
