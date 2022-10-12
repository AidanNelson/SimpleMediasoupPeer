/*
SimpleMediasoupPeer Client Side Data Structure:

// these are the tracks we would like to produce
// used for re-initializing when client experiences
// a change in socket ID
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

export class SimpleMediasoupPeer {
  constructor(options = { server: "localhost:3000", roomId: null }) {
    console.log(
      "Setting up new MediasoupPeer with the following options:",
      options
    );

    this.device = null;
    this.currentRoomId = null;
    this.socket = io(options.server);

    // add promisified socket request to make our lives easier
    this.socket.request = (type, data = {}) => {
      return new Promise((resolve) => {
        this.socket.emit(type, data, resolve);
      });
    };

    this.socket.on("mediasoupSignaling", (data) => {
      this.handleSocketMessage(data);
    });

    this.socket.on("connect", async () => {
      console.log("Connected to Socket Server with ID: ", this.socket.id);
      await this.disconnect();
      await this.initialize();
      if (options.roomId) {
        this.joinRoom(options.roomId);
      } else {
        console.log("No room Id set. Please call 'joinRoom' to connect!");
      }
    });

    // this.socket.on("clients", (ids) => {
    //   console.log("Got clients: ",ids)
    // });

    // this.socket.on("clientConnected", (id) => {
    //   console.log("Client joined:", id);
    // });

    // this.socket.on("clientDisconnected", (id) => {
    //   console.log("Client disconnected:", id);
    // });

    this.producers = {};
    this.consumers = {};

    this.sendTransport = null;
    this.recvTransport = null;

    this.tracksToProduce = {};

    this.latestAvailableProducers = {};
    this.desiredPeerConnections = new Set();
  }

  async joinRoom(roomId) {
    if (!roomId) {
      console.log("Please enter a room id to join");
    }

    if (this.currentRoomId === roomId) {
      console.log("Already joined room: ", roomId);
      return;
    }

    // if we're already in a different room, disconnect from all peers therein
    if (this.currentRoomId !== roomId) {
      this.socket.request("mediasoupSignaling", {
        type: "leaveRoom",
        data: { roomId: roomId },
      });
      for (const peerId in this.latestAvailableProducers) {
        this.disconnectFromPeer(peerId);
      }
      this.latestAvailableProducers = {};
    }

    // finally, join the new room
    await this.socket.request("mediasoupSignaling", {
      type: "joinRoom",
      data: { roomId },
    });
    this.currentRoomId = roomId;
  }

  // borrowed from https://github.com/vanevery/p5LiveMedia/ -- thanks!
  on(event, callback) {
    switch (event) {
      case "track": {
        console.log(`Setting ${event} callback.`);
        this.onTrackCallback = callback;
        break;
      }

      case "peer": {
        console.log(`Setting ${event} callback.`);
        this.onPeerCallback = callback;
        break;
      }

      case "disconnect": {
        console.log(`Setting ${event} callback.`);
        this.onDisconnectCallback = callback;
      }

      default: {
        console.log(`Whoops!  No ${event} event exists.`);
      }
    }
  }

  callOnTrackCallback({ track, peerId, label }) {
    if (this.onTrackCallback) {
      this.onTrackCallback(track, peerId, label);
    } else {
      console.log("no onTrack Callback Set");
    }
  }

  callOnPeerCallback(peerId) {
    if (!this.onPeerCallback) {
      console.log("Please set a callback for peer event!");
      return;
    }
    this.onPeerCallback(peerId);
  }

  callOnDisconnectCallback(peerId) {
    if (!this.onPeerCallback) {
      console.log("Please set a callback for disconnect event!");
      return;
    }
    this.onDisconnectCallback(peerId);
  }

  async disconnect() {
    console.log("Clearing SimpleMediasoupPeer!");

    if (this.sendTransport) {
      this.sendTransport.close();
    }
    if (this.recvTransport) {
      this.recvTransport.close();
    }

    this.producers = {};
    this.consumers = {};

    this.sendTransport = null;
    this.recvTransport = null;

    this.latestAvailableProducers = {};
  }

  async initialize() {
    console.log("Initializing SimpleMediasoupPeer!");
    this.setupMediasoupDevice();
    await this.connectToMediasoupRouter();
    await this.createSendTransport();
    await this.createRecvTransport();

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
    console.log(this.tracksToProduce);
    await this.addProducer(track, label, broadcast, customEncodings);
  }

  async addProducer(track, label, broadcast, customEncodings) {
    let producer;

    if (this.producers[label]) {
      console.warn(`Already producing ${label}! Swapping track!`);
      this.producers[label].replaceTrack({ track });
      return;
    }

    if (track.kind === "video") {
      let encodings = [
        { maxBitrate: 500000 }, // 0.5Mbps
      ];

      if (customEncodings) {
        encodings = customEncodings;
        console.log("Using custom encodings:", encodings);
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
      console.log("transport closed");
      producer = null;
    });

    producer.on("trackended", async () => {
      console.log("track ended");
      try {
        await this.socket.request("mediasoupSignaling", {
          type: "closeProducer",
          data: {
            producerId: producer.id,
          },
        });
      } catch (err) {
        console.error(err);
      }

      await producer.close();

      producer = null;
    });

    this.producers[label] = producer;
  }

  ensureConnectedToDesiredPeerConnections() {
    console.log("ensure connections");
    console.log("latest available producers:", this.latestAvailableProducers);
    console.log("desired connections:", this.desiredPeerConnections);
    for (const peerId in this.latestAvailableProducers) {
      if (peerId === this.socket.id) continue; // ignore our own streams
      for (const producerId in this.latestAvailableProducers[peerId]) {
        const shouldConsume =
          this.desiredPeerConnections.has(peerId) ||
          this.latestAvailableProducers[peerId][producerId].broadcast;
        if (shouldConsume) {
          const consumer =
            this.consumers[peerId] && this.consumers[peerId][producerId];
          console.log("existing consumer:", consumer);
          if (!consumer) {
            this.requestConsumer(peerId, producerId);
          }
        }
      }
    }
  }

  requestConsumer(producingPeerId, producerId) {
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

  async createConsumer(consumerInfo) {
    const {
      peerId,
      producerId,
      id,
      kind,
      rtpParameters,
      type,
      appData,
      producerPaused,
    } = consumerInfo;

    if (!this.consumers[peerId]) {
      this.consumers[peerId] = {};
    }

    let consumer = this.consumers[peerId][producerId];

    if (!consumer) {
      console.log(
        `Creating consumer with ID ${id} for producer with ID ${producerId}`
      );

      consumer = await this.recvTransport.consume({
        id,
        producerId,
        kind,
        rtpParameters,
        appData: { ...appData, peerId },
      });

      console.log("Created consumer:", consumer);

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

    this.callOnTrackCallback({
      track: consumer.track,
      peerId: consumer.appData.peerId,
      label: consumer.appData.label,
    });
  }

  // TODO use more modern and efficient approaches to this
  updatePeersFromSyncData(syncData) {
    // check for new peers
    for (const peerId in syncData) {
      if (!this.latestAvailableProducers[peerId]) {
        if (peerId !== this.socket.id) {
          this.callOnPeerCallback(peerId);
        }
      }
    }

    // check for disconnections
    for (const peerId in this.latestAvailableProducers) {
      if (!syncData[peerId]) {
        if (peerId !== this.socket.id) {
          this.callOnDisconnectCallback(peerId);
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

      case "createConsumer": {
        this.createConsumer(request.data);
        break;
      }

      case "consumerClosed": {
        console.log(
          "Server-side consumerClosed, closing client side consumer."
        );
        console.log(request.data);
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
      consumer.close();
    }
    delete this.consumers[otherPeerId];
  }

  //~~**~~//~~**~~//~~**~~//~~**~~//~~**~~//~~**~~//~~**~~//~~**~~//
  //~~**~~//~~**~~//~~**~~//~~**~~//~~**~~//~~**~~//~~**~~//~~**~~//
  // public methods

  connectToPeer(peerId) {
    console.log("Attempting to connect to peer", peerId);
    this.desiredPeerConnections.add(peerId);

    for (const producerId in this.latestAvailableProducers[peerId]) {
      const existingConsumer =
        this.consumers[peerId] && this.consumers[peerId][producerId];
      console.log("existingConsumer:", existingConsumer);
      if (!existingConsumer) {
        this.requestConsumer(peerId, producerId);
      }
    }
  }

  /*
  This function closes all connections to a given peer
  */
  disconnectFromPeer(otherPeerId) {
    this.callOnDisconnectCallback(otherPeerId);
    for (let producerId in this.consumers[otherPeerId]) {
      const consumer = this.consumers[otherPeerId][producerId];
      consumer.close();
      this.socket.request("mediasoupSignaling", {
        type: "closeConsumer",
        data: {
          producerId: consumer.producerId,
        },
      });
      console.log(consumer);
    }
    delete this.consumers[otherPeerId];
    this.desiredPeerConnections.delete(otherPeerId);
  }

  async pausePeer(producingPeerId) {
    const consumers = this.consumers[producingPeerId];

    for (const producerId in consumers) {
      const consumer = consumers[producerId];

      // by default do not let us pause a broadcasts
      if (!consumer || consumer.appData.broadcast) continue;
      if (!consumer.paused) {
        console.log("Pausing consumer!");

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

  async resumePeer(producingPeerId) {
    const consumers = this.consumers[producingPeerId];

    for (const producerId in consumers) {
      const consumer = consumers[producerId];

      if (!consumer) continue;
      if (consumer.paused) {
        console.log("Resuming consumer!");
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

  //~~**~~//~~**~~//~~**~~//~~**~~//~~**~~//~~**~~//~~**~~//~~**~~//
  //~~**~~//~~**~~//~~**~~//~~**~~//~~**~~//~~**~~//~~**~~//~~**~~//
  // Initial Setup

  setupMediasoupDevice() {
    try {
      this.device = new mediasoupClient.Device();
    } catch (err) {
      console.error(err);
    }
  }

  async connectToMediasoupRouter() {
    const routerRtpCapabilities = await this.socket.request(
      "mediasoupSignaling",
      { type: "getRouterRtpCapabilities" }
    );
    await this.device.load({ routerRtpCapabilities });
    console.log("Router loaded!");
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

    const { id, iceParameters, iceCandidates, dtlsParameters, sctpParameters } =
      sendTransportInfo;

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
        console.log("Connecting Send Transport");
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
          console.log("starting to produce");
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
      async (
        { sctpStreamParameters, label, protocol, appData },
        callback,
        errback
      ) => {
        try {
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

          callback({ id });
        } catch (error) {
          errback(error);
        }
      }
    );

    console.log("Created send transport!");
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

    const { id, iceParameters, iceCandidates, dtlsParameters, sctpParameters } =
      recvTransportInfo;

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
        console.log("Connecting Receive Transport!");
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

    console.log("Created receive transport!");
  }
}

window.SimpleMediasoupPeer = SimpleMediasoupPeer;
