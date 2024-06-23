let socket = io('http://localhost:5000', {
  path: "/socket.io/",
  autoConnect: false
})
let mediasoupPeer;

window.onload = () => {
  document.getElementById("startButton").addEventListener("click", () => {
    document.getElementById("startButton").style.display = "none";
    init();
  });
};

function init() {
  mediasoupPeer = new SimpleMediasoupPeer({socket: socket});
  socket.connect();
  mediasoupPeer.on("track", gotTrack);
  
  mediasoupPeer.joinRoom("broadcastRoom123");
}

//*//*//*//*//*//*//*//*//*//*//*//*//*//*//*//*//*//*//*//*//

function gotTrack({ track, peerId, label }) {
  console.log(`Got track of kind ${label} from ${peerId}`);

  let el;

  if (track.kind === "video") {
    console.log("Creating video element for client with ID: " + peerId);
    el = document.createElement("video");
    el.id = peerId + "_video";
    el.setAttribute("playsinline", true);
    el.setAttribute("autoplay", true);
    el.setAttribute("muted", true);
    el.setAttribute("controls", true);
    document.body.appendChild(el);
  }

  if (track.kind === "audio") {
    console.log("Creating audio element for client with ID: " + peerId);
    el = document.createElement("audio");
    el.id = peerId + "_" + label;
    document.body.appendChild(el);
    el.setAttribute("playsinline", true);
    el.setAttribute("autoplay", true);
    el.volume = 0; // this is here to avoid feedback while testing
  }



  el.onloadedmetadata = (e) => {
    console.log('attempting to play media');
    el.play().catch((e) => {
      console.log("Play Error: " + e);
    });
  };

  el.srcObject = null;
  el.srcObject = new MediaStream([track]);
}
