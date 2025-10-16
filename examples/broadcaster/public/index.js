let socket;
let mediasoupPeer;


window.onload = () => {
  init();
};

function init() {
  mediasoupPeer = new SimpleMediasoupPeer();
  mediasoupPeer.on("track", gotTrack);
  mediasoupPeer.on("trackRemoved", gotTrackRemoved);
  mediasoupPeer.joinRoom("broadcastRoom123");
  window.smp = mediasoupPeer;
}

//*//*//*//*//*//*//*//*//*//*//*//*//*//*//*//*//*//*//*//*//

function gotTrackRemoved({ label, peerId }) {
  console.log(`Track ${label} removed from ${peerId}`);
}

function gotTrack({ track, peerId, label, pause, resume }) {
  console.log(`Got track of kind ${label} from ${peerId}`);

  let videoEl = document.getElementById("broadcast_video");
  let pauseButton = document.getElementById("pauseButton");
  let resumeButton = document.getElementById("resumeButton");
  pauseButton.addEventListener("click", () => {
    pause();
  });
  resumeButton.addEventListener("click", () => {
    resume();
  });

  if (track.kind === "video") {
    videoEl.srcObject = null;
    videoEl.srcObject = new MediaStream([track]);
  }

  videoEl.onloadedmetadata = (e) => {
    videoEl.play().catch((e) => {
      console.log("Play Error: " + e);
    });
  };
}
