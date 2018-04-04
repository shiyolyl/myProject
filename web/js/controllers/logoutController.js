(function(angular){  //因为退出页面要显示用户信息，所以也需封装一个退出的控制器（模块）
  angular.module('music.logout',[])
  .controller('logoutController',['$scope','userService','$timeout','$state',function($scope,userService,$timeout,$state){
      $scope.msg='尊敬的'+userService.name+',您正在退出，请稍后...';
      // userService.name="";
      userService.setName('');//设置顶部显示的用户名 调用公共service中封装的函数
      // window.sessionStorage.setItem('token','');//清除token
      userService.setToken('');  //对token的操作也封装在userService中
      //退出 清空权限
      userService.setPermissions('');

      $timeout(function(){
        //2秒之后跳转到登录页
        $state.go('login');
      },2000)
  }])
})(angular)
