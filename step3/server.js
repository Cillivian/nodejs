const http = require("http");
const url = require("url");

function start(route, handle) {
    function onRequest(request, response) {
        var pathname = url.parse(request.url).pathname;
        var html = route(handle, pathname);
        response.writeHead(200, { "Content-Type": "text/plain" });
        response.write(html);
        response.end();
    }

    http.createServer(onRequest).listen(8080, () => {
        console.log("running server");
    });
}

exports.start = start;