let mediasoupPeer;
let localStream;
let localScreenshareStream;


let customVideoEncodings = [{ scaleResolutionDownBy: 1, maxBitrate: 500000 }];
let customAudioEncodings = [{ maxBitrate: 256000 }];

let userMediaConstraints = {
  audio: false,
  video: {
    width: 1280,
    height: 720,
  },
};

let screenMediaConstraints = {
  video: {
    width: 320,
    height: 240,
  },
  audio: false,
};

async function sendCamera() {
  if (!localStream) {
    await startCamera();
  }

  const videoTrack = localStream.getVideoTracks()[0];
  const audioTrack = localStream.getAudioTracks()[0];

  if (videoTrack) {
    mediasoupPeer.addTrack(videoTrack, "video", customVideoEncodings);
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
  let el = document.getElementById(id + "_" + label);
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
    el.volume = 0; // avoid feedback during local development

    el.onloadedmetadata = (e) => {
      el.play().catch((e) => {
        console.log("Play audio error: " + e);
      });
    };
  }
}

function main() {
  console.log("~~~~~~~~~~~~~~~~~");
  // setupSocketConnection();

  mediasoupPeer = new SimpleMediasoupPeer({ autoConnect: false, roomId: 'recording' });
  window.peer = mediasoupPeer;

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
}

main();
