// import { io } from "socket.io-client";
// import { SimpleMediasoupPeer } from "./SimpleMediasoupPeer";

//
let socket;
let clients = {};
let mediasoupPeer;
let localStream;

function setupSocketConnection() {
  socket = io("localhost:5000", {
    path: "/socket.io"
  });

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

async function startBroadcast() {
  if (!localStream) return;

  let track = localStream.getVideoTracks()[0];
  mediasoupPeer.addTrack(track, "video-broadcast", true);
}

async function startCamera() {
  if (localStream) return;

  try {
    let constraints = {
      audio: false,
      video: {
        width: 320,
        height: 240,
        frameRate: { max: 10 },
      },
    };
    localStream = await navigator.mediaDevices.getUserMedia(constraints);

    let track = localStream.getVideoTracks()[0];
    mediasoupPeer.addTrack(track, "video");
    // mediasoupPeer.addTrack(stream.getAudioTracks()[0], 'microphone');
  } catch (err) {
    console.error(err);
  }
}

function stopCamera() {
  console.log("closing camera");
  if (localStream) {
    localStream.getTracks().forEach((track) => {
      console.log("closing track");
      track.stop();
      track.dispatchEvent(new Event("ended"));
    });
    localStream = null;
  }
}

async function connectToPeer(id) {
  await mediasoupPeer.connectToPeer(id);
}

function main() {
  console.log("~~~~~~~~~~~~~~~~~");
  setupSocketConnection();

  mediasoupPeer = new SimpleMediasoupPeer(socket);
  document.getElementById("startCamera").addEventListener(
    "click",
    () => {
      startCamera();
    },
    false
  );
  document.getElementById("stopCamera").addEventListener(
    "click",
    () => {
      stopCamera();
    },
    false
  );
  document.getElementById("connectToPeers").addEventListener(
    "click",
    () => {
      for (let id in clients) {
        connectToPeer(id);
      }
    },
    false
  );
  document.getElementById("pausePeers").addEventListener(
    "click",
    () => {
      for (let id in clients) {
        mediasoupPeer.pausePeer(id);
      }
    },
    false
  );
  document.getElementById("resumePeers").addEventListener(
    "click",
    () => {
      for (let id in clients) {
        mediasoupPeer.resumePeer(id);
      }
    },
    false
  );
  document.getElementById("screenshare").addEventListener(
    "click",
    () => {
      startScreenshare();
    },
    false
  );
  document.getElementById("broadcast").addEventListener(
    "click",
    () => {
      startBroadcast();
    },
    false
  );
  document.getElementById("restartSocket").addEventListener(
    "click",
    () => {
      socket.disconnect();
      socket.connect();
    },
    false
  );

  mediasoupPeer.onTrack = (track, id, label) => {
    console.log(`Got track of kind ${label} from ${id}`);
    let el = document.getElementById(id + "_" + label);
    if (track.kind === "video") {
      if (el == null) {
        console.log("Creating video element for client with ID: " + id);
        el = document.createElement("video");
        el.id = id + "_" + label;
        el.autoplay = true;
        el.muted = true;
        // el.style = 'visibility: hidden;';
        document.body.appendChild(el);
        el.setAttribute("playsinline", true);
        document.body.appendChild(el);
      }

      // TODO only update tracks if the track is different
      console.log("Updating video source for client with ID: " + id);
      el.srcObject = null;
      el.srcObject = new MediaStream([track]);

      el.onloadedmetadata = (e) => {
        el.play().catch((e) => {
          console.log("Play video error: " + e);
        });
      };
    }
    if (track.kind === "audio") {
      if (el == null) {
        console.log("Creating audio element for client with ID: " + id);
        el = document.createElement("audio");
        el.id = id + "_" + label;
        document.body.appendChild(el);
        el.setAttribute("playsinline", true);
        el.setAttribute("autoplay", true);
      }

      console.log("Updating <audio> source object for client with ID: " + id);
      el.srcObject = null;
      el.srcObject = new MediaStream([track]);
      el.volume = 0;

      el.onloadedmetadata = (e) => {
        el.play().catch((e) => {
          console.log("Play video error: " + e);
        });
      };
    }
  };
}

main();

async function startScreenshare() {
  console.log("Sharing screen!");

  try {
    // get a screen share track
    const localScreen = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: {
        autoGainControl: false, // seems to make it mono if true
        echoCancellation: false,
        noiseSupression: false,
      },
    });

    const videoTrack = localScreen.getVideoTracks()[0];
    const audioTrack = localScreen.getAudioTracks()[0];

    if (videoTrack) {
      let videoEl = document.getElementById("local_screen-video");
      if (!videoEl) {
        videoEl = document.createElement("video");
        videoEl.setAttribute("id", "local_screen-video");
        videoEl.setAttribute("muted", true);
        videoEl.setAttribute("autoplay", true);
        document.body.appendChild(videoEl);
      }

      const videoStream = new MediaStream([videoTrack]);
      videoEl.srcObject = videoStream;

      mediasoupPeer.addTrack(videoTrack, "screen-video", true);
    }

    if (audioTrack) {
      let audioEl = document.getElementById("local_screen-audio");
      if (audioEl == null) {
        audioEl = document.createElement("audio");
        audioEl.setAttribute("id", "local_screen-audio");
        audioEl.setAttribute("playsinline", true);
        audioEl.setAttribute("autoplay", true);
        document.body.appendChild(audioEl);
      }

      let audioStream = new MediaStream([audioTrack]);
      audioEl.srcObject = audioStream;

      audioEl
        .play()
        .then(() => { })
        .catch((e) => {
          console.error("Play audio error: " + e);
        });

      mediasoupPeer.addTrack(audioTrack, "screen-audio", true);
    }
  } catch (e) {
    console.error(e);
  }
}
