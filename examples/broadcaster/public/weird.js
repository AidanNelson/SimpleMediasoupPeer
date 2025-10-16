let socket;
let mediasoupPeer;


window.onload = () => {
  init();
};

function init() {
  mediasoupPeer = new SimpleMediasoupPeer();
  mediasoupPeer.on("track", gotTrack);
  mediasoupPeer.joinRoom("broadcastRoom123");
  window.smp = mediasoupPeer;

  // setInterval(() => {
  //   mediasoupPeer.leaveRoom("broadcastRoom123");
  //   mediasoupPeer.joinRoom("broadcastRoom123");
    
  // }, 500);
  // setInterval(() => {
  //   mediasoupPeer.socket.disconnect();
  //   mediasoupPeer.socket.connect();
  // }, 1000);
}

//*//*//*//*//*//*//*//*//*//*//*//*//*//*//*//*//*//*//*//*//

function gotTrack({ track, peerId, label, pause, resume }) {
  console.log(`Got track of kind ${label} from ${peerId}`);

  let videoEl = document.getElementById("broadcast_video");
  let pauseButton = document.getElementById("pauseButton");
  let resumeButton = document.getElementById("resumeButton");
  // setInterval(() => {
  //   pause();
  //   setTimeout(() => {
  //     resume();
  //   }, 1000);
    
  // }, 2000);
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
