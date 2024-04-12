const express = require("express");
const http = require("http");

// uncomment one of the following lines to see all mediasoup's internal logging messages:
process.env.DEBUG = "SimpleMediasoupPeer*"; // show everything mediasoup related
// process.env.DEBUG = "mediasoup:WARN:* mediasoup:ERROR:*"; // show only mediasoup warnings & errors

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

let SMP = new SimpleMediasoupPeerServer();

SMP.on("newProducer", (data) => {
    const {producerId, producingPeerId} = data;
    console.log("new producer with id",producerId,"from peer",producingPeerId);

    const filename = "recording.mp4";
    SMP.recordToFile({producingPeerId,producerId,filename})
})