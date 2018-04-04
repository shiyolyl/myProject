//以下代码都需要被引入和声明依赖
(function(angular){
  angular.module('music.login',[])
  .controller('loginController',['$scope','$http','host','$state','userService',function($scope,$http,host,$state,userService){
    //挂载登录提交函数
    //初始化data
    $scope.data={};
    $scope.doLogin=function(data){
      //1:验证表单数据是否为空
      if(!data.username || data.username.trim()==''){ //要么根本没有填写||要么填写了空格
        return $scope.msg="用户名不能为空";
      }
      if(!data.pwd || data.pwd.trim()==''){
        return $scope.msg="密码不能为空";
      }

      //2.将数据发送到后台 /api/login,请求方式为post
      $http.post(host.login.url,data,host.login.handler)
      .then(function(res){
        //3.如果成功->跳转到list页面  失败->给予提示，清空数据
        if(res.data.code==="001"){

          //接收服务器返回的权限  并保存在客户端中(sessionStorage中)
          userService.setPermissions(res.data.permissions);

          //接收服务器返回的token 并保存在客户端中
          // $window.sessionStorage.setItem('token',res.data.token);
          userService.setToken(res.data.token)

          // userService.name=data.username;
          userService.setName(data.username);

          $state.go('music.list');
        }else{
          $scope.msg=res.data.msg;
        }
      },function(err){
        console.log(err);
      })

    }
  }])
})(angular)
