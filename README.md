# Simple Mediasoup Peer

Simple Mediasoup Peer provides a simple way to build real-time video and audio web applications for more than 10 people. Under the hood, this library wraps the powerful, low-level [Mediasoup SFU library](https://mediasoup.org/) library with a simple API, using the [socket.io](https://socket.io/) websocket library for signaling.

## Getting Started

### Server-Side Setup (Node.js)

This library can be installed from npm (the node package manager).

```bash
npm install simple-mediasoup-peer-server
```

Once installed, create a new SimpleMediasoupPeerServer:

```js
const SimpleMediasoupPeerServer = require("simple-mediasoup-peer-server");
new SimpleMediasoupPeerServer();
```

You're done! 🙃 By default, this server will create a Mediasoup worker and router for every available CPU core. Working on an 8-core server, you'll have 8 Mediasoup workers and 8 Mediasoup routers available.

### Client-Side Setup (Browser)

Add the client-side library to your code using a script tag:

```js
<script
    src="https://cdn.jsdelivr.net/npm/simple-mediasoup-peer-client@latest/dist/SimpleMediasoupPeer.js"
    type="text/javascript"
></script>
```

Or, if you're using a bundler, install it directly from npm:

```bash
npm install simple-mediasoup-peer-client
```

Once installed, initialize a new SimpleMediasoupPeer.

```js
// available options for initializing a new peer
const options = {
    autoConnect: true, // should the peer automatically connect to available tracks
    server: "http://localhost:3000",
    roomId: "MyCoolRoomName123",
};
const peer = new SimpleMediasoupPeer(options);
```

This peer will automatically connect to the signaling server you previously set up and join the room specified.

This peer has the following methods available:

```js
// join a room!
await peer.joinRoom("MyCoolRoomName");

// leave a room
await peer.leaveRoom("MyCoolRoomName");

// deal with incoming tracks
peer.on("track", ({ track, peerId, label, pause, resume }) => {
    // do something with this new track
    console.log(
        "New",
        track.kind,
        "track available from peer with id",
        peerId,
        "with label",
        label
    );
    // you can pause/resume individual tracks using the provided methods
});

// get notified when a track is removed (peer left, track ended, etc.)
peer.on("trackRemoved", ({ peerId, label, producerId }) => {
    console.log("Track", label, "from peer", peerId, "was removed");
    // clean up any UI elements, etc.
});

// add a MediaStream track to your peer object
await peer.addTrack({ track: videoTrack, label: "webcam" });

// add a track with custom encodings (useful for screenshare/broadcast)
await peer.addTrack({ 
    track: videoTrack, 
    label: "screenshare",
    customEncodings: [
        { maxBitrate: 3000000 }, // 3 Mbps
    ]
});

// remove a track
await peer.removeTrack({ label: "webcam" });

// resume all connected tracks from a given peer
peer.resumePeer(otherPeerID);

// pause all connected tracks from a given peer
peer.pausePeer(otherPeerID);
```

Note that this library does not deal with getUserMedia requests, keeping track of clients or actually displaying any incoming audio or video streams. See the examples to better understand how this fits into your larger application.

## Examples

-   [Multiple Rooms](./examples/multiple-rooms/) - A video chat with multiple rooms.
-   [Broadcast](./examples/broadcaster/) - This example sets up a broadcast page and an audience page. It uses custom encodings to ensure a high-quality broadcast.
-   [Load Testing](./examples/load-testing/) - Use this example for a quick-and-dirty approach to testing the capacity of your server to roughly estimate how many users it will support.


### How many peers can I support?

That depends on how they are several things: total number of connections, the server you are using, and the quality of the media stream you are sending. Check out the [load testing example](./examples/load-testing/) to try to estimate for your setup.

## Development

Interested in developing on this library locally? Read on [here](./development.md).