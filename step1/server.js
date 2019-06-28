var http = require('http');
var url = require('url'); //引入url 模块，帮助解析
var querystring = require('querystring'); // 引入 querystring 库，也是帮助解析用的
function service(req, response) {
    //获取返回的url对象的query属性值 
    var arg = url.parse(req.url).query;

    //将arg参数字符串反序列化为一个对象
    var params = querystring.parse(arg);

    //请求的方式
    console.log("method - " + req.method);

    //请求的url
    console.log("url - " + req.url);

    //获取参数id
    console.log("id- " + params.id);

    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end('Hello Node.js');
}
var server = http.createServer(service);
server.listen(8080, '127.0.0.1', () => {
    console.log('running in http://127.0.0.1:8080');
});