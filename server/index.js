/*
simple-mediasoup-peer-server
Aidan Nelson, 2022
https://github.com/AidanNelson/SimpleMediasoupPeer/

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

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

process.env.DEBUG = "SimpleMediasoupPeer:Error";


const mediasoup = require("mediasoup");
const { AwaitQueue } = require("awaitqueue");
const { Server } = require("socket.io");

const config = require("./config");
const debug = require("debug");

const logInfo = debug("SimpleMediasoupPeer:Info");
const logError = debug("SimpleMediasoupPeer:Error");

class SimpleMediasoupPeerServer {
  constructor(options = {}) {
    const defaultOptions = {
      io: null,
      socketServerOpts: {
        path: "/socket.io/",
        cors: {
          origin: "*",
          methods: ["GET", "POST"],
          credentials: true,
        },
        serveClient: false,
      },
      port: 3000,
    };
    this.options = Object.assign(defaultOptions, options);

    // do initialization in an async function
    this.init();
  }

  async init() {
    try {
      logInfo("Initializing SimpleMediasoupPeerServer!");
      logInfo("Config: ", JSON.stringify(config, null, 2));
      await this.initializeMediasoupWorkersAndRouters();

      this.currentPeerRouterIndex = -1;

      // we will use this queue for asynchronous tasks to avoid multiple peers
      // requesting the same thing:
      this.queue = new AwaitQueue();

      // keep track of peers and rooms
      this.peers = {};
      this.rooms = {};

      if (this.options.io) {
        this.io = this.options.io;
      } else {
        this.io = new Server(this.options.socketServerOpts);
        this.io.listen(this.options.port);
        logInfo("SimpleMediasoupPeer socket.io server listening on port:", this.options.port);
      }

      this.io.on("connection", (socket) => {
        logInfo("Socket joined:", socket.id);
        this.addPeer(socket);

        socket.on("disconnect", async () => {
          try {
            await this.removePeer(socket.id);
          } catch (error) {
            logError("Error in disconnect handler:", error);
          }
        });

        socket.on("mediasoupSignaling", async (data, callback) => {
          try {
            await this.handleSocketRequest(socket.id, data, callback);
          } catch (error) {
            logError("Error in mediasoupSignaling handler:", error);
            if (callback) {
              callback({ error: "Internal server error: " + (error?.message || error?.toString() || "Unknown error") });
            }
          }
        });
      });

    } catch (error) {
      logError("Error initializing SimpleMediasoupPeerServer:", error);
    }
  }

  async initializeMediasoupWorkersAndRouters() {
    this.workers = [];
    this.routers = [];

    for (let i = 0; i < config.mediasoup.numWorkers; i++) {
      try {
        const worker = await mediasoup.createWorker(config.mediasoup.workerSettings);
        worker.on("died", (error) => {
          logError("Mediasoup worker died: ", error);
        });

        const router = await worker.createRouter({
          mediaCodecs: config.mediasoup.routerOptions.mediaCodecs,
        });
        this.workers[i] = worker;
        this.routers[i] = router;
      } catch (error) {
        logError("Error initializing mediasoup workers and routers:", error);
        throw error;
      }
    }
  }

  getNewPeerRouterIndex() {
    this.currentPeerRouterIndex = this.currentPeerRouterIndex + 1;

    if (this.currentPeerRouterIndex >= this.routers.length) {
      this.currentPeerRouterIndex = 0;
    }
    logInfo(`Assigning peer to router # ${this.currentPeerRouterIndex}`);
    return this.currentPeerRouterIndex;
  }

  addPeer(socket) {
    this.peers[socket.id] = {
      socket: socket,
      roomId: null,
      routerIndex: this.getNewPeerRouterIndex(),
      transports: {},
      producers: {},
      consumers: {},
      // dataProducers: {}, // commented out for testing
      // dataConsumers: {}, // commented out for testing
    };
  }
  async removePeer(id) {
    logInfo(`Removing and cleaning up peer ${id}`);
    const peer = this.peers[id];

    if (!peer) return;

    const existingRoomId = peer.roomId;
    if (existingRoomId) {
      await this.removePeerFromRoom({ peerId: id, roomId: existingRoomId });
    }

    // close transports
    for (const transportId in peer.transports) {
      logInfo("Closing transport");
      peer.transports[transportId].close();
    }

    // remove from this.peers
    delete this.peers[id];
  }

  async handleSocketRequest(id, request, callback) {
    logInfo(`Received request of type ${request.type} from peer ${id}.  \nRequest data: %j`, request.data);
    logInfo
    switch (request.type) {
      case "joinRoom": {
        try {
          await this.addPeerToRoom({ peerId: id, roomId: request.data.roomId });
          callback({ success: true });
        } catch (error) {
          callback({ error: "Internal server error: " + (error?.message || error?.toString() || "Unknown error") });
          return;
        }
        break;
      }

      case "leaveRoom": {
        try {
          await this.removePeerFromRoom({ peerId: id, roomId: request.data.roomId });
          callback({ success: true });
        } catch (error) {
          callback({ error: "Internal server error: " + (error?.message || error?.toString() || "Unknown error") });
          return;
        }
        break;
      }

      case "getRouterRtpCapabilities": {
        try {
          const peerRouter = this.getRouterForPeer({ peerId: id });
          callback({ success: true, routerRtpCapabilities: peerRouter.rtpCapabilities });
        } catch (error) {
          callback({ error: "Internal server error: " + (error?.message || error?.toString() || "Unknown error") });
          return;
        }
        break;
      }

      case "createWebRtcTransport": {
        logInfo("Creating WebRTC transport!");
        try {
          const transportInfo = await this.createTransportForPeer({ peerId: id, data: request.data });
          callback({ success: true, transportInfo });
        } catch (error) {
          callback({ error: "Internal server error: " + (error?.message || error?.toString() || "Unknown error") });
          return;
        }
        break;
      }

      case "connectWebRtcTransport": {
        logInfo("Connecting WebRTC transport!");

        try {
          const { transportId, dtlsParameters } = request.data;
          const transport = this.peers[id].transports[transportId];

          if (!transport) {
            throw new Error(`Cannot connect WebRTC transport: transport with id "${transportId}" not found`);
          }

          await transport.connect({ dtlsParameters });

          callback({ success: true });
        } catch (error) {
          callback({ error: "Internal server error: " + (error?.message || error?.toString() || "Unknown error") });
          return;
        }

        break;
      }

      case "produce": {
        logInfo("Creating server-side producer!");

        try {
          const producer = await this.createProducer({ producingPeerId: id, data: request.data });
          callback({ success: true, id: producer.id });
        } catch (error) {
          callback({ error: "Internal server error: " + (error?.message || error?.toString() || "Unknown error") });
          return;
        }
        break;
      }

      // case "produceData": {
      //   logger("Creating server-side data producer");


      //   try {
      //     const producer = await this.createDataProducer(id, request.data);
      //     callback({ success: true, id: producer.id });
      //   } catch (error) {
      //     callback({ error: "Internal server error: " + (error?.message || error?.toString() || "Unknown error") });
      //     return;
      //   }

      //   break;
      // }

      // case "createConsumer": {
      //   logger(
      //     `Peer ${id} requesting producer ${request.data.producerId} from peer ${request.data.producingPeerId}`
      //   );
      //   try {
      //     const consumer = await this.getOrCreateConsumerForPeer(
      //       id,
      //       request.data.producingPeerId,
      //       request.data.producerId
      //     );


      //     const consumerInfo = {
      //       peerId: request.data.producingPeerId,
      //       producerId: consumer.producerId,
      //       id: consumer.id,
      //       kind: consumer.kind,
      //       rtpParameters: consumer.rtpParameters,
      //       type: consumer.type,
      //       appData: consumer.appData,
      //       producerPaused: consumer.producerPaused,
      //     };

      //     // send the consumer info to the consuming peer
      //     this.peers[id].socket.emit("mediasoupSignaling", {
      //       type: "createConsumer",
      //       data: consumerInfo,
      //     });

      //     callback({ success: true });
      //   } catch (error) {
      //     callback({ error: "Internal server error: " + (error?.message || error?.toString() || "Unknown error") });
      //     return;
      //   }
      //   break;
      // }

      // case "createDataConsumer": {
      //   logger("Connecting peer to other peer!");
      //   try {
      //     const dataConsumer = await this.getOrCreateDataConsumerForPeer(
      //       id,
      //       request.data.producingPeerId,
      //       request.data.producerId
      //     );

      //     const dataConsumerInfo = {
      //       peerId: request.data.producingPeerId,
      //       dataProducerId: request.data.producerId,
      //       id: dataConsumer.id,
      //       sctpStreamParameters: dataConsumer.sctpStreamParameters,
      //       label: dataConsumer.label,
      //       protocol: dataConsumer.protocol,
      //       appData: dataConsumer.appData,
      //     };

      //     this.peers[id].socket.emit("mediasoupSignaling", {
      //       type: "createDataConsumer",
      //       data: dataConsumerInfo,
      //     });
      //     callback({ success: true });
      //   } catch (error) {
      //     callback({ error: "Internal server error: " + (error?.message || error?.toString() || "Unknown error") });
      //     return;
      //   }
      //   break;
      // }

      case "pauseConsumer": {
        logInfo("Pausing consumer!");
        try {
          const consumer = this.getConsumer(id, request.data.producerId);

          if (!consumer) {
            throw new Error("No consumer found!");
          }
          await consumer.pause();
          callback({ success: true });
        } catch (error) {
          callback({ error: "Internal server error: " + (error?.message || error?.toString() || "Unknown error") });
          return;
        }
        break;
      }

      case "resumeConsumer": {
        logInfo("Resuming consumer!");

        try {
          const consumer = this.getConsumer(id, request.data.producerId);

          if (!consumer) {
            throw new Error("No consumer found!");
          }

          await consumer.resume();
          callback({ success: true });
        } catch (error) {
          callback({ error: "Internal server error: " + (error?.message || error?.toString() || "Unknown error") });
          return;
        }

        break;
      }

      case "closeConsumer": {
        logInfo("Closing consumer!");
        try {
          const consumer = this.getConsumer(id, request.data.producerId);

          if (!consumer) {
            throw new Error("No consumer found!");
          }

          this.closeConsumer({ peerId: id, consumer });

          callback({ success: true });
        } catch (error) {
          callback({ error: "Internal server error: " + (error?.message || error?.toString() || "Unknown error") });
          return;
        }

        break;
      }

      case "closeProducer": {
        try {

          const { producerId } = request.data;
          const producers = this.peers[id].producers[producerId];

          for (const routerIndex in producers) {
            const producer = producers[routerIndex];
            producer.close();
          }

          // update room

          delete this.peers[id].producers[producerId];

          callback({ success: true });
          logInfo("Closed producer");

        } catch (error) {
          callback({ error: "Internal server error: " + (error?.message || error?.toString() || "Unknown error") });
          return;
        }

        break;
      }
    }
  }

  async addPeerToRoom({ peerId, roomId }) {
    logInfo(`Adding peer ${peerId} to room ${roomId}.`);

    if (this.peers[peerId].roomId !== null) {
      throw new Error(`Peer ${peerId} already in room ${this.peers[peerId].roomId}`);
    }

    // if we haven't seen this room before, create it
    if (!this.rooms.hasOwnProperty(roomId)) {
      this.rooms[roomId] = [];
    }

    // keep track of which room the peer is in
    this.peers[peerId].roomId = roomId;

    // console.log('this.peers', this.peers);


    // Create all consumer creation promises simultaneously for better performance
    const consumerCreationPromises = [];

    for (const existingPeerId of this.rooms[roomId]) {
      if (!this.peers[existingPeerId]) continue;

      // Create consumers for each existing peer's producers (for the new peer to consume)
      const existingPeerProducers = this.peers[existingPeerId].producers;
      for (const producerId in existingPeerProducers) {
        consumerCreationPromises.push(
          this.createConsumerFromProducerOrPipeProducer({
            consumingPeerId: peerId,
            producingPeerId: existingPeerId,
            producerId
          }).catch(error => {
            logError(`Error creating consumer for existing peer ${existingPeerId}:`, error);
          })
        );
      }

      // Create consumers for the new peer's producers (for existing peers to consume)
      const newPeerProducers = this.peers[peerId].producers;
      for (const producerId in newPeerProducers) {
        consumerCreationPromises.push(
          this.createConsumerFromProducerOrPipeProducer({
            consumingPeerId: existingPeerId,
            producingPeerId: peerId,
            producerId
          }).catch(error => {
            logError(`Error creating consumer for new peer ${peerId}:`, error);
          })
        );
      }
    }

    // Wait for all consumer creation operations to complete in parallel
    await Promise.all(consumerCreationPromises);

    // finally, add peer to this room:
    this.rooms[roomId].push(peerId);
  }

  async removePeerFromRoom({ peerId, roomId }) {
    logInfo(`Removing peer with id ${peerId} from room with id${roomId}`);

    if (!this.rooms[roomId] || !this.peers[peerId]) return;

    // remove this peer from room
    this.rooms[roomId] = this.rooms[roomId].filter((roomPeerId) => roomPeerId !== peerId);
    this.peers[peerId].roomId = null;

    // disconnect this peer from others within the room:
    // Guard: Check peer still exists before accessing consumers
    if (this.peers[peerId]?.consumers) {
      for (const consumerId in this.peers[peerId].consumers) {
        await this.closeConsumer({ peerId, consumer: this.peers[peerId].consumers[consumerId] });
      }
    }

    // close consumers for the other peers in the room
    // of the leaving peer's producers
    if (this.peers[peerId]?.producers) {
      for (const remainingPeerId of this.rooms[roomId]) {
        // Guard: Remaining peer might have disconnected during this operation
        if (!this.peers[remainingPeerId]) {
          logInfo(`Remaining peer ${remainingPeerId} no longer exists, skipping cleanup`);
          continue;
        }

        for (const producerId in this.peers[peerId].producers) {
          const consumer = this.peers[remainingPeerId]?.consumers?.[producerId];
          if (consumer) {
            await this.closeConsumer({ peerId: remainingPeerId, consumer });
          }
        }
      }
    }

    if (this.rooms[roomId].length === 0) {
      logInfo(`Room ${roomId} empty.  Removing it.`);
      delete this.rooms[roomId];
    }
  }

  getTransportForPeer(id, transportId) {
    const transport = this.peers[id]?.transports[transportId];
    if (!transport) {
      throw new Error(`Transport with id "${transportId}" not found for peer with id "${id}"`);
    }
    return transport;
  }

  getRecvTransportForPeer(peerId) {
    let transports = this.peers[peerId]?.transports;
    if (!transports) {
      throw new Error(`Transports not found for peer with id "${peerId}"`);
    }
    let recvTransport = null;
    for (let transportId in transports) {
      let t = transports[transportId];
      if (t?.appData?.consuming) {
        recvTransport = t;
        break;
      }
    }
    if (!recvTransport) {
      throw new Error(`Receive transport not found for peer with id "${peerId}"`);
    }
    return recvTransport;
  }

  getRouterForPeer({ peerId }) {
    const routerIndex = this.peers[peerId]?.routerIndex;
    if (routerIndex === undefined || routerIndex === null) {
      throw new Error(`Router index not found for peer with id "${peerId}"`);
    }
    const router = this.routers[routerIndex];
    if (!router) {
      throw new Error(`Router with index "${routerIndex}" not found for peer with id "${peerId}"`);
    }
    return router;
  }

  getConsumer(peerId, producerId) {
    return this.peers[peerId].consumers[producerId];
  }

  /*
    Given a consumingPeerId, a producingPeerId and a producerId, this function will 
    automatically get the corresponding producer or create a pipe producer as needed, 
    then call this.createConsumer to create the corresponding consumer.
    Finally, it notifies the consuming peer about the new consumer.
    */
  async createConsumerFromProducerOrPipeProducer({ consumingPeerId, producingPeerId, producerId }) {
    try {
      // Validate peers exist (expected to fail during disconnects - not an error)
      const consumingPeer = this.peers[consumingPeerId];
      const producingPeer = this.peers[producingPeerId];

      if (!consumingPeer) {
        logInfo(`Consuming peer ${consumingPeerId} not found (likely disconnected), skipping consumer creation`);
        return null;
      }
      if (!producingPeer) {
        logInfo(`Producing peer ${producingPeerId} not found (likely disconnected), skipping consumer creation`);
        return null;
      }

      // first check whether the producer or one of its pipe producers exists
      // on the consuming peer's router:
      const consumingPeerRouterIndex = consumingPeer?.routerIndex;

      if (!consumingPeerRouterIndex){
        logInfo(`Consuming peer ${consumingPeerId} not found (likely disconnected), skipping consumer creation`);
        return null;
      }

      const producerMapForPeer = producingPeer?.producers?.[producerId];
      if (!producerMapForPeer) {
        logInfo(`Producer ${producerId} not found for producing peer ${producingPeerId} (likely disconnected), skipping consumer creation`);
        return null;
      }

      let producerOrPipeProducer = producerMapForPeer?.[consumingPeerRouterIndex];
      if (!producerOrPipeProducer) {
        logInfo(`Producer or pipe producer not found for producing peer ${producingPeerId} (likely disconnected), skipping consumer creation`);
        return null;
      }

      const consumer = await this.createConsumer({ consumingPeerId, producer: producerOrPipeProducer });

      if (!consumer) {
        logInfo(`Consumer not created for producing peer ${producingPeerId} (likely disconnected), skipping consumer creation`);
        return null;
      }

      // add new consumer to the consuming peer's consumers object (if the peer still exists)
      if (this.peers[consumingPeerId]?.consumers) {
        this.peers[consumingPeerId].consumers[producerId] = consumer;
      }

      // Notify the consuming peer about the new consumer
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

      this.peers[consumingPeerId]?.socket.emit("mediasoupSignaling", {
        type: "createConsumer",
        data: consumerInfo,
      });

      return consumer;

    } catch (err) {
      logError("Error in createConsumerFromProducerOrPipeProducer:", err);
      return null;
    }
  }

  /*
    Given a consumingPeerId, a producingPeerId and a producerId, this function will 
    automatically get the corresponding producer or create a pipe producer if needed, 
    then call this.createConsumer to create the corresponding consumer.
    */
  // async getOrCreateDataConsumerForPeer(consumingPeerId, producingPeerId, producerId) {
  //   try {
  //     const existingConsumer = this.peers[consumingPeerId]?.dataConsumers?.[producerId];

  //     if (existingConsumer) {
  //       logger("Already consuming!");
  //       return existingConsumer;
  //     }

  //     logger("Creating new data consumer!");

  //     // use our queue to avoid multiple peers requesting the same pipeProducer
  //     // at the same time
  //     return await this.queue.push(async () => {
  //       try {
  //         // Validate peers exist
  //         const consumingPeer = this.peers[consumingPeerId];
  //         const producingPeer = this.peers[producingPeerId];
  //         if (!consumingPeer) throw new Error(`Consuming peer ${consumingPeerId} not found`);
  //         if (!producingPeer) throw new Error(`Producing peer ${producingPeerId} not found`);

  //         // first check whether the producer or one of its pipe producers exists
  //         // on the consuming peer's router:
  //         const consumingPeerRouterIndex = consumingPeer.routerIndex;
  //         const dataProducerMapForPeer = producingPeer.dataProducers[producerId];
  //         if (!dataProducerMapForPeer) {
  //           throw new Error(
  //             `Data producer ${producerId} not found for producing peer ${producingPeerId}`
  //           );
  //         }

  //         let producerOrPipeProducer = dataProducerMapForPeer[consumingPeerRouterIndex];
  //         logger("Current producer: ", !!producerOrPipeProducer);

  //         if (!producerOrPipeProducer) {
  //           // if it doesn't exist, create a new pipe producer
  //           const producingRouterIndex = producingPeer.routerIndex;
  //           logger(
  //             `Creating pipe data producer ID ${producerId} from router ${producingRouterIndex} to peer ${consumingPeerId} in router ${consumingPeerRouterIndex}!`
  //           );

  //           const { pipeDataProducer } = await this.routers[producingRouterIndex].pipeToRouter({
  //             dataProducerId: producerId,
  //             router: this.routers[consumingPeerRouterIndex],
  //           });

  //           // add the pipe producer to the producing peer's object of producers:
  //           producingPeer.dataProducers[producerId][consumingPeerRouterIndex] =
  //             pipeDataProducer;

  //           producerOrPipeProducer = pipeDataProducer;
  //         }

  //         const newConsumer = await this.createDataConsumer(
  //           consumingPeerId,
  //           producerOrPipeProducer
  //         );

  //         if (!newConsumer) return null;

  //         // add new consumer to the consuming peer's consumers object:
  //         this.peers[consumingPeerId].dataConsumers[producerId] = newConsumer;

  //         return newConsumer;
  //       } catch (err) {
  //         logger("Error in getOrCreateDataConsumerForPeer task:", err);
  //         throw err;
  //       }
  //     });
  //   } catch (err) {
  //     logger("Error in getOrCreateDataConsumerForPeer:", err);
  //     throw err;
  //   }
  // }

  async createConsumer({ consumingPeerId, producer }) {
    try {
      const transport = this.getRecvTransportForPeer(consumingPeerId);


      const consumer = await transport.consume({
        producerId: producer.id,
        rtpCapabilities: this.routers[this.peers[consumingPeerId].routerIndex].rtpCapabilities,
        paused: true,
        appData: producer.appData,
      });

      // add consumer to the consuming peer's consumers object if the peer exists
      // it is possible that the peer has left the room by the time the consumer is created
      if (this.peers[consumingPeerId]) {
        this.peers[consumingPeerId].consumers[producer.id] = consumer;
      }

      // Set Consumer events.
      consumer.on("transportclose", () => {
        this.closeConsumer({ peerId: consumingPeerId, consumer });
      });

      consumer.on("producerclose", () => {
        this.closeConsumer({ peerId: consumingPeerId, consumer });
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
    } catch (err) {
      logError("Error in createConsumer:", err);
      throw err;
    }
  }

  async closeConsumer({ peerId, consumer }) {
    logInfo(`Closing consumer ${consumer.id} from peer ${peerId}`);
    try {
      //  close the server-side consumer
      await consumer.close();

      // tell the peer to close their corresponding consumer
      this.peers[peerId]?.socket?.emit("mediasoupSignaling", {
        type: "consumerClosed",
        data: {
          producingPeerId: consumer.appData.peerId,
          producerId: consumer.producerId,
        },
      });

      // delete reference to this consumer
      if (!this.peers[peerId] || !this.peers[peerId].consumers) return;
      delete this.peers[peerId].consumers[consumer.producerId];
    } catch (err) {
      logError("Error in closeConsumer:", err);
    }
  }

  // async createDataConsumer(consumingPeerId, producer) {
  //   let dataConsumer;
  //   try {
  //     const transport = this.getRecvTransportForPeer(consumingPeerId);

  //     // create the data consumer
  //     dataConsumer = await transport.consumeData({
  //       dataProducerId: producer.id,
  //     });
  //   } catch (err) {
  //     logger(err);
  //     throw err;
  //   }

  //   // logger("consumer paused after creation? ", consumer.paused);
  //   // logger("consumerID: ", consumer.id);
  //   // logger("producerID:", consumer.producerId);

  //   this.peers[consumingPeerId].dataConsumers[producer.id] = dataConsumer;

  //   // Set Consumer events.
  //   dataConsumer.on("transportclose", () => {
  //     // Remove from its map.
  //     this.closeDataConsumer({ peerId: consumingPeerId, consumer: dataConsumer });

  //   });

  //   dataConsumer.on("producerclose", () => {
  //     logger("Producer closed! Closing server-side consumer!");

  //     this.closeDataConsumer({ peerId: consumingPeerId, consumer: dataConsumer });
  //     // consumerPeer.notify('consumerClosed', { consumerId: consumer.id })
  //     // 	.catch(() => {});
  //   });

  //   // consumer.on('producerpause', () => {
  //   // consumerPeer.notify('consumerPaused', { consumerId: consumer.id })
  //   // 	.catch(() => {});
  //   // });

  //   // consumer.on('producerresume', () => {
  //   // consumerPeer.notify('consumerResumed', { consumerId: consumer.id })
  //   // 	.catch(() => {});
  //   // });

  //   return dataConsumer;
  // }

  // async closeDataConsumer({ peerId, consumer }) {
  //   try {
  //     //  close the server-side consumer
  //     await consumer.close();

  //     // tell the peer to close their corresponding consumer
  //     this.peers[peerId]?.socket?.emit("mediasoupSignaling", {
  //       type: "dataConsumerClosed",
  //       data: {
  //         producingPeerId: consumer.appData.peerId,
  //         producerId: consumer.producerId,
  //       },
  //     });

  //     // delete reference to this consumer
  //     if (!this.peers[peerId] || !this.peers[peerId].dataConsumers) return;
  //     delete this.peers[peerId].dataConsumers[consumer.producerId];
  //   } catch (err) {
  //     console.error("Error in closeDataConsumer:", err);
  //   }
  // }

  async createProducer({ producingPeerId, data }) {
    const { transportId, kind, rtpParameters } = data;

    // add peerId to appData
    let { appData } = data;
    appData = { ...appData, peerId: producingPeerId };

    try {
      const transport = this.getTransportForPeer(producingPeerId, transportId);

      const producer = await transport.produce({
        kind,
        rtpParameters,
        appData,
        // keyFrameRequestDelay: 5000
      });

      // add producer to the peer object
      this.peers[producingPeerId].producers[producer.id] = {};
      this.peers[producingPeerId].producers[producer.id][this.peers[producingPeerId].routerIndex] =
        producer;

      // create pipe producers to all other routers
      const producingRouterIndex = this.peers[producingPeerId].routerIndex;
      for (let consumingRouterIndex = 0; consumingRouterIndex < this.routers.length; consumingRouterIndex++) {
        if (consumingRouterIndex === producingRouterIndex) continue;
        const { pipeProducer } = await this.routers[producingRouterIndex].pipeToRouter({
          producerId: producer.id,
          router: this.routers[consumingRouterIndex],
        });
        this.peers[producingPeerId].producers[producer.id][consumingRouterIndex] = pipeProducer;
      }

      // broadcast the producer to all other peers in the room
      const peersInRoom = this.rooms[this.peers[producingPeerId].roomId];

      // Create all consumer creation promises simultaneously for better performance
      const consumerCreationPromises = [];

      for (const consumingPeerId of peersInRoom) {
        if (consumingPeerId !== producingPeerId) {
          consumerCreationPromises.push(
            this.createConsumerFromProducerOrPipeProducer({
              consumingPeerId,
              producingPeerId,
              producerId: producer.id
            }).catch(error => {
              logError(`Error in createConsumersForProducer for peer ${consumingPeerId}:`, error);
            })
          );
        }
      }

      // Wait for all consumer creation operations to complete in parallel
      await Promise.all(consumerCreationPromises);

      return producer;

    } catch (error) {
      logError("Error in createProducer:", error);
      throw error;
    }
  }

  // async createDataProducer(producingPeerId, data) {
  //   const { transportId, sctpStreamParameters, label, protocol, appData } = data;

  //   try {

  //     const transport = this.getTransportForPeer(producingPeerId, transportId);

  //     const dataProducer = await transport.produceData({
  //       sctpStreamParameters,
  //       label,
  //       protocol,
  //       appData,
  //     });

  //     // add producer to the peer object
  //     this.peers[producingPeerId].dataProducers[dataProducer.id] = {};
  //     this.peers[producingPeerId].dataProducers[dataProducer.id][
  //       this.peers[producingPeerId].routerIndex
  //     ] = dataProducer;

  //     // // Create a server-side DataConsumer for each Peer.
  //     // for (const otherPeer of this._getJoinedPeers({ excludePeer: peer })) {
  //     //   this._createDataConsumer({
  //     //     dataConsumerPeer: otherPeer,
  //     //     dataProducerPeer: peer,
  //     //     dataProducer,
  //     //   });
  //     // }

  //     return dataProducer;
  //   } catch (error) {
  //     logger("Error in createDataProducer:", error);
  //     throw error;
  //   }
  // }

  async createConsumersForProducer({ producingPeerId, producerId }) {

  }

  async createTransportForPeer({ peerId, data }) {
    try {
      const { producing, consuming, sctpCapabilities } = data;

      const webRtcTransportOptions = {
        ...config.mediasoup.webRtcTransportOptions,
        enableSctp: true,
        numSctpStreams: sctpCapabilities.numStreams,
        appData: { producing, consuming },
      };

      const router = this.getRouterForPeer({ peerId });

      const transport = await router.createWebRtcTransport(
        webRtcTransportOptions
      );

      transport.on("sctpstatechange", (sctpState) => {
        logInfo('WebRtcTransport "sctpstatechange" event [sctpState:%s]', sctpState);
      });

      transport.on("dtlsstatechange", async (dtlsState) => {
        if (dtlsState === "failed" || dtlsState === "closed") {
          logInfo('WebRtcTransport "dtlsstatechange" event [dtlsState:%s]', dtlsState);
          // tell peer to reset their connection
          // this.peers[id].socket.emit("mediasoupSignaling", {
          //   type: "resetConnection",
          //   data: {},
          // });
          // await this.removePeer(id);
        }
      });

      this.peers[peerId].transports[transport.id] = transport;

      return {
        id: transport.id,
        iceParameters: transport.iceParameters,
        iceCandidates: transport.iceCandidates,
        dtlsParameters: transport.dtlsParameters,
        sctpParameters: transport.sctpParameters,
      };
    } catch (err) {
      logInfo(err);
      throw err;
    }
  }
}

module.exports = SimpleMediasoupPeerServer;
