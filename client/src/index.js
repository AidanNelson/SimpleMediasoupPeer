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
    console.log("Socket ID: ", socket.id); // x8WIv7-mJelg7on_ALbx
  });

}


async function startStream() {
  let stream = null;

  try {
    let constraints = { audio: false, video: true }
    stream = await navigator.mediaDevices.getUserMedia(constraints);
    /* use the stream */
    mediasoupPeer.produce(stream);

    // const video = document.createElement('video');
    // video.srcObject = stream;
    // // Wait for the stream to load enough to play
    // video.onloadedmetadata = function (e) {
    //   video.play();
    // };
    // document.body.appendChild(video);
  } catch (err) {
    /* handle the error */
  }
}


function main() {
  console.log('~~~~~~~~~~~~~~~~~');
  setupSocketConnection();
  mediasoupPeer = new SimpleMediasoupPeer(socket);
  setTimeout(() => {
    startStream()
  }, 2000)

}

main();

