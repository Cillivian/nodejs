# 第一个app 
### 启动服务器
```js
const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
```
之后，运行您的Web服务器node app.js，访问
```bash
http://localhost:3000
```
您将看到一条消息“Hello World”

### nodejs获取参数
写一个文件server.js
```js
var http = require('http');
var url=require('url'); //引入url 模块，帮助解析
var querystring=require('querystring');// 引入 querystring 库，也是帮助解析用的
function service(req,response){
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

    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end('Hello Node.js');
}
var server = http.createServer(service);
server.listen(8080,'127.0.0.1',()=>{
    console.log('running in http://127.0.0.1:8080');
});
```
监听8080端口：
```bash
node server.js
```
访问：http://localhost:8080?id=123
得到：
```bash
I_SQLIN-MB0:nodejs cillivian$ node server.js
running in http://127.0.0.1:8080
method - GET
url - /?id=123
id- 123
method - GET
url - /favicon.ico
id- undefined
```

在日志里，会出现 /favicon.ico 信息，这个 favion 是 favorite icon 的缩写，即网站图标
用node.js 就会有这么一个默认的访问。。。 和业务没有实际关系，忽略掉好了。。。

### 自己制作一个小模块

首先在同目录下创建两个文件：
- main.js
- utils.js

utils.js
```js
function server(req, res) {
    res.statusCode = 200,
        res.setHeader('Content-Type', 'text/plain');
    res.end('fuckxxxx');
}

function show() {
    console.log("running show message");
}
exports.show = show;
exports.server = server;
```
main.js
```js
var utils = require('./utils');
var http = require('http');
var web = http.createServer(utils.server);
web.listen(8080, () => {
    utils.show();
})
```

cmd运行：
```bash
node main.js
```

显示：
```bash
I_SQLIN-MB0:nodejs cillivian$ node main.js
running show message
```

打开浏览器监听8080端口可以看到：
![5b5ed1edbab7e539a0193ab2645da584.png](evernotecid://40375618-6E43-4BC7-B276-7EA330A5836C/appyinxiangcom/17299991/ENResource/p361)
### 创建路由跳转
需要通过访问 /listCategory 显示所有的分类，又需要通过访问 /listProduct 显示所有的产品，那么仅仅通过一个 service(request, response) 方法来进行维护不是很麻烦吗所以在这个时候，就会引入路由的概念了。

--- 
如果没有路由的概念，那么无论是访问/listCategory路径 还是访问 /listProduct 路径，都是在service(request,response) 函数里做的。

那么引入路由的概念的话，就是指访问 /listCategory 路径，会访问 listCategory函数。 而访问 /listProduct 路径，就会访问 listProduct 函数，这样子维护起来就容易多了。

如代码所示，会提供 listCategory() 函数。
再如图所示，访问地址 /listCategory 就会显示 listCategory() 函数的返回值。


* * *
创建四个文件：

* 业务处理模块 requestHandlers.js
* 路由模块 router.js
* 服务器模块 server.js
* 入口主模块 index.js

requestHandlers.js
```js
function listCategory() {
    return "a lot of categorys";
}

function listProduct() {
    return "a lot of products";
}

exports.listCategory = listCategory;
exports.listProduct = listProduct;
```
router.js
```js
function route(handle, pathname) { 
    if (typeof handle[pathname] === 'function') { 
      return handle[pathname](); 
    } else {
      return pathname + ' is not defined';
    } 
  } 
  exports.route = route; 
```
server.js
```js
var http = require("http"); 
var url = require("url"); 
   
function start(route, handle) { 
  function onRequest(request, response) { 
    var pathname = url.parse(request.url).pathname; 
    var html = route(handle, pathname); 
    response.writeHead(200, {"Content-Type": "text/plain"}); 
    response.write(html); 
    response.end(); 
  } 
   
  http.createServer(onRequest).listen(8088); 
} 
   
exports.start = start; 
```
index.js
```js
var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {}
handle["/listCategory"] = requestHandlers.listCategory;
handle["/listProduct"] = requestHandlers.listProduct;

server.start(router.route, handle);
```

运行cmd：
```bash
node index.js
```

1. index.js 调用了 server.start 函数，并且传递了 router.js 里route 函数和handle数组作为参数

2. serverl.js 通过了8088端口启动了服务。 然后用 onRequest 函数来处理业务

    2.1  在 onRequest 中，首先获取 访问路径 pathname
    2.2  然后调用 router.js 的route 函数，并把pathname 和 handle数组传递进去
3.  在router.js 中，通过pathname为下标获调用真正的业务函数，并把业务函数的返回值返回出去。
    3.1  如果找不到，比如访问 /listUser 这个路径就没有在 handle 数组中找到对应，那么就会返回 listUser is not defined.
4.  当访问地址是 /listCategory的时候， 真正的业务函数 requestHandlers.js 中的 listCategory() 就会被调用，并返回业务 Html 代码 : "a lots of categorys".
