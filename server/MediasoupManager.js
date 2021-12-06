const os = require("os");
const mediasoup = require("mediasoup");
const { AwaitQueue } = require("awaitqueue");
require("dotenv").config({ path: process.cwd() + "/.env" });
// const config = require("./mediasoupConfig");

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
      listenIps: [
        {
          ip: process.env.MEDIASOUP_LISTEN_IP || "1.2.3.4",
          announcedIp: process.env.MEDIASOUP_ANNOUNCED_IP || null,
        },
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
        ip: process.env.MEDIASOUP_LISTEN_IP || "1.2.3.4",
        announcedIp: process.env.MEDIASOUP_ANNOUNCED_IP,
      },
      maxSctpMessageSize: 262144,
    },
  },
};

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
    this.io.on("connection", (socket) => {
      this.addPeer(socket);

      socket.on("disconnect", () => {
        this.removePeer(socket.id);
      });
      socket.on("mediasoupSignaling", (data, callback) => {
        this.handleSocketRequest(socket.id, data, callback);
      });
    });

    this.peers = {};
    this.initialize();

    // we will use this queue for asynchronous tasks to avoid multiple peers
    // requesting the same thing:
    this.queue = new AwaitQueue();

    setInterval(() => {
      this.sendSyncData();
    }, 5000);
  }

  sendSyncData() {
    let producers = this.getSyncData();
    this.io.sockets.emit("mediasoupSignaling", {
      type: "availableProducers",
      data: producers,
    });
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
      consumers: {},
    };
  }
  removePeer(id) {
    for (const transportId in this.peers[id].transports) {
      console.log("Closing transport");
      this.peers[id].transports[transportId].close();
    }
    delete this.peers[id];
  }

  async startMediasoupWorker() {
    let worker = await mediasoup.createWorker(config.mediasoup.workerSettings);
    worker.on("died", () => {
      console.error("mediasoup worker died (this should never happen)");
      process.exit(1);
    });
    const router = await worker.createRouter({
      mediaCodecs: config.mediasoup.routerOptions.mediaCodecs,
    });
    return { worker, router };
  }

  async handleSocketRequest(id, request, callback) {
    switch (request.type) {
      case "getRouterRtpCapabilities": {
        callback(this.routers[this.peers[id].routerIndex].rtpCapabilities);
        break;
      }

      case "createWebRtcTransport": {
        console.log("Creating WebRTC transport!");
        const callbackData = await this.createTransportForPeer(
          id,
          request.data
        );
        callback(callbackData);
        break;
      }

      case "connectWebRtcTransport": {
        console.log("Connecting WebRTC transport!");
        const { transportId, dtlsParameters } = request.data;
        const transport = this.peers[id].transports[transportId];

        if (!transport)
          throw new Error(`transport with id "${transportId}" not found`);

        await transport.connect({ dtlsParameters });

        callback();

        break;
      }

      case "produce": {
        console.log("Creating producer!");
        const producer = await this.createProducer(id, request.data);
        callback({ id: producer.id });
        break;
      }

      case "produceData": {
        console.log("produce data");
        break;
      }

      case "createConsumer": {
        console.log("Connecting peer to other peer!");
        let consumer = await this.getOrCreateConsumerForPeer(
          id,
          request.data.producingPeerId,
          request.data.producerId
        );

        if (consumer) {
          const consumerInfo = {
            peerId: request.data.producingPeerId,
            producerId: consumer.producerId,
            id: consumer.id,
            kind: consumer.kind,
            rtpParameters: consumer.rtpParameters,
            type: consumer.type,
            appData: consumer.appData,
            producerPaused: consumer.producerPaused,
          };

          this.peers[id].socket.emit("mediasoupSignaling", {
            type: "createConsumer",
            data: consumerInfo,
          });
        }
        callback();
        break;
      }

      case "pauseConsumer": {
        console.log("Pausing consumer!");
        const consumer = this.getConsumer(id, request.data.producerId);

        if (!consumer) {
          console.warn("No consumer found!");
          break;
        }
        await consumer.pause();
        callback({ paused: true });
        break;
      }

      case "resumeConsumer": {
        console.log("Resuming consumer!");

        const consumer = this.getConsumer(id, request.data.producerId);

        if (!consumer) {
          console.warn("No consumer found!");
          break;
        }
        await consumer.resume();
        callback();

        break;
      }

      case "closeProducer": {
        console.log("Closing producer!");

        const { producerId } = request.data;
        const producers = this.peers[id].producers[producerId];

        for (const routerIndex in producers) {
          const producer = producers[routerIndex];
          producer.close();
        }

        delete this.peers[id].producers[producerId];

        callback();

        break;
      }
    }
  }

  getTransportForPeer(id, transportId) {
    return this.peers[id].transports[transportId];
  }

  getRecvTransportForPeer(peerId) {
    let transports = this.peers[peerId].transports;
    for (let transportId in transports) {
      let t = transports[transportId];
      if (t.appData.consuming) return t;
    }
    return null;
  }

  getRouterForPeer(peerId) {
    return this.routers[this.peers[peerId].routerIndex];
  }

  getConsumer(peerId, producerId) {
    return this.peers[peerId].consumers[producerId];
  }

  /*
    Returns an object structured as follows:
    {
        peerId1: {},
        peerId2: {
            'producerId12345': {label: 'camera', peerId: '12jb12kja3', broadcast: true}
            'producerId88888': {label: 'microphone', peerId: '12jb12kja3'}
        }
    }
    
    */
  getSyncData() {
    let syncData = {};
    for (const peerId in this.peers) {
      syncData[peerId] = {};
      for (const producerId in this.peers[peerId].producers) {
        let peerRouterIndex = this.peers[peerId].routerIndex;
        const producer =
          this.peers[peerId].producers[producerId][peerRouterIndex];
        syncData[peerId][producerId] = producer.appData;
      }
    }
    return syncData;
  }

  /*
    Given a consumingPeerId, a producingPeerId and a producerId, this function will 
    automatically get the corresponding producer or create a pipe producer if needed, 
    then call this.createConsumer to create the corresponding consumer.
    */
  async getOrCreateConsumerForPeer(consumingPeerId, producingPeerId, producerId) {
    let existingConsumer = this.peers[consumingPeerId].consumers[producerId];

    if (existingConsumer) {
      console.log("Already consuming!");
      return existingConsumer;
    }

    console.log("Creating new consumer!");

    // use our queue to avoid multiple peers requesting the same pipeProducer 
    // at the same time
    this.queue
      .push(async () => {
        // first check whether the producer or one of its pipe producers exists
        // on the consuming peer's router:
        let consumingPeerRouterIndex = this.peers[consumingPeerId].routerIndex;
        // console.log(this.peers[producingPeerId].producers);
        let producerOrPipeProducer =
          this.peers[producingPeerId].producers[producerId][
            consumingPeerRouterIndex
          ];

        console.log("Current producer: ", !!producerOrPipeProducer);

        if (!producerOrPipeProducer) {
          // if it doesn't exist, create a new pipe producer
          let producingRouterIndex = this.peers[producingPeerId].routerIndex;
          console.log(
            `Creating pipe producer ID ${producerId} from router ${producingRouterIndex} to peer ${consumingPeerId} in router ${consumingPeerRouterIndex}!`
          );

          // this.peers[producingPeerId].producers[producerId][
          //   consumingPeerRouterIndex
          // ] = "creating";

          try {
            const { pipeProducer } = await this.routers[
              producingRouterIndex
            ].pipeToRouter({
              producerId: producerId,
              router: this.routers[consumingPeerRouterIndex],
            });

            // add the pipe producer to the producing peer's object of producers:
            this.peers[producingPeerId].producers[producerId][
              consumingPeerRouterIndex
            ] = pipeProducer;

            producerOrPipeProducer = pipeProducer;
          } catch (err) {
            console.error("Pipe To Router Error!");
          }
        }

        let newConsumer = await this.createConsumer(
          consumingPeerId,
          producerOrPipeProducer
        );
        
        if (!newConsumer) return null;

        // add new consumer to the consuming peer's consumers object:
        this.peers[consumingPeerId].consumers[producerId] = newConsumer;

        return newConsumer;
      })
      .catch((e) => {
        console.error(e);
      });
  }

  async createConsumer(consumingPeerId, producer) {
    let consumer;
    try {
      let transport = this.getRecvTransportForPeer(consumingPeerId);

      if (!transport) {
        console.warn(`No receive transport found for peer with ID ${consumingPeerId}`)
        return null;
      }
      consumer = await transport.consume({
        producerId: producer.id,
        rtpCapabilities:
          this.routers[this.peers[consumingPeerId].routerIndex].rtpCapabilities,
        paused: true,
        appData: producer.appData,
      });
    } catch (err) {
      console.log(err);
    }

    // console.log("consumer paused after creation? ", consumer.paused);
    // console.log("consumerID: ", consumer.id);
    // console.log("producerID:", consumer.producerId);

    this.peers[consumingPeerId].consumers[producer.id] = consumer;

    // Set Consumer events.
    consumer.on("transportclose", () => {
      // Remove from its map.
      this.peers[consumingPeerId].consumers.delete(producer.id);
    });

    consumer.on("producerclose", () => {
      console.log("Producer closed! Closing server-side consumer!");

      this.peers[consumingPeerId].socket.emit("mediasoupSignaling", {
        type: "consumerClosed",
        data: {
          producingPeerId: producer.appData.peerId,
          producerId: producer.id,
        },
      });

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

    const transport = this.getTransportForPeer(producingPeerId, transportId);

    if (!transport)
      throw new Error(`transport with id "${transportId}" not found`);

    const producer = await transport.produce({
      kind,
      rtpParameters,
      appData,
      // keyFrameRequestDelay: 5000
    });

    // add producer to the peer object
    this.peers[producingPeerId].producers[producer.id] = {};
    this.peers[producingPeerId].producers[producer.id][
      this.peers[producingPeerId].routerIndex
    ] = producer;

    if (appData.broadcast) {
      this.broadcastProducer(producingPeerId, producer.id);
    }

    return producer;
  }

  async broadcastProducer(producingPeerId, producerId) {
    // automatically create consumers for every other peer to consume this producer

    for (const consumingPeerId in this.peers) {
      if (consumingPeerId !== producingPeerId) {
        const consumer = await this.getOrCreateConsumerForPeer(
          consumingPeerId,
          producingPeerId,
          producerId
        );
        if (consumer) {
          const consumerInfo = {
            peerId: producingPeerId,
            producerId: consumer.producerId,
            id: consumer.id,
            kind: consumer.kind,
            rtpParameters: consumer.rtpParameters,
            type: consumer.type,
            appData: consumer.appData,
            producerPaused: consumer.producerPaused,
          };

          this.peers[consumingPeerId].socket.emit("mediasoupSignaling", {
            type: "createConsumer",
            data: consumerInfo,
          });
        }
      }
    }
  }

  async createTransportForPeer(id, data) {
    const { producing, consuming, sctpCapabilities } = data;

    const webRtcTransportOptions = {
      ...config.mediasoup.webRtcTransportOptions,
      enableSctp: true,
      numSctpStreams: sctpCapabilities.numStreams,
      appData: { producing, consuming },
    };

    try {
      const transport = await this.getRouterForPeer(id).createWebRtcTransport(
        webRtcTransportOptions
      );

      transport.on("sctpstatechange", (sctpState) => {
        console.log(
          'WebRtcTransport "sctpstatechange" event [sctpState:%s]',
          sctpState
        );
      });

      transport.on("dtlsstatechange", (dtlsState) => {
        if (dtlsState === "failed" || dtlsState === "closed")
          console.log(
            'WebRtcTransport "dtlsstatechange" event [dtlsState:%s]',
            dtlsState
          );
      });

      this.peers[id].transports[transport.id] = transport;

      return {
        id: transport.id,
        iceParameters: transport.iceParameters,
        iceCandidates: transport.iceCandidates,
        dtlsParameters: transport.dtlsParameters,
        sctpParameters: transport.sctpParameters,
      };
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = MediasoupManager;
