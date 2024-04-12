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
const EventEmitter = require("eventemitter3");

const config = require("./config");
const debug = require("debug");
const logger = debug("SimpleMediasoupPeer:server");

const FFmpeg = require("./ffmpeg");

const { getPort, releasePort } = require("./port");

const Process = require("child_process");
class SimpleMediasoupPeerServer extends EventEmitter {
  constructor(options = {}) {
    super();
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

      socket.on("mediasoupSignaling", (data, callback) => {
        this.handleSocketRequest(socket.id, data, callback);
      });
    });

    setInterval(() => {
      this.sendSyncDataToAllRooms();
    }, 1000);
  }

  sendSyncDataToAllRooms() {
    // const allRooms = this.io.of("/").adapter.rooms;
    const allRooms = Object.keys(this.rooms);
    // logger("Sending sync data to all rooms:", allRooms);
    for (const roomId of allRooms) {
      const syncData = this.getSyncDataForRoom(roomId);
      const peerIdsInRoom = this.rooms[roomId];
      if (!syncData) {
        delete this.rooms[roomId];
      } else {
        peerIdsInRoom.forEach((pid) => {
          this.peers[pid].socket.emit("mediasoupSignaling", {
            type: "availableProducers",
            data: syncData,
          });
        });
        // logger("sending sync data to room", roomId, ":", syncData);
      }
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
    // const peersInRoom = this.io.sockets.adapter.rooms.get(roomId);
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
          const producer = this.peers[peerId].producers[producerId][peerRouterIndex];
          syncData[peerId].producers[producerId] = producer.appData;
        }
        for (const dataProducerId in this.peers[peerId].dataProducers) {
          let peerRouterIndex = this.peers[peerId].routerIndex;
          const dataProducer = this.peers[peerId].dataProducers[dataProducerId][peerRouterIndex];
          syncData[peerId].dataProducers[dataProducerId] = dataProducer.appData;
        }
      }
    }
    // for (const peerId in this.peers) {
    //   if (this.rooms[roomId].has(peerId)) {
    //     syncData[peerId] = {};
    //     for (const producerId in this.peers[peerId].producers) {
    //       let peerRouterIndex = this.peers[peerId].routerIndex;
    //       const producer =
    //         this.peers[peerId].producers[producerId][peerRouterIndex];
    //       syncData[peerId][producerId] = producer.appData;
    //     }
    //   }
    // }
    return syncData;
  }

  async initializeMediasoupWorkersAndRouters() {
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
    logger(
      `Received request of type ${request.type} from peer ${id}.  \nRequest data: %j`,
      request.data
    );
    logger;
    switch (request.type) {
      case "joinRoom": {
        this.addPeerToRoom({ peerId: id, roomId: request.data.roomId });
        callback();
        break;
      }

      case "leaveRoom": {
        this.removePeerFromRoom({ peerId: id, roomId: request.data.roomId });
        callback();
        break;
      }

      case "getRouterRtpCapabilities": {
        callback(this.routers[this.peers[id].routerIndex].rtpCapabilities);
        break;
      }

      case "createWebRtcTransport": {
        logger("Creating WebRTC transport!");
        const callbackData = await this.createTransportForPeer(id, request.data);
        callback(callbackData);
        break;
      }

      case "connectWebRtcTransport": {
        logger("Connecting WebRTC transport!");
        const { transportId, dtlsParameters } = request.data;
        const transport = this.peers[id].transports[transportId];

        if (!transport) throw new Error(`transport with id "${transportId}" not found`);

        await transport.connect({ dtlsParameters });

        callback();

        break;
      }

      case "produce": {
        logger("Creating server-side producer!");

        const producer = await this.createProducer(id, request.data);
        callback({ id: producer.id });

        this.emit("newProducer", { producingPeerId: id, producerId: producer.id });

        // update room

        break;
      }

      case "produceData": {
        logger("Creating server-side data producer");
        const producer = await this.createDataProducer(id, request.data);
        callback({ id: producer.id });

        break;
      }

      case "createConsumer": {
        logger(
          `Peer ${id} requesting producer ${request.data.producerId} from peer ${request.data.producingPeerId}`
        );
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

      case "createDataConsumer": {
        logger("Connecting peer to other peer!");
        let dataConsumer = await this.getOrCreateDataConsumerForPeer(
          id,
          request.data.producingPeerId,
          request.data.producerId
        );

        if (dataConsumer) {
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
        }
        callback();
        break;
      }

      case "pauseConsumer": {
        logger("Pausing consumer!");
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
        logger("Resuming consumer!");

        const consumer = this.getConsumer(id, request.data.producerId);

        if (!consumer) {
          console.warn("No consumer found!");
          break;
        }
        await consumer.resume();
        callback();

        break;
      }

      case "closeConsumer": {
        logger("Closing consumer!");
        const consumer = this.getConsumer(id, request.data.producerId);

        if (!consumer) {
          console.warn("No consumer found!");
          break;
        }

        this.closeConsumer({ peerId: id, consumer });

        callback();

        break;
      }

      case "closeProducer": {
        logger("Closing producer!");

        const { producerId } = request.data;
        const producers = this.peers[id].producers[producerId];

        for (const routerIndex in producers) {
          const producer = producers[routerIndex];
          producer.close();
        }

        // update room

        delete this.peers[id].producers[producerId];

        callback();

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
    logger(`Peer with id ${peerId} leaving room ${roomId}.`);

    if (!this.rooms[roomId]) return;

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
      data: this.rooms[roomId],
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
  async getOrCreateConsumerForPeer(consumingPeerId, producingPeerId, producerId) {
    let existingConsumer = this.peers[consumingPeerId].consumers[producerId];

    if (existingConsumer) {
      logger("Already consuming!");
      return existingConsumer;
    }

    logger("Creating new consumer!");

    // use our queue to avoid multiple peers requesting the same pipeProducer
    // at the same time
    this.queue
      .push(async () => {
        // first check whether the producer or one of its pipe producers exists
        // on the consuming peer's router:
        let consumingPeerRouterIndex = this.peers[consumingPeerId].routerIndex;
        // logger(this.peers[producingPeerId].producers);
        console.log(
          `looking for producer id ${producerId} from ${producingPeerId} in router index ${consumingPeerRouterIndex}`
        );
        let producerOrPipeProducer =
          this.peers[producingPeerId].producers[producerId][consumingPeerRouterIndex];

        logger("Current producer: ", !!producerOrPipeProducer);

        if (!producerOrPipeProducer) {
          // if it doesn't exist, create a new pipe producer
          let producingRouterIndex = this.peers[producingPeerId].routerIndex;
          logger(
            `Creating pipe producer ID ${producerId} from router ${producingRouterIndex} to peer ${consumingPeerId} in router ${consumingPeerRouterIndex}!`
          );

          // this.peers[producingPeerId].producers[producerId][
          //   consumingPeerRouterIndex
          // ] = "creating";

          try {
            const { pipeProducer } = await this.routers[producingRouterIndex].pipeToRouter({
              producerId: producerId,
              router: this.routers[consumingPeerRouterIndex],
            });

            // add the pipe producer to the producing peer's object of producers:
            this.peers[producingPeerId].producers[producerId][consumingPeerRouterIndex] =
              pipeProducer;

            producerOrPipeProducer = pipeProducer;
          } catch (err) {
            console.error("Pipe To Router Error!");
          }
        }

        let newConsumer = await this.createConsumer(consumingPeerId, producerOrPipeProducer);

        if (!newConsumer) return null;

        // add new consumer to the consuming peer's consumers object:
        this.peers[consumingPeerId].consumers[producerId] = newConsumer;

        return newConsumer;
      })
      .catch((e) => {
        console.error(e);
      });
  }

  /*
    Given a consumingPeerId, a producingPeerId and a producerId, this function will 
    automatically get the corresponding producer or create a pipe producer if needed, 
    then call this.createConsumer to create the corresponding consumer.
    */
  async getOrCreateDataConsumerForPeer(consumingPeerId, producingPeerId, producerId) {
    let existingConsumer = this.peers[consumingPeerId].dataConsumers[producerId];

    if (existingConsumer) {
      logger("Already consuming!");
      return existingConsumer;
    }

    logger("Creating new data consumer!");

    // use our queue to avoid multiple peers requesting the same pipeProducer
    // at the same time
    this.queue
      .push(async () => {
        // first check whether the producer or one of its pipe producers exists
        // on the consuming peer's router:
        let consumingPeerRouterIndex = this.peers[consumingPeerId].routerIndex;
        // logger(this.peers[producingPeerId].producers);
        let producerOrPipeProducer =
          this.peers[producingPeerId].dataProducers[producerId][consumingPeerRouterIndex];

        logger("Current producer: ", !!producerOrPipeProducer);

        if (!producerOrPipeProducer) {
          // if it doesn't exist, create a new pipe producer
          let producingRouterIndex = this.peers[producingPeerId].routerIndex;
          logger(
            `Creating pipe data producer ID ${producerId} from router ${producingRouterIndex} to peer ${consumingPeerId} in router ${consumingPeerRouterIndex}!`
          );

          // this.peers[producingPeerId].producers[producerId][
          //   consumingPeerRouterIndex
          // ] = "creating";

          try {
            const { pipeDataProducer } = await this.routers[producingRouterIndex].pipeToRouter({
              dataProducerId: producerId,
              router: this.routers[consumingPeerRouterIndex],
            });

            // add the pipe producer to the producing peer's object of producers:
            this.peers[producingPeerId].dataProducers[producerId][consumingPeerRouterIndex] =
              pipeDataProducer;

            producerOrPipeProducer = pipeDataProducer;
          } catch (err) {
            console.error("Pipe To Router Error!");
          }
        }

        let newConsumer = await this.createDataConsumer(consumingPeerId, producerOrPipeProducer);

        if (!newConsumer) return null;

        // add new consumer to the consuming peer's consumers object:
        this.peers[consumingPeerId].dataConsumers[producerId] = newConsumer;

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
        console.warn(`No receive transport found for peer with ID ${consumingPeerId}`);
        return null;
      }
      consumer = await transport.consume({
        producerId: producer.id,
        rtpCapabilities: this.routers[this.peers[consumingPeerId].routerIndex].rtpCapabilities,
        paused: true,
        appData: producer.appData,
      });
    } catch (err) {
      logger(err);
    }

    // logger("consumer paused after creation? ", consumer.paused);
    // logger("consumerID: ", consumer.id);
    // logger("producerID:", consumer.producerId);

    this.peers[consumingPeerId].consumers[producer.id] = consumer;

    // Set Consumer events.
    consumer.on("transportclose", () => {
      // Remove from its map.
      delete this.peers[consumingPeerId].consumers[producer.id];
    });

    consumer.on("producerclose", () => {
      logger("Producer closed! Closing server-side consumer!");
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
  }

  async closeConsumer({ peerId, consumer }) {
    logger(`Closing consumer ${consumer.id} from peer ${peerId}`);
    try {
      //  close the server-side consumer
      await consumer.close();

      // tell the peer to close their corresponding consumer
      this.peers[peerId].socket.emit("mediasoupSignaling", {
        type: "consumerClosed",
        data: {
          producingPeerId: consumer.appData.peerId,
          producerId: consumer.producerId,
        },
      });

      // delete reference to this consumer
      delete this.peers[peerId].consumers[consumer.producerId];
    } catch (err) {
      console.log("closeConsumer error:", err);
    }
  }

  async createDataConsumer(consumingPeerId, producer) {
    let dataConsumer;
    try {
      let transport = this.getRecvTransportForPeer(consumingPeerId);

      if (!transport) {
        console.warn(`No receive transport found for peer with ID ${consumingPeerId}`);
        return null;
      }
      dataConsumer = await transport.consumeData({
        dataProducerId: producer.id,
      });
    } catch (err) {
      logger(err);
    }

    // logger("consumer paused after creation? ", consumer.paused);
    // logger("consumerID: ", consumer.id);
    // logger("producerID:", consumer.producerId);

    this.peers[consumingPeerId].dataConsumers[producer.id] = dataConsumer;

    // Set Consumer events.
    dataConsumer.on("transportclose", () => {
      // Remove from its map.
      delete this.peers[consumingPeerId].consumers[producer.id];
    });

    dataConsumer.on("producerclose", () => {
      logger("Producer closed! Closing server-side consumer!");

      this.peers[consumingPeerId].socket.emit("mediasoupSignaling", {
        type: "dataConsumerClosed",
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

    return dataConsumer;
  }

  async closeDataConsumer({ peerId, consumer }) {
    try {
      //  close the server-side consumer
      await consumer.close();

      // tell the peer to close their corresponding consumer
      this.peers[peerId].socket.emit("mediasoupSignaling", {
        type: "dataConsumerClosed",
        data: {
          producingPeerId: consumer.appData.peerId,
          producerId: consumer.producerId,
        },
      });

      // delete reference to this consumer
      delete this.peers[peerId].dataConsumers[consumer.producerId];
    } catch (err) {
      console.log("closeDataConsumer error:", err);
    }
  }

  async createProducer(producingPeerId, data) {
    const { transportId, kind, rtpParameters } = data;
    let { appData } = data;
    appData = { ...appData, peerId: producingPeerId };

    const transport = this.getTransportForPeer(producingPeerId, transportId);

    if (!transport) throw new Error(`transport with id "${transportId}" not found`);

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
  }

  async createDataProducer(producingPeerId, data) {
    const { transportId, sctpStreamParameters, label, protocol, appData } = data;

    const transport = this.getTransportForPeer(producingPeerId, transportId);

    if (!transport) throw new Error(`transport with id "${transportId}" not found`);

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
    }
  }

  async recordToFile({ producingPeerId, producerId, filename }) {
    // first generate an RTP transport for the given router
    const routerToUse = this.getRouterForPeer(producingPeerId);

    const serverSideConsumerPeerId = "ServerSideConsumerPeer_" + Math.random().toString();
    this.peers[serverSideConsumerPeerId] = {
      routerIndex: routerToUse,
      transports: {},
      producers: {},
      consumers: {},
    };

    const transport = await routerToUse.createPlainTransport({
      listenInfo: { protocol: "udp", ip: "192.168.8.91" },
      rtcpMux: false,
      comedia: false,
    });

    // save the transport under a new peer
    this.peers[serverSideConsumerPeerId].transports[transport.id] = transport;

    const remoteRtpPort = await getPort();
    const remoteRtcpPort = await getPort();
    // connect the transport to a given set of ports
    await transport.connect({
      ip: "192.168.8.91",
      port: remoteRtpPort,
      rtcpPort: remoteRtcpPort,
    });

    console.log(
      "mediasoup VIDEO RTP SEND transport connected: %s:%d <--> %s:%d (%s)",
      transport.tuple.localIp,
      transport.tuple.localPort,
      transport.tuple.remoteIp,
      transport.tuple.remotePort,
      transport.tuple.protocol
    );

    console.log(
      "mediasoup VIDEO RTCP SEND transport connected: %s:%d <--> %s:%d (%s)",
      transport.rtcpTuple.localIp,
      transport.rtcpTuple.localPort,
      transport.rtcpTuple.remoteIp,
      transport.rtcpTuple.remotePort,
      transport.rtcpTuple.protocol
    );

    // then decide which codecs will work
    const producer =
      this.peers[producingPeerId].producers[producerId][this.peers[producingPeerId].routerIndex];
    console.log({ producer });

    const codecs = [];
    // Codec passed to the RTP Consumer must match the codec in the Mediasoup router rtpCapabilities
    const routerCodec = routerToUse.rtpCapabilities.codecs.find(
      (codec) => codec.kind === producer.kind
    );
    codecs.push(routerCodec);

    const sharedRtpCapabilities = {
      codecs,
      rtcpFeedback: [],
    };

    console.log("codecs:", sharedRtpCapabilities.codecs);

    // then create an RTP consumer which will consume the producer using the newly
    // created RTP transport
    const rtpConsumer = await transport.consume({
      producerId: producerId,
      rtpCapabilities: sharedRtpCapabilities, // Assume the recorder supports same formats as mediasoup's router
      paused: true,
    });

    console.log(
      "mediasoup VIDEO RTP SEND consumer created, kind: %s, type: %s, paused: %s, SSRC: %s CNAME: %s",
      rtpConsumer.kind,
      rtpConsumer.type,
      rtpConsumer.paused,
      rtpConsumer.rtpParameters.encodings[0].ssrc,
      rtpConsumer.rtpParameters.rtcp.cname
    );

    // setInterval(async () => {
    //   let stats = await transport.getStats();
    //   console.log(stats);
    // }, 4000);

    // save this info so we know what to give FFMPEG
    const recordInfo = {};

    recordInfo["video"] = {
      remoteRtpPort: transport.tuple.remotePort,
      remoteRtcpPort: transport.rtcpTuple.remotePort,
      localRtcpPort: transport.rtcpTuple ? transport.rtcpTuple.localPort : undefined,
      rtpCapabilities: sharedRtpCapabilities,
      rtpParameters: rtpConsumer.rtpParameters,
    };

    recordInfo.fileName = Date.now().toString();

    const process = new FFmpeg(recordInfo);

    setTimeout(async () => {
      // for (const consumer of peer.consumers) {
      // Sometimes the consumer gets resumed before the GStreamer process has fully started
      // so wait a couple of seconds
      await rtpConsumer.resume();
      await rtpConsumer.requestKeyFrame();
      // }
    }, 1000);

    // // start ffmpeg process
    // const useAudio = false;
    // const useVideo = true;
    // const useH264 = false;

    // const cmdProgram = "ffmpeg"; // Found through $PATH

    // let cmdInputPath = `${__dirname}/sdp-files/input-vp8.sdp`;
    // let cmdOutputPath = `${__dirname}/${filename}`;
    // let cmdCodec = "";
    // let cmdFormat = "-f webm -flags +global_header";

    // if (useAudio) {
    //   cmdCodec += " -map 0:a:0 -c:a copy";
    // }
    // if (useVideo) {
    //   cmdCodec += " -map 0:v:0 -c:v copy";

    //   if (useH264) {
    //     cmdInputPath = `${__dirname}/sdp-files/input-h264.sdp`;
    //     cmdOutputPath = `${__dirname}/recordings/output-ffmpeg-h264.mp4`;

    //     // "-strict experimental" is required to allow storing
    //     // OPUS audio into MP4 container
    //     cmdFormat = "-f mp4 -strict experimental";
    //   }
    // }

    // // Run process
    // const cmdArgStr = [
    //   "-nostdin",
    //   "-analyzeduration 5M",
    //   "-probesize 5M",
    //   "-protocol_whitelist file,rtp,udp",
    //   // "-loglevel debug",
    //   // "-fflags +genpts",
    //   `-i ${cmdInputPath}`,
    //   cmdCodec,
    //   cmdFormat,
    //   `-y ${cmdOutputPath}`,
    // ]
    //   .join(" ")
    //   .trim();

    // console.log(`Run command: ${cmdProgram} ${cmdArgStr}`);

    // let recProcess = Process.spawn(cmdProgram, cmdArgStr.split(/\s+/));
    // global.recProcess = recProcess;

    // recProcess.on("error", (err) => {
    //   console.error("Recording process error:", err);
    // });

    // recProcess.on("exit", (code, signal) => {
    //   console.log("Recording process exit, code: %d, signal: %s", code, signal);

    //   global.recProcess = null;
    //   // stopMediasoupRtp();

    //   if (!signal || signal === "SIGINT") {
    //     console.log("Recording stopped");
    //   } else {
    //     console.warn("Recording process didn't exit cleanly, output file might be corrupt");
    //   }
    // });

    // // FFmpeg writes its logs to stderr
    // recProcess.stderr.on("data", (chunk) => {
    //   chunk
    //     .toString()
    //     .split(/\r?\n/g)
    //     .filter(Boolean) // Filter out empty strings
    //     .forEach((line) => {
    //       console.log(line);
    //       if (line.startsWith("ffmpeg version")) {
    //         // setTimeout(() => {
    //         //   recResolve();
    //         // }, 1000);
    //       }
    //     });
    // });

    // then resume consumer
    // setTimeout(() => {
    //   rtpConsumer.resume();
    //   setTimeout(() => {
    //     recProcess.kill("SIGINT");
    //   }, 10000);
    // }, 3000);

    // console.log("Plain Transport Tuple: ", transport.tuple);
    // console.log("Plain Transport RTCPTuple: ", transport.rtcpTuple);

    // const appData = {
    //   label: "serverSideVideoProducer",
    //   broadcast: true,
    //   peerId: producingPeerId,
    // };

    // console.log(JSON.stringify(r.rtpCapabilities, null, 4));

    // const producer = await transport.produce({
    //   kind: "video",
    //   rtpParameters: {
    //     mid: "VIDEO",
    //     codecs: [
    //       // for VP9
    //       // {
    //       //   mimeType: "video/VP9",
    //       //   clockRate: 90000,
    //       //   payloadType: 103,
    //       //   parameters: {
    //       //     "profile-id": 2,
    //       //     "x-google-start-bitrate": 1000,
    //       //   },
    //       // },
    //       // {
    //       //   mimeType: "video/vp8",
    //       //   payloadType: 101,
    //       //   clockRate: 90000,
    //       // },
    //       // for h264
    //       {
    //         mimeType: "video/h264",
    //         payloadType: 112,
    //         clockRate: 90000,
    //         parameters: {
    //           "packetization-mode": 1,
    //           "profile-level-id": "4d0032",
    //         },
    //         rtcpFeedback: [
    //           { type: "nack" },
    //           { type: "nack", parameter: "pli" },
    //           { type: "goog-remb" },
    //         ],
    //       },
    //       // {
    //       //   mimeType: "video/rtx",
    //       //   payloadType: 113,
    //       //   clockRate: 90000,
    //       //   parameters: { apt: 112 },
    //       // },
    //     ],
    //     headerExtensions: [
    //       {
    //         uri: "urn:ietf:params:rtp-hdrext:sdes:mid",
    //         id: 10,
    //       },
    //       {
    //         uri: "urn:3gpp:video-orientation",
    //         id: 13,
    //       },
    //     ],
    //     // for vpx
    //     // encodings: [{ ssrc: 2222 }],

    //     // for h264
    //     encodings: [
    //       { ssrc: 22222222, rtx: { ssrc: 22222223 }, scalabilityMode: "L1T3" },
    //       { ssrc: 22222224, rtx: { ssrc: 22222225 } },
    //       { ssrc: 22222226, rtx: { ssrc: 22222227 } },
    //       { ssrc: 22222228, rtx: { ssrc: 22222229 } },
    //     ],
    //     // rtcp: {
    //     //   cname: "video-1",
    //     // },
    //   },
    //   appData: {
    //     label: "serverSideVideoProducer",
    //     broadcast: true,
    //     peerId: producingPeerId,
    //   },
    // });
    // console.log();

    // add producer to the peer object
    // this.peers[producingPeerId].producers[producer.id] = {};
    // this.peers[producingPeerId].producers[producer.id][this.peers[producingPeerId].routerIndex] =
    //   producer;

    // this.broadcastProducer(producingPeerId, producer.id);

    // return {
    //   tuple: transport.tuple,
    //   rtcpTuple: transport.rtcpTuple,
    // };
  }
}

module.exports = SimpleMediasoupPeerServer;
