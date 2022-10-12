const mediasoup = require("mediasoup");
const { AwaitQueue } = require("awaitqueue");
const { Server } = require("socket.io");

const config = require("./config");

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

class SimpleMediasoupPeerServer {
  constructor() {
    // this.io = io;
    this.io = new Server({
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });
    this.rooms = {};
    this.io.on("connection", (socket) => {
      console.log("Socket joined:", socket.id);
      this.addPeer(socket);

      // tell the new client about all other clients
      // const currentClients = this.io.of(nspName).sockets.keys();
      // console.log(`Current clients in namespace '${nspName}':`, currentClients);
      // socket.emit("clients", currentClients);

      // borrowed from https://github.com/vanevery/p5LiveMedia/blob/master/server.js
      socket.on("joinRoom", (data) => {
        if (!this.rooms.hasOwnProperty(data.room)) {
          console.log(Date.now(), socket.id, "Room doesn't exist, creating it");
          this.rooms[data.room] = new Set();
        }
        // we'll keep track of roomIds in this.rooms, and also add the socket to the socket.io room
        this.rooms[data.room].add(socket.id);
        this.peers[socket.id].room = data.room;
        socket.join(data.room);
      });

      socket.on("disconnect", () => {
        this.removePeer(socket.id);
      });

      socket.on("mediasoupSignaling", (data, callback) => {
        this.handleSocketRequest(socket.id, data, callback);
      });
    });
    // this.io.on("connection", (socket) => {
    //   console.log(
    //     "User " +
    //       socket.id +
    //       " connected, there are " +
    //       io.engine.clientsCount +
    //       " clients connected"
    //   );

    //   socket.emit("clients", Object.keys(clients));
    //   socket.broadcast.emit("clientConnected", socket.id);

    //   // then add to our clients object
    //   clients[socket.id] = {}; // store initial client state here

    //   socket.on("disconnect", () => {
    //     delete clients[socket.id];
    //     io.sockets.emit("clientDisconnected", socket.id);
    //     console.log("client disconnected: ", socket.id);
    //   });
    // });
    this.io.listen(3000);

    this.peers = {};
    this.initialize();

    this.currentPeerRouterIndex = -1;
    // we will use this queue for asynchronous tasks to avoid multiple peers
    // requesting the same thing:
    this.queue = new AwaitQueue();

    setInterval(() => {
      this.sendSyncData();
    }, 2500);
  }

  sendSyncData() {
    console.log("Sending sync data", this.rooms);
    for (const roomId in this.rooms) {
      console.log("sending sync data to room", roomId);
      let producers = this.getSyncData(roomId);
      console.log(producers);
      this.io.to(roomId).emit("mediasoupSignaling", {
        type: "availableProducers",
        data: producers,
      });
    }
    // this.io.sockets.emit(
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
  getSyncData(roomId) {
    let syncData = {};
    for (const peerId in this.peers) {
      if (this.rooms[roomId].has(peerId)) {
        syncData[peerId] = {};
        for (const producerId in this.peers[peerId].producers) {
          let peerRouterIndex = this.peers[peerId].routerIndex;
          const producer =
            this.peers[peerId].producers[producerId][peerRouterIndex];
          syncData[peerId][producerId] = producer.appData;
        }
      }
    }
    return syncData;
  }

  async initialize() {
    this.workers = [];
    this.routers = [];

    for (let i = 0; i < config.mediasoup.numWorkers; i++) {
      let { worker, router } = await this.startMediasoupWorker();
      this.workers[i] = worker;
      this.routers[i] = router;
    }
  }

  getNewPeerRouterIndex() {
    this.currentPeerRouterIndex = this.currentPeerRouterIndex + 1;

    if (this.currentPeerRouterIndex >= this.routers.length) {
      this.currentPeerRouterIndex = 0;
    }
    console.log(`Assigning peer to router # ${this.currentPeerRouterIndex}`);
    return this.currentPeerRouterIndex;

    // let index = Math.floor(Math.random() * this.routers.length);
    // console.log(`Assigning peer to router # ${index}`);
    // return index;
  }

  addPeer(socket) {
    this.peers[socket.id] = {
      socket: socket,
      room: undefined,
      routerIndex: this.getNewPeerRouterIndex(),
      transports: {},
      producers: {},
      consumers: {},
    };
  }
  removePeer(id) {
    const peer = this.peers[id];

    // close transports
    for (const transportId in peer.transports) {
      console.log("Closing transport");
      peer.transports[transportId].close();
    }

    // remove from rooms
    if (peer.room) {
      this.rooms[peer.room].delete(id);
    }

    // remove from this.peers
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
    Given a consumingPeerId, a producingPeerId and a producerId, this function will 
    automatically get the corresponding producer or create a pipe producer if needed, 
    then call this.createConsumer to create the corresponding consumer.
    */
  async getOrCreateConsumerForPeer(
    consumingPeerId,
    producingPeerId,
    producerId
  ) {
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
        console.warn(
          `No receive transport found for peer with ID ${consumingPeerId}`
        );
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
      delete this.peers[consumingPeerId].consumers[producer.id];
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

module.exports = SimpleMediasoupPeerServer;
