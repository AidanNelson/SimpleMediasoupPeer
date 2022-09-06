let socket;
let clients = {};
let mediasoupPeer;
let localStream;
let localScreenshareStream;

let userMediaConstraints = {
  audio: false,
  video: {
    width: 320,
    height: 240,
  },
};

let screenMediaConstraints = {
  video: {
    width: 320,
    height: 240,
  },
  audio: false,
};

function setupSocketConnection() {
  socket = io("localhost:5000", {
    path: "/socket.io",
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
  addPeerElements(id);
}

function removePeer(id) {
  console.log("Client disconencted:", id);
  const peerEl = document.getElementById(id + "_container");
  if (peerEl) peerEl.remove();
  delete clients[id];
}

// create a <div> for each peer
function addPeerElements(id) {
  let peerEl = document.createElement("div");
  peerEl.id = id + "_container";
  peerEl.style = "border: 1px solid black; margin: 10px; padding: 10px;";

  const headerEl = document.createElement("div");
  const titleEl = document.createElement("p");
  titleEl.innerText = "Client " + id + " - ";
  headerEl.appendChild(titleEl);

  let connectButton = document.createElement("button");
  connectButton.addEventListener(
    "click",
    () => {
      connectToPeer(id);
    },
    false
  );
  connectButton.innerText = "connect";

  headerEl.appendChild(connectButton);

  let pauseButton = document.createElement("button");
  pauseButton.addEventListener(
    "click",
    () => {
      mediasoupPeer.pausePeer(id);
    },
    false
  );
  pauseButton.innerText = "pause";

  headerEl.appendChild(pauseButton);

  let resumeButton = document.createElement("button");
  resumeButton.addEventListener(
    "click",
    () => {
      mediasoupPeer.resumePeer(id);
    },
    false
  );
  resumeButton.innerText = "resume";

  headerEl.appendChild(resumeButton);

  peerEl.appendChild(headerEl);
  document.getElementById('peerContainer').appendChild(peerEl);
}

async function startBroadcast() {
  if (!localStream) {
    await startCamera();
  }

  const videoTrack = localStream.getVideoTracks()[0];
  const audioTrack = localStream.getAudioTracks()[0];

  if (videoTrack) {
    mediasoupPeer.addTrack(videoTrack, "video-broadcast", true);
  }

  if (audioTrack) {
    mediasoupPeer.addTrack(audioTrack, "audio-broadcast", true);
  }
}

async function sendCamera() {
  if (!localStream) {
    await startCamera();
  }

  const videoTrack = localStream.getVideoTracks()[0];
  const audioTrack = localStream.getAudioTracks()[0];

  if (videoTrack) {
    mediasoupPeer.addTrack(videoTrack, "video");
  }

  if (audioTrack) {
    mediasoupPeer.addTrack(audioTrack, "audio");
  }
}

async function startCamera() {
  if (localStream) return;

  try {
    localStream = await navigator.mediaDevices.getUserMedia(userMediaConstraints);

    const videoTrack = localStream.getVideoTracks()[0];
    if (videoTrack) {
      createHTMLElementsFromTrack(videoTrack, "local", "video");
    }
  } catch (err) {
    console.error(err);
  }
}

function stopCamera() {
  if (!localStream) return;
  console.log("Turning off camera");

  localStream.getTracks().forEach((track) => {
    console.log("closing track");
    track.stop();
  });
  localStream = null;
}

async function connectToPeer(id) {
  await mediasoupPeer.connectToPeer(id);
}

async function startScreenshare() {
  console.log("Sharing screen!");

  if (!localScreenshareStream) {
    await getLocalScreenShareMedia();
  }

  const videoTrack = localScreenshareStream.getVideoTracks()[0];
  const audioTrack = localScreenshareStream.getAudioTracks()[0];

  if (videoTrack) {
    mediasoupPeer.addTrack(videoTrack, "screenshare-video");
  }

  if (audioTrack) {
    mediasoupPeer.addTrack(audioTrack, "screenshare-audio");
  }
}

async function getLocalScreenShareMedia() {
  try {
    // get a screen share track
    localScreenshareStream = await navigator.mediaDevices.getDisplayMedia(screenMediaConstraints);

    const videoTrack = localScreenshareStream.getVideoTracks()[0];
    if (videoTrack) {
      createHTMLElementsFromTrack(videoTrack, "local", "screen-video");
    }
  } catch (err) {
    console.error("GetDisplayMedia Error: ", err);
  }
}

function createHTMLElementsFromTrack(track, id, label) {
  let el = document.getElementById(id + "_" + label);
  if (track.kind === "video") {
    if (el == null) {
      console.log("Creating video element for client with ID: " + id);
      el = document.createElement("video");
      el.id = id + "_" + label;
      el.autoplay = true;
      el.muted = true;
      let container = document.getElementById(id + "_container");
      container.appendChild(el);
      el.setAttribute("playsinline", true);
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
      let container = document.getElementById(id + "_container");
      container.appendChild(el);
      el.setAttribute("playsinline", true);
      el.setAttribute("autoplay", true);
    }

    console.log("Updating <audio> source object for client with ID: " + id);
    el.srcObject = null;
    el.srcObject = new MediaStream([track]);
    el.volume = 0; // avoid feedback during local development

    el.onloadedmetadata = (e) => {
      el.play().catch((e) => {
        console.log("Play audio error: " + e);
      });
    };
  }
}

function gotTrack(track, id, label) {
  console.log(`Got track with label ${label} from ${id}.   Kind: ${track.kind}`);
  createHTMLElementsFromTrack(track, id, label);
};

function main() {
  console.log("~~~~~~~~~~~~~~~~~");
  setupSocketConnection();

  mediasoupPeer = new SimpleMediasoupPeer(socket);
  document.getElementById("sendCamera").addEventListener(
    "click",
    () => {
      sendCamera();
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

  // create an on-track listener
  mediasoupPeer.on("track", gotTrack);
}

main();
