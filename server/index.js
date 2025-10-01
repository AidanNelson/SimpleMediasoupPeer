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

const mediasoup = require("mediasoup");
const { AwaitQueue } = require("awaitqueue");
const { Server } = require("socket.io");

const config = require("./config");
const debug = require("debug");
const logger = debug("SimpleMediasoupPeer:server");

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
      logger("Initializing SimpleMediasoupPeerServer!");
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
        logger("SimpleMediasoupPeer socket.io server listening on port:", this.options.port);
      }

      this.io.on("connection", (socket) => {
        logger("Socket joined:", socket.id);
        this.addPeer(socket);

        socket.on("disconnect", () => {
          this.removePeer(socket.id);
        });

        socket.on("mediasoupSignaling", async (data, callback) => {
          try {
            await this.handleSocketRequest(socket.id, data, callback);
          } catch (error) {
            logger("Error in mediasoupSignaling handler:", error);
            if (callback) {
              callback({ error: "Internal server error: " + (error?.message || error?.toString() || "Unknown error") });
            }
          }
        });
      });

      setInterval(() => {
        this.sendSyncDataToAllRooms();
      }, 1000);
    } catch (error) {
      console.error("Error initializing SimpleMediasoupPeerServer:", error);
    }
  }

  sendSyncDataToAllRooms() {
    try {
      const allRooms = Object.keys(this.rooms);
      for (const roomId of allRooms) {
        let syncData;
        let peerIdsInRoom = this.rooms[roomId];
        try {
          syncData = this.getSyncDataForRoom(roomId);
        } catch (err) {
          logger("Error building sync data for room", roomId, err);
          continue;
        }

        if (!syncData || !Array.isArray(peerIdsInRoom) || peerIdsInRoom.length === 0) {
          delete this.rooms[roomId];
          continue;
        }

        peerIdsInRoom.forEach((pid) => {
          try {
            this.peers[pid]?.socket?.emit("mediasoupSignaling", {
              type: "availableProducers",
              data: syncData,
            });
          } catch (err) {
            logger("Error emitting sync data to peer", pid, err);
          }
        });
      }
    } catch (err) {
      logger("Error in sendSyncDataToAllRooms:", err);
    }
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
  getSyncDataForRoom(roomId) {
    let syncData = {};
    const peersInRoom = this.rooms[roomId];
    // if the room no longer exists, return an empty object
    // TODO cleanup rooms as peers exit
    if (!peersInRoom) {
      // room is empty!  let's get rid of it
      return undefined;
    }
    for (const peerId of peersInRoom) {
      if (this.peers[peerId]) {
        syncData[peerId] = { producers: {}, dataProducers: {} };
        for (const producerId in this.peers[peerId].producers) {
          let peerRouterIndex = this.peers[peerId].routerIndex;
          const producer = this.peers[peerId].producers[producerId]?.[peerRouterIndex];
          if (producer?.appData) {
            syncData[peerId].producers[producerId] = producer.appData;
          }
        }
        for (const dataProducerId in this.peers[peerId].dataProducers) {
          let peerRouterIndex = this.peers[peerId].routerIndex;
          const dataProducer = this.peers[peerId].dataProducers[dataProducerId]?.[peerRouterIndex];
          if (dataProducer?.appData) {
            syncData[peerId].dataProducers[dataProducerId] = dataProducer.appData;
          }
        }
      }
    }
    return syncData;
  }

  async initializeMediasoupWorkersAndRouters() {
    this.workers = [];
    this.routers = [];

    for (let i = 0; i < config.mediasoup.numWorkers; i++) {
      try {
        const worker = await mediasoup.createWorker(config.mediasoup.workerSettings);
        worker.on("died", (error) => {
          console.error("Mediasoup worker died: ", error);
        });

        const router = await worker.createRouter({
          mediaCodecs: config.mediasoup.routerOptions.mediaCodecs,
        });
        this.workers[i] = worker;
        this.routers[i] = router;
      } catch (error) {
        console.error("Error initializing mediasoup workers and routers:", error);
        throw error;
      }
    }
  }

  getNewPeerRouterIndex() {
    this.currentPeerRouterIndex = this.currentPeerRouterIndex + 1;

    if (this.currentPeerRouterIndex >= this.routers.length) {
      this.currentPeerRouterIndex = 0;
    }
    logger(`Assigning peer to router # ${this.currentPeerRouterIndex}`);
    return this.currentPeerRouterIndex;
  }

  addPeer(socket) {
    this.peers[socket.id] = {
      socket: socket,
      room: undefined,
      routerIndex: this.getNewPeerRouterIndex(),
      transports: {},
      producers: {},
      consumers: {},
      dataProducers: {},
      dataConsumers: {},
    };
  }
  async removePeer(id) {
    logger(`Removing and cleaning up peer ${id}`);
    const peer = this.peers[id];

    if (!peer) return;

    const existingRoomId = peer.room;
    if (existingRoomId) {
      logger(`Removing peer from room ${existingRoomId}.`);
      await this.removePeerFromRoom({ peerId: id, roomId: existingRoomId });
    }

    // close transports
    for (const transportId in peer.transports) {
      logger("Closing transport");
      peer.transports[transportId].close();
    }

    // remove from this.peers
    delete this.peers[id];
  }

  async handleSocketRequest(id, request, callback) {
    logger(`Received request of type ${request.type} from peer ${id}.  \nRequest data: %j`, request.data);
    logger
    switch (request.type) {
      case "joinRoom": {
        this.addPeerToRoom({ peerId: id, roomId: request.data.roomId });
        callback({ success: true });
        break;
      }

      case "leaveRoom": {
        this.removePeerFromRoom({ peerId: id, roomId: request.data.roomId });
        callback({ success: true });
        break;
      }

      case "getRouterRtpCapabilities": {
        try {
          const peerRouter = this.getRouterForPeer(id);
          callback({ success: true, routerRtpCapabilities: peerRouter.rtpCapabilities });
        } catch (error) {
          callback({ error: "Internal server error: " + (error?.message || error?.toString() || "Unknown error") });
          return;
        }
        break;
      }

      case "createWebRtcTransport": {
        logger("Creating WebRTC transport!");
        try {
          const transportInfo = await this.createTransportForPeer(id, request.data);
          callback({ success: true, transportInfo });
        } catch (error) {
          callback({ error: "Internal server error: " + (error?.message || error?.toString() || "Unknown error") });
          return;
        }
        break;
      }

      case "connectWebRtcTransport": {
        logger("Connecting WebRTC transport!");

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
        logger("Creating server-side producer!");

        try {
          const producer = await this.createProducer(id, request.data);
          callback({ success: true, id: producer.id });
        } catch (error) {
          callback({ error: "Internal server error: " + (error?.message || error?.toString() || "Unknown error") });
          return;
        }


        // update room

        break;
      }

      case "produceData": {
        logger("Creating server-side data producer");


        try {
          const producer = await this.createDataProducer(id, request.data);
          callback({ success: true, id: producer.id });
        } catch (error) {
          callback({ error: "Internal server error: " + (error?.message || error?.toString() || "Unknown error") });
          return;
        }

        break;
      }

      case "createConsumer": {
        logger(
          `Peer ${id} requesting producer ${request.data.producerId} from peer ${request.data.producingPeerId}`
        );
        try {
          const consumer = await this.getOrCreateConsumerForPeer(
            id,
            request.data.producingPeerId,
            request.data.producerId
          );


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

          // send the consumer info to the consuming peer
          this.peers[id].socket.emit("mediasoupSignaling", {
            type: "createConsumer",
            data: consumerInfo,
          });

          callback({ success: true });
        } catch (error) {
          callback({ error: "Internal server error: " + (error?.message || error?.toString() || "Unknown error") });
          return;
        }
        break;
      }

      case "createDataConsumer": {
        logger("Connecting peer to other peer!");
        try {
          const dataConsumer = await this.getOrCreateDataConsumerForPeer(
            id,
            request.data.producingPeerId,
            request.data.producerId
          );

          const dataConsumerInfo = {
            peerId: request.data.producingPeerId,
            dataProducerId: request.data.producerId,
            id: dataConsumer.id,
            sctpStreamParameters: dataConsumer.sctpStreamParameters,
            label: dataConsumer.label,
            protocol: dataConsumer.protocol,
            appData: dataConsumer.appData,
          };

          this.peers[id].socket.emit("mediasoupSignaling", {
            type: "createDataConsumer",
            data: dataConsumerInfo,
          });
          callback({ success: true });
        } catch (error) {
          callback({ error: "Internal server error: " + (error?.message || error?.toString() || "Unknown error") });
          return;
        }
        break;
      }

      case "pauseConsumer": {
        logger("Pausing consumer!");
        try {
          const consumer = this.getConsumer(id, request.data.producerId);

          if (!consumer) {
            console.warn("No consumer found!");
            break;
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
        logger("Resuming consumer!");

        try {
          const consumer = this.getConsumer(id, request.data.producerId);

          if (!consumer) {
            console.warn("No consumer found!");
            break;
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
        logger("Closing consumer!");
        try {
          const consumer = this.getConsumer(id, request.data.producerId);

          if (!consumer) {
            console.warn("No consumer found!");
            break;
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
          logger("Closed producer");

        } catch (error) {
          callback({ error: "Internal server error: " + (error?.message || error?.toString() || "Unknown error") });
          return;
        }

        break;
      }
    }
  }

  addPeerToRoom({ peerId, roomId }) {
    logger(`Adding peer ${peerId} to join room ${roomId}.`);

    const existingRoomId = this.peers[peerId].room;
    if (existingRoomId) {
      logger(`Peer is already in room ${existingRoomId}.`);
      this.removePeerFromRoom({ peerId, roomId: existingRoomId });
    }

    // if we haven't seen this room before, create it
    if (!this.rooms.hasOwnProperty(roomId)) {
      this.rooms[roomId] = [];
    }

    // tell new peer about the existing peers (and their available producers)
    const existingPeerIds = structuredClone(this.rooms[roomId]);
    logger("existing peers in room ", roomId, ": ", existingPeerIds);

    // tell everyone else that this peer just joined
    existingPeerIds.forEach((existingPeerId) => {
      console.log("telling", existingPeerId, "about new peer:", peerId);
      this.peers[existingPeerId]?.socket.emit("mediasoupSignaling", {
        type: "peerConnection",
        data: [peerId],
      });
    });

    // add peer to this room:
    this.rooms[roomId].push(peerId);
    this.peers[peerId].room = roomId;

    // tell this peer about everyone else
    if (existingPeerIds.length > 0) {
      this.peers[peerId].socket.emit("mediasoupSignaling", {
        type: "peerConnection",
        data: existingPeerIds,
      });
    }
  }

  async removePeerFromRoom({ peerId, roomId }) {
    logger(`Removing peer with id ${peerId} from room with id${roomId}`);

    if (!this.rooms[roomId] || !this.peers[peerId]) return;

    // remove this peer from room
    this.rooms[roomId] = this.rooms[roomId].filter((roomPeerId) => roomPeerId !== peerId);
    this.peers[peerId].room = null;

    // disconnect this peer from others within the room:
    const consumerIds = Object.keys(this.peers[peerId].consumers);
    const dataConsumerIds = Object.keys(this.peers[peerId].dataConsumers);
    consumerIds.forEach(async (consumerId) => {
      await this.closeConsumer({ peerId, consumer: this.peers[peerId].consumers[consumerId] });
    });
    dataConsumerIds.forEach(async (consumerId) => {
      await this.closeDataConsumer({
        peerId,
        consumer: this.peers[peerId].dataConsumers[consumerId],
      });
    });

    // emit peer disconnection events for other peers to the peer that is leaving
    this.peers[peerId].socket.emit("mediasoupSignaling", {
      type: "peerDisconnection",
      data: this.rooms[roomId]
    });


    // inform remaining peers
    const producerIds = Object.keys(this.peers[peerId].producers);
    const dataProducerIds = Object.keys(this.peers[peerId].dataProducers);

    const remainingRoomPeerIds = this.rooms[roomId];
    remainingRoomPeerIds.forEach(async (otherPeerId) => {
      const otherPeer = this.peers[otherPeerId];
      if (!otherPeer) return;

      otherPeer.socket.emit("mediasoupSignaling", {
        type: "peerDisconnection",
        data: [peerId],
      });

      producerIds.forEach(async (pid) => {
        const consumer = otherPeer.consumers[pid];
        if (consumer) {
          await this.closeConsumer({ peerId: otherPeerId, consumer });
        }
      });
      dataProducerIds.forEach(async (pid) => {
        const consumer = otherPeer.dataConsumers[pid];
        if (consumer) {
          await this.closeDataConsumer({ peerId: otherPeerId, consumer });
        }
      });
    });

    if (remainingRoomPeerIds.length === 0) {
      logger(`Room ${roomId} empty.  Removing it.`);
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

  getRouterForPeer(peerId) {
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
    automatically get the corresponding producer or create a pipe producer if needed, 
    then call this.createConsumer to create the corresponding consumer.
    */
  async getOrCreateConsumerForPeer(consumingPeerId, producingPeerId, producerId) {
    try {
      const existingConsumer = this.peers[consumingPeerId]?.consumers?.[producerId];

      if (existingConsumer) {
        logger("Already consuming!");
        return existingConsumer;
      }

      logger("Creating new consumer!");

      // use our queue to avoid multiple peers requesting the same pipeProducer
      // at the same time
      return await this.queue.push(async () => {
        try {
          // Validate peers exist
          const consumingPeer = this.peers[consumingPeerId];
          const producingPeer = this.peers[producingPeerId];
          if (!consumingPeer) throw new Error(`Consuming peer ${consumingPeerId} not found`);
          if (!producingPeer) throw new Error(`Producing peer ${producingPeerId} not found`);

          // first check whether the producer or one of its pipe producers exists
          // on the consuming peer's router:
          const consumingPeerRouterIndex = consumingPeer.routerIndex;

          const producerMapForPeer = producingPeer.producers[producerId];
          if (!producerMapForPeer) {
            throw new Error(
              `Producer ${producerId} not found for producing peer ${producingPeerId}`
            );
          }

          let producerOrPipeProducer = producerMapForPeer[consumingPeerRouterIndex];
          logger("Current producer: ", !!producerOrPipeProducer);

          if (!producerOrPipeProducer) {
            // if it doesn't exist, create a new pipe producer
            const producingRouterIndex = producingPeer.routerIndex;
            logger(
              `Creating pipe producer ID ${producerId} from router ${producingRouterIndex} to peer ${consumingPeerId} in router ${consumingPeerRouterIndex}!`
            );

            const { pipeProducer } = await this.routers[producingRouterIndex].pipeToRouter({
              producerId: producerId,
              router: this.routers[consumingPeerRouterIndex],
            });

            // add the pipe producer to the producing peer's object of producers:
            producingPeer.producers[producerId][consumingPeerRouterIndex] = pipeProducer;

            producerOrPipeProducer = pipeProducer;
          }

          const newConsumer = await this.createConsumer(consumingPeerId, producerOrPipeProducer);

          if (!newConsumer) return null;

          // add new consumer to the consuming peer's consumers object:
          this.peers[consumingPeerId].consumers[producerId] = newConsumer;

          return newConsumer;
        } catch (err) {
          logger("Error in getOrCreateConsumerForPeer await queue task:", err);
          throw err;
        }
      });
    } catch (err) {
      logger("Error in getOrCreateConsumerForPeer:", err);
      throw err;
    }
  }

  /*
    Given a consumingPeerId, a producingPeerId and a producerId, this function will 
    automatically get the corresponding producer or create a pipe producer if needed, 
    then call this.createConsumer to create the corresponding consumer.
    */
  async getOrCreateDataConsumerForPeer(consumingPeerId, producingPeerId, producerId) {
    try {
      const existingConsumer = this.peers[consumingPeerId]?.dataConsumers?.[producerId];

      if (existingConsumer) {
        logger("Already consuming!");
        return existingConsumer;
      }

      logger("Creating new data consumer!");

      // use our queue to avoid multiple peers requesting the same pipeProducer
      // at the same time
      return await this.queue.push(async () => {
        try {
          // Validate peers exist
          const consumingPeer = this.peers[consumingPeerId];
          const producingPeer = this.peers[producingPeerId];
          if (!consumingPeer) throw new Error(`Consuming peer ${consumingPeerId} not found`);
          if (!producingPeer) throw new Error(`Producing peer ${producingPeerId} not found`);

          // first check whether the producer or one of its pipe producers exists
          // on the consuming peer's router:
          const consumingPeerRouterIndex = consumingPeer.routerIndex;
          const dataProducerMapForPeer = producingPeer.dataProducers[producerId];
          if (!dataProducerMapForPeer) {
            throw new Error(
              `Data producer ${producerId} not found for producing peer ${producingPeerId}`
            );
          }

          let producerOrPipeProducer = dataProducerMapForPeer[consumingPeerRouterIndex];
          logger("Current producer: ", !!producerOrPipeProducer);

          if (!producerOrPipeProducer) {
            // if it doesn't exist, create a new pipe producer
            const producingRouterIndex = producingPeer.routerIndex;
            logger(
              `Creating pipe data producer ID ${producerId} from router ${producingRouterIndex} to peer ${consumingPeerId} in router ${consumingPeerRouterIndex}!`
            );

            const { pipeDataProducer } = await this.routers[producingRouterIndex].pipeToRouter({
              dataProducerId: producerId,
              router: this.routers[consumingPeerRouterIndex],
            });

            // add the pipe producer to the producing peer's object of producers:
            producingPeer.dataProducers[producerId][consumingPeerRouterIndex] =
              pipeDataProducer;

            producerOrPipeProducer = pipeDataProducer;
          }

          const newConsumer = await this.createDataConsumer(
            consumingPeerId,
            producerOrPipeProducer
          );

          if (!newConsumer) return null;

          // add new consumer to the consuming peer's consumers object:
          this.peers[consumingPeerId].dataConsumers[producerId] = newConsumer;

          return newConsumer;
        } catch (err) {
          logger("Error in getOrCreateDataConsumerForPeer task:", err);
          throw err;
        }
      });
    } catch (err) {
      logger("Error in getOrCreateDataConsumerForPeer:", err);
      throw err;
    }
  }

  async createConsumer(consumingPeerId, producer) {
    try {
      const transport = this.getRecvTransportForPeer(consumingPeerId);

      const consumer = await transport.consume({
        producerId: producer.id,
        rtpCapabilities: this.routers[this.peers[consumingPeerId].routerIndex].rtpCapabilities,
        paused: true,
        appData: producer.appData,
      });

      this.peers[consumingPeerId].consumers[producer.id] = consumer;

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
      logger("Error in createConsumer:", err);
      throw err;
    }
  }

  async closeConsumer({ peerId, consumer }) {
    logger(`Closing consumer ${consumer.id} from peer ${peerId}`);
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
      console.error("Error in closeConsumer:", err);
    }
  }

  async createDataConsumer(consumingPeerId, producer) {
    let dataConsumer;
    try {
      const transport = this.getRecvTransportForPeer(consumingPeerId);

      // create the data consumer
      dataConsumer = await transport.consumeData({
        dataProducerId: producer.id,
      });
    } catch (err) {
      logger(err);
      throw err;
    }

    // logger("consumer paused after creation? ", consumer.paused);
    // logger("consumerID: ", consumer.id);
    // logger("producerID:", consumer.producerId);

    this.peers[consumingPeerId].dataConsumers[producer.id] = dataConsumer;

    // Set Consumer events.
    dataConsumer.on("transportclose", () => {
      // Remove from its map.
      this.closeDataConsumer({ peerId: consumingPeerId, consumer: dataConsumer });

    });

    dataConsumer.on("producerclose", () => {
      logger("Producer closed! Closing server-side consumer!");

      this.closeDataConsumer({ peerId: consumingPeerId, consumer: dataConsumer });
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

    return dataConsumer;
  }

  async closeDataConsumer({ peerId, consumer }) {
    try {
      //  close the server-side consumer
      await consumer.close();

      // tell the peer to close their corresponding consumer
      this.peers[peerId]?.socket?.emit("mediasoupSignaling", {
        type: "dataConsumerClosed",
        data: {
          producingPeerId: consumer.appData.peerId,
          producerId: consumer.producerId,
        },
      });

      // delete reference to this consumer
      if (!this.peers[peerId] || !this.peers[peerId].dataConsumers) return;
      delete this.peers[peerId].dataConsumers[consumer.producerId];
    } catch (err) {
      console.error("Error in closeDataConsumer:", err);
    }
  }

  async createProducer(producingPeerId, data) {
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

      if (appData.broadcast) {
        this.broadcastProducer(producingPeerId, producer.id);
      }
      return producer;

    } catch (error) {
      logger("Error in createProducer:", error);
      throw error;
    }
  }

  async createDataProducer(producingPeerId, data) {
    const { transportId, sctpStreamParameters, label, protocol, appData } = data;

    try {

      const transport = this.getTransportForPeer(producingPeerId, transportId);

      const dataProducer = await transport.produceData({
        sctpStreamParameters,
        label,
        protocol,
        appData,
      });

      // add producer to the peer object
      this.peers[producingPeerId].dataProducers[dataProducer.id] = {};
      this.peers[producingPeerId].dataProducers[dataProducer.id][
        this.peers[producingPeerId].routerIndex
      ] = dataProducer;

      // // Create a server-side DataConsumer for each Peer.
      // for (const otherPeer of this._getJoinedPeers({ excludePeer: peer })) {
      //   this._createDataConsumer({
      //     dataConsumerPeer: otherPeer,
      //     dataProducerPeer: peer,
      //     dataProducer,
      //   });
      // }

      return dataProducer;
    } catch (error) {
      logger("Error in createDataProducer:", error);
      throw error;
    }
  }

  async broadcastProducer(producingPeerId, producerId) {
    // automatically create consumers for every other peer to consume this producer

    for (const consumingPeerId in this.peers) {
      if (consumingPeerId !== producingPeerId) {
        try {
          const consumer = await this.getOrCreateConsumerForPeer(
            consumingPeerId,
            producingPeerId,
            producerId
          );

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

          // send the consumer info to the consuming peer
          this.peers[consumingPeerId].socket.emit("mediasoupSignaling", {
            type: "createConsumer",
            data: consumerInfo,
          });
        } catch (error) {
          console.error("Error in broadcastProducer:", error);
        }
      }
    }
  }

  async createTransportForPeer(id, data) {
    try {
      const { producing, consuming, sctpCapabilities } = data;

      const webRtcTransportOptions = {
        ...config.mediasoup.webRtcTransportOptions,
        enableSctp: true,
        numSctpStreams: sctpCapabilities.numStreams,
        appData: { producing, consuming },
      };

      const router = this.getRouterForPeer(id);

      const transport = await router.createWebRtcTransport(
        webRtcTransportOptions
      );

      transport.on("sctpstatechange", (sctpState) => {
        logger('WebRtcTransport "sctpstatechange" event [sctpState:%s]', sctpState);
      });

      transport.on("dtlsstatechange", (dtlsState) => {
        if (dtlsState === "failed" || dtlsState === "closed")
          logger('WebRtcTransport "dtlsstatechange" event [dtlsState:%s]', dtlsState);
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
      logger(err);
      throw err;
    }
  }
}

module.exports = SimpleMediasoupPeerServer;
