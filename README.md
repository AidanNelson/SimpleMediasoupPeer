# SimpleSFU (SnaFU)

## To Do

- [X] - make it work with multiple routers
- [ ] - deal with network disconnects (multiple socket connections from client when there has been a network blip?)
- [ ] - if someone has previously added then paused a peer, then they remove and add a track, will the paused state be respected?


## API

This library is mean to simplify the process of building scalable real-time video and audio applications. 

Under the hood, this library uses the Mediasoup SFU library and the socket.io websocket library.  It requires that you're application use socket.io (for now).

To use SimpleSFU, you need to add the SimpleSFU to your client-side and server-side code.  

#### Server-Side Setup
On the server-side, simply add this line after initializing the io engine:
```js
const io = require('socket.io')();
new MediasoupManager(io);
```



#### Client-Side Setup
On the client-side, the api consists of the following methods

```js
socket = io("localhost:5000", {
    path: "/socket.io",
  });
const peer = new SimpleMediasoupPeer(socket);

// add a track to your peer object
peer.addTrack(videoTrack, "webcam", false);

// connectToPeer based on socket ID of another peer
peer.connectToPeer("e8219dsjwek123a");

// handle the on-track event
peer.onTrack = (incomingTrack, peerId, info) => {
    // do something with this new track
    // info will contain the label assigned by the addTrack 
    // method: {label: "webcam", peerId: "e8219dsjwek123a", broadcast: false}
}

peer.resumePeer("e8219dsjwek123a");
peer.pausePeer("e8219dsjwek123a");

```