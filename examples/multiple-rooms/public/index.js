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
        localScreenshareStream = await navigator.mediaDevices.getDisplayMedia(
            screenMediaConstraints
        );

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

function gotTrack({ track, peerId, label }) {
    console.log(`Got track with label ${label} from ${peerId}.   Kind: ${track.kind}`);
    updateHTMLElementsFromTrack(track, peerId, label);
}

function main() {
    console.log("~~~~~~~~~~~~~~~~~");
    // setupSocketConnection();

    mediasoupPeer = new SimpleMediasoupPeer();

    document.getElementById("joinRoomSubmit").addEventListener("click", () => {
        const roomId = document.getElementById("roomIdInput").value;
        console.log("joining room", roomId);
        mediasoupPeer.joinRoom(roomId);
    });

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

    // create an on-track listener
    mediasoupPeer.on("track", gotTrack);
    mediasoupPeer.on("peerConnection", (peerId) => {
        console.log("Peer joined:", peerId);
        addPeer(peerId);
    });

    mediasoupPeer.on("peerDisconnection", (peerId) => {
        console.log("Peer disconnected:", peerId);
        removePeer(peerId);
    });
    // test with non-existant event
    mediasoupPeer.on("sosos", () => {
        console.log("some callback");
    });
}

main();
