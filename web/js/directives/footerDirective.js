(function(angular){
  angular.module('music.footerDirective',[])
  .directive('myFooter',function(){  //使用的时候<my-footer></my-footer>
      return{
        // templateUrl:'../../views/footer.html',  //下面这种直接写法 不会请求footer.html 减少了请求 提高性能
        template:`<div class="aw-footer-wrap">
            <div class="aw-footer">
                Copyright © 2016, All Rights Reserved</span>
                <span class="hidden-xs">Powered By <a href="https://github.com/shiyolyl" target="blank">yl</a></span>
            </div>
        </div>`,
      }

  })

})(angular);
