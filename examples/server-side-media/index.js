const express = require("express");
const http = require("http");

// uncomment one of the following lines to see all mediasoup's internal logging messages:
// process.env.DEBUG = "mediasoup*" // show everything mediasoup related
process.env.DEBUG = "mediasoup:WARN:* mediasoup:ERROR:*"; // show only mediasoup warnings & errors

const SimpleMediasoupPeerServer = require("simple-mediasoup-peer-server");

const app = express();
const server = http.createServer(app);

// serve the client-side files
const distFolder = process.cwd() + "/public";
console.log("Serving static files at ", distFolder);
app.use(express.static(process.cwd() + "/public"));

const port = 5000;
server.listen(port);
console.log(`Server listening on http://localhost:${port}`);

let smp = new SimpleMediasoupPeerServer();
setTimeout(() => {
  smp.playVideoToRoom({ file: "./test.mp4", roomId: "broadcastRoom123" });
}, 1000);
