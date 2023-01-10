const express = require("express");
const http = require("http");
const childProcess = require("child_process");

// uncomment one of the following lines to see all mediasoup's internal logging messages:
// process.env.DEBUG = "mediasoup*" // show everything mediasoup related
process.env.DEBUG = "mediasoup:WARN:* mediasoup:ERROR:*"; // show only mediasoup warnings & errors

const SimpleMediasoupPeerServer = require("../../server/index");

const io = require("socket.io")();

const app = express();
const server = http.createServer(app);

io.listen(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// serve the client-side files
const distFolder = process.cwd() + "/public";
console.log("Serving static files at ", distFolder);
app.use(express.static(process.cwd() + "/public"));

const port = 5000;
server.listen(port);
console.log(`Server listening on http://localhost:${port}`);

// keep track of all clients here
let clients = {};

function setupSocketServer() {
  io.on("connection", (socket) => {
    console.log(
      "User " +
        socket.id +
        " connected, there are " +
        io.engine.clientsCount +
        " clients connected"
    );

    socket.emit("clients", Object.keys(clients));
    socket.broadcast.emit("clientConnected", socket.id);

    // then add to our clients object
    clients[socket.id] = {}; // store initial client state here

    socket.on("disconnect", () => {
      delete clients[socket.id];
      io.sockets.emit("clientDisconnected", socket.id);
      console.log("client disconnected: ", socket.id);
    });
  });
}

function main() {
  // the mediasoup manager object will set up additional event
  // handlers on the socket-io object
  let mediasoupManager = new SimpleMediasoupPeerServer(io);
  setupSocketServer();
  // setTimeout(async () => {
  //   const transportInfo = await mediasoupManager.addServerSideBroadcaster();
  //   console.log(transportInfo);
  //   startFFMPEGBroadcaster(
  //     transportInfo.tuple.localPort,
  //     transportInfo.rtcpTuple.localPort
  //   );
  // }, 2000);

  setTimeout(async () => {
    const transportInfo = await mediasoupManager.addServerSideBroadcaster();
    console.log(transportInfo);
    startFFMPEGSRTServer(
      transportInfo.tuple.localPort,
      transportInfo.rtcpTuple.localPort
    );
  }, 2000);
}

main();

function startFFMPEGSRTServer(
  plainTransportPort,
  plainTransportRTCPPort,
  srtPort
) {
  // spawn an ffmpeg process
  const child = childProcess.spawn("ffmpeg", [
    "-re",
    "-v",
    "info",
    "-stream_loop",
    "-1",
    "-i",
    "srt://127.0.0.1:9191?mode=listener&transtype=live&latency=3000000&ffs=128000&rcvbuf=100058624",

    // generic libav soptions:
    "-cpu-used",
    "8",

    "-map",
    "0:v:0",

    "-pix_fmt",
    "yuv420p",

    // for no re-encoding (only works if source is encoded correctly)
    "-c:v",
    "copy",

    // for re-encoding to h264
    // "-c:v",
    // "libx264",
    // "-b:v",
    // "5000k",
    // "-bf",
    // "-1",

    // for re-encoding to VP8
    // "-c:v",
    // "libvpx",
    // "-b:v",
    // "2M",
    // "-deadline",
    // "realtime",
    // "-max_delay",
    // "0",

    // for shrinking output size by 2
    // "-vf",
    // "scale=iw/2:-2",

    "-f",
    "tee",
    `[select=v:f=rtp:ssrc=22222222:payload_type=112]rtp://127.0.0.1:${plainTransportPort}?rtcpport=${plainTransportRTCPPort}`,
  ]);

  child.on("error", () => {
    // catches execution error (bad file)
    console.log(`Error executing binary: ${ffmpegPath}`);
  });

  child.stdout.on("data", (data) => {
    console.log(data.toString());
  });

  child.stderr.on("data", (data) => {
    console.log(data.toString());
  });

  child.on("close", (code) => {
    console.log(`Process exited with code: ${code}`);
    if (code === 0) {
      console.log(`FFmpeg finished successfully`);
    } else {
      console.log(`FFmpeg encountered an error, check the console output`);
    }
  });
}
function startFFMPEGBroadcaster(port, rtcpPort) {
  // spawn an ffmpeg process
  const child = childProcess.spawn(
    "ffmpeg",
    // note, args must be an array when using spawn
    // [
    //   "-i",
    //   `${inputFile}`,
    //   // copy over the input streams of the input file to the output file
    //   "-map",
    //   "0",
    //   "-c",
    //   "copy",
    //   // transcode the file into hevc from h264
    //   "-c:v",
    //   "libx265",
    //   `${outputFile}`,
    // ],
    [
      "-re",
      "-v",
      "info",
      "-stream_loop",
      "-1",
      "-i",
      "./test.mp4",

      // generic libav soptions:
      "-cpu-used",
      "8",

      "-map",
      "0:v:0",

      "-pix_fmt",
      "yuv420p",

      // for no re-encoding (only works if source is encoded correctly)
      // "-c:v",
      // "copy",

      // for re-encoding to h264
      "-c:v",
      "libx264",
      "-b:v",
      "5000k",
      // "-bf",
      // "-1",

      // for re-encoding to VP8
      // "-c:v",
      // "libvpx",
      // "-b:v",
      // "2M",
      // "-deadline",
      // "realtime",
      // "-max_delay",
      // "0",

      // for shrinking output size by 2
      // "-vf",
      // "scale=iw/2:-2",

      "-f",
      "tee",
      `[select=v:f=rtp:ssrc=22222222:payload_type=112]rtp://127.0.0.1:${port}?rtcpport=${rtcpPort}`,
    ]
  );

  child.on("error", () => {
    // catches execution error (bad file)
    console.log(`Error executing binary: ${ffmpegPath}`);
  });

  child.stdout.on("data", (data) => {
    console.log(data.toString());
  });

  child.stderr.on("data", (data) => {
    console.log(data.toString());
  });

  child.on("close", (code) => {
    console.log(`Process exited with code: ${code}`);
    if (code === 0) {
      console.log(`FFmpeg finished successfully`);
    } else {
      console.log(`FFmpeg encountered an error, check the console output`);
    }
  });
}
