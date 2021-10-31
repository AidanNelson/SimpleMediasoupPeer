import * as mediasoupClient from "mediasoup-client";

/*
for broadcaster,
will need to be able to set a peer as a sender or receiver
will need bidirectional data channels

other idea:
re-broadcaster - idea of managing a video switch on client or server side

add to github and share with shawn

*/

export class MediasoupPeer {
    constructor(socket){
        console.log("Setting up new MediasoupPeer");
        this.device = null;
        this.socket = socket;


        this.setupMediasoupDevice();

        this.connectToMediasoupRouter();

    }

    setupMediasoupDevice(){
        try {
            this.device = new mediasoupClient.Device();
            console.log(this.device);
        } catch(err){
            console.error(err);
        }
    }

    async connectToMediasoupRouter(){
        const routerRtpCapabilities  = await this.socket.request('mediasoupSignaling', {'type': 'getRouterRtpCapabilities'});
        await this.device.load({routerRtpCapabilities});
        console.log(this.device);
    }

    async createWebRTCTransports() {
        const transportInfo = await this.socket.request('mediasoupSignaling', {type: 'createWebRtcTransport', data: {
            forceTcp: false,
            producing: true,
            consuming: false,
            sctpCapabilities : true
        }})

        const {
            id,
            iceParameters,
            iceCandidates,
            dtlsParameters,
            sctpParameters
        } = transportInfo;

        this.sendTransport = this.device.createSendTransport({
            id,
            iceParameters,
            iceCandidates,
            dtlsParameters,
            sctpParameters,
            iceServers             : [],
            proprietaryConstraints : PC_PROPRIETARY_CONSTRAINTS,
            additionalSettings 	   :
                { encodedInsertableStreams: this._e2eKey && e2e.isSupported() }
        });
    }

}