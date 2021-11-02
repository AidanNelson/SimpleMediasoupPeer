import { io } from "socket.io-client";
import { SimpleMediasoupPeer } from "./SimpleMediasoupPeer";
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

  socket.request = socketPromise(socket);

  socket.on("connect", () => {
    console.log("Socket ID: ",socket.id); // x8WIv7-mJelg7on_ALbx
  });

}


function main() {
  console.log('~~~~~~~~~~~~~~~~~');
  setupSocketConnection();
  mediasoupPeer = new SimpleMediasoupPeer(socket);

  
}

main();