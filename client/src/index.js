import { io } from "socket.io-client";
import { SimpleMediasoupPeer } from "./SimpleMediasoupPeer";

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
    console.log("Socket ID: ", socket.id); // x8WIv7-mJelg7on_ALbx
  });

  socket.on("clients", (ids) => {
    console.log(ids);
    for (let i = 0; i < ids.length; i++) {
      clients[i] = {};
    }
    console.log("Got initial clients!");
    console.log("Clients:", clients);
  });

  socket.on("clientConnected", (id) => {
    clients[id] = {};
    console.log("Client conencted!");
    console.log("Clients:", clients);
  });

  socket.on("clientDisconnected", (id) => {

    delete clients[id];
    console.log("Client disconencted!");
    console.log("Clients:", clients);
  });
}


async function startCamera() {
  let stream = null;

  try {
    let constraints = { audio: false, video: true }
    stream = await navigator.mediaDevices.getUserMedia(constraints);
    mediasoupPeer.addStream(stream);

  } catch (err) {
    console.error(err)
  }
}

async function connectToPeer(id) {
  let tracks = await mediasoupPeer.connectToPeer(id);

  const stream = new MediaStream(tracks);

  const video = document.createElement('video');
  video.srcObject = stream;
  // Wait for the stream to load enough to play
  video.onloadedmetadata = function (e) {
    video.play();
  };
  document.body.appendChild(video);
}


function main() {
  console.log('~~~~~~~~~~~~~~~~~');
  setupSocketConnection();
  mediasoupPeer = new SimpleMediasoupPeer(socket);

  document.getElementById("startCamera").addEventListener("click", () => {
    startCamera();
  }, false);
  document.getElementById("connectToPeers").addEventListener("click", () => {
    for (let id in clients) {
      connectToPeer(id);
    }
  }, false);
}

main();

