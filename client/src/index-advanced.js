import { io } from "socket.io-client";
import { SimpleMediasoupPeer } from "./SimpleMediasoupPeer";

const socketPromise = require('./socket.io-promise').promise;


//
let socket;
let clients = {};
let mediasoupPeer;
let localStream;



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

  let peerEl = document.createElement('div');
  peerEl.id = id + "_container";
  peerEl.style="border: 1px solid black; margin: 10px; padding: 10px;";
  peerEl.innerText = "Client " + id + " - ";

  let connectButton = document.createElement("button");
  connectButton.addEventListener('click', () => { connectToPeer(id) }, false);
  connectButton.innerText = "connect";
  peerEl.appendChild(connectButton);

  document.body.appendChild(peerEl);

}

function removePeer(id) {
  console.log("Client disconencted:", id);
  delete clients[id];
}


async function startCamera() {
  if (localStream) return;

  try {
    let constraints = { audio: false, video: true }
    localStream = await navigator.mediaDevices.getUserMedia(constraints);

    let track = localStream.getVideoTracks()[0]
    mediasoupPeer.addTrack(track, 'camera');
    // mediasoupPeer.addTrack(stream.getAudioTracks()[0], 'microphone');


  } catch (err) {
    console.error(err)
  }
}

function stopCamera(){
  console.log('closing camera');
  if (localStream){
    localStream.getTracks().forEach((track)=> {
      console.log('closing track');
      track.stop();
       track.dispatchEvent(new Event("ended"));
    });
    localStream = null;
  }
}

async function connectToPeer(id) {
  let tracks = await mediasoupPeer.connectToPeer(id);
  console.log(tracks);

  for (const track of tracks) {
    let el = document.getElementById(id + "_" + track.kind);
    if (track.kind === 'video') {
      if (el == null) {
        console.log('Creating video element for client with ID: ' + id);
        el = document.createElement('video');
        el.id = id + "_" + track.kind;
        el.autoplay = true;
        el.muted = true;
        // el.style = 'visibility: hidden;';
        document.body.appendChild(el);
        el.setAttribute('playsinline', true);
        document.body.appendChild(el);
      }

      // TODO only update tracks if the track is different
      console.log('Updating video source for client with ID: ' + id);
      el.srcObject = null;
      el.srcObject = new MediaStream([track]);

      el.onloadedmetadata = (e) => {
        el.play()
          .catch((e) => {
            console.log('Play video error: ' + e);
          });
      };

    }
    if (track.kind === "audio") {
      if (el == null) {
        console.log('Creating audio element for client with ID: ' + id);
        el = document.createElement('audio');
        el.id = id + "_" + track.kind;
        document.body.appendChild(el);
        el.setAttribute('playsinline', true);
        el.setAttribute('autoplay', true);
      }

      console.log('Updating <audio> source object for client with ID: ' + id);
      el.srcObject = null;
      el.srcObject = new MediaStream([track]);
      el.volume = 0;

      el.onloadedmetadata = (e) => {
        el.play()
          .catch((e) => {
            console.log('Play video error: ' + e);
          });
      };
    }
  }



  // const stream = new MediaStream(tracks);

  //  videoEl = document.getElementById(id + "_video");

  // if (!videoEl){
  //   videoEl =   document.createElement('video');
  //   videoEl.id = id + "_video"

  // }
  // document.body.appendChild(video);

  // video.srcObject = stream;
  // // Wait for the stream to load enough to play
  // video.onloadedmetadata = function (e) {
  //   video.play();
  // };

}

function main() {
  console.log('~~~~~~~~~~~~~~~~~');
  setupSocketConnection();
  mediasoupPeer = new SimpleMediasoupPeer(socket);

  document.getElementById("startCamera").addEventListener("click", () => {
    startCamera();
  }, false);
  document.getElementById("stopCamera").addEventListener("click", () => {
    stopCamera();
  }, false);
  document.getElementById("connectToPeers").addEventListener("click", () => {
    for (let id in clients) {
      connectToPeer(id);
    }
  }, false);
  document.getElementById("pausePeers").addEventListener("click", () => {
    for (let id in clients) {
      mediasoupPeer.pausePeer(id);
    }
  }, false);
  document.getElementById("resumePeers").addEventListener("click", () => {
    for (let id in clients) {
      mediasoupPeer.resumePeer(id);
    }
  }, false);

}

main();

