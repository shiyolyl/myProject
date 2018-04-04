(function(angular){
  angular.module('music.register',[])
  .controller('registerController',['$scope','$http','host','$state',function($scope,$http,host,$state,){
    //挂载onblur 事件的函数
    $scope.checkUsername=function(uname){
      //判断是否为空
      if(!uname||uname.trim()==='') return;

      $http.post(host.checkusername.url,{
        username:uname,
      },host.checkusername.handler

      //每个请求都需要设置  所以将其统一配置到client.js中 做统一的默认设置
       // {
       //
       //      //设置头
       //      headers: {
       //          'content-type': 'application/x-www-form-urlencoded' //键值对的形式
       //      },
       //      //转换数据  将参数转换成序列化的形式 以便后台能通过req.body获取到请求体参数信息
       //      transformRequest: function(data) {
       //              var tmp = '';
       //              for (var key in data) {
       //                  tmp += key + '=' + data[key] + '&'
       //              }
       //              //去除&
       //              return tmp.substr(0, tmp.length - 1);
       //      }
       //
       //  }
      )
      .then(function(res){
        if(res.data.code==001){
          //成功
          $scope.msg=res.data.msg; //挂载显示提示信息
        }else{
          $scope.msg=res.data.msg;
        }
      },function(err){
        console.log(err);
      })
    }

    //挂载注册提交的函数
    $scope.doRegister=function(){


      $http.post(host.register.url,$scope.data,host.register.handler
      //   {
      //   withCredentials:true    //允许携带证书 ->cookie (因为ajax跨域不能自动携带cookie  需要此设置)
      // }
    )
      .then(function(res){

        if(res.data.code==='001'){
          //成功 则页面跳转
          //编程式导航
          $state.go('login');
        }else{

          //清空所有的数据 $scope.data={}
          $scope.data={};
          //如果不成功，给予提示继续注册
          alert(res.data.msg1);
        }


      },function(err){
        console.log(err);
      })
    }
  }])
})(angular)
