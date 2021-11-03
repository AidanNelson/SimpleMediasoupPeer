import * as mediasoupClient from "mediasoup-client";

/*
for broadcaster,
will need to be able to set a peer as a sender or receiver
will need bidirectional data channels

other idea:
re-broadcaster - idea of managing a video switch on client or server side

add to github and share with shawn

*/

export class SimpleMediasoupPeer {
    constructor(socket) {
        console.log("Setting up new MediasoupPeer");
        this.device = null;
        this.socket = socket;

        this.initialize();
    }

    async initialize() {
        this.setupMediasoupDevice();
        await this.connectToMediasoupRouter();
        await this.createSendTransport();
        await this.createRecvTransport();
    }

    async produce(stream) {
        let track = stream.getVideoTracks()[0];
        // console.log(videoTrack);
     

        // this.producer = await this.sendTransport.produce({
        //     track,
        //         encodings:
        //             [
        //                 { maxBitrate: 100000 },
        //                 { maxBitrate: 300000 },
        //                 { maxBitrate: 900000 }
        //             ],
        //         codecOptions:
        //         {
        //             videoGoogleStartBitrate: 1000
        //         }
        //     });

            this.dataProducer = await this.sendTransport.produceData(
				{
					ordered        : false,
					maxRetransmits : 1,
					label          : 'chat',
					priority       : 'medium',
					appData        : { }
				});
                this.dataProducer.send('hello');

    }

    setupMediasoupDevice() {
        try {
            this.device = new mediasoupClient.Device();
        } catch (err) {
            console.error(err);
        }
    }

    async connectToMediasoupRouter() {
        const routerRtpCapabilities = await this.socket.request('mediasoupSignaling', { 'type': 'getRouterRtpCapabilities' });
        await this.device.load({ routerRtpCapabilities });
    }



    async createSendTransport() {
        const sendTransportInfo = await this.socket.request('mediasoupSignaling', {
            type: 'createWebRtcTransport',
            data: {
                forceTcp: false,
                producing: true,
                consuming: false,
                sctpCapabilities: this.device.sctpCapabilities
            }
        })

        const {
            id,
            iceParameters,
            iceCandidates,
            dtlsParameters,
            sctpParameters
        } = sendTransportInfo;

        this.sendTransport = this.device.createSendTransport({
            id,
            iceParameters,
            iceCandidates,
            dtlsParameters,
            sctpParameters,
            iceServers: []
        });

        this.sendTransport.on(
            'connect', ({ dtlsParameters }, callback, errback) => // eslint-disable-line no-shadow
        {
            console.log('Connecting Send Transport');
            this.socket.request('mediasoupSignaling',{
                type: 'connectWebRtcTransport',
                data: {
                    transportId: this.sendTransport.id,
                    dtlsParameters
                }
            })
                .then(callback)
                .catch(errback);
        });

        this.sendTransport.on(
            'produce', async ({ kind, rtpParameters, appData }, callback, errback) => {
                try {
                    // eslint-disable-next-line no-shadow
                    const { id } = await this.socket.request('mediasoupSignaling',{
                        type: 'produce',
                        data: {
                            transportId: this.sendTransport.id,
                            kind,
                            rtpParameters,
                            appData
                        }});

                    callback({ id });
                }
                catch (error) {
                    errback(error);
                }
            });

        this.sendTransport.on('producedata', async (
            {
                sctpStreamParameters,
                label,
                protocol,
                appData
            },
            callback,
            errback
        ) => {

            try {
                // eslint-disable-next-line no-shadow
                const { id } = await this.socket.request('mediasoupSignaling',{
                    type: 'produceData',
                    data: {
                        transportId: this.sendTransport.id,
                        sctpStreamParameters,
                        label,
                        protocol,
                        appData
                    }});

                callback({ id });
            }
            catch (error) {
                errback(error);
            }
        });

        console.log("Created send transport!");
    }

    async createRecvTransport() {
        const recvTransportInfo = await this.socket.request('mediasoupSignaling', {
            type: 'createWebRtcTransport',
            data: {
                forceTcp: false,
                producing: false,
                consuming: true,
                sctpCapabilities: this.device.sctpCapabilities
            }
        });


        const {
            id,
            iceParameters,
            iceCandidates,
            dtlsParameters,
            sctpParameters
        } = recvTransportInfo;

        this.recvTransport = this.device.createRecvTransport(
            {
                id,
                iceParameters,
                iceCandidates,
                dtlsParameters,
                sctpParameters,
                iceServers: [],
            });

        this.recvTransport.on(
            'connect', ({ dtlsParameters }, callback, errback) => // eslint-disable-line no-shadow
        {
            this.socket.request(
                'connectWebRtcTransport',
                {
                    transportId: this.recvTransport.id,
                    dtlsParameters
                })
                .then(callback)
                .catch(errback);
        });

        console.log("Created receive transport!");
    }

}