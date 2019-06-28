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