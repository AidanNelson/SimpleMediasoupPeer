const os = require('os')
const mediasoup = require('mediasoup')
require('dotenv').config({ path: process.cwd() + '/.env' })
const config = require('./mediasoupConfig');


/*
Class Information:
this.workers = [];
this.routers = [];
this.peers = {
    peerId1: {
        routerIndex: number,
        transports: {
            transportId1: transportObj,
            transportId2: transportObj
        },
        producers: {
             producerId1: {
                routerIndex0: producerObj,
                routerIndex1: producerObj,
                routerIndex2: producerObj,
                routerIndex3: producerObj
            },
            producerId2: {
                routerIndex0: producerObj,
                routerIndex1: producerObj,
                routerIndex2: producerObj,
                routerIndex3: producerObj
            },
            producerId3: {
                routerIndex0: producerObj,
                routerIndex1: producerObj,
                routerIndex2: producerObj,
                routerIndex3: producerObj
            }
        },
        consumers: {
            producerId1: consumerObj,
            producerId2: consumerObj,
            producerId3: consumerObj
        }
    }
}








*/

class MediasoupManager {
    constructor(io) {

        this.io = io;
        this.io.on('connection', (socket) => {
            this.addPeer(socket);

            socket.on('disconnect', () => {
                this.removePeer(socket.id);
            })
            socket.on('mediasoupSignaling', (data, callback) => {
                this.handleSocketRequest(socket.id, data, callback);
            })
        });


        this.peers = {};
        this.initialize();

        // setInterval(() => {
        //     console.log(this.peers);
        // }, 10000);

        setInterval(() => {
            this.sendSyncData();
        }, 5000);
    }


    sendSyncData() {
        let producers = this.getSyncData();
        this.io.sockets.emit('mediasoupSignaling',
            {
                type: 'availableProducers',
                data: producers
            }
        );
    }


    async initialize() {
        this.workers = [];
        this.routers = [];

        for (let i = 0; i < 4; i++) {
            let { worker, router } = await this.startMediasoupWorker();
            this.workers[i] = worker;
            this.routers[i] = router;
        }

    }

    getNewPeerRouterIndex() {
        let index = Math.floor(Math.random() * this.routers.length);
        console.log(`Assigning peer to router # ${index}`);
        return index;
    }

    addPeer(socket) {
        this.peers[socket.id] = {
            socket: socket,
            routerIndex: this.getNewPeerRouterIndex(),
            transports: {},
            producers: {},
            consumers: {}
        };
    }
    removePeer(id) {
        for (const transportId in this.peers[id].transports) {
            console.log('Closing transport');
            this.peers[id].transports[transportId].close();
        }
        delete this.peers[id];
    }

    async startMediasoupWorker() {
        let worker = await mediasoup.createWorker(config.mediasoup.workerSettings)
        worker.on('died', () => {
            console.error('mediasoup worker died (this should never happen)')
            process.exit(1)
        })
        const router = await worker.createRouter({ mediaCodecs: config.mediasoup.routerOptions.mediaCodecs });
        return { worker, router };
    }

    async handleSocketRequest(id, request, callback) {
        switch (request.type) {
            case "getRouterRtpCapabilities":
                {
                    callback(this.routers[this.peers[id].routerIndex].rtpCapabilities);
                    break;
                }

            case "createWebRtcTransport":
                {
                    console.log('Creating WebRTC transport!');
                    const callbackData = await this.createTransportForPeer(id, request.data);
                    callback(callbackData);
                    break;
                }

            case "connectWebRtcTransport":
                {
                    console.log('Connecting WebRTC transport!');
                    const { transportId, dtlsParameters } = request.data;
                    const transport = this.peers[id].transports[transportId];

                    if (!transport)
                        throw new Error(`transport with id "${transportId}" not found`);

                    await transport.connect({ dtlsParameters });

                    callback();

                    break;
                }

            case "produce":
                {
                    console.log("Creating producer!");
                    const producer = await this.createProducer(id, request.data);
                    callback({ id: producer.id });
                    break;
                }

            case "produceData":
                {
                    console.log("produce data");
                    break;
                }

            // case "getAvailableProducerIds":
            //     {
            //         console.log(`Getting available producer Ids from peer ${request.data.producingPeerId} for peer ${id}!`);
            //         let availableProducers = await this.getProducers(request.data.producingPeerId);
            //         callback(Object.keys(availableProducers));
            //         break;
            //     }

            case "createConsumer":
                {
                    console.log("Connecting peer to other peer!");
                    let consumer = await this.createConsumerForPeer(id, request.data.producingPeerId, request.data.producerId)

                    if (consumer) {
                        const consumerInfo = {
                            peerId: request.data.producingPeerId,
                            producerId: consumer.producerId,
                            id: consumer.id,
                            kind: consumer.kind,
                            rtpParameters: consumer.rtpParameters,
                            type: consumer.type,
                            appData: consumer.appData,
                            producerPaused: consumer.producerPaused
                        };

                        this.peers[id].socket.emit('mediasoupSignaling', {
                            type: 'createConsumer',
                            data: consumerInfo,
                        })
                        // callback(consumerInfo);
                    }
                    // else {
                    // callback();
                    // }
                    break;
                }

            case "getOrCreateConsumersForPeer":
                {
                    console.log("Connecting peer to other peer!");
                    let consumers = await this.getOrCreateConsumersForPeer(id, request.data.otherPeerId);

                    let consumersInfo = [];
                    for (let consumer of consumers) {
                        const consumerInfo = {
                            peerId: request.data.otherPeerId,
                            producerId: consumer.producerId,
                            id: consumer.id,
                            kind: consumer.kind,
                            rtpParameters: consumer.rtpParameters,
                            type: consumer.type,
                            appData: consumer.appData,
                            producerPaused: consumer.producerPaused
                        };

                        consumersInfo.push(consumerInfo);
                    }
                    callback(consumersInfo);
                    break;
                }

            case "pauseConsumer":
                {
                    const consumer = this.getConsumer(id, request.data.producerId);
                    await consumer.pause();
                    callback({ paused: true })
                    break;
                }

            case "resumeConsumer":
                {
                    console.log("Resuming consumer!");

                    const consumer = this.getConsumer(id, request.data.producerId);
                    // console.log('consumerID: ', consumer.id);
                    // console.log('producerID:', consumer.producerId);
                    await consumer.resume();
                    callback();

                    break;
                }

            case "closeProducer":
                {
                    console.log("Closing producer!");
                    // console.log(this.peers[id].producers);

                    const { producerId } = request.data;
                    const producers = this.peers[id].producers[producerId];

                    for (const routerIndex in producers) {
                        const producer = producers[routerIndex];
                        producer.close();
                    }
                    delete this.peers[id].producers[producerId];
                    // this.peers[id].producers.delete(producerId);
                    // console.log(this.peers[id].producers);

                    callback();

                    break;
                }
        }
    }

    getTransportForPeer(id, transportId) {
        return this.peers[id].transports[transportId];
    }

    getRecvTransportForPeer(id) {
        let transports = this.peers[id].transports;
        for (let id in transports) {
            let t = transports[id];
            if (t.appData.consuming) return t;
        }
        return null;
    }

    getRouterForPeer(id) {
        return this.routers[this.peers[id].routerIndex];
    }

    getProducerIds(producingPeerId) {
        let producerIds = Object.keys(this.peers[producingPeerId].producers);
        return producerIds;
    }

    getConsumer(peerId, producerId) {
        return this.peers[peerId].consumers[producerId];
    }

    /*
    Returns an object structured as follows:
    {
        peerId1: {},
        peerId2: {
            'producerId12345': 'camera'
            'producerId88888': 'microphone'
        }
    }
    
    */
    getSyncData() {
        let peers = {};
        for (const peerId in this.peers) {
            peers[peerId] = {};
            for (const producerId in this.peers[peerId].producers) {
                let peerRouterIndex = this.peers[peerId].routerIndex;
                let label = this.peers[peerId].producers[producerId][peerRouterIndex].appData.label;
                peers[peerId][producerId] = label;
            }
        }
        return peers;

    }

    /*
    Given a consumingPeerId, a producingPeerId and a producerId, this function will 
    automatically get or create a pipe producer if needed, then call this.createConsumer to 
    create the corresponding consumer.

    */
    async createConsumerForPeer(consumingPeerId, producingPeerId, producerId) {

        let existingConsumer = this.peers[consumingPeerId].consumers[producerId];

        if (existingConsumer) {
            console.log('Already consuming!');
            return existingConsumer;
        }

        console.log('Creating new consumer!');

        // first check whether the producer or one of its pipe producers exists
        // on the consuming peer's router:
        let consumingPeerRouterIndex = this.peers[consumingPeerId].routerIndex;
        // console.log(this.peers[producingPeerId].producers);
        let producerOrPipeProducer = this.peers[producingPeerId].producers[producerId][consumingPeerRouterIndex];

        if (!producerOrPipeProducer) {
            // if it doesn't exist, create a new pipe producer
            let producingRouterIndex = this.peers[producingPeerId].routerIndex;
            console.log(`Creating pipe producer from router ${producingRouterIndex} to router ${consumingPeerRouterIndex}!`);
            let { pipeProducer } = await this.routers[producingRouterIndex].pipeToRouter({
                producerId: producerId,
                router: this.routers[consumingPeerRouterIndex],
            })

            // add the pipe producer to the producing peer's object of producers:
            this.peers[producingPeerId].producers[producerId][consumingPeerRouterIndex] = pipeProducer;

            // console.log(this.peers[producingPeerId].producers[producerId]);

            producerOrPipeProducer = pipeProducer;
        }

        let newConsumer = await this.createConsumer(consumingPeerId, producerOrPipeProducer);

        // add new consumer to the consuming peer's consumers object:
        this.peers[consumingPeerId].consumers[producerId] = newConsumer;

        return newConsumer;
    }

    // async getOrCreateConsumersForPeer(consumingPeerId, producingPeerId) {
    //     let producerIds = this.getProducerIds(producingPeerId);

    //     console.log(producerIds);

    //     let consumers = [];
    //     for (const producerId of producerIds) {
    //         let existingConsumer = this.peers[consumingPeerId].consumers[producerId];

    //         if (existingConsumer) {
    //             console.log('Already consuming!');
    //             consumers.push(existingConsumer);
    //         } else {
    //             console.log('Creating new consumer!');
    //             // first check whether the producer or one of its pipe producers exists
    //             // on the consuming peer's router:
    //             let consumingPeerRouterIndex = this.peers[consumingPeerId].routerIndex;
    //             let producerOrPipeProducer = this.peers[producingPeerId].producers[producerId][consumingPeerRouterIndex];

    //             if (!producerOrPipeProducer) {
    //                 // if it doesn't exist, create a new pipe producer
    //                 let producingRouterIndex = this.peers[producingPeerId].routerIndex;
    //                 console.log(`Creating pipe producer from router ${producingRouterIndex} to router ${consumingPeerRouterIndex}!`);
    //                 let { pipeProducer } = await this.routers[producingRouterIndex].pipeToRouter({
    //                     producerId: producerId,
    //                     router: this.routers[consumingPeerRouterIndex],
    //                 })

    //                 // add the pipe producer to the producing peer's object of producers:
    //                 this.peers[producingPeerId].producers[producerId][consumingPeerRouterIndex] = pipeProducer;

    //                 console.log(this.peers[producingPeerId].producers[producerId]);

    //                 producerOrPipeProducer = pipeProducer;
    //             }

    //             let newConsumer = await this.createConsumer(consumingPeerId, producerOrPipeProducer);

    //             // add new consumer to the consuming peer's consumers object:
    //             this.peers[consumingPeerId].consumers[producerId] = newConsumer;
    //             consumers.push(newConsumer);
    //         }
    //     }

    //     console.log(consumers);
    //     return consumers;
    // }

    async createConsumer(consumingPeerId, producer) {
        let consumer;
        try {
            let transport = this.getRecvTransportForPeer(consumingPeerId);

            consumer = await transport.consume({
                producerId: producer.id,
                rtpCapabilities: this.routers[this.peers[consumingPeerId].routerIndex].rtpCapabilities,
                paused: true,
                appData: producer.appData
            })
        } catch (err) {
            console.log(err);
        }

        console.log('consumer paused after creation? ', consumer.paused);
        console.log('consumerID: ', consumer.id);
        console.log('producerID:', consumer.producerId);

        this.peers[consumingPeerId].consumers[producer.id] = consumer;

        // Set Consumer events.
        consumer.on('transportclose', () => {
            // Remove from its map.
            this.peers[consumingPeerId].consumers.delete(producer.id);
        });

        consumer.on('producerclose', () => {
            console.log('Producer closed! Closing server-side consumer!');

            this.peers[consumingPeerId].socket.emit('mediasoupSignaling', {
                type: 'consumerClosed',
                data: {
                    producingPeerId: producer.appData.peerId,
                    producerId: producer.id
                }
            })

            delete this.peers[consumingPeerId].consumers[producer.id];

            // consumerPeer.notify('consumerClosed', { consumerId: consumer.id })
            // 	.catch(() => {});
        });

        // consumer.on('producerpause', () => {
        // consumerPeer.notify('consumerPaused', { consumerId: consumer.id })
        // 	.catch(() => {});
        // });

        // consumer.on('producerresume', () => {
        // consumerPeer.notify('consumerResumed', { consumerId: consumer.id })
        // 	.catch(() => {});
        // });

        return consumer;
    }



    async createProducer(producingPeerId, data) {
        const { transportId, kind, rtpParameters } = data;
        let { appData } = data;
        appData = { ...appData, peerId: producingPeerId };
        // console.log(appData);


        const transport = this.getTransportForPeer(producingPeerId, transportId);

        if (!transport)
            throw new Error(`transport with id "${transportId}" not found`);


        const producer = await transport.produce(
            {
                kind,
                rtpParameters,
                appData
                // keyFrameRequestDelay: 5000
            });

        // add producer to the peer object
        this.peers[producingPeerId].producers[producer.id] = {}
        this.peers[producingPeerId].producers[producer.id][this.peers[producingPeerId].routerIndex] = producer;

        if (appData.broadcast) {
            this.createBroadcast(producingPeerId, producer.id);

            // store the broadcaster value somewhere

            // on join (for every new peer), add a consumer for broadcaster
        }
        // console.log(`Peer is on router # ${this.peers[id].routerIndex}`)
        // console.log(this.peers[id].producers[producer.id]);
        return producer;
    }

    async createBroadcast(producingPeerId, producerId) {
        // automatically create consumers for every other peer to consume this producer

        for (const consumingPeerId in this.peers) {
            if (consumingPeerId !== producingPeerId) {
                const consumer = await this.createConsumerForPeer(consumingPeerId, producingPeerId,producerId)
                if (consumer) {
                    const consumerInfo = {
                        peerId: producingPeerId,
                        producerId: consumer.producerId,
                        id: consumer.id,
                        kind: consumer.kind,
                        rtpParameters: consumer.rtpParameters,
                        type: consumer.type,
                        appData: consumer.appData,
                        producerPaused: consumer.producerPaused
                    };

                    this.peers[consumingPeerId].socket.emit('mediasoupSignaling', {
                        type: 'createConsumer',
                        data: consumerInfo,
                    })
                };
            }
        }
    }


    async createTransportForPeer(id, data) {
        const {
            producing,
            consuming,
            sctpCapabilities
        } = data;



        const webRtcTransportOptions =
        {
            ...config.mediasoup.webRtcTransportOptions,
            enableSctp: true,
            numSctpStreams: sctpCapabilities.numStreams,
            appData: { producing, consuming }
        };


        try {
            const transport = await this.getRouterForPeer(id).createWebRtcTransport(webRtcTransportOptions);

            this.peers[id].transports[transport.id] = transport;

            return ({
                id: transport.id,
                iceParameters: transport.iceParameters,
                iceCandidates: transport.iceCandidates,
                dtlsParameters: transport.dtlsParameters,
                sctpParameters: transport.sctpParameters
            });

        } catch (err) {
            console.log(err);
        }

    }

}

module.exports = MediasoupManager;