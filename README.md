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
peer.joinRoom("MyCoolRoomName");

// leave a room
peer.leaveRoom("MyCoolRoomName");

// deal with incoming tracks
peer.on("track", ({ track, peerId, label }) => {
    // do something with this new track
    console.log(
        "New",
        track.kind,
        "track available from peer with id",
        peerId,
        "with label",
        label
    );
});

// deal with new peers in the room
peer.on("peerConnection", ({ peerId }) => {
    console.log("Peer with id", peerId, "joined the room");
});

// deal with peers disconnecting
peer.on("peerDisconnection", ({ peerId }) => {
    console.log("Peer with id", peerId, "left the room");
});

// add a MediaStream track to your peer object
peer.addTrack(videoTrack, "webcam");

// connect to a given peer (based on their socket ID)
peer.connectToPeer(otherPeerID);

// broadcast a track (so that connected peers auto-subscribe)
peer.addTrack(videoTrack, "webcam", true);

// resume all conected tracks from a given peer
peer.resumePeer(otherPeerID);

// pause all connected tracks from a given peen
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

Interested in developing on this library locally? Read on [here](./development.md)!

## To Do

### Improvements

-   [x] -   Update to logging library
-   [ ] -   Optionally set custom update frequency on server?
-   [ ] -   Override update frequency if there is a broadcast?
-   [ ] -   Allow metadata instead of label?
-   [x] -   Allow for auto-connect flag on client-side?
-   [ ] -   Add method to disconnect from peer and cleanup any consumers
-   [ ] -   Support data producer / consumer
-   [x] -   Support multiple rooms?
-   [ ] -   Add cleanup method for tracks after broadcaster disconnects.
-   [ ] -   "Listen on server side for “transportclose” and “producerclose” in the Consumer and notify the client" (https://mediasoup.discourse.group/t/detecting-consumer-closed-track-ended/592)

### Bugs and Testing

-   [ ] -   What is proper behavior for change in socket ID?
-   [ ] -   if someone has previously added then paused a peer, then they remove and add a track, will the paused state be respected?
-   [ ] -   ensure tranports have successfully connected on client side before attempting to produce.
-   [ ] -   add a way to close a producer completely

### Done

-   [x] -   socket glitches and reassigning IDs
-   [x] -   make it work with multiple routers
-   [x] -   optionally add encodings for addTrack function? for screenshare quality
-   [x] -   pass in IP rather than using .env?
-   [x] -   better alternative to ontrack?
-   [x] -   Add ability to switch track
-   [x] -   ensure load balancing across workers?
-   [x] -   ensure maximum number of workers created
-   [x] -   UnhandledPromiseRejectionWarning: TypeError: a Producer with same id "9d89745e-af87-4372-80e8-e9f6282c15ee" already exists
-   [x] -   UnhandledPromiseRejectionWarning: Error: a Producer with same producerId already exists
-   [x] -   separate examples from library code
-   [x] -   pre-build library?
-   [x] -   when connecting then clicking resume, how to ensure connection before we've resumed (or at least fail gracefully?)

## Examples

-   [x] -   simple example
-   [x] -   broadcast example
