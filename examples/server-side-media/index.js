const express = require("express");
const http = require("http");
const fs = require("fs");

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

// We will use the socket.io library to manage Websocket connections
const { Server } = require("socket.io");
const io = new Server({ maxHttpBufferSize: 1e8 });
io.listen(server);

const peers = {};
const playbackQueue = new Set();

// Set up each socket connection
io.on("connection", (socket) => {
  console.log(
    "Peer joined with ID",
    socket.id,
    ". There are " + io.engine.clientsCount + " peer(s) connected."
  );

  // add a new peer indexed by their socket id
  peers[socket.id] = { recordings: [] };

  socket.on("media-chunk", ({ chunk, uuid }) => {
    console.log("got media chunk");
    fs.appendFile(`recordings/${socket.id}-${uuid}.webm`, chunk, (err) => {
      if (err) throw err;
      console.log("Chunk received and saved");
      if (!playbackQueue.has(uuid)){
        playbackQueue.add(uuid);
        smp.playVideoToRoom({ file: `recordings/${socket.id}-${uuid}.webm`, roomId: "broadcastRoom123" });
      }
    });
  });

  socket.on("recording-start", ({ uuid }) => {
    console.log("recording started:", uuid);
    peers[socket.id].recordings.push(uuid);
  });

  socket.on("recording-end", ({ uuid }) => {
    console.log("recording ended:", uuid);
    
  });

  // // handle disconnections
  socket.on("disconnect", () => {
    delete peers[socket.id];
    // io.sockets.emit("peerDisconnection", socket.id);
    console.log(
      "Peer " +
        socket.id +
        " diconnected, there are " +
        io.engine.clientsCount +
        " peer(s) connected."
    );
  });
});

let smp = new SimpleMediasoupPeerServer({ io: io });
// setTimeout(() => {
//   smp.playVideoToRoom({ file: "./test.webm", roomId: "broadcastRoom123" });
// }, 1000);
