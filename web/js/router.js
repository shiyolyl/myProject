//将前端路由抽取出来

(function(angular){
  angular.module('music.router',[])
  .config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){
    //默认进入login登录
    $urlRouterProvider.otherwise('login');
    $stateProvider.state('register',{  //配置路由规则
      url:'/register',                 //通过http://127.0.0.1:9997/#!/register来访问
      templateUrl:'../views/register.html',
      controller:'registerController'
    })
    .state('login',{     //登录路由
      url:'/login',
      templateUrl:'../views/login.html',
      controller:"loginController"
    })
    .state('music',{     //音乐父级路由
      url:'/music',
      templateUrl:'../views/music.html',
    })
    .state('music.list',{  //音乐子级路由（列表页）
      url:'/list',
      templateUrl:'../views/list.html',
      controller:'listController',
    })
    .state('logout',{  //退出路由
      url:'/logout',
      templateUrl:'../views/logout.html',
      controller:'logoutController',
    })
    .state('music.add',{    //添加路由
      url:'/add',
      templateUrl:'../views/add.html',
      controller:'addController',
    })
    .state('music.edit',{   //编辑路由
      url:'/edit?id',
      templateUrl:'../views/edit.html',
      controller:'editController',
    })
  }])
})(angular)
