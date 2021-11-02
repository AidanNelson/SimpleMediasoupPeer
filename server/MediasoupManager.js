const os = require('os')
const mediasoup = require('mediasoup')
require('dotenv').config({ path: process.cwd() + '/server/.env' })
const config = require('./mediasoupConfig');


class MediasoupManager {
    constructor() {
        this.peers = {};
        this.initialize();

        setInterval(() => {
            console.log(this.peers);
        }, 10000);
    }

    async initialize() {
        this.workers = [];
        this.routers = [];
      
        for (let i = 0; i < 2; i++) {
            let { worker, router } = await this.startMediasoupWorker();
            this.workers[i] = worker;
            this.routers[i] = router;
        }

        console.log(this.routers);
    }

    getNewPeerRouterIndex(){
        return Math.floor(Math.random()*this.routers.length);
    }

    addPeer(id) {
        this.peers[id] = {
            routerIndex: this.getNewPeerRouterIndex(),
            transports: [],
            producers: [],
            consumers: []
        };
    }
    removePeer(id) {
        delete this.peers[id];
    }

    async startMediasoupWorker() {
        let worker = await mediasoup.createWorker(config.mediasoup.workerSettings)
        worker.on('died', () => {
            console.error('mediasoup worker died (this should never happen)')
            process.exit(1)
        })
        const router = await worker.createRouter(config.mediasoup.routerOptions.mediaCodecs);
        return { worker, router };
    }

    async handleSocketRequest(id, request, callback) {
        if (!this.peers[id]) this.addPeer(id);

        switch (request.type) {
            case "getRouterRtpCapabilities":
                {
                    callback(this.routers[this.peers[id].routerIndex].rtpCapabilities);
                }
            
            case "createWebRtcTransport":
                {
                    const callbackData = await this.createTransportForPeer(id, request.data);
                    // console.log(callbackData);
                    callback(callbackData);
                }
        }
    }

    getRouterForPeer(id){
        return this.routers[this.peers[id].routerIndex];
    }

    async createTransportForPeer(id, data){


        const webRtcTransportOptions =
        {
            ...config.mediasoup.webRtcTransportOptions
        };


        console.log('Attempting to make webrtc transport with these options:', webRtcTransportOptions);
        console.log('Router: ', this.getRouterForPeer(id).createWebRtcTransport);
        try {
        const transport = await this.getRouterForPeer(id).createWebRtcTransport(webRtcTransportOptions);

            this.peers[id].transports.push(transport);

        return ({
            id             : transport.id,
            iceParameters  : transport.iceParameters,
            iceCandidates  : transport.iceCandidates,
            dtlsParameters : transport.dtlsParameters,
            sctpParameters : transport.sctpParameters
        });

        } catch(err){
            console.log(err);
        }
        
    }

}

module.exports = MediasoupManager;