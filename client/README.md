## Getting Started

On the client-side, this requires the use of a Javascript complier.  The examples use [parcel](https://parceljs.org/).

The api consists of the following methods:

```js
socket = io("localhost:5000", {
    path: "/socket.io",
  });
const peer = new SimpleMediasoupPeer(socket);

// add a MediaStream track to your peer object
peer.addTrack(videoTrack, "webcam", false);

// connect to a given peer (based on their socket ID)
peer.connectToPeer(otherPeerID);

// what to do when a track arrives
peer.onTrack = (incomingTrack, peerId, info) => {
    // do something with this new track
    // info will contain the label assigned by the addTrack 
    // method: {label: "webcam", peerId: "e8219dsjwek123a", broadcast: false}
}

peer.resumePeer(otherPeerID);
peer.pausePeer(otherPeerID);

```