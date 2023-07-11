let mediasoupPeer;
let localStream;
let localScreenshareStream;

let userMediaConstraints = {
  audio: true,
  video: {
    width: 640,
    height: 480,
  },
};

let screenMediaConstraints = {
  video: {
    width: 1920,
    height: 1080,
  },
  audio: false,
};

window.onload = () => {
  console.log("~~~~~~~~~~~~~~~~~");
  // setupSocketConnection();

  // Two options for setting up the SMP client
  // 1. have SMP manage the socket internally
  mediasoupPeer = new SimpleMediasoupPeer();
  // 2. provide a socket for SMP
  // const socket = io("localhost:3000");
  // mediasoupPeer = new SimpleMediasoupPeer({
  //     autoConnect: true,
  //     socket,
  // });

  mediasoupPeer.joinRoom("myCoolRoom123");

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

  document.getElementById("screenshare").addEventListener(
    "click",
    () => {
      startScreenshare();
    },
    false
  );

  mediasoupPeer.on("peerConnection", addPeer);
  mediasoupPeer.on("peerDisconnection", removePeer);
  mediasoupPeer.on("track", gotTrack);
};

function addPeer({ peerId }) {
  console.log("Client conencted: ", peerId);
  addPeerElements(peerId);
}

function removePeer({ peerId }) {
  console.log("Client disconencted:", peerId);
  const peerEl = document.getElementById(peerId + "_container");
  if (peerEl) peerEl.remove();
}

// create a <div> for each peer
function addPeerElements(id) {
  let peerEl = document.createElement("div");
  peerEl.id = id + "_container";
  peerEl.style = "border: 1px solid black; margin: 10px; padding: 10px;";

  let videoEl = document.createElement("video");
  videoEl.id = id + "_video";
  videoEl.setAttribute("autoplay", true);
  videoEl.setAttribute("muted", true);
  videoEl.setAttribute("playsinline", true);
  peerEl.appendChild(videoEl);

  videoEl = document.createElement("video");
  videoEl.id = id + "_screen-video";
  videoEl.setAttribute("autoplay", true);
  videoEl.setAttribute("muted", true);
  videoEl.setAttribute("playsinline", true);
  peerEl.appendChild(videoEl);

  let audioEl = document.createElement("audio");
  audioEl.id = id + "_audio";
  audioEl.setAttribute("playsinline", true);
  audioEl.setAttribute("autoplay", true);
  audioEl.setAttribute("controls", true);
  peerEl.appendChild(audioEl);

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
  document.getElementById("peerContainer").appendChild(peerEl);
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
      updateHTMLElementsFromTrack(videoTrack, "local", "video");
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

  if (videoTrack) {
    mediasoupPeer.addTrack(videoTrack, "screen-video");
  }
}

async function getLocalScreenShareMedia() {
  try {
    // get a screen share track
    localScreenshareStream = await navigator.mediaDevices.getDisplayMedia(screenMediaConstraints);

    const videoTrack = localScreenshareStream.getVideoTracks()[0];
    if (videoTrack) {
      updateHTMLElementsFromTrack(videoTrack, "local", "screen-video");
    }
  } catch (err) {
    console.error("GetDisplayMedia Error: ", err);
  }
}

function updateHTMLElementsFromTrack(track, id, label) {
  console.log("updating video", track);
  let el = document.getElementById(id + "_" + label);
  console.log("el:", el);
  if (track.kind === "video") {
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
    console.log("Updating <audio> source object for client with ID: " + id);
    el.srcObject = null;
    el.srcObject = new MediaStream([track]);

    el.onloadedmetadata = (e) => {
      el.play().catch((e) => {
        console.log("Play audio error: " + e);
      });
    };
  }
}

function gotTrack({ track, peerId, label }) {
  console.log(`Got track with label ${label} from ${peerId}. Kind: ${track.kind}`);
  updateHTMLElementsFromTrack(track, peerId, label);
}
