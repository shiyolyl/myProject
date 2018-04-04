(function(angular){
  angular.module('music.myHeaderDirective',[])
  .directive('myHeader',['userService',function(userService){  //使用的时候<my-header></my-header>
      return{
        templateUrl:'../../views/header.html',
        link:function(scope,ele){
          //监视一定需要是scope的属性  所以要挂载到scope上
          scope.us=userService;
          scope.$watch('us.name',function(newV,oldV){
            scope.name=newV;//第一次的时候可能是空串，空串代表false 不显示用户名只显示登录注册
          })
        }
      }

  }])

})(angular);
