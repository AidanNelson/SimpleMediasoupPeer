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
    this.options = Object.assign(defaultOptions, options || {});

    logger("Setting up new MediasoupPeer with the following options:", this.options);

    this.device = null;
    this.currentRoomId = null;

    if (this.options.socket) {
      this.socket = this.options.socket;
    } else {
      try {
        this.socket = io(
          `${this.options.url}:${this.options.port}`,
          this.options.socketClientOptions
        );
      } catch (error) {
        console.error("Error creating socket connection:", error);
      }
    }

    this.producers = {};
    this.consumers = {};
    this.dataConsumers = {};

    this.sendTransport = null;
    this.recvTransport = null;

    // mediasoup initialization readiness tracking
    this._mediasoupReady = false;
    this._mediasoupReadyWaiters = [];

    this.tracksToProduce = {};

    this.latestAvailableProducers = {};
    this.desiredPeerConnections = new Set();

    this.publiclyExposedEvents = new Set(["peerConnection", "peerDisconnection", "track", "data"]);
    this.userDefinedCallbacks = {};

    // add promisified socket request to make our lives easier
    this.socket.request = (type, data = {}) => {
      return new Promise((resolve, reject) => {
        if (!this.socket || !this.socket.connected) {
          return reject(new Error("Socket not connected"));
        }
        this.socket.emit(type, data, (response) => {
          if (!response) {
            return reject(new Error("No response from server"));
          }
          if (response.error) {
            const err = new Error(response.error.message || "Server error");
            err.code = response.error.code || null;
            return reject(err);
          }
          resolve(response);
        });
      });
    };

    // all mediasoupSignaling will come through on this socket event
    this.socket.on("mediasoupSignaling", (data) => {
      this.handleSocketMessage(data);
    });

    this.socket.on("connect", async () => {
      try {
        logger("Connected to Socket Server with ID: ", this.socket.id);
        await this.disconnectFromMediasoup();
        await this.initializeMediasoupConnection();

        if (this.options.roomId) {
          this.joinRoom(this.options.roomId);
        } else {
          logger("No room Id set. Please call 'joinRoom' to connect!");
        }
      } catch (error) {
        console.error("Error connecting to socket connect handler:", error);
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

  // Ensure the Socket.IO client is connected and mediasoup is initialized
  async waitForSocketConnection(timeoutMs = 15000) {
    const waitForConnect = () => new Promise((resolve, reject) => {
      if (this.socket && this.socket.connected) return resolve();
      let timeout;
      const cleanup = () => {
        clearTimeout(timeout);
        this.socket.off("connect", onConnect);
        this.socket.off("connect_error", onError);
        this.socket.off("reconnect_error", onError);
      };
      const onConnect = () => {
        cleanup();
        resolve();
      };
      const onError = (err) => {
        cleanup();
        reject(err instanceof Error ? err : new Error(String(err)));
      };
      this.socket.once("connect", onConnect);
      this.socket.once("connect_error", onError);
      this.socket.once("reconnect_error", onError);
      timeout = setTimeout(() => {
        cleanup();
        reject(new Error("Socket connect timeout"));
      }, timeoutMs);
      if (this.socket && !this.socket.connected) this.socket.connect();
    });

    const waitForMediasoupReady = () => new Promise((resolve, reject) => {
      if (this._mediasoupReady) return resolve();
      let timeout;
      const complete = () => {
        clearTimeout(timeout);
        resolve();
      };
      this._mediasoupReadyWaiters.push(complete);
      timeout = setTimeout(() => {
        // remove from waiters if still present
        this._mediasoupReadyWaiters = this._mediasoupReadyWaiters.filter((fn) => fn !== complete);
        reject(new Error("Mediasoup initialization timeout"));
      }, timeoutMs);
    });

    await waitForConnect();
    await waitForMediasoupReady();
  }

  async joinRoom(roomId) {
    try {
      // Ensure socket is connected before attempting to join
      await this.waitForSocketConnection();

      if (!roomId) {
        logger("Please enter a room id to join");
        return;
      }

      if (this.currentRoomId === roomId) {
        logger("Already joined room: ", roomId);
        return;
      } else if (this.currentRoomId) {
        await this.leaveRoom({ roomId: this.currentRoomId });
      }

      // finally, join the new room
      await this.socket.request("mediasoupSignaling", {
        type: "joinRoom",
        data: { roomId },
      });
      this.currentRoomId = roomId;
      logger(`Joined room ${roomId}`);
    } catch (error) {
      console.error("Error joining room:", error);
    }
  }

  async leaveRoom({ roomId }) {
    if (!roomId) {
      logger("No roomId provided to leaveRoom");
      return;
    }
    try {
      await this.socket.request("mediasoupSignaling", {
        type: "leaveRoom",
        data: { roomId: roomId },
      });
      this.latestAvailableProducers = {};
      logger(`Left room ${roomId}`);
    } catch (error) {
      console.error("Error leaving room:", error);
    }
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
    this._mediasoupReady = false;

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

    try {
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

      logger("Mediasoup connection initialized!");
      // mark ready and flush waiters
      this._mediasoupReady = true;
      this._mediasoupReadyWaiters.splice(0).forEach((resolve) => resolve());
    } catch (error) {
      console.error("Error initializing Mediasoup connection:", error);
      this._mediasoupReady = false;
    }
  }

  async addTrack(track, label, broadcast = false, customEncodings = false) {
    this.tracksToProduce[label] = {
      track,
      broadcast,
      customEncodings,
    };
    try {
      await this.addProducer(track, label, broadcast, customEncodings);
    } catch (error) {
      console.error("Error adding producer for track:", error);
    }
  }

  async removeTrack(label) {
    logger("Removing track with label:", label);
    try {
      if (this.producers[label]) {
        await this.producers[label].close();
        delete this.producers[label];
      } else {
        logger(`No producer found with label: ${label}`);
      }
      delete this.tracksToProduce[label];
    } catch (error) {
      logger("Error removing track:", error);
    }
  }

  async addProducer(track, label, broadcast, customEncodings) {
    let producer;

    if (this.producers[label] && !this.producers[label].closed) {
      logger(`Already producing ${label}! Swapping track!`);
      try {
        this.producers[label].replaceTrack({ track });
        return;
      } catch (error) {
        console.error(`Error replacing track for ${label}:`, error);
        // Continue with creating new producer
      }
    }

    try {
      if (!this.sendTransport) {
        throw new Error("Send transport not available");
      }

      if (track.kind === "video") {
        let encodings = [
          { maxBitrate: 500000 }, // 0.5Mbps
        ];

        if (customEncodings) {
          encodings = customEncodings;
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

      if (producer) {
        producer.on("transportclose", () => {
          producer = null;
          logger("transport closed");
        });

        producer.on("trackended", async () => {
          try {
            await producer.close();
          } catch (error) {
            logger("Error closing producer on track end:", error);
          }
          producer = null;
          logger("Track ended.  Closing producer");
        });

        producer.observer.on("close", async () => {
          try {
            await this.socket.request("mediasoupSignaling", {
              type: "closeProducer",
              data: {
                producerId: producer.id,
              },
            });
            logger("Producer closed.  Closed server-side producer.");
          } catch (err) {
            logger("Error closing server-side producer:", err);
          }
          producer = null;
          delete this.producers[label];
        });
      }

      this.producers[label] = producer;

    } catch (error) {
      console.error("Error adding producer:", error);
    }
  }

  async addDataProducer() {
    logger("addDataProducer()");

    try {
      if (!this.sendTransport) {
        throw new Error("Send transport not available");
      }

      // Create chat DataProducer.
      let dataProducer = await this.sendTransport.produceData({
        ordered: false,
        maxRetransmits: 1,
        label: "data",
        priority: "medium",
        appData: { type: "data" },
      });

      if (dataProducer) {
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
      }
    } catch (error) {
      logger("addDataProducer() | failed:%o", error);
      console.error("Error adding data producer:", error);
    }
  }

  ensureConnectedToDesiredPeerConnections() {
    // console.log("ensure connections");
    // console.log("latest available producers:", this.latestAvailableProducers);
    // console.log("desired connections:", this.desiredPeerConnections);

    if (this.latestAvailableProducers && typeof this.latestAvailableProducers === 'object') {
      for (const peerId in this.latestAvailableProducers) {
        if (peerId === this.socket.id) continue; // ignore our own streams

        // check all their producers
        if (this.latestAvailableProducers[peerId].producers) {
          for (const producerId in this.latestAvailableProducers[peerId].producers) {
            const shouldConsume =
              this.desiredPeerConnections.has(peerId) ||
              this.latestAvailableProducers[peerId].producers[producerId].broadcast ||
              this.options.autoConnect;

            if (shouldConsume) {
              const consumer = this.consumers[peerId] && this.consumers[peerId][producerId];
              if (!consumer) {
                this.requestConsumer(peerId, producerId);
              }
            }
          }
        }

        // check all available data producers
        if (this.latestAvailableProducers[peerId].dataProducers) {
          for (const dataProducerId in this.latestAvailableProducers[peerId].dataProducers) {
            const shouldConsume =
              this.desiredPeerConnections.has(peerId) ||
              this.latestAvailableProducers[peerId].dataProducers[dataProducerId].broadcast ||
              this.options.autoConnect;

            if (shouldConsume) {
              const dataConsumer =
                this.dataConsumers[peerId] && this.dataConsumers[peerId][dataProducerId];
              if (!dataConsumer) {
                this.requestDataConsumer(peerId, dataProducerId);
              }
            }
          }
        }
      }
    }
  }

  async requestConsumer(producingPeerId, producerId) {
    try {
      if (!this.consumers[producingPeerId]) {
        this.consumers[producingPeerId] = {};
      }
      await this.socket.request("mediasoupSignaling", {
        type: "createConsumer",
        data: {
          producingPeerId,
          producerId,
        },
      });
    } catch (error) {
      console.error("Error requesting consumer:", error);
    }
  }

  async requestDataConsumer(producingPeerId, producerId) {
    try {
      if (!this.dataConsumers[producingPeerId]) {
        this.dataConsumers[producingPeerId] = {};
      }

      await this.socket.request("mediasoupSignaling", {
        type: "createDataConsumer",
        data: {
          producingPeerId,
          producerId,
        },
      });
    } catch (error) {
      console.error("Error requesting data consumer:", error);
    }
  }

  async createConsumer(consumerInfo) {
    try {
      const { peerId, producerId, id, kind, rtpParameters, type, appData, producerPaused } =
        consumerInfo;

      if (!this.consumers[peerId]) {
        this.consumers[peerId] = {};
      }

      let consumer = this.consumers[peerId][producerId];

      if (!consumer) {
        logger(`Creating consumer with ID ${id} for producer with ID ${producerId}`);

        if (!this.recvTransport) {
          throw new Error("Receive transport not available");
        }

        consumer = await this.recvTransport.consume({
          id,
          producerId,
          kind,
          rtpParameters,
          appData: { ...appData, peerId },
        });

        logger("Created consumer:", consumer);

        this.consumers[peerId][producerId] = consumer;

        if (consumer) {
          consumer.on("transportclose", () => {
            delete this.consumers[consumer.id];
          });
        }

        // tell the server to start the newly created consumer
        try {
          await this.socket.request("mediasoupSignaling", {
            type: "resumeConsumer",
            data: {
              producerId: consumer.producerId,
            },
          });
        } catch (error) {
          logger("Error resuming consumer:", error);
        }
      }

      if (consumer && consumer.track) {
        this.callEventCallback("track", {
          track: consumer.track,
          peerId: consumer.appData.peerId,
          label: consumer.appData.label,
        });
      }
    } catch (error) {
      console.error("Error creating consumer:", error);
    }
  }

  async createDataConsumer(data) {
    const { peerId, dataProducerId, id, sctpStreamParameters, label, protocol, appData } = data;

    try {
      if (!this.recvTransport) {
        throw new Error("Receive transport not available");
      }

      const dataConsumer = await this.recvTransport.consumeData({
        id,
        dataProducerId,
        sctpStreamParameters,
        label,
        protocol,
        appData: { ...appData, peerId }, // Trick.
      });

      if (dataConsumer) {
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
      }
    } catch (error) {
      logger.error('"newDataConsumer" request failed:%o', error);
    }
  }

  updatePeersFromSyncData(syncData) {
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
    try {
      this.socket.request("mediasoupSignaling", {
        type: "closeConsumer",
        data: {
          producerId: consumer.producerId,
        },
      });
    } catch (error) {
      console.error("Error closing consumer:", error);
    }
  }

  //~~**~~//~~**~~//~~**~~//~~**~~//~~**~~//~~**~~//~~**~~//~~**~~//
  //~~**~~//~~**~~//~~**~~//~~**~~//~~**~~//~~**~~//~~**~~//~~**~~//
  // public methods

  /*
  add a callback for a given event
  */
  on(event, callback) {
    if (this.publiclyExposedEvents.has(event)) {
      this.userDefinedCallbacks[event] = callback;
    } else {
      console.error(`Whoops!  No ${event} event exists.`);
    }
  }

  /*
  connect to a given peer
  */
  connectToPeer(otherPeerId) {
    if (!otherPeerId) {
      console.warn("No peer ID provided to connectToPeer");
      return;
    }

    logger("Attempting to connect to peer", otherPeerId);
    this.desiredPeerConnections.add(otherPeerId);
    console.log(this.latestAvailableProducers);

    if (this.latestAvailableProducers[otherPeerId] && this.latestAvailableProducers[otherPeerId].producers) {
      for (const producerId in this.latestAvailableProducers[otherPeerId].producers) {
        const existingConsumer =
          this.consumers[otherPeerId] && this.consumers[otherPeerId][producerId];
        logger("existingConsumer:", existingConsumer);
        if (!existingConsumer) {
          this.requestConsumer(otherPeerId, producerId);
        }
      }
    }
  }

  /*
  disconnect from a given peer
  */
  disconnectFromPeer(otherPeerId) {
    if (this.consumers[otherPeerId]) {
      for (let producerId in this.consumers[otherPeerId]) {
        const consumer = this.consumers[otherPeerId][producerId];
        if (consumer) {
          this.closeConsumer(consumer);
        }
      }
      delete this.consumers[otherPeerId];
    }
    this.desiredPeerConnections.delete(otherPeerId);
  }

  /*
  pause all tracks from a given peer
  */
  async pausePeer(otherPeerId) {
    const consumers = this.consumers[otherPeerId];
    if (!consumers) {
      console.warn(`No consumers found for peer ${otherPeerId}`);
      return;
    }

    for (const producerId in consumers) {
      const consumer = consumers[producerId];

      // by default do not let us pause a broadcasts
      if (!consumer || consumer.appData.broadcast) continue;
      if (!consumer.paused) {
        logger("Pausing consumer!");

        try {
          await this.socket.request("mediasoupSignaling", {
            type: "pauseConsumer",
            data: {
              producerId: consumer.producerId,
            },
          });
          consumer.pause();
        } catch (error) {
          console.error("Error pausing consumer:", error);
        }
      }
    }
  }

  /*
  resume all tracks from a given peer
  */
  async resumePeer(otherPeerId) {
    const consumers = this.consumers[otherPeerId];
    if (!consumers) {
      console.warn(`No consumers found for peer ${otherPeerId}`);
      return;
    }

    for (const producerId in consumers) {
      const consumer = consumers[producerId];

      if (!consumer) continue;
      if (consumer.paused) {
        logger("Resuming consumer!");
        try {
          await this.socket.request("mediasoupSignaling", {
            type: "resumeConsumer",
            data: {
              producerId: consumer.producerId,
            },
          });
          consumer.resume();
        } catch (error) {
          console.error("Error resuming consumer:", error);
        }
      }
    }
  }

  /*
  send data to all peers in room (if connected)
  */
  send(data) {
    if (!this.producers["data"]) {
      console.warn("Data producer not available");
      return;
    }
    try {
      this.producers["data"].send(data);
    } catch (error) {
      logger("DataProducer.send() failed:%o", error);
    }
  }

  //~~**~~//~~**~~//~~**~~//~~**~~//~~**~~//~~**~~//~~**~~//~~**~~//
  //~~**~~//~~**~~//~~**~~//~~**~~//~~**~~//~~**~~//~~**~~//~~**~~//
  // Initial Setup

  setupMediasoupDevice() {
    try {
      this.device = new mediasoupClient.Device();
    } catch (err) {
      logger("Error creating mediasoup device:", err);
      throw err;
    }
  }

  async connectToMediasoupRouter() {
    try {
      const response = await this.socket.request("mediasoupSignaling", {
        type: "getRouterRtpCapabilities",
      });

      if (!this.device) {
        throw new Error("Mediasoup device not initialized");
      }
      await this.device.load({ routerRtpCapabilities: response.routerRtpCapabilities });
    } catch (error) {
      logger("Error connecting to mediasoup router:", error);
      throw error;
    }
  }

  async createSendTransport() {
    try {
      const response = await this.socket.request("mediasoupSignaling", {
        type: "createWebRtcTransport",
        data: {
          forceTcp: false,
          producing: true,
          consuming: false,
          sctpCapabilities: this.device.sctpCapabilities,
        },
      });

      if (!response || !response.transportInfo) {
        throw new Error("Invalid transport response from server");
      }
      const { id, iceParameters, iceCandidates, dtlsParameters, sctpParameters } = response.transportInfo;

      if (!this.device) {
        throw new Error("Mediasoup device not initialized");
      }
      this.sendTransport = this.device.createSendTransport({
        id,
        iceParameters,
        iceCandidates,
        dtlsParameters,
        sctpParameters,
        iceServers: [],
      });

      if (this.sendTransport) {
        this.sendTransport.on(
          "connect",
          async (
            { dtlsParameters },
            callback,
            errback // eslint-disable-line no-shadow
          ) => {
            try {
              await this.socket.request("mediasoupSignaling", {
                type: "connectWebRtcTransport",
                data: {
                  transportId: this.sendTransport.id,
                  dtlsParameters,
                },
              });
              callback();
              logger("Send transport connected");
            } catch (error) {
              logger("Error connecting send transport:", error);
              errback(error);
            }
          }
        );

        this.sendTransport.on(
          "produce",
          async ({ kind, rtpParameters, appData }, callback, errback) => {
            try {
              // eslint-disable-next-line no-shadow
              const response = await this.socket.request("mediasoupSignaling", {
                type: "produce",
                data: {
                  transportId: this.sendTransport.id,
                  kind,
                  rtpParameters,
                  appData,
                },
              });

              callback({ id: response.id });
              logger(`Created ${kind} producer with id: ${response.id}`);

            } catch (error) {
              logger("Error creating producer:", error);
              errback(error);
            }
          }
        );

        this.sendTransport.on(
          "producedata",
          async ({ sctpStreamParameters, label, protocol, appData }, callback, errback) => {
            try {
              // eslint-disable-next-line no-shadow
              const response = await this.socket.request("mediasoupSignaling", {
                type: "produceData",
                data: {
                  transportId: this.sendTransport.id,
                  sctpStreamParameters,
                  label,
                  protocol,
                  appData,
                },
              });

              callback({ id: response.id });
              logger("Created dataproducer with id:", response.id);

            } catch (error) {
              logger("Error creating data producer:", error);
              errback(error);
            }
          }
        );
      }

    } catch (error) {
      logger("Error creating send transport:", error);
      throw error;
    }
  }

  async createRecvTransport() {
    try {
      const response = await this.socket.request("mediasoupSignaling", {
        type: "createWebRtcTransport",
        data: {
          forceTcp: false,
          producing: false,
          consuming: true,
          sctpCapabilities: this.device.sctpCapabilities,
        },
      });

      if (!response || !response.transportInfo) {
        throw new Error("Invalid transport response from server");
      }
      const { id, iceParameters, iceCandidates, dtlsParameters, sctpParameters } = response.transportInfo;

      if (!this.device) {
        throw new Error("Mediasoup device not initialized");
      }
      this.recvTransport = this.device.createRecvTransport({
        id,
        iceParameters,
        iceCandidates,
        dtlsParameters,
        sctpParameters,
        iceServers: [],
      });

      if (this.recvTransport) {
        this.recvTransport.on(
          "connect",
          async (
            { dtlsParameters },
            callback,
            errback // eslint-disable-line no-shadow
          ) => {
            logger("Connecting Receive Transport!");
            try {
              await this.socket
                .request("mediasoupSignaling", {
                  type: "connectWebRtcTransport",
                  data: {
                    transportId: this.recvTransport.id,
                    dtlsParameters,
                  },
                });
              callback();
            } catch (error) {
              logger("Error connecting receive transport:", error);
              errback(error);
            }
          }
        );
      }

      logger("Created receive transport!");
    } catch (error) {
      logger("Error creating recv transport:", error);
      throw error;
    }
  }

}

export { SimpleMediasoupPeer };
