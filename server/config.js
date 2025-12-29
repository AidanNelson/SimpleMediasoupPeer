const os = require("os");
const path = require("path");
const fs = require("fs");
const selfsigned = require("selfsigned");
var ip = require("ip");
const LOCAL_IP_ADDRESS = ip.address();
console.log("Local IP Address: ", LOCAL_IP_ADDRESS);

// DTLS certificate paths
const DTLS_CERT_PATH = path.join(process.cwd(), "dtls-cert.pem");
const DTLS_KEY_PATH = path.join(process.cwd(), "dtls-key.pem");

// Generate DTLS certificates if they don't exist
function ensureDtlsCertificates() {
  if (!fs.existsSync(DTLS_CERT_PATH) || !fs.existsSync(DTLS_KEY_PATH)) {
    console.log("Generating DTLS certificates...");
    const pems = selfsigned.generate(
      [{ name: "commonName", value: "mediasoup" }],
      { days: 365 * 10, keySize: 2048 }
    );
    fs.writeFileSync(DTLS_CERT_PATH, pems.cert);
    fs.writeFileSync(DTLS_KEY_PATH, pems.private);
    console.log("DTLS certificates generated.");
  }
}

ensureDtlsCertificates();

const config = {
  mediasoup: {
    // Number of mediasoup workers to launch.
    numWorkers: Object.keys(os.cpus()).length,
    // mediasoup WorkerSettings.
    // See https://mediasoup.org/documentation/v3/mediasoup/api/#WorkerSettings
    workerSettings: {
      logLevel: "warn",
      logTags: [
        "info",
        "ice",
        "dtls",
        "rtp",
        "srtp",
        "rtcp",
        "rtx",
        "bwe",
        "score",
        "simulcast",
        "svc",
        "sctp",
      ],
      rtcMinPort: 40000,
      rtcMaxPort: 49999,
      // Use shared DTLS certificate for all workers (important for Firefox compatibility)
      dtlsCertificateFile: DTLS_CERT_PATH,
      dtlsPrivateKeyFile: DTLS_KEY_PATH,
    },
    // mediasoup Router options.
    // See https://mediasoup.org/documentation/v3/mediasoup/api/#RouterOptions
    routerOptions: {
      mediaCodecs: [
        {
          kind: "audio",
          mimeType: "audio/opus",
          clockRate: 48000,
          channels: 2,
        },
        {
          kind: "video",
          mimeType: "video/VP8",
          clockRate: 90000,
          parameters: {
            "x-google-start-bitrate": 1000,
          },
        },
        {
          kind: "video",
          mimeType: "video/VP9",
          clockRate: 90000,
          parameters: {
            "profile-id": 2,
            "x-google-start-bitrate": 1000,
          },
        },
        {
          kind: "video",
          mimeType: "video/h264",
          clockRate: 90000,
          parameters: {
            "packetization-mode": 1,
            "profile-level-id": "4d0032",
            "level-asymmetry-allowed": 1,
            "x-google-start-bitrate": 1000,
          },
        },
        {
          kind: "video",
          mimeType: "video/h264",
          clockRate: 90000,
          parameters: {
            "packetization-mode": 1,
            "profile-level-id": "42e01f",
            "level-asymmetry-allowed": 1,
            "x-google-start-bitrate": 1000,
          },
        },
      ],
    },
    // mediasoup WebRtcTransport options for WebRTC endpoints (mediasoup-client,
    // libmediasoupclient).
    // See https://mediasoup.org/documentation/v3/mediasoup/api/#WebRtcTransportOptions
    webRtcTransportOptions: {

      listenInfos: [
        {
					protocol         : 'udp',
					ip               : process.env.LISTEN_IP || LOCAL_IP_ADDRESS || '0.0.0.0',
					...(process.env.ANNOUNCED_IP ? { announcedAddress : process.env.ANNOUNCED_IP } : {}),
					portRange        :
					{
						min : process.env.MIN_PORT || 40000,
						max : process.env.MAX_PORT || 49999,
					}
				},
				{
					protocol         : 'tcp',
					ip               : process.env.LISTEN_IP || LOCAL_IP_ADDRESS || '0.0.0.0',  
					...(process.env.ANNOUNCED_IP ? { announcedAddress : process.env.ANNOUNCED_IP } : {}),
					portRange        :
					{
						min : process.env.MIN_PORT || 40000,
						max : process.env.MAX_PORT || 49999,
					}
				}
      ],
      initialAvailableOutgoingBitrate: 1000000,
      minimumAvailableOutgoingBitrate: 600000,
      maxSctpMessageSize: 262144,
      // Additional options that are not part of WebRtcTransportOptions.
      maxIncomingBitrate: 1500000,
    },
    // mediasoup PlainTransport options for legacy RTP endpoints (FFmpeg,
    // GStreamer).
    // See https://mediasoup.org/documentation/v3/mediasoup/api/#PlainTransportOptions
    plainTransportOptions: {
      listenIp: {
        ip: process.env.LISTEN_IP || LOCAL_IP_ADDRESS || "1.2.3.4",
        announcedIp: process.env.ANNOUNCED_IP,
      },
      maxSctpMessageSize: 262144,
    },
  },
};

module.exports = config;
