/*
simple-mediasoup-peer-client
Aidan Nelson, 2022
https://github.com/AidanNelson/SimpleMediasoupPeer/

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

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

const DEFAULT_VIDEO_ENCODINGS = [
  { maxBitrate: 500000 }, // 0.5Mbps
];
const DEFAULT_AUDIO_ENCODINGS = [
  { maxBitrate: 64000 }, // 64Kbps
];
export class SimpleMediasoupPeer {
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
        logger("Please call 'joinRoom(roomId)' to connect to a room.");
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

  //~~**~~//~~**~~//~~**~~//~~**~~//~~**~~//~~**~~//~~**~~//~~**~~//
  //~~**~~//~~**~~//~~**~~//~~**~~//~~**~~//~~**~~//~~**~~//~~**~~//
  // public methods

  async joinRoom(roomId) {
    if (!roomId) {
      console.log("Missing roomId.  Please enter a roomId when calling joinRoom().");
      return;
    }

    if (this.currentRoomId && this.currentRoomId === roomId) {
      console.log("Already joined room: ", roomId,".");
      return;
    } else if (this.currentRoomId) {
      await this.leaveRoom(this.currentRoomId);
    }

    // finally, join the new room
    await this.socket.request("mediasoupSignaling", {
      type: "joinRoom",
      data: { roomId },
    });
    this.currentRoomId = roomId;
    console.log(`Connected to room with ID ${roomId}`);
  }

  async leaveRoom(roomId){
    console.log(`Leaving room: ${roomId}`);

    this.socket.request("mediasoupSignaling", {
      type: "leaveRoom",
      data: { roomId: roomId },
    });


    for (const peerId in this.latestAvailableProducers) {
      this.disconnectFromPeer(peerId);
      this.callEventCallback("peerDisconnection", { peerId });
    }

    this.currentRoomId = null;
    this.latestAvailableProducers = {};
  }

  async addStream(stream, customEncodings= null, customData = {}) {
    stream.getVideoTracks().forEach((track) => {
      this._addTrack({
        track,
        customEncodings,
        appData: { customData: customData, streamID: stream.id },
      });
    });
    stream.getAudioTracks().forEach((track) => {
      this._addTrack({
        track,
        customEncodings,
        appData: { customData: customData, streamID: stream.id },
      });
    });

    // monitor tracks added to the stream, and add / remove them as needed
    stream.addEventListener("addtrack", (event) => {
      const { track } = event;
      this._addTrack({
        track,
        customEncodings,
        appData: { customData: customData, streamID: stream.id },
      });
    });

    stream.addEventListener("removetrack", (event) => {
      const { track } = event;
      this.removeTrack(track);
    });
  }

  async removeStream() {
    stream.getVideoTracks().forEach((track) => {
      this.removeTrack(track);
    });
    stream.getAudioTracks().forEach((track) => {
      this.removeTrack(track);
    });
  }

  async addTrack({ track, customEncodings, customData }) {
    this._addTrack({ track, customEncodings, appData: { customData } });
  }

  async removeTrack(track) {
    if (this.producers[track.id]) {
      const producer = this.producers[track.id];
      this._closeProducer(producer);
      logger(`Removing ${track.kind} track with ID ${track.id}`);
    } else {
      logger(`Could not find track: ${track}`);
    }
  }

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

    for (const producerId in this.latestAvailableProducers[otherPeerId]) {
      const existingConsumer =
        this.consumers[otherPeerId] && this.consumers[otherPeerId][producerId];
      logger("existingConsumer:", existingConsumer);
      if (!existingConsumer) {
        this._requestConsumer(otherPeerId, producerId);
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

      if (!consumer) continue;
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
  // private methods

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

    await this._addDataProducer();
  }

  async _addTrack({ track = null, customEncodings = null, appData = null }) {
    let producer;

    if (this.producers[track.id]) {
      log(`Already producing track with ID ${track.id}!`);
      return;
    }
    
    if (track.kind === "video" || track.kind === "audio") {
      let encodings = track.kind === "video"? DEFAULT_VIDEO_ENCODINGS : DEFAULT_AUDIO_ENCODINGS;

      if (track.kind === "video" && customEncodings && customEncodings.video) {
        encodings = customEncodings.video;
        logger("Using custom video encodings:", encodings);
      }
      if (track.kind === "video" && customEncodings && customEncodings.audio) {
        encodings = customEncodings.audio;
        logger("Using custom audio encodings:", encodings);
      }

      producer = await this.sendTransport.produce({
        track: track,
        stopTracks: false,
        encodings,
        codecOptions: track.kind === "video"? {
          videoGoogleStartBitrate: 1000,
        } : null,
        appData: appData,
      });
      
      producer.on("transportclose", () => {
        logger("transport closed");
        producer = null;
      });
  
      producer.on("trackended", async () => {
        logger("track ended");
        this._closeProducer(producer);
        producer = null;
      });

      this.producers[track.id] = producer;
    } else {
      console.log("Unrecognized track type: ",track);
    }
  }

  async _closeProducer(producer) {
    try {
      await this.socket.request("mediasoupSignaling", {
        type: "closeProducer",
        data: {
          producerId: producer.id,
        },
      });
    } catch (err) {
      logError(err);
    }

    await producer.close();
    delete this.producers[track.id];
  }

  async _addDataProducer() {
    logger("_addDataProducer()");

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
      logger("_addDataProducer() | failed:%o", error);
      throw error;
    }
  }

  ensureConnectedToDesiredPeerConnections() {
    logger("ensure connections");
    logger("latest available producers:", this.latestAvailableProducers);
    logger("desired connections:", this.desiredPeerConnections);
    for (const peerId in this.latestAvailableProducers) {
      if (peerId === this.socket.id) continue; // ignore our own streams
      for (const producerId in this.latestAvailableProducers[peerId].producers) {
        const shouldConsume = this.desiredPeerConnections.has(peerId) || this.options.autoConnect;

        if (shouldConsume) {
          const consumer = this.consumers[peerId] && this.consumers[peerId][producerId];
          logger("existing consumer:", consumer);
          if (!consumer) {
            this._requestConsumer(peerId, producerId);
          }
        }
      }
      for (const dataProducerId in this.latestAvailableProducers[peerId].dataProducers) {
        const shouldConsume = this.desiredPeerConnections.has(peerId) || this.options.autoConnect;

        if (shouldConsume) {
          const dataConsumer =
            this.dataConsumers[peerId] && this.dataConsumers[peerId][dataProducerId];
          logger("existing consumer:", dataConsumer);
          if (!dataConsumer) {
            this._requestDataConsumer(peerId, dataProducerId);
          }
        }
      }
    }
  }

  async _requestConsumer(producingPeerId, producerId) {
    if (!this.consumers[producingPeerId]) {
      this.consumers[producingPeerId] = {};
    }

    let {data} = await this.socket.request("mediasoupSignaling", {
      type: "createConsumer",
      data: {
        producingPeerId,
        producerId,
      },
    });

    this._createConsumer(data);
  }

  async _createConsumer(consumerInfo) {
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

  async _requestDataConsumer(producingPeerId, producerId) {
    if (!this.dataConsumers[producingPeerId]) {
      this.dataConsumers[producingPeerId] = {};
    }

const {data} = await this.socket.request("mediasoupSignaling", {
      type: "createDataConsumer",
      data: {
        producingPeerId,
        producerId,
      },
    });

    this._createDataConsumer(data);
  }



  async _createDataConsumer(data) {
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
        console.log("got message TODO call callback!", message);
      });
    } catch (error) {
      logger.error('"newDataConsumer" request failed:%o', error);
      throw error;
    }
  }

  // TODO use more modern and efficient approaches to this
  updatePeersFromSyncData(syncData) {
    // check for new peers
    for (const peerId in syncData) {
      if (!this.latestAvailableProducers[peerId]) {
        if (peerId !== this.socket.id) {
          this.callEventCallback("peerConnection", { peerId });
        }
      }
    }

    // check for disconnections
    for (const peerId in this.latestAvailableProducers) {
      if (!syncData[peerId]) {
        if (peerId !== this.socket.id) {
          this.callEventCallback("peerDisconnection", { peerId });
        }
      }
    }

    // finally update the latestavailableproducers and connections
    this.latestAvailableProducers = syncData;
    this.ensureConnectedToDesiredPeerConnections();
  }

  async handleSocketMessage(request) {
    switch (request.type) {
      case "availableProducers": {
        this.updatePeersFromSyncData(request.data);
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
    consumer.close();
    this.socket.request("mediasoupSignaling", {
      type: "closeConsumer",
      data: {
        producerId: consumer.producerId,
      },
    });
  }

  setupMediasoupDevice() {
    try {
      this.device = new mediasoupClient.Device();
    } catch (err) {
      logError(err);
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
          console.log("trying to set up data producer");
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

          console.log("set up data producer with id:", id);

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

window.SimpleMediasoupPeer = SimpleMediasoupPeer;
