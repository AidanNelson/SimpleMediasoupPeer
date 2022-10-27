# Simple Mediasoup Peer

Simple Mediasoup Peer is a simple way to build real-time video and audio web applications for more than 10 people. Under the hood, this library wraps the powerful, low-level [Mediasoup SFU library](https://mediasoup.org/) library with a simple API, using the [socket.io](https://socket.io/) websocket library for signaling.

## Getting Started

### Server-Side Setup

This library can be installed from npm (the node package manager).

```bash
npm install simple-mediasoup-peer-server
```

Once installed, create a new SimpleMediasoupPeerServer:

```js
new SimpleMediasoupPeerServer();
```

You're done! 🙃 By default, this server will create a Mediasoup worker and router for every available CPU core. Working on an 8-core server, you'll have 8 Mediasoup workers and 8 Mediasoup routers available.

### Client-Side Setup

Add the client-side library to your code using a script tag:

```js
<script
    src="https://cdn.jsdelivr.net/npm/simple-mediasoup-peer-client@0.0.3/dist/SimpleMediasoupPeer.js"
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
    autoConnect: false, // should the peer automatically connect to available tracks
    server: "http://localhost:3000",
    roomId: "MyCoolRoomName123",
};
const peer = new SimpleMediasoupPeer(options);
```

This peer will automatically connect to the signaling server you previously set up and join the room specified.

This peer has the following methods available:

```js
// deal with incoming tracks
peer.on("track", ({ peerId, track, info }) => {
    // do something with this new track
});

// deal with new peers in the room
peer.on("peer", ({ peerId }) => {
    // do something with this new track
});

// deal with peers disconnecting
peer.on("disconnect", ({ peerId }) => {
    // do something with this new track
});

// join a room!
peer.joinRoom("MyCoolRoomName");

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

-   [Simple Video Chat](./examples/simple-video-chat/)

### How many peers can I support?

That depends on how they are several things: total number of connections, the server you are using, and the quality of the media stream you are sending.

## Development

Interested in developing on this library locally? Read on!

To develop on the server-side library (simple-mediasoup-peer-server) using [npm link](https://docs.npmjs.com/cli/v8/commands/npm-link):

```bash
# enter the server side library folder
cd server
# link the local code to npm
npm link

# then, enter your project folder
cd /PATH/TO/YOUR/PROJECT/FOLDER
# and complete the link to the local copy of the server library
npm link simple-mediasoup-peer-server
```

To develop on the client-side library (simple-mediasoup-peer-client):

```bash
# enter the client side library folder
cd client
# start the build system (parcel) and a local development server
npm run start
```

Finally, in your index.html code, you will need to load the client-side library from the local development server

```html
<script src="http://localhost:8080/SimpleMediasoupPeer.js" type="text/javascript"></script>
```

## To Do

### Improvements

-   [ ] -   Update to logging library
-   [ ] -   Optionally set custom update frequency on server?
-   [ ] -   Override update frequency if there is a broadcast?
-   [ ] -   Allow metadata instead of label?
-   [ ] -   Allow for auto-connect flag on client-side?
-   [ ] -   Add method to disconnect from peer and cleanup any consumers
-   [ ] -   Support data producer / consumer
-   [ ] -   Support multiple rooms?
-   [ ] -   Add cleanup method for tracks after broadcaster disconnects.

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
