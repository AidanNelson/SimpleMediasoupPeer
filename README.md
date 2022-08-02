# Simple Mediasoup Peer

This library is mean to simplify the process of building scalable real-time video and audio applications. 

Under the hood, this library uses the [Mediasoup SFU library](https://mediasoup.org/) and the [socket.io](https://socket.io/) websocket library.  It requires that your application use socket.io.

To use Simple Mediasoup Peer, you need to add to your client-side and server-side code.  


### How many peers can I support?
That depends on how they are several things: total number of connections, the server you are using, and the quality of the media stream you are sending.  


### Server-Side Setup
On the server-side, simply add this line after initializing the io engine:
```js
const io = require('socket.io')();
new MediasoupManager(io);
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



## To Do

- [X] - make it work with multiple routers
- [ ] - deal with network disconnects (multiple socket connections from client when there has been a network blip?)
- [ ] - if someone has previously added then paused a peer, then they remove and add a track, will the paused state be respected?
- [ ] - socket glitches and reassigning IDs
- [ ] - transport and or producer fails
- [ ] - ensuring tranports have successfully connected on client side before attempting to produce
- [ ] - when connecting then clicking resume, how to ensure connection before we've resumed (or at least fail gracefully?)
- [ ] - add a way to close a producer?  or somehow end track?
- [ ] - optionally add encodings for addTrack function? for screenshare quality
- [ ] - pass in IP rather than using .env?
- [ ] - better alternative to ontrack?
- [ ] - Add ability to switch track
- [x] - ensure load balancing across workers? 
- [x] - ensure maximum number of workers created
- [x] - UnhandledPromiseRejectionWarning: TypeError: a Producer with same id "9d89745e-af87-4372-80e8-e9f6282c15ee" already exists
- [x] - UnhandledPromiseRejectionWarning: Error: a Producer with same producerId already exists
- [ ] - separate examples from library code
- [ ] - pre-build library?



## Examples
- [ ] - simple example
- [ ] - 