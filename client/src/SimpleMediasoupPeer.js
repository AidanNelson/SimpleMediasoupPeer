import * as mediasoupClient from "mediasoup-client";

/*
for broadcaster,
will need to be able to set a peer as a sender or receiver
will need bidirectional data channels

other idea:
re-broadcaster - idea of managing a video switch on client or server side

add to github and share with shawn

this.producers = {
    producerId1: producerObj,
    producerId2: producerObj
}
this.peers = {
    peerId1: {
        producerId1: consumerObj,
        producerId2: consumerObj
    }
}
this.latestAvailableProducers = {
    peerId1: {
        producerId1: 'camera',
        producerId2: 'microphone'
    }
}
TODO this should allow client to choose specific tracks
this.desiredPeerConnections = new Set(peerId1, peerId2, peerId3);

}



*/

export class SimpleMediasoupPeer {
    constructor(socket) {
        console.log("Setting up new MediasoupPeer");

        this.device = null;
        this.socket = socket;
        this.socket.on('mediasoupSignaling', (data) => {
            this.handleSocketMessage(data);
        });

        this.producers = {};
        this.peers = {};

        this.latestAvailableProducers = {};
        this.desiredPeerConnections = new Set();

        this.initialize();
    }

    async initialize() {
        console.log('initialize');
        this.setupMediasoupDevice();
        await this.connectToMediasoupRouter();
        await this.createSendTransport();
        await this.createRecvTransport();
        // this.setupDataProducer();
    }


    async addTrack(track, label) {

        let producer;

        if (track.kind === 'video') {
            producer = await this.sendTransport.produce({
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
        } else if (track.kind === 'audio') {
            producer = await this.sendTransport.produce({
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


        producer.on('transportclose', () => {
            console.log('transport closed');
            producer = null;
        });

        producer.on('trackended', async () => {
            console.log('track ended');
            try {
                await this.socket.request('mediasoupSignaling', {
                    'type': 'closeProducer', data: {
                        producerId: producer.id
                    }
                });
            } catch (err) {
                console.error(err);
            }

            producer = null;
        });

        this.producers[label] = producer;

    }

    ensureConnectedToDesiredPeerConnections() {
        console.log('ensure connections');
        console.log('latest available producers:',this.latestAvailableProducers);
        console.log('desired connections:', this.desiredPeerConnections);
        for (const peerId in this.latestAvailableProducers) {
            console.log(this.desiredPeerConnections.has(peerId))
            if (this.desiredPeerConnections.has(peerId)) {
                for (const producerId in this.latestAvailableProducers[peerId]) {
                    const consumer = this.peers[peerId] && this.peers[peerId][producerId];
                    console.log('existing consumer:',consumer);
                    if (!consumer) {
                        this.createConsumer(peerId, producerId);
                    }
                }
            }
        }

    }

    async createConsumer(producingPeerId, producerId) {
        // have we seen and added this peer already?
        if (!this.peers[producingPeerId]) {
            this.addPeer(producingPeerId);
        }

        let consumerInfo = await this.socket.request('mediasoupSignaling', {
            'type': 'createConsumer', data: {
                producingPeerId,
                producerId
            }
        });

        console.log("Got consumersInfo:", consumerInfo);

        let tracks = [];

        const {
            peerId,
            // producerId,
            id,
            kind,
            rtpParameters,
            type,
            appData,
            producerPaused
        } = consumerInfo;


        let consumer = this.peers[peerId][producerId];

        if (!consumer) {

            console.log(`Creating consumer with ID ${id} for producer with ID ${producerId}`);

            consumer = await this.recvTransport.consume(
                {
                    id,
                    producerId,
                    kind,
                    rtpParameters,
                    appData: { ...appData, peerId }
                });

            console.log("Created consumer:", consumer);

            this.peers[peerId][producerId] = consumer;

            consumer.on('transportclose', () => {
                delete this.peers[consumer.id];
            });

            // tell the server to start the newly created consumer
            await this.socket.request('mediasoupSignaling', {
                'type': 'resumeConsumer', data: {
                    producerId: consumer.producerId
                }
            });
        }

    }




    async handleSocketMessage(request) {
        switch (request.type) {

            case "availableProducers":
                {
                    console.log('tick');
                    this.latestAvailableProducers = request.data;
                    this.ensureConnectedToDesiredPeerConnections();
                    break;
                }

            case "consumerClosed":
                {
                    console.log("Server-side consumerClosed, closing client side consumer.");
                    console.log(request.data);
                    const { producingPeerId, producerId } = request.data;

                    this.peers[producingPeerId][producerId].close();
                    delete this.peers[producingPeerId][producerId];

                    break;
                }

        }
    }

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

    addPeer(otherPeerId) {
        this.peers[otherPeerId] = {};
    }

    async removePeer(otherPeerId) {
        for (let label in this.peers[otherPeerId]) {
            let c = this.peers[otherPeerId][label];
            c.close();
        }
        delete this.peers[otherPeerId];
    }

    connectToPeer(id) {
        this.desiredPeerConnections.add(id);
    }

    disconnectFromPeer(id) {
        // close and remove all consumers

        this.desiredPeerConnections.delete(id);
    }

    // async connectToPeer(otherPeerId) {
    //     // have we seen and added this peer already?
    //     if (!this.peers[otherPeerId]) {
    //         this.addPeer(otherPeerId);
    //     }

    //     let consumersInfo = await this.socket.request('mediasoupSignaling', {
    //         'type': 'getOrCreateConsumersForPeer', data: {
    //             otherPeerId: otherPeerId
    //         }
    //     });

    //     console.log("Got consumersInfo:", consumersInfo);

    //     let tracks = [];

    //     for (let consumerInfo of consumersInfo) {
    //         const {
    //             peerId,
    //             producerId,
    //             id,
    //             kind,
    //             rtpParameters,
    //             type,
    //             appData,
    //             producerPaused
    //         } = consumerInfo;


    //         let consumer = this.peers[peerId][producerId];

    //         if (!consumer) {

    //             console.log(`Creating consumer with ID ${id} for producer with ID ${producerId}`);

    //             consumer = await this.recvTransport.consume(
    //                 {
    //                     id,
    //                     producerId,
    //                     kind,
    //                     rtpParameters,
    //                     appData: { ...appData, peerId }
    //                 });

    //             console.log("Created consumer:", consumer);

    //             this.peers[peerId][producerId] = consumer;

    //             consumer.on('transportclose', () => {
    //                 delete this.peers[consumer.id];
    //             });

    //             // tell the server to start the newly created consumer
    //             await this.socket.request('mediasoupSignaling', {
    //                 'type': 'resumeConsumer', data: {
    //                     producerId: consumer.producerId
    //                 }
    //             });
    //         }

    //         // await this.resumeConsumer(consumer);
    //         tracks.push(consumer.track);
    //     }

    //     return tracks;

    //     // this.connectToPeerConsumers(otherPeerId);



    //     // // get existing consumers for this peer
    //     // const existingConsumers = this.peers[otherPeerId];

    //     // // get an updated list of available producers from this peer from the server
    //     // const availableProducerIds = await this.socket.request('mediasoupSignaling', {
    //     //     'type': 'getAvailableProducerIds', data: {
    //     //         producingPeerId: otherPeerId
    //     //     }
    //     // });

    //     // // check the list of available producers against the list of current consumers
    //     // // create new consumers or ensure the current ones are playing accordingly
    //     // for (const id of availableProducerIds) {
    //     //     if (!(id in existingConsumers)) {
    //     //         this.createAndStartConsumer();
    //     //     } else {
    //     //         this.resumeConsumer(existingConsumers[id].id);
    //     //     }
    //     // }


    // }


    async pausePeer(producingPeerId) {
        const consumers = this.peers[producingPeerId];

        for (const consumerId in consumers) {
            const consumer = consumers[consumerId];
            if (!consumer.paused) {
                console.log('Pausing consumer!');

                await this.socket.request('mediasoupSignaling', {
                    'type': 'pauseConsumer', data: {
                        producerId: consumer.producerId
                    }
                });
                consumer.pause();
            } else {
                console.log('Consumer already paused!');
            }
        }
    }

    async resumePeer(producingPeerId) {
        const consumers = this.peers[producingPeerId];

        for (const consumerId in consumers) {
            const consumer = consumers[consumerId];
            if (consumer.paused) {
                console.log('Resuming consumer!');
                await this.socket.request('mediasoupSignaling', {
                    'type': 'resumeConsumer', data: {
                        producerId: consumer.producerId
                    }
                });
                consumer.resume();
            } else {
                console.log('Consumer already playing!');
            }
        }
    }



    async startConsumer() {
        console.log('Start consumer');
    }

    async pauseConsumer(consumer) {
        if (consumer) {
            console.log('pause consumer', consumer.appData.peerId, consumer.appData.label);
            try {
                await this.socket.request('pauseConsumer', { consumerId: consumer.id });
                await consumer.pause();
            } catch (e) {
                console.error(e);
            }
        }
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