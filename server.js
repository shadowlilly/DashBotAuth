const globals = require("globals");

launchServer();

async function launchServer() {

  console.log("Connecting to database");

  await globals.database.connect().then(function() {
    console.log("Database connected");
  }).catch(function(err) {
    console.log("An error occured while connecting to database. " + err);
    console.log("The process cannot safely continue. Exiting...");
    process.exit(1);
  });

  const server = globals.http.createServer(respond404).listen(process.env.PORT);

  console.log("Now listening for HTTP requests");

  const socket = new globals.WebSocketServer({
      httpServer: server,
      autoAcceptConnections: false
  });

  socket.on('request', handleSocketRequest);

  console.log("Now listening for WebSocket requests");

  setTimeout(checkLogin, 60000);

}

async function handleSocketRequest(request) {

  const lockdownActive = await globals.database.query("SELECT lockdown FROM keys LIMIT 1").then(function(res) {
    return res.rows[0].lockdown;
  }).catch(function(err) {
    console.log("An error occured when checking if lockdown is enabled. " + err);
    console.log("The process cannot safely continue. Exiting...");
    process.exit(1);
  });

  if(lockdownActive) {
    console.log("Lockdown is enabled. Rejecting request and shutting down.");
    request.reject();
    process.exit(1);
  }

  console.log("Lockdown is not enabled. Validating private key and accepting request")

  try {
    connection = request.accept("dbcp_key-" + process.env.socketkey, request.origin);
  } catch(e) {
    console.log("An error occured while accepting the request. " + e);
    console.log("This is most likely due to an invalid private key. Rejecting request");
    request.reject();
    return;
  }

  if(globals.connected_to_bot) {
    console.log("Request valid, but a client is already connected! This is most likely an attack. Locking down.");
    lockdown();
  }
  else {
    console.log("Request accepted. Now connected to DashBot. Sending token...");
  }

  globals.connected_to_bot = true;

  setInterval(keepAlive, 300000);
  setTimeout(restartServer, 79200000);

  connection.sendUTF("TOKEN IS '" + process.env.localtoken + "'", function(err) {
    if(err) {
      console.log("An error occured while attempting to send token. " + err);
    }
  });

  connection.on('message', processMessage);

  connection.on('close', function() {
    console.log("Bot disconnected unexpectedly. Entering lockdown");
    lockdown();
  });

}

function lockdown() {
  globals.database.query("UPDATE keys SET lockdown = true").then(function() {
    console.log("Lockdown active. Shutting down...");
    process.exit(1);
  }).catch(function(err) {
    console.log("An error occured while setting lockdown. This is a critical security issue!!! " + err);
    console.log("Exiting...");
    process.exit(1);
  });
}

function processMessage(message) {

}

function respond404(request, response) {

  response.writeHead(404).end();

}

function keepAlive() {

  console.log("Sending a Keep-Alive request")

  globals.request('http://dashbot0013.herokuapp.com', function (err, response, body) {
    if(err) {
      console.log("An error occured when attempted to send a keep-alive request. " + err);
    }
    else {
      console.log("Request send successfully.")
    }
  });

}

function restartServer() {

  console.log("Now restarting the server...");

  process.exit(0);

}

function checkLogin() {

  console.log("The 60 second connection window has expired. Checking connection status...");

  if(globals.connected_to_bot) {
    console.log("DashBot not logged in. Init lockdown.")
    lockdown();
  }
  else {
    console.log("Connected to DashBot");
  }

}
