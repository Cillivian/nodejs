var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {}
handle["/listCategory"] = requestHandlers.listCategory;
handle["/listProduct"] = requestHandlers.listProduct;

server.start(router.route, handle);