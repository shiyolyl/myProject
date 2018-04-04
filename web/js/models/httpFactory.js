(function(angular) {
    angular.module('music.httpFactory', [])
        .factory('httpFactory', ['$window','host', function($window,host) {
            return {
                request: function(config) {
                    //判断是否需要添加头信息
                    var token = $window.sessionStorage.getItem('token');
                    if (token) {
                        //向请求头中加入有信息
                        config.headers.mytoken = token;
                    } //否则头信息不变
                    return config;
                },
                response: function(response) {
                    return response;
                }
            }
        }])
})(angular);
