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

function originIsAllowed(origin) {
  return origin == "https://dashbot0013.herokuapp.com"
}

socket.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }

    socket.on('connect', function(connection) {
      var connection = request.accept('DBCP', request.origin);
      console.log((new Date()) + ' Connection accepted.');
      connection.on('message', function(message) {
        console.log('Received Message: ' + message.utf8Data);
          connection.sendUTF(message.utf8Data);
        });
        connection.on('close', function(reasonCode, description) {
          console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
        });
    });

});
