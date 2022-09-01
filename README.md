# Simple Mediasoup Peer

Simple Mediasoup Peer is meant to provide a simple approach to building real-time video and audio web applications for more than 10 people.  Under the hood, this library wraps the powerful, low-level [Mediasoup SFU library](https://mediasoup.org/) library with a simple API, using the [socket.io](https://socket.io/) websocket library for signaling.

### Getting Started

See [the example](./examples/simple/) for guidance.


### Server-Side Setup
On the server-side, simply add this line after initializing the io engine:
```js
const io = require('socket.io')();
new SimpleMediasoupPeerServer(io);
```

### Client-Side Setup
On the client-side, this requires the use of a Javascript complier.  The examples use [parcel](https://parceljs.org/).

The api consists of the following methods:

```js
socket = io("localhost:5000", {
    path: "/socket.io",
  });

const peer = new SimpleMediasoupPeer(socket);

// add a MediaStream track to your peer object
peer.addTrack(videoTrack, "webcam");

// connect to a given peer (based on their socket ID)
peer.connectToPeer(otherPeerID);

// broadcast a track (so that connected peers auto-subscribe)
peer.addTrack(videoTrack, "webcam", true);

// deal with incoming tracks
peer.on("track", (incomingTrack, peerId, label) => {
    // do something with this new track
    // info will contain the label assigned by the addTrack 
    // method: {label: "webcam", peerId: "e8219dsjwek123a", broadcast: false}
});

peer.resumePeer(otherPeerID);
peer.pausePeer(otherPeerID);

```


### How many peers can I support?
That depends on how they are several things: total number of connections, the server you are using, and the quality of the media stream you are sending.  



## To Do

### Improvements
- [ ] - Update to logging library 
- [ ] - Optionally set custom update frequency on server?
- [ ] - Override update frequency if there is a broadcast?
- [ ] - Allow metadata instead of label?
- [ ] - Allow for auto-connect flag on client-side?
- [ ] - Add method to disconnect from peer and cleanup any consumers
- [ ] - Support data producer / consumer
- [ ] - Support multiple rooms?
- [ ] - Add cleanup method for tracks after broadcaster disconnects.


### Bugs and Testing
- [ ] - What is proper behavior for change in socket ID?
- [ ] - if someone has previously added then paused a peer, then they remove and add a track, will the paused state be respected?
- [ ] - ensure tranports have successfully connected on client side before attempting to produce.
- [ ] - add a way to close a producer completely

### Done
- [X] - socket glitches and reassigning IDs
- [X] - make it work with multiple routers
- [X] - optionally add encodings for addTrack function? for screenshare quality
- [X] - pass in IP rather than using .env?
- [X] - better alternative to ontrack?
- [X] - Add ability to switch track
- [x] - ensure load balancing across workers? 
- [x] - ensure maximum number of workers created
- [x] - UnhandledPromiseRejectionWarning: TypeError: a Producer with same id "9d89745e-af87-4372-80e8-e9f6282c15ee" already exists
- [x] - UnhandledPromiseRejectionWarning: Error: a Producer with same producerId already exists
- [X] - separate examples from library code
- [X] - pre-build library?
- [X] - when connecting then clicking resume, how to ensure connection before we've resumed (or at least fail gracefully?)




## Examples
- [X] - simple example
- [X] - broadcast example
