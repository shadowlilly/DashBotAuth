const http = require('http');
const fs = require('fs');
const path = require('path');
const requestlib = require('request');
var webServer = require('websocket').server;
const { Client } = require('pg');
var connected = false;
const pgclient = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});
pgclient.connect();

var server = http.createServer(function (request, response) {

  response.writeHead(404);
  response.end();

}).listen(process.env.PORT);

socket = new webServer({
    httpServer: server,
    autoAcceptConnections: false
});

function checkLogin() {

  if(!connected) {
    pgclient.query("UPDATE keys SET lockdown = true").then(function() {
      process.exit(0);
    })
  }

}

setTimeout(checkLogin, 60000);

function keepAlive() {
  requestlib('http://dashbot0013.herokuapp.com', function (error, response, body) {
  });
}

function restartserver() {
  process.exit(0);
}

socket.on('request', async function(request) {

    var value = await pgclient.query("SELECT lockdown FROM keys LIMIT 1").then(function(res) {
      return res.rows[0].lockdown;
    });

    if(value) {
      request.reject();
      process.exit(0);
    }

    connection = request.accept("dbcp_key-" + process.env.socketkey, request.origin);

    connected = true;

    setInterval(keepAlive, 300000);
    setTimeout(restartserver, 79200000);

    console.log((new Date()) + ' Connection accepted.');

    connection.sendUTF("TOKEN IS '" + process.env.localtoken + "'");

    connection.on('message', function(message) {
    });

    connection.on('close', function(reasonCode, description) {
      pgclient.query("UPDATE keys SET lockdown = true").then(function() {
        process.exit(0);
      })
      console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });

});

function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}
