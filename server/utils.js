const { spawn } = require('node:child_process');

function playVideoWithFFMPEG({ file, plainTransportPort, plainTransportRTCPPort }) {
//   const url = ip.address();
//   const port = nextSRTPort++;
//   const streamingEndpoint = `srt://${url}:${port}`;
//   console.log(`Starting FFMPEG child process. Start streaming to ${streamingEndpoint}`);

  // spawn an ffmpeg process
  const child = spawn("ffmpeg", [
    "-re",
    "-v",
    "info",
    "-stream_loop",
    "-1",

    // stream delay reduction
    // https://stackoverflow.com/questions/16658873/how-to-minimize-the-delay-in-a-live-streaming-with-ffmpeg
    // "-fflags",
    // "nobuffer",
    // "-flags",
    // "low_delay",
    // "-framedrop",
    // "-strict",
    // "experimental",
    // "-probesize",
    // "32",
    // "-analyzeduration",
    // "0",
    // "-sync",
    // "ext",

    "-i",
    `${file}`,
    // srt without any parameters
    // `srt://127.0.0.1:${port}?mode=listener`,

    // various attempts at SRT parameters
    // "srt://127.0.0.1:9191?mode=listener&transtype=live&rcvlatency=250&peerlatency=250&mss=1360&rcvbuf=443836",
    // `srt://127.0.0.1:9191?mode=listener&transtype=live&latency=${rttMillis * 4}&ffs=128000&rcvbuf=${calc_rcv_buf_bytes(rttMillis,)}`,
    // "srt://127.0.0.1:9191?mode=listener&transtype=live&latency=50",
    // "srt://127.0.0.1:9191?mode=listener&transtype=live&latency=3000000&ffs=128000&rcvbuf=100058624",

    // generic libav options:
    "-cpu-used",
    "8",

    "-map",
    "0:v:0",

    // "-pix_fmt",
    // "yuv420p",

    // for no re-encoding (only works if source is encoded correctly)
    // "-vf",
    // "scale=1280:720",
    "-c:v",
    "copy",

    // for enabling vp9 packetization (which is currently not in spec)
    "-strict",
    "experimental",

    // for re-encoding to h264
    // "-c:v",
    // "libx264",
    // "-b:v",
    // "500k",
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
    // "scale=iw/4:-4",

    "-f",
    "tee",
    // for vp8
    // `[select=v:f=rtp:ssrc=2222:payload_type=101]rtp://127.0.0.1:${plainTransportPort}?rtcpport=${plainTransportRTCPPort}`,

    // for vp9
    `[select=v:f=rtp:ssrc=2222:payload_type=103]rtp://127.0.0.1:${plainTransportPort}?rtcpport=${plainTransportRTCPPort}`,

    // for h264
    // `[select=v:f=rtp:ssrc=22222222:payload_type=112]rtp://127.0.0.1:${plainTransportPort}?rtcpport=${plainTransportRTCPPort}`,
  ]);

  child.on("error", () => {
    // catches execution error (bad file)
    console.log(`Error executing binary: ${ffmpegPath}`);
  });

  child.stdout.on("data", (data) => {
    // console.log(data.toString());
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
module.exports = {
    playVideoWithFFMPEG
}