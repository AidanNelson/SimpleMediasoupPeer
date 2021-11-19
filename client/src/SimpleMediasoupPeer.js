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

        this.producers = {};
        this.consumers = {};

        this.initialize();
    }

    async initialize() {
        this.setupMediasoupDevice();
        await this.connectToMediasoupRouter();
        await this.createSendTransport();
        await this.createRecvTransport();
        // this.setupDataProducer();
    }
    async addTrack(track, label) {

        if (track.kind === 'video') {
            console.log("Adding track:", track);
            this.producers[label] = await this.sendTransport.produce({
                track: track,
                encodings:
                    [
                        // { maxBitrate: 100000 },
                        // { maxBitrate: 300000 },
                        { maxBitrate: 900000 }
                    ],
                codecOptions:
                {
                    videoGoogleStartBitrate: 1000
                },
                appData: {
                    label
                }
            });
            console.log("done adding track:", track);
        } else if (track.kind === 'audio') {
            console.log("Adding track:", track);
            this.producers[label] = await this.sendTransport.produce({
                track: track,
                codecOptions:
                {
                    opusStereo: 1,
                    opusDtx: 1
                },
                appData: {
                    label
                }
            });
        }
        console.log(this.producers);
    }

    async addStream(stream) {
        let videoTracks = stream.getVideoTracks();
        let audioTracks = stream.getAudioTracks();

        for (let i in videoTracks) {
            console.log(videoTracks[i]);
            this.producer = await this.sendTransport.produce({
                track: videoTracks[i],
                encodings:
                    [
                        // { maxBitrate: 100000 },
                        // { maxBitrate: 300000 },
                        { maxBitrate: 900000 }
                    ],
                codecOptions:
                {
                    videoGoogleStartBitrate: 1000
                }
            });
        }
        for (let i in audioTracks) {
            console.log(audioTracks[i]);
            this.producer = await this.sendTransport.produce({
                track: audioTracks[i],
                codecOptions:
                {
                    opusStereo: 1,
                    opusDtx: 1
                }
            });
        }
    }

    pauseResumeAudio() { }
    pauseResumeVideo() { }

    async setupDataProducer() {
        this.dataProducer = await this.sendTransport.produceData(
            {
                ordered: false,
                maxRetransmits: 1,
                label: 'chat',
                priority: 'medium',
                appData: {}
            });
    };
    // https://stackoverflow.com/questions/35857576/webrtc-pause-and-resume-stream

    async connectToPeer(otherPeerId) {
        let consumersInfo = await this.socket.request('mediasoupSignaling', {
            'type': 'connectToPeer', data: {
                otherPeerId: otherPeerId
            }
        });

        console.log("Got consumersInfo:", consumersInfo);

        let tracks = [];

        for (let consumerInfo of consumersInfo) {
            const {
                peerId,
                producerId,
                id,
                kind,
                rtpParameters,
                type,
                appData,
                producerPaused
            } = consumerInfo;

            console.log('Creating consumer!');

            const consumer = await this.recvTransport.consume(
                {
                    id,
                    producerId,
                    kind,
                    rtpParameters,
                    appData: { ...appData, peerId } // Trick.
                });

            console.log("Consumer:", consumer);

            // Store in the map.
            this.consumers[consumer.id] = consumer;

            consumer.on('transportclose', () => {
                delete this.consumers[consumer.id];
            });

            await this.socket.request('mediasoupSignaling', {
                'type': 'resumeConsumer', data: {
                    consumerId: consumer.id
                }
            })

            tracks.push(consumer.track);
            // this.showStream(consumer);

        }

        return tracks;
    }

    async pauseConsumer(consumer) {
        if (consumer) {
            console.log('pause consumer', consumer.appData.peerId, consumer.appData.label);
            try {
                // await this.socket.request('pause-consumer', { consumerId: consumer.id });
                await consumer.pause();
            } catch (e) {
                console.error(e);
            }
        }
    }

    getConsumersForPeer(id){
        let consumers = [];
        for (const consumerId in this.consumers){
            const consumer = this.consumers[consumerId];
            if (consumer.appData.peerId === id){
                consumers.push(consumer);
            }
        }
        return consumers;
    }

    pausePeer(id){
        let consumers = this.getConsumersForPeer(id);
        consumers.forEach(async (consumer) => {
            if (!consumer.paused){
                await this.pauseConsumer(consumer);
            }
        })
    }

    showStream(consumer) {
        console.log('Creating video element for consumer');
        const stream = new MediaStream([consumer.track]);
        const video = document.createElement('video');
        video.srcObject = stream;
        document.body.appendChild(video);
        video.onloadedmetadata = function (e) {
            video.play();
        };
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
        console.log("Router loaded!");
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
            this.socket.request('mediasoupSignaling', {
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
                    console.log('starting to produce');
                    // eslint-disable-next-line no-shadow
                    const { id } = await this.socket.request('mediasoupSignaling', {
                        type: 'produce',
                        data: {
                            transportId: this.sendTransport.id,
                            kind,
                            rtpParameters,
                            appData
                        }
                    });

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
                const { id } = await this.socket.request('mediasoupSignaling', {
                    type: 'produceData',
                    data: {
                        transportId: this.sendTransport.id,
                        sctpStreamParameters,
                        label,
                        protocol,
                        appData
                    }
                });

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
            console.log('Connecting Receive Transport!');
            this.socket.request('mediasoupSignaling', {
                type: 'connectWebRtcTransport',
                data: {
                    transportId: this.recvTransport.id,
                    dtlsParameters
                }
            })
                .then(callback)
                .catch(errback);
        });

        console.log("Created receive transport!");
    }

}