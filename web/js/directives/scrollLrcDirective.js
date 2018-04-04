(function(angular){
  angular.module('music.scrollLrcDirective',[])
  .directive('scrollLrc',['$http','host',function($http,host){
    return{
      templateUrl:'../../views/scrollLrc.html',
      scope:{
        file:'@',
        // =表示 双向数据绑定，如果外部直接给pwd="data.pwd",当你们修改，相互影响
        // @表示 单向数据绑定，如果外部修改，影响内部，内部修改不影响外部

      },

      link:function(scope,element,attrs){
        var lrc=element.children().children()[0];
        var audio=element.children().children()[2]
        scope.createLrcDom=function(obj){
          var html='';
          for(var time in obj){
            //给p加上时间便于未来查找元素（通过自定义属性)
            html+='<p time='+time+'>'+obj[time]+'</p>'  //拼接字符串显示到页面  只显示键的值
          }
          // $('#lrc').html(html);
          lrc.innerHTML=html;
        }

        //解析歌词字符串成键值对形式
        scope.parseLrc=function(lrcStr){  //将歌词数据转换成对象形式
          var obj={};
          //匹配每一行歌词的正则
          var regex=/\[(\d{2})\:(\d{2})\.(\d{1,2})\](.*)/;
          //以换行符来切割字符串
          var lines=lrcStr.split("\n"); //将字符串切割成数组
          for(var i=0;i<lines.length;i++){
            var line=lines[i];
            var result=regex.exec(line);//正则的exec()方法返回的是一个数组
            if(!result) continue; //防止第一行歌词为空匹配不到报错
            // console.log(result);
            var minutes=result[1]; //分钟
            var seconds=result[2]; //秒
            var hm=result[3]; //毫秒
            var content=result[4];//不包括时间的歌词内容

            var time=minutes*60+(seconds-0) //根据秒来标记歌词
            obj[time]=content;
          }
          return obj;
        }

        //滚动歌词 函数封装
        scope.scroll=function(jumpPoint,obj){ //传入当前音乐播放的秒数 即需要跳动的点
          //如果当前的秒数不存在于歌词文件中，则return 此时不需要滚动
          if(!obj[jumpPoint]) return;
          //寻找元素
          // var $lrc=$("#lrc"); //歌词lrc盒子
          var $lrc=$(lrc); //封装 不依赖id
          var $p=$lrc.find('p[time='+jumpPoint+']');
          // var $p=$("p[time=jumpPoint]") //返回的是一个数组 所以通过其父元素的find方法去查找
          //求高差距
          var minusH=$lrc.offset().top - $p.offset().top; //相对于当前文档的坐标高度
          //给当前p标签添加样式 并且移除其他兄弟元素的样式
          $p.addClass('hl').siblings().removeClass('hl');
          //动画  将lrc盒子向上移动高度差
          $lrc.animate({
            top:minusH,
          },'slow');

        }


        //发请求获取歌词数据，之后播放音乐 -> src=路径

        //当父级scope使用一个指令{{xxx}}来传递一个对象时，指令中接收的值是字符串的对象形式 需要做转换
        scope.$watch('file',function(newV,oldV){  //监听file属性值的改变 即fileObj的变化 即music.file和music.fileLrc的变化
          // console.log(newV===oldV);//初始状态时一样 为true
          // console.log(newV); //字符串的对象形式  所以需要对象的转换
          // console.log(typeof(newV)); //string
          // console.log(oldV);

          //判断是否是页面刷新 初始值的情况 return
          if(newV===oldV) return;
          var fileObj=JSON.parse(newV);



          //发起请求获取歌词数据
          $http.get(fileObj.fileLrc,host.filelrc.handler
            // {  //注意 真正使用歌词的路径fileLrc是在自定义指令这里  所以传入的路径即存储的路径应该是相对于此处的路径
            //   transformResponse:function(data){
            //     return data;
            //   }
            // }
          )
          .then(function(res){
            // console.log(res.data);//返回的res.data是歌词的字符串形式
            //解析歌词数据
            var obj=scope.parseLrc(res.data); //返回一个对象
            //显示歌词信息
            scope.createLrcDom(obj);
            // console.log(obj);

            //监视音乐播放事件  获取此刻时间
            $("#audio").on('timeupdate',function(e){
              // console.log(e.target.currentTime);//0.393108
              var s=Math.round(e.target.currentTime)//对当前时间秒数进行取整  因为存储的每行歌词的秒数Keyz属性为整数
              //调用滚动的函数
              scope.scroll(s,obj);
            })

            //让歌曲播放
            scope.audioSrc=fileObj.file;

          },function(err){
            console.log(err);
          })

        })
      }
    }
  }])

})(angular);
