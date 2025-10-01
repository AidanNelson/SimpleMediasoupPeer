let socket;
let mediasoupPeer;

window.onload = () => {
  document.getElementById("startButton").addEventListener("click", () => {
    document.getElementById("startButton").style.display = "none";
    init();
  });
};

function init() {
  mediasoupPeer = new SimpleMediasoupPeer();
  mediasoupPeer.on("track", gotTrack);
  mediasoupPeer.joinRoom("broadcastRoom123");
}

//*//*//*//*//*//*//*//*//*//*//*//*//*//*//*//*//*//*//*//*//

function gotTrack({ track, peerId, label }) {
  console.log(`Got track of kind ${label} from ${peerId}`);

  let videoEl = document.getElementById( "broadcast_video");
  let audioEl = document.getElementById( "broadcast_audio");

  if (track.kind === "video") {
    videoEl.srcObject = null;
    videoEl.srcObject = new MediaStream([track]);
  }
  if (track.kind === "audio") {
    audioEl.srcObject = null;
    audioEl.srcObject = new MediaStream([track]);
  }


  videoEl.onloadedmetadata = (e) => {
    videoEl.play().catch((e) => {
      console.log("Play Error: " + e);
    });
  };
  audioEl.onloadedmetadata = (e) => {
    audioEl.play().catch((e) => {
      console.log("Play Error: " + e);
    });
  };
}
