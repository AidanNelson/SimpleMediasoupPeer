
const mediasoup = require('mediasoup')

const mediasoupWorkerSettings = {
    logLevel: 'debug',
    logTags: [
        'info',
        'ice',
        'dtls',
        'rtp',
        'srtp',
        'rtcp',
        'rtx',
        'bwe',
        'score',
        'simulcast',
        'svc'
    ],
    rtcMinPort: 40000,
    rtcMaxPort: 49999,
}

const mediaCodecs = [
    {
        kind: 'audio',
        mimeType: 'audio/opus',
        clockRate: 48000,
        channels: 2
    },
    {
        kind: 'video',
        mimeType: 'video/VP8',
        clockRate: 90000,
        parameters:
        {
            //                'x-google-start-bitrate': 1000
        }
    },
    {
        kind: 'video',
        mimeType: 'video/h264',
        clockRate: 90000,
        parameters:
        {
            'packetization-mode': 1,
            'profile-level-id': '4d0032',
            'level-asymmetry-allowed': 1,
            //						  'x-google-start-bitrate'  : 1000
        }
    },
    {
        kind: 'video',
        mimeType: 'video/h264',
        clockRate: 90000,
        parameters:
        {
            'packetization-mode': 1,
            'profile-level-id': '42e01f',
            'level-asymmetry-allowed': 1,
            //						  'x-google-start-bitrate'  : 1000
        }
    }
];

class MediasoupManager {
    constructor() {
        this.initialize();
    }

    async initialize() {
        this.router = await this.startMediasoupWorker();
        console.log(this.router);
    }

    async startMediasoupWorker() {
        let worker = await mediasoup.createWorker(mediasoupWorkerSettings)
        worker.on('died', () => {
            console.error('mediasoup worker died (this should never happen)')
            process.exit(1)
        })
        const router = await worker.createRouter({ mediaCodecs });
        return router;
    }

    async handleSocketRequest(socketId, data, callback){
        console.log("Mediasoup signaling request received from ", socketId);

        switch (data.type)
        {
            case "getRouterRtpCapabilities":
                {
                    callback(this.router.rtpCapabilities);
                }
        }
    }
    
}

module.exports = MediasoupManager;