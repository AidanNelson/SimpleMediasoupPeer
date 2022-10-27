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

    const headerEl = document.createElement("div");
    const titleEl = document.createElement("p");
    titleEl.innerText = "Client " + id + " - ";
    headerEl.appendChild(titleEl);

    peerEl.appendChild(headerEl);
    document.getElementById("peerContainer").appendChild(peerEl);
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
        localStream = await navigator.mediaDevices.getUserMedia(
            userMediaConstraints
        );

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

function gotTrack({ track, peerId, label }) {
    console.log(
        `Got track with label ${label} from ${peerId}.   Kind: ${track.kind}`
    );
    createHTMLElementsFromTrack(track, peerId, label);
}

function main() {
    console.log("~~~~~~~~~~~~~~~~~");

    mediasoupPeer = new SimpleMediasoupPeer();
    mediasoupPeer.joinRoom("loadTestingRoom123");

    window.onload = sendCamera;

    // create an on-track listener
    mediasoupPeer.on("track", gotTrack);
    mediasoupPeer.on("peerConnection", addPeer);
    mediasoupPeer.on("peerDisconnection", removePeer);
}

main();
