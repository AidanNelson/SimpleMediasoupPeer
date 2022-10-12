// this simple node.js server serves the built client library to make local development possible without copying and pasting code

const express = require("express");
const http = require("http");

// uncomment one of the following lines to see all mediasoup's internal logging messages:
process.env.DEBUG = "mediasoup*"; // show everything mediasoup related
// process.env.DEBUG = "mediasoup:WARN:* mediasoup:ERROR:*"; // show only mediasoup warnings & errors

const app = express();
const server = http.createServer(app);

// serve the client-side files
app.use(express.static(process.cwd() + "/dist"));

const port = 60000;
server.listen(port);
console.log(
  `Local development server listening on http://localhost:${port}.  Use this link for library file: http://localhost:${port}/SimpleMediasoupPeer.js`
);
