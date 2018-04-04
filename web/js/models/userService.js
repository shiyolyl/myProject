(function(angular) { //此模块被loginController.js所依赖
  angular.module('music.userService', [])
    .service('userService', ['$window', function($window) {

      //初始化等于sessionStorage  防止页面刷新后没有数据
      // this.name = ''; //初始值为空串 即false 不显示用户名
      this.name=$window.sessionStorage.getItem('username');
      this.token=$window.sessionStorage.getItem('token'); //初始化token 取存的值
      this.permissions=$window.sessionStorage.getItem('permissions') || '';//如果没有登录过 则没有存储 默认给空串
      if($window.sessionStorage.getItem('permissions')=='undefined'){
        this.permissions='';
      }


      this.setName=function(name){
        this.name=name;
        //将其存储到sessionStorage中
        $window.sessionStorage.setItem('username',name);
      };

      this.setToken=function(token){
          this.token=token; //保存起来
          $window.sessionStorage.setItem('token',token);
      };

      //获取权限 并保存
      this.setPermissions=function(permissions){
        this.permissions=permissions;
        console.log($window.sessionStorage.getItem('permissions'));
        if($window.sessionStorage.getItem('permissions')=='undefined'){
          this.permissions='';
        }
        $window.sessionStorage.setItem('permissions',JSON.stringify(permissions)); //接收进来的permissions是一个数组
      };

      //判断当前的url是否存在于权限集合中
      this.hasPermissions=function(url){ //调用的时候传入当前要跳转的url
        return this.permissions.indexOf(url) != -1; //return true 有权限允许跳转  return false 没有权限不允许跳转
      }



    }])

})(angular)
