let mediasoupPeer;

function init() {
  mediasoupPeer = new SimpleMediasoupPeer();
  mediasoupPeer.joinRoom("abc");
  mediasoupPeer.on("track", gotTrack);
  console.log(mediasoupPeer);
}
init();

//*//*//*//*//*//*//*//*//*//*//*//*//*//*//*//*//*//*//*//*//

function gotTrack({ track, peerId, label }) {
  console.log(`Got track of kind ${label} from ${peerId}`);
  console.log({ track });
  let el;

  if (track.kind === "video") {
    console.log("Creating video element for client with ID: " + peerId);
    el = document.createElement("video");
    el.id = peerId + "_video";
    el.autoplay = true;
    el.muted = true;
    el.controls = true;
    el.setAttribute("playsinline", true);
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

  el.srcObject = null;
  el.srcObject = new MediaStream([track]);

  el.onloadedmetadata = (e) => {
    el.play().catch((e) => {
      console.log("Play Error: " + e);
    });
  };
}
