var utils = require('./utils');
var http = require('http');
var web = http.createServer(utils.server);
web.listen(8080, () => {
    utils.show();
})