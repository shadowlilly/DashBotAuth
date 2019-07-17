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

socket.on('request', function(request) {

    connection = request.accept("DBCP", request.origin);

    connection.on("error", function(error) {
      console.log(error);
    });

    connection.sendUTF("TOKEN IS '" + process.env.localtoken + "'");
    console.log((new Date()) + ' Connection accepted.');

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
