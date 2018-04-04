(function(angular){

  angular.module('music.edit',[])
  .controller('editController',['$scope','$http','host','$state',function($scope,$http,host,$state){
    //获取路由参数  即当前歌曲的id
    // console.log($state.params.id);
    var id=$state.params.id; //后端需要对此id用ObjectId("id")来包裹  因为数据库中是这样存的

    //向后台发起请求 传送id  跨域
    $http.get(host.edit.url + id,host.edit.handler)
    .then(function(res){
      // console.log(res);
      if(res.data.code==='001'){
        $scope.msg=res.data.msg;
        $scope.music=res.data.music;
      }else{
        alert(res.data.msg);
      }
    },function(err){
      console.log(err);
    })


    //挂载保存函数  和添加提交数据一样
    $scope.doSave=function(data,event){
      //创建FormData对象  将表单数据转换为键值对的形式以便提交
      var fd= new FormData();


      //将id也添加到要提交对象的属性中 以便后台通过id表示去更新数据库
      fd.append('_id',$scope.music._id);  //上面点击编辑时已经获取到当前编辑的对象music

      //歌名
      fd.append('title',data.title);
      //时长
      fd.append('time',data.time);
      //歌手
      fd.append('singer',data.singer);
      //获取dom元素也可以使用 angular.element(DOM)  其jqlite对象功能不强大，还需要先获取到DOM元素 不如使用原生方法 或者jquery获取DOM
      //document.getElementById('file') //直接获取DOM元素也能操作
      //$("#file") 更为简单
      fd.append('file',$('#file').get(0).files[0]);//要将jquery对象转化为原生对象
      fd.append('filelrc',$('#filelrc').get(0).files[0]);

      //发起请求 保存更新
      //restful中更新用put请求方式
      $http.put(host.update.url,fd,host.update.handler
       //  {
       //    headers:{
       //      'content-type':undefined
       //    },
       //    transformRequest:function(data){  //原样输出
       //      return data;
       //    }
       // }
     )
      .then(function(res){
        // console.log(res.data);
        //修改成功则跳转到列表页
        if(res.data.code=='001'){
          $state.go('music.list');
        }else{
          alert(res.data.music);
        }
      },function(err){
        console.log(err);
      })

    }



  }])

})(angular)
