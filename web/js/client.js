(function(angular){

  angular.module('music',[
    'ui.router',
    'music.router',   //前端路由列表
    'music.hostConfig',//全局url配置  每个请求细节包括url和请求方式头等的配置模块
    'music.register', //注册模块
    'music.checkPwdDirective',//密码强度指令模块
    'music.login',//登录
    'music.httpFactory', //拦截器的具体操作
    'music.list',     //音乐列表模块
    'music.scrollLrcDirective', //滚动歌词指令模块
    'music.footerDirective',   //封装的底部模块
    'music.myHeaderDirective', //封装的头部
    'music.userService', //操作用户数据  为顶部显示用户名设置的模块
    'music.logout', //退出
    'music.add',    //添加
    'music.edit',   //编辑
  ])
      .config(['$httpProvider',function($httpProvider){
        $httpProvider.defaults.headers.post={
          'content-type':'application/x-www-form-urlencoded'
        };
        $httpProvider.defaults.transformRequest=function(data){
          var tmp = '';
          for (var key in data) {
             tmp += key + '=' + data[key] + '&'
          }
          //去除&
          return tmp.substr(0, tmp.length - 1); //键值对的形式
        };
        //配置每次请求，如果有自定义的头token，通过拦截器自动加入到请求头中
        $httpProvider.interceptors.push('httpFactory');
      }])
      // .constant('host','http://127.0.0.1:12345') //定义一个常量

      // 将此前端路由抽取出来到router.js文件中

      // .config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){
      //   //默认进入login登录
      //   $urlRouterProvider.otherwise('login');
      //   $stateProvider.state('register',{  //配置路由规则
      //     url:'/register',                 //通过http://127.0.0.1:9997/#!/register来访问
      //     templateUrl:'../views/register.html',
      //     controller:'registerController'
      //   })
      //   .state('login',{     //登录路由
      //     url:'/login',
      //     templateUrl:'../views/login.html',
      //     controller:"loginController"
      //   })
      //   .state('music',{     //音乐父级路由
      //     url:'/music',
      //     templateUrl:'../views/music.html',
      //   })
      //   .state('music.list',{  //音乐子级路由（列表页）
      //     url:'/list',
      //     templateUrl:'../views/list.html',
      //     controller:'listController',
      //   })
      //   .state('logout',{  //退出路由
      //     url:'/logout',
      //     templateUrl:'../views/logout.html',
      //     controller:'logoutController',
      //   })
      //   .state('music.add',{    //添加路由
      //     url:'/add',
      //     templateUrl:'../views/add.html',
      //     controller:'addController',
      //   })
      //   .state('music.edit',{   //编辑路由
      //     url:'/edit?id',
      //     templateUrl:'../views/edit.html',
      //     controller:'editController',
      //   })
      // }])

      //监听路由的变化 获取路由信息 根据其设置权限
      .config(['$transitionsProvider',function($transitionsProvider){

        //配置当路由开始改变时：
        //第一个参数对象为监控条件设置，可以设置from和to属性
        $transitionsProvider.onStart({to:'music.**'},function(s){
          // console.log(s.to()); //此时打印出 跳向的路由信息对象 {url: "/add", templateUrl: "../views/add.html", controller: "addController", name: "music.add", $$state: ƒ}$$state: ƒ ()controller: "addController"name: "music.add"templateUrl: "../views/add.html"url: "/add"__proto__: Object
          // var permissions=['/add'];//数组 设置当前只让数组内配置的路由通过
          // if(permissions.indexOf(s.to().url) != -1){
          //   //允许访问music下的路由
          //   return true;
          // }else{
          //   //不允许访问music下的路由  取消当前锚点改变的行为
          //   return false;
          // }
          //获取注入器   获取到userService对象
          var userService=s.injector().get('userService');
          // console.log(userService);
          return userService.hasPermissions(s.to().url);//传入当前要跳转的url  去和当前用户的权限做判断

        })

      }])

})(angular)
