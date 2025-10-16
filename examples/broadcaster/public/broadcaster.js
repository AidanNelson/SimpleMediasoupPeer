let socket;
let mediasoupPeer;
let localCam;

// custom encodings
let customVideoEncodings = [{ scaleResolutionDownBy: 1, maxBitrate: 500000 }];

async function startBroadcast() {
  let videoTrack = localCam.getVideoTracks()[0];
  mediasoupPeer.addTrack({ track: videoTrack, label: "video-broadcast", customEncodings: customVideoEncodings });

  setInterval(async() => {
    await mediasoupPeer.leaveRoom("broadcastRoom123");
    await mediasoupPeer.joinRoom("broadcastRoom123");
  }, 2000);
  // setInterval(() => {
  //   mediasoupPeer.socket.disconnect();
  //   mediasoupPeer.socket.connect();
  // }, 4000);
}

async function main() {
  console.log("~~~~~~~~~~~~~~~~~");

  mediasoupPeer = new SimpleMediasoupPeer();
  mediasoupPeer.joinRoom("broadcastRoom123");

  await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
  getDevices();

  document.getElementById("startBroadcast").addEventListener(
    "click",
    () => {
      startBroadcast();
    },
    false
  );
}

main();

//*//*//*//*//*//*//*//*//*//*//*//*//*//*//*//*//*//*//
// user media

const videoElement = document.getElementById("local_video");
const videoInputSelect = document.querySelector("select#videoSource");
const selectors = [videoInputSelect];

videoInputSelect.addEventListener("change", startStream);

async function getDevices() {
  let devicesInfo = await navigator.mediaDevices.enumerateDevices();
  gotDevices(devicesInfo);
  await startStream();
}

function gotDevices(deviceInfos) {
  // Handles being called several times to update labels. Preserve values.
  const values = selectors.map((select) => select.value);
  selectors.forEach((select) => {
    while (select.firstChild) {
      select.removeChild(select.firstChild);
    }
  });
  for (let i = 0; i !== deviceInfos.length; ++i) {
    const deviceInfo = deviceInfos[i];
    const option = document.createElement("option");
    option.value = deviceInfo.deviceId;

    if (deviceInfo.kind === "videoinput") {
      option.text = deviceInfo.label || `camera ${videoInputSelect.length + 1}`;
      videoInputSelect.appendChild(option);
    }
  }
  selectors.forEach((select, selectorIndex) => {
    if (
      Array.prototype.slice.call(select.childNodes).some((n) => n.value === values[selectorIndex])
    ) {
      select.value = values[selectorIndex];
    }
  });
}

function gotStream(stream) {
  localCam = stream; // make stream available to console

  const videoTrack = localCam.getVideoTracks()[0];

  // add video stream to DOM for local testing
  // don't add audio to avoid feedback
  let videoStream = new MediaStream([videoTrack]);
  if ("srcObject" in videoElement) {
    videoElement.srcObject = videoStream;
  } else {
    videoElement.src = window.URL.createObjectURL(videoStream);
  }

  videoElement.play();

  // Refresh button list in case labels have become available
  return navigator.mediaDevices.enumerateDevices();
}

function handleError(error) {
  console.log("navigator.MediaDevices.getUserMedia error: ", error.message, error.name);
}

async function startStream() {
  console.log("getting local stream");
  if (localCam) {
    localCam.getTracks().forEach((track) => {
      track.stop();
    });
  }

  const videoSource = videoInputSelect.value;
  const constraints = {
    audio: false,
    video: {
      deviceId: videoSource ? { exact: videoSource } : undefined,
      width: { ideal: 1920 },
      height: { ideal: 1080 },
    },
  };
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(gotStream)
    .then(gotDevices)
    .catch(handleError);
}
