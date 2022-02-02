const app = require("./backend/app");
const debug = require("debug")("node-angular");
const http = require("http");

/*
* normalize port function that simply makes sure that
* when we try to set up a port and especially
* when we receive it through an env variable,
* we actually make sure its a valid number if we wanna use it
*/

const normalizePort = val => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

/*
* onerror will check which type of error occured and log something different and exit gracefully
* from our nodejs server
*/

const onError = error => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

/*
* onlistening where we essentially just ouput or where we log that we are now
* listening to incoming requests.
*/

const onListening = () => {
  const addr = server.address();
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  debug("Listening on " + bind);
};

/*
* setting up the port
*/
const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

/*
* node server setup
* register it to listeners
* one for errors that might occur (methods upstairs)
* one for whenever we start listening (method upstairs)
*/
const server = http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);
server.listen(port);
