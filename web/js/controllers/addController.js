(function(angular) {
  angular.module('music.add', [])
    .controller('addController', ['$scope', "$http", 'host','$state',function($scope, $http, host,$state) {
      $scope.data = {};
      //挂载上传函数
      $scope.doUpload = function(data,event) {

          //创建FormData对象  将表单数据转换为键值对的形式以便提交
          var fd= new FormData();
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

          //restful中新增用post请求
          $http.post(host.upload.url,fd,host.upload.handler
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
            //上传成功则跳转到列表页
            if(res.data.code=='001'){
              $state.go('music.list');
            }
          },function(err){
            console.log(err);
          })


      }
    }])
})(angular)
