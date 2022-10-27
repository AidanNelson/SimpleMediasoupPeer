## Broadcaster Example

This example uses Simple Mediasoup Peer to set up two separete pages: one for a broadcaster and one for an audience.

-   The audience page is available at https://localhost:5000
-   The broadcaster page is available at https://localhost:5000/broadcaster.html

### Getting Started

Run the following commaneds in your terminal (from the root directory of this example):

```bash
npm install # install server-side dependencies
npm run start # start the server
```

### Custom Encodings

You can set custom encodings for video and audio tracks as an optional fourth parameter to the `mediasoupPeer.addTrack()` method. The broadcaster page uses simulcast encodings. You can read (a lot) more about codecs and encodings in the [Mediasoup Documentation](https://mediasoup.org/documentation/v3/mediasoup/rtp-parameters-and-capabilities).

```js
let customVideoEncodings = [
    { scaleResolutionDownBy: 4, maxBitrate: 500000 },
    { scaleResolutionDownBy: 2, maxBitrate: 1000000 },
    { scaleResolutionDownBy: 1, maxBitrate: 5000000 },
];
let customAudioEncodings = [{ maxBitrate: 256000 }];

mediasoupPeer.addTrack(myVideoTrack, "video-broadcast", true, customVideoEncodings);
mediasoupPeer.addTrack(myAudioTrack, "audio-broadcast", true, customAudioEncodings);
```
