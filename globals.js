module.exports = {

  const http: require('http'),
  const fs: require('fs'),
  const path: require('path'),
  const request: require('request'),
  const WebSocketServer: require('websocket').server,
  const { DatabaseClient }: require('pg'),

  var connected_to_bot: false,

  const database: new DatabaseClient({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  }),

  sleep: function (ms) {
      return new Promise(resolve=>{
          setTimeout(resolve,ms);
      });
  }

}
