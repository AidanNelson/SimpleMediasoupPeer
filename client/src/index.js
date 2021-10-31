import { io } from "socket.io-client";
import { MediasoupPeer } from "./MediasoupPeer";
// import { socketPromise } from "./socket.io-promise";
const socketPromise = require('./socket.io-promise').promise;


//
let socket;
let clients = {};
let mediasoupPeer;



function setupSocketConnection() {

  socket = io("localhost:5000", {
    path: "/socket.io",
  });

  // console.log(socket.request);
  socket.request = socketPromise(socket);
  // client-side
  socket.on("connect", () => {
    console.log(socket.id); // x8WIv7-mJelg7on_ALbx
  });

  socket.on("clients", () => { });
  socket.on("clientConnected", () => { });
  socket.on("clientDisconnected", () => { });
}


function main() {
  setupSocketConnection();
  mediasoupPeer = new MediasoupPeer(socket);


  console.log('hello');
}

main();