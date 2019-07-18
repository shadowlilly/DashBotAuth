const http = require('http');
const fs = require('fs');
const path = require('path');
const request = require('request');
const WebSocketServer = require('websocket').server;
const pg = require('pg').Client;

var connected_to_bot = false;

const database = new pg({
  connectionString: process.env.DATABASE_URL,
  ssl: true
})

function sleep(ms) {
  return new Promise(resolve=>{
      setTimeout(resolve,ms);
  });
}

module.exports = {

  http: http,
  fs: fs,
  path: path,
  request: request,
  WebSocketServer: WebSocketServer,
  pg: pg,
  connected_to_bot: connected_to_bot,
  database: database,
  sleep: sleep

}
