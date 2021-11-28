const os = require('os')
const mediasoup = require('mediasoup')
require('dotenv').config({ path: process.cwd() + '/.env' })
const config = require('./mediasoupConfig');


/*
Class Information:
workers
routers
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

        io.on('connection', (socket) => {
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
        for (const transportId in this.peers[id].transports){
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

            // case "createConsumer":
            //     {
            //         console.log("Connecting peer to other peer!");
            //         let consumers = await this.getOrCreateConsumerForPeer(id, request.data.otherPeerId);
            //         callback(consumers);
            //         break;
            //     }

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
                    console.log('consumerID: ', consumer.id);
                    console.log('producerID:', consumer.producerId);
                    await consumer.resume();
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

    // getProducers(producingPeerId) {
    //     console.log('Getting producers for peer with id: ', producingPeerId);
    //     return this.peers[producingPeerId].producers;
    // }

    getProducerIds(producingPeerId) {
        let producerIds = Object.keys(this.peers[producingPeerId].producers);
        return producerIds;
    }

    getConsumer(peerId, producerId) {
        return this.peers[peerId].consumers[producerId];
    }

    getAvailableProducers(consumingPeerId, producingPeerId) {
        const consumingPeerRouterIndex = this.peers[consumingPeerId].routerIndex;
        const producingPeerRouterIndex = this.peers[producingPeerId].routerIndex;

        let producers = [];
        if (consumingPeerRouterIndex === producingPeerRouterIndex) {

        }

    }

    // async getAvailableProducers(consumingPeerId, producingPeerId) {
    //     const consumingPeerRouterIndex = this.peers[consumingPeerId].routerIndex;
    //     const producingPeerRouterIndex = this.peers[producingPeerId].routerIndex;

    //     let producers = [];
    //     if (consumingPeerRouterIndex === producingPeerRouterIndex){

    //     }

    // }

    // async getOrCreateConsumerForPeer(id, producingPeerId, producerId) {
    //     let producer = this.peers[producingPeerId].producers[]
    //     let producers = this.getProducers(producingPeerId);
    //     // console.log(producers);
    //     let consumers = [];
    //     for (let producerId in producers) {
    //         let existingConsumer = this.peers[id].consumers[producerId];
    //         if (existingConsumer) {
    //             console.log('already consuming!');
    //             consumers.push(existingConsumer);
    //         } else {
    //             let newConsumer = await this.createConsumer(id, producingPeerId, producers[producerId]);
    //             consumers.push(newConsumer);
    //         }
    //     }
    //     return consumers;
    // }

    async getOrCreateConsumersForPeer(consumindPeerId, producingPeerId) {
        let producerIds = this.getProducerIds(producingPeerId);

        console.log(producerIds);

        let consumers = [];
        for (const producerId of producerIds) {
            let existingConsumer = this.peers[consumindPeerId].consumers[producerId];

            if (existingConsumer) {
                console.log('Already consuming!');
                consumers.push(existingConsumer);
            } else {
                console.log('Creating new consumer!');
                // first check whether the producer or one of its pipe producers exists
                // on the consuming peer's router:
                let consumingPeerRouterIndex = this.peers[consumindPeerId].routerIndex;
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

                    console.log(this.peers[producingPeerId].producers[producerId]);

                    producerOrPipeProducer = pipeProducer;
                }

                let newConsumer = await this.createConsumer(consumindPeerId, producingPeerId, producerOrPipeProducer);

                // add new consumer to the consuming peer's consumers object:
                this.peers[consumindPeerId].consumers[producerId] = newConsumer;
                consumers.push(newConsumer);
            }
        }

        console.log(consumers);
        return consumers;
    }

    async createConsumer(consumingPeerId, producingPeerId, producer) {
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
            // Remove from its map.
            this.peers[consumingPeerId].consumers.delete(producer.id);
            this.peers[consumingPeerId].socket.emit('mediasoupSignaling', {
                type: 'consumerClosed',
                producingPeerId: producer.appData.peerId,
                producerId: producer.id
            })

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



    async createProducer(id, data) {
        const { transportId, kind, rtpParameters } = data;
        let { appData } = data;
        appData = { ...appData, peerId: id };
        console.log(appData);


        const transport = this.getTransportForPeer(id, transportId);

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
        this.peers[id].producers[producer.id] = {}
        this.peers[id].producers[producer.id][this.peers[id].routerIndex] = producer;

        console.log(`Peer is on router # ${this.peers[id].routerIndex}`)
        console.log(this.peers[id].producers[producer.id]);
        return producer;
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