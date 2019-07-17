const http = require('http');
const fs = require('fs');
const path = require('path');
var webServer = require('websocket').server;

var server = http.createServer(function (request, response) {

  response.writeHead(404);
  response.end();

}).listen(process.env.PORT);

socket = new webServer({
    httpServer: server,
    autoAcceptConnections: false
});

socket.on('request', async function(request) {

    connection = request.accept("dbcp_key-" + process.env.socketkey, request.origin);

    console.log((new Date()) + ' Connection accepted.');

    connection.sendUTF("TOKEN IS '" + process.env.localtoken + "'");

    await sleep(30000);

    process.exit(0);

    connection.on('message', function(message) {
    });

    connection.on('close', function(reasonCode, description) {
      console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });

});

function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}
