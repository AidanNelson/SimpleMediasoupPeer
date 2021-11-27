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
    console.log("Got initial clients!");
    for (let i = 0; i < ids.length; i++) {
      addPeer(ids[i]);
    }
  });

  socket.on("clientConnected", (id) => {
    addPeer(id);
  });

  socket.on("clientDisconnected", (id) => {
    removePeer(id);
  });
}

function addPeer(id) {
  console.log("Client conencted: ", id);
  clients[id] = {};
}

function removePeer(id) {
  console.log("Client disconencted:", id);
  delete clients[id];
}


async function startCamera() {
  let stream = null;

  try {
    let constraints = { audio: false, video: true }
    stream = await navigator.mediaDevices.getUserMedia(constraints);

    let track = stream.getVideoTracks()[0]
    mediasoupPeer.addTrack(track, 'camera');
    // mediasoupPeer.addTrack(stream.getAudioTracks()[0], 'microphone');


  } catch (err) {
    console.error(err)
  }
}

async function connectToPeer(id) {
  let tracks = await mediasoupPeer.connectToPeer(id);
  console.log(tracks);

  const stream = new MediaStream(tracks);

  const video = document.createElement('video');
  document.body.appendChild(video);
  video.srcObject = stream;
  // Wait for the stream to load enough to play
  video.onloadedmetadata = function (e) {
    video.play();
  };
}

async function pausePeer(id){
  mediasoupPeer.pausePeer(id);
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
 
  document.getElementById("pausePeers").addEventListener("click", () => {
    for (let id in clients) {
      pausePeer(id);
    }
  }, false);

}

main();

