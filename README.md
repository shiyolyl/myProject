# myProject
我的项目
#### webpack基本操作
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
