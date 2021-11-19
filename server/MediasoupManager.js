const os = require('os')
const mediasoup = require('mediasoup')
require('dotenv').config({ path: process.cwd() + '/.env' })
const config = require('./mediasoupConfig');


class MediasoupManager {
    constructor() {
        this.peers = {};
        this.initialize();

        // setInterval(() => {
        //     console.log(this.peers);
        // }, 10000);
    }

    async initialize() {
        this.workers = [];
        this.routers = [];

        for (let i = 0; i < 1; i++) {
            let { worker, router } = await this.startMediasoupWorker();
            this.workers[i] = worker;
            this.routers[i] = router;
        }

    }

    getNewPeerRouterIndex() {
        return Math.floor(Math.random() * this.routers.length);
    }

    addPeer(id) {
        this.peers[id] = {
            routerIndex: this.getNewPeerRouterIndex(),
            transports: {},
            producers: {},
            consumers: {}
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
        const router = await worker.createRouter({ mediaCodecs: config.mediasoup.routerOptions.mediaCodecs });
        return { worker, router };
    }

    async handleSocketRequest(id, request, callback) {
        if (!this.peers[id]) this.addPeer(id);

        switch (request.type) {
            case "getRouterRtpCapabilities":
                {
                    callback(this.routers[this.peers[id].routerIndex].rtpCapabilities);
                    break;
                }

            case "createWebRtcTransport":
                {
                    console.log('webrtctransport');
                    const callbackData = await this.createTransportForPeer(id, request.data);
                    callback(callbackData);
                    break;
                }

            case "connectWebRtcTransport":
                {
                    console.log('Connecting transport!');

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

            case "connectToPeer":
                {
                    console.log("Connecting peer to other peer!");
                    let consumers = await this.connectToPeer(id, request.data.otherPeerId);
                    callback(consumers);
                    break;
                }

            case "pauseConsumer":
                {
                    const consumer = this.getConsumer(id, request.data.consumerId);
                    await consumer.pause();
                    callback({ paused: true })
                    break;
                }

            case "resumeConsumer":
                {
                    console.log("Resuming consumer!");
                    const consumer = this.getConsumer(id, request.data.consumerId);
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

    getProducersForPeer(id) {
        console.log('Getting producers for peer with id: ', id);
        return this.peers[id].producers;
    }

    getConsumer(peerId, consumerId) {
        return this.peers[peerId].consumers[consumerId];
    }


    async connectToPeer(id, producingPeerId) {
        let producers = this.getProducersForPeer(producingPeerId);
        // console.log(producers);
        let consumers = [];
        for (let producerId in producers) {
            let existingConsumer = this.peers[id].consumers[producerId];
            if (existingConsumer) {
                console.log('already consuming!');
            } else {
                let newConsumer = await this.createConsumer(id, producingPeerId, producers[producerId]);
                consumers.push(newConsumer);
            }
        }
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


        this.peers[consumingPeerId].consumers[consumer.id] = consumer;

        // Set Consumer events.
        // consumer.on('transportclose', () =>
        // {
        // 	// Remove from its map.
        // 	consumerPeer.data.consumers.delete(consumer.id);
        // });

        // consumer.on('producerclose', () =>
        // {
        // 	// Remove from its map.
        // 	consumerPeer.data.consumers.delete(consumer.id);

        // 	consumerPeer.notify('consumerClosed', { consumerId: consumer.id })
        // 		.catch(() => {});
        // });

        // consumer.on('producerpause', () =>
        // {
        // 	consumerPeer.notify('consumerPaused', { consumerId: consumer.id })
        // 		.catch(() => {});
        // });

        // consumer.on('producerresume', () =>
        // {
        // 	consumerPeer.notify('consumerResumed', { consumerId: consumer.id })
        // 		.catch(() => {});
        // });

        let newConsumerInfo = {
            peerId: producingPeerId,
            producerId: producer.id,
            id: consumer.id,
            kind: consumer.kind,
            rtpParameters: consumer.rtpParameters,
            type: consumer.type,
            appData: producer.appData,
            producerPaused: consumer.producerPaused
        };
        return newConsumerInfo;
    }



    async createProducer(id, data) {
        const { transportId, kind, rtpParameters, appData } = data;

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

        this.peers[id].producers[producer.id] = producer;

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