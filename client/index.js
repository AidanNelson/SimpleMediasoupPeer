/*
simple-mediasoup-peer-client
Aidan Nelson, 2022
https://github.com/AidanNelson/SimpleMediasoupPeer/

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

these are the tracks we would like to produce
used for re-initializing when client experiences
a change in socket ID

this.tracksToProduce = {
    camera: {
      track,
      broadcast: false
    }
}

// these are the tracks we are currently producing
// keyed with their label
this.producers = {
    <label>: <mediasoupProducerObj>,
    "camera": {...},
    "microphone": {...},
    "screenshare": {...}
}

// these are the latest available producers from other peers
// given to us periodically by the server
this.latestAvailableProducers = {
    peerId1: {
        producerId1: 'camera',
        producerId2: 'microphone'
    }
}

// these are our consumers of the producers from the other peers
this.consumers = {
    <peerId>: {
        <producerId>: <mediasoupConsumerObj>
    },
    "asli238gsa2il": {
      "soaidhf138as": {...}
    }
}

// a set of peer IDs of peers we'd like to remain connected to
// this persists through a disconnection event
this.desiredPeerConnections = new Set();

*/
import * as mediasoupClient from "mediasoup-client";
import { io } from "socket.io-client";
const debug = require("debug");
const logger = debug("SimpleMediasoupPeer");

class SimpleMediasoupPeer {
  constructor(options = {}) {
    const defaultOptions = {
      autoConnect: true,
      roomId: null,
      // socket options
      socket: null,
      url: window.location.hostname,
      port: 3000,
      socketClientOptions: {
        path: "/socket.io/",
      },
    };
    this.options = Object.assign(defaultOptions, options);

    logger("Setting up new MediasoupPeer with the following options:", this.options);

    this.device = null;
    this.currentRoomId = null;

    if (this.options.socket) {
      this.socket = this.options.socket;
    } else {
      this.socket = io(
        `${this.options.url}:${this.options.port}`,
        this.options.socketClientOptions
      );
    }

    this.producers = {};
    this.consumers = {};
    this.dataConsumers = {};

    this.sendTransport = null;
    this.recvTransport = null;

    this.tracksToProduce = {};

    this.latestAvailableProducers = {};
    this.desiredPeerConnections = new Set();

    this.publiclyExposedEvents = new Set(["peerConnection", "peerDisconnection", "track", "data"]);
    this.userDefinedCallbacks = {};

    // add promisified socket request to make our lives easier
    this.socket.request = (type, data = {}) => {
      return new Promise((resolve) => {
        this.socket.emit(type, data, resolve);
      });
    };

    // all mediasoupSignaling will come through on this socket event
    this.socket.on("mediasoupSignaling", (data) => {
      this.handleSocketMessage(data);
    });

    this.socket.on("connect", async () => {
      logger("Connected to Socket Server with ID: ", this.socket.id);
      await this.disconnectFromMediasoup();
      await this.initializeMediasoupConnection();

      if (this.options.roomId) {
        this.joinRoom(this.options.roomId);
      } else {
        logger("No room Id set. Please call 'joinRoom' to connect!");
      }
    });

    // this.socket.on("clients", (ids) => {
    //   logger("Got clients: ",ids)
    // });

    // this.socket.on("clientConnected", (id) => {
    //   logger("Client joined:", id);
    // });

    // this.socket.on("clientDisconnected", (id) => {
    //   logger("Client disconnected:", id);
    // });
  }

  async joinRoom(roomId) {
    if (!roomId) {
      logger("Please enter a room id to join");
      return;
    }

    if (this.currentRoomId === roomId) {
      logger("Already joined room: ", roomId);
      return;
    } else if (this.currentRoomId) {
      this.leaveRoom({ roomId: this.currentRoomId });
    }

    // finally, join the new room
    await this.socket.request("mediasoupSignaling", {
      type: "joinRoom",
      data: { roomId },
    });
    this.currentRoomId = roomId;
  }

  async leaveRoom({ roomId }) {
    this.socket.request("mediasoupSignaling", {
      type: "leaveRoom",
      data: { roomId: roomId },
    });

    // disconnect from other peers in this room
    // for (const peerId in this.latestAvailableProducers) {
    //   this.disconnectFromPeer(peerId);
    //   this.callEventCallback("peerDisconnection", { peerId });
    // }
    this.latestAvailableProducers = {};
  }

  callEventCallback(event, data) {
    const callback = this.userDefinedCallbacks[event];
    if (callback) {
      callback(data);
    } else {
      logger(`No callback defined for ${event} event`);
    }
  }

  async disconnectFromMediasoup() {
    logger("Clearing SimpleMediasoupPeer!");

    // may be redundant because server already handles transportclosed events...
    for (const producerId in this.consumers) {
      const consumer = this.consumers[producerId];
      this.closeConsumer(consumer);
    }

    if (this.sendTransport) {
      this.sendTransport.close();
    }
    if (this.recvTransport) {
      this.recvTransport.close();
    }

    this.producers = {};
    this.consumers = {};

    this.device = null;

    this.sendTransport = null;
    this.recvTransport = null;

    this.latestAvailableProducers = {};
  }

  async initializeMediasoupConnection() {
    logger("Initializing SimpleMediasoupPeer!");

    this.setupMediasoupDevice();
    await this.connectToMediasoupRouter();
    await this.createSendTransport();
    await this.createRecvTransport();

    await this.addDataProducer();

    for (const label in this.tracksToProduce) {
      const track = this.tracksToProduce[label].track;
      const broadcast = this.tracksToProduce[label].broadcast;
      const customEncodings = this.tracksToProduce[label].customEncodings;
      this.addProducer(track, label, broadcast, customEncodings);
    }
  }

  async addTrack(track, label, broadcast = false, customEncodings = false) {
    this.tracksToProduce[label] = {
      track,
      broadcast,
      customEncodings,
    };
    logger(this.tracksToProduce);
    await this.addProducer(track, label, broadcast, customEncodings);
  }

  async addProducer(track, label, broadcast, customEncodings) {
    let producer;

    if (this.producers[label] && !this.producers[label].closed) {
      logger(`Already producing ${label}! Swapping track!`);
      this.producers[label].replaceTrack({ track });
      return;
    }

    if (track.kind === "video") {
      let encodings = [
        { maxBitrate: 500000 }, // 0.5Mbps
      ];

      if (customEncodings) {
        encodings = customEncodings;
        logger("Using custom encodings:", encodings);
      }

      producer = await this.sendTransport.produce({
        track: track,
        stopTracks: false,
        encodings,
        codecOptions: {
          videoGoogleStartBitrate: 1000,
        },
        appData: {
          label,
          broadcast,
        },
      });
    } else if (track.kind === "audio") {
      let encodings = [
        { maxBitrate: 64000 }, // 64 kbps
      ];

      if (customEncodings) {
        encodings = customEncodings;
      }

      producer = await this.sendTransport.produce({
        track: track,
        stopTracks: false,
        encodings,
        appData: {
          label,
          broadcast,
        },
      });
    }

    producer.on("transportclose", () => {
      logger("transport closed");
      producer = null;
    });

    producer.on("trackended", async () => {
      logger("Track ended.  Closing producer");
      await producer.close();
      producer = null;
    });

    producer.observer.on("close", async () => {
      console.log("Producer closed.  Closing server-side producer.");
      try {
        await this.socket.request("mediasoupSignaling", {
          type: "closeProducer",
          data: {
            producerId: producer.id,
          },
        });
      } catch (err) {
        logger(err);
      }
      producer = null;
      delete this.producers[label];
    });

    this.producers[label] = producer;
  }

  async addDataProducer() {
    logger("addDataProducer()");

    try {
      // Create chat DataProducer.
      let dataProducer = await this.sendTransport.produceData({
        ordered: false,
        maxRetransmits: 1,
        label: "data",
        priority: "medium",
        appData: { type: "data" },
      });
      this.producers["data"] = dataProducer;

      dataProducer.on("transportclose", () => {
        logger('DataProducer "transportclose" event');
        dataProducer = null;
      });

      dataProducer.on("open", () => {
        logger('DataProducer "open" event');
      });

      dataProducer.on("close", () => {
        logger('DataProducer "close" event');
        dataProducer = null;
      });

      dataProducer.on("error", (error) => {
        logger('DataProducer "error" event:%o', error);
      });

      dataProducer.on("bufferedamountlow", () => {
        logger('DataProducer "bufferedamountlow" event');
      });
    } catch (error) {
      logger("addDataProducer() | failed:%o", error);
      throw error;
    }
  }

  ensureConnectedToDesiredPeerConnections() {
    console.log("ensure connections");
    console.log("latest available producers:", this.latestAvailableProducers);
    console.log("desired connections:", this.desiredPeerConnections);
    for (const peerId in this.latestAvailableProducers) {
      if (peerId === this.socket.id) continue; // ignore our own streams
      for (const producerId in this.latestAvailableProducers[peerId].producers) {
        const shouldConsume =
          this.desiredPeerConnections.has(peerId) ||
          this.latestAvailableProducers[peerId].producers[producerId].broadcast ||
          this.options.autoConnect;

        if (shouldConsume) {
          const consumer = this.consumers[peerId] && this.consumers[peerId][producerId];
          logger("existing consumer:", consumer);
          if (!consumer) {
            this.requestConsumer(peerId, producerId);
          }
        }
      }
      for (const dataProducerId in this.latestAvailableProducers[peerId].dataProducers) {
        const shouldConsume =
          this.desiredPeerConnections.has(peerId) ||
          this.latestAvailableProducers[peerId].dataProducers[dataProducerId].broadcast ||
          this.options.autoConnect;

        if (shouldConsume) {
          const dataConsumer =
            this.dataConsumers[peerId] && this.dataConsumers[peerId][dataProducerId];
          logger("existing consumer:", dataConsumer);
          if (!dataConsumer) {
            this.requestDataConsumer(peerId, dataProducerId);
          }
        }
      }
    }
  }

  requestConsumer(producingPeerId, producerId) {
    console.log(`Requesting consumer for producer ${producerId} from peer ${producingPeerId}`);
    if (!this.consumers[producingPeerId]) {
      this.consumers[producingPeerId] = {};
    }

    this.socket.request("mediasoupSignaling", {
      type: "createConsumer",
      data: {
        producingPeerId,
        producerId,
      },
    });
  }

  requestDataConsumer(producingPeerId, producerId) {
    if (!this.dataConsumers[producingPeerId]) {
      this.dataConsumers[producingPeerId] = {};
    }

    this.socket.request("mediasoupSignaling", {
      type: "createDataConsumer",
      data: {
        producingPeerId,
        producerId,
      },
    });
  }

  async createConsumer(consumerInfo) {
    const { peerId, producerId, id, kind, rtpParameters, type, appData, producerPaused } =
      consumerInfo;

    if (!this.consumers[peerId]) {
      this.consumers[peerId] = {};
    }

    let consumer = this.consumers[peerId][producerId];

    if (!consumer) {
      logger(`Creating consumer with ID ${id} for producer with ID ${producerId}`);

      consumer = await this.recvTransport.consume({
        id,
        producerId,
        kind,
        rtpParameters,
        appData: { ...appData, peerId },
      });

      logger("Created consumer:", consumer);

      this.consumers[peerId][producerId] = consumer;

      consumer.on("transportclose", () => {
        delete this.consumers[consumer.id];
      });

      // tell the server to start the newly created consumer
      await this.socket.request("mediasoupSignaling", {
        type: "resumeConsumer",
        data: {
          producerId: consumer.producerId,
        },
      });
    }

    this.callEventCallback("track", {
      track: consumer.track,
      peerId: consumer.appData.peerId,
      label: consumer.appData.label,
    });
  }

  async createDataConsumer(data) {
    const { peerId, dataProducerId, id, sctpStreamParameters, label, protocol, appData } = data;

    try {
      const dataConsumer = await this.recvTransport.consumeData({
        id,
        dataProducerId,
        sctpStreamParameters,
        label,
        protocol,
        appData: { ...appData, peerId }, // Trick.
      });

      // Store in the map.
      this.dataConsumers[peerId][dataProducerId] = dataConsumer;

      dataConsumer.on("transportclose", () => {
        // this._dataConsumers.delete(dataConsumer.id);
        logger("TODO deal with transport close for data consumers");
      });

      dataConsumer.on("open", () => {
        logger('DataConsumer "open" event');
      });

      dataConsumer.on("close", () => {
        logger('DataConsumer "close" event');

        // this._dataConsumers.delete(dataConsumer.id);
      });

      dataConsumer.on("error", (error) => {
        logger('DataConsumer "error" event:%o', error);
      });

      dataConsumer.on("message", (message) => {
        logger(
          'DataConsumer "message" event [streamId:%d]',
          dataConsumer.sctpStreamParameters.streamId
        );
        this.callEventCallback("data", { from: dataConsumer.appData.peerId, data: message });
        logger("got message TODO call callback!", message);
      });
    } catch (error) {
      logger.error('"newDataConsumer" request failed:%o', error);
      throw error;
    }
  }

  // TODO use more modern and efficient approaches to this
  updatePeersFromSyncData(syncData) {
    // check for new peers
    // for (const peerId in syncData) {
    //   if (!this.latestAvailableProducers[peerId]) {
    //     if (peerId !== this.socket.id) {
    //       this.callEventCallback("peerConnection", { peerId });
    //     }
    //   }
    // }

    // check for disconnections
    // for (const peerId in this.latestAvailableProducers) {
    //   if (!syncData[peerId]) {
    //     if (peerId !== this.socket.id) {
    //       this.callEventCallback("peerDisconnection", { peerId });
    //     }
    //   }
    // }

    // finally update the latestavailableproducers and connections
    this.latestAvailableProducers = syncData;
    this.ensureConnectedToDesiredPeerConnections();
  }

  async handleSocketMessage(request) {
    switch (request.type) {
      case "peerConnection": {
        console.log("peer connection", request.data);
        request.data.forEach((peerId) => {
          this.callEventCallback("peerConnection", { peerId });
        });
        break;
      }

      case "peerDisconnection": {
        console.log("peer disonnection", request.data);
        request.data.forEach((peerId) => {
          this.callEventCallback("peerDisconnection", { peerId });
        });
        break;
      }

      case "availableProducers": {
        console.log("got data");
        this.updatePeersFromSyncData(request.data);
        break;
      }

      case "createConsumer": {
        this.createConsumer(request.data);
        break;
      }

      case "createDataConsumer": {
        this.createDataConsumer(request.data);
        break;
      }

      case "consumerClosed": {
        logger("Server-side consumerClosed, closing client side consumer.");
        logger(request.data);
        const { producingPeerId, producerId } = request.data;

        this.consumers[producingPeerId][producerId].close();
        delete this.consumers[producingPeerId][producerId];

        break;
      }
    }
  }

  async removePeer(otherPeerId) {
    for (let producerId in this.consumers[otherPeerId]) {
      let consumer = this.consumers[otherPeerId][producerId];
      this.closeConsumer(consumer);
    }
    delete this.consumers[otherPeerId];
  }

  closeConsumer(consumer) {
    logger("Closing consumer:", consumer.id);
    this.socket.request("mediasoupSignaling", {
      type: "closeConsumer",
      data: {
        producerId: consumer.producerId,
      },
    });
  }

  //~~**~~//~~**~~//~~**~~//~~**~~//~~**~~//~~**~~//~~**~~//~~**~~//
  //~~**~~//~~**~~//~~**~~//~~**~~//~~**~~//~~**~~//~~**~~//~~**~~//
  // public methods

  /*
  add a callback for a given event
  */
  on(event, callback) {
    if (this.publiclyExposedEvents.has(event)) {
      logger(`Setting ${event} callback.`);
      this.userDefinedCallbacks[event] = callback;
    } else {
      console.error(`Whoops!  No ${event} event exists.`);
    }
  }

  /*
  connect to a given peer
  */
  connectToPeer(otherPeerId) {
    logger("Attempting to connect to peer", otherPeerId);
    this.desiredPeerConnections.add(otherPeerId);
    console.log(this.latestAvailableProducers);

    for (const producerId in this.latestAvailableProducers[otherPeerId].producers) {
      const existingConsumer =
        this.consumers[otherPeerId] && this.consumers[otherPeerId][producerId];
      logger("existingConsumer:", existingConsumer);
      if (!existingConsumer) {
        this.requestConsumer(otherPeerId, producerId);
      }
    }
  }

  /*
  disconnect from a given peer
  */
  disconnectFromPeer(otherPeerId) {
    for (let producerId in this.consumers[otherPeerId]) {
      const consumer = this.consumers[otherPeerId][producerId];
      this.closeConsumer(consumer);
    }
    delete this.consumers[otherPeerId];
    this.desiredPeerConnections.delete(otherPeerId);
  }

  /*
  pause all tracks from a given peer
  */
  async pausePeer(otherPeerId) {
    const consumers = this.consumers[otherPeerId];

    for (const producerId in consumers) {
      const consumer = consumers[producerId];

      // by default do not let us pause a broadcasts
      if (!consumer || consumer.appData.broadcast) continue;
      if (!consumer.paused) {
        logger("Pausing consumer!");

        await this.socket.request("mediasoupSignaling", {
          type: "pauseConsumer",
          data: {
            producerId: consumer.producerId,
          },
        });
        consumer.pause();
      }
    }
  }

  /*
  resume all tracks from a given peer
  */
  async resumePeer(otherPeerId) {
    const consumers = this.consumers[otherPeerId];

    for (const producerId in consumers) {
      const consumer = consumers[producerId];

      if (!consumer) continue;
      if (consumer.paused) {
        logger("Resuming consumer!");
        await this.socket.request("mediasoupSignaling", {
          type: "resumeConsumer",
          data: {
            producerId: consumer.producerId,
          },
        });
        consumer.resume();
      }
    }
  }

  /*
  send data to all peers in room (if connected)
  */
  send(data) {
    try {
      this.producers["data"].send(data);
    } catch (error) {
      logger("DataProducer.send() failed:%o", error);

      throw error;
    }
  }

  //~~**~~//~~**~~//~~**~~//~~**~~//~~**~~//~~**~~//~~**~~//~~**~~//
  //~~**~~//~~**~~//~~**~~//~~**~~//~~**~~//~~**~~//~~**~~//~~**~~//
  // Initial Setup

  setupMediasoupDevice() {
    try {
      this.device = new mediasoupClient.Device();
    } catch (err) {
      logger(err);
    }
  }

  async connectToMediasoupRouter() {
    const routerRtpCapabilities = await this.socket.request("mediasoupSignaling", {
      type: "getRouterRtpCapabilities",
    });
    await this.device.load({ routerRtpCapabilities });
    logger("Router loaded!");
  }

  async createSendTransport() {
    const sendTransportInfo = await this.socket.request("mediasoupSignaling", {
      type: "createWebRtcTransport",
      data: {
        forceTcp: false,
        producing: true,
        consuming: false,
        sctpCapabilities: this.device.sctpCapabilities,
      },
    });

    const { id, iceParameters, iceCandidates, dtlsParameters, sctpParameters } = sendTransportInfo;

    this.sendTransport = this.device.createSendTransport({
      id,
      iceParameters,
      iceCandidates,
      dtlsParameters,
      sctpParameters,
      iceServers: [],
    });

    this.sendTransport.on(
      "connect",
      (
        { dtlsParameters },
        callback,
        errback // eslint-disable-line no-shadow
      ) => {
        logger("Connecting Send Transport");
        this.socket
          .request("mediasoupSignaling", {
            type: "connectWebRtcTransport",
            data: {
              transportId: this.sendTransport.id,
              dtlsParameters,
            },
          })
          .then(callback)
          .catch(errback);
      }
    );

    this.sendTransport.on(
      "produce",
      async ({ kind, rtpParameters, appData }, callback, errback) => {
        try {
          logger("starting to produce");
          // eslint-disable-next-line no-shadow
          const { id } = await this.socket.request("mediasoupSignaling", {
            type: "produce",
            data: {
              transportId: this.sendTransport.id,
              kind,
              rtpParameters,
              appData,
            },
          });

          callback({ id });
        } catch (error) {
          errback(error);
        }
      }
    );

    this.sendTransport.on(
      "producedata",
      async ({ sctpStreamParameters, label, protocol, appData }, callback, errback) => {
        try {
          logger("trying to set up data producer");
          // eslint-disable-next-line no-shadow
          const { id } = await this.socket.request("mediasoupSignaling", {
            type: "produceData",
            data: {
              transportId: this.sendTransport.id,
              sctpStreamParameters,
              label,
              protocol,
              appData,
            },
          });

          logger("set up data producer with id:", id);

          callback({ id });
        } catch (error) {
          errback(error);
        }
      }
    );

    logger("Created send transport!");
  }

  async createRecvTransport() {
    const recvTransportInfo = await this.socket.request("mediasoupSignaling", {
      type: "createWebRtcTransport",
      data: {
        forceTcp: false,
        producing: false,
        consuming: true,
        sctpCapabilities: this.device.sctpCapabilities,
      },
    });

    const { id, iceParameters, iceCandidates, dtlsParameters, sctpParameters } = recvTransportInfo;

    this.recvTransport = this.device.createRecvTransport({
      id,
      iceParameters,
      iceCandidates,
      dtlsParameters,
      sctpParameters,
      iceServers: [],
    });

    this.recvTransport.on(
      "connect",
      (
        { dtlsParameters },
        callback,
        errback // eslint-disable-line no-shadow
      ) => {
        logger("Connecting Receive Transport!");
        this.socket
          .request("mediasoupSignaling", {
            type: "connectWebRtcTransport",
            data: {
              transportId: this.recvTransport.id,
              dtlsParameters,
            },
          })
          .then(callback)
          .catch(errback);
      }
    );

    logger("Created receive transport!");
  }
}

export { SimpleMediasoupPeer };
