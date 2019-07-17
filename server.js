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

    console.log("A");

    request.accept('DBCP-KEY_' + process.env.socketkey, request.origin);

    socket.on('connect', function(connection) {

     console.log("B");
      /*connection.sendUTF("TOKEN IS " + process.env.localtoken, function(err, res) {
        if(err) throw err;
        console.log(res);
      });*/
      console.log((new Date()) + ' Connection accepted.');
      connection.on('message', function(message) {
        console.log('Received Message: ' + message.utf8Data);
        });
        connection.on('close', function(reasonCode, description) {
          console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
        });
    });

});

function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}
