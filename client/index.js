import * as mediasoupClient from "mediasoup-client";
var log = require("debug")("SFUPeer");

/*
for broadcaster,
will need to be able to set a peer as a sender or receiver
will need bidirectional data channels

other idea:
re-broadcaster - idea of managing a video switch on client or server side

add to github and share with shawn

this.producers = {
    camera: producerObj,
    microphone: producerObj,
    screenshare: producerObj
}
this.peers = {
    peerId1: {
        producerId1: consumerObj,
        producerId2: consumerObj
    }
}
this.latestAvailableProducers = {
    peerId1: {
        producerId1: 'camera',
        producerId2: 'microphone'
    }
}
this.tracksToProduce = {
  camera: {
    track,
    broadcast: false
  }
}
TODO this should allow client to choose specific tracks
this.desiredPeerConnections = new Set(peerId1, peerId2, peerId3);

}



*/

class SimpleMediasoupPeer {
  constructor(socket) {
    console.log("Setting up new MediasoupPeer");

    this.device = null;
    this.socket = socket;

    // add promisified socket request to make our lives easier
    this.socket.request = (type, data = {}) => {
      return new Promise((resolve) => {
        socket.emit(type, data, resolve);
      });
    };

    this.socket.on("mediasoupSignaling", (data) => {
      this.handleSocketMessage(data);
    });

    this.socket.on("connect", async () => {
      //
      console.log("Connected to Socket Server with ID: ", this.socket.id);
      await this.disconnect();
      await this.initialize();
    });

    this.producers = {};
    this.peers = {};

    this.sendTransport = null;
    this.recvTransport = null;

    this.tracksToProduce = {};

    this.latestAvailableProducers = {};
    this.desiredPeerConnections = new Set();
  }

  onTrack(track, id, label) {
    //
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
    this.peers = {};

    this.sendTransport = null;
    this.recvTransport = null;

    this.latestAvailableProducers = {};
    this.desiredPeerConnections = new Set();
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
      this.addProducer(track, label, broadcast);
    }
    // this.setupDataProducer();
  }

  async addTrack(track, label, broadcast = false) {
    this.tracksToProduce[label] = {
      track,
      broadcast,
    };
    console.log(this.tracksToProduce);
    await this.addProducer(track, label, broadcast);
  }

  async addProducer(track, label, broadcast) {
    let producer;

    if (this.producers[label]) {
      console.warn(`Already producing ${label}! Swapping track!`);
      this.producers[label].replaceTrack({ track });
      return;
    }

    if (track.kind === "video") {
      producer = await this.sendTransport.produce({
        track: track,
        stopTracks: false,
        encodings: [
          // { maxBitrate: 100000 },
          // { maxBitrate: 300000 },
          { maxBitrate: 900000 },
        ],
        codecOptions: {
          videoGoogleStartBitrate: 1000,
        },
        appData: {
          label,
          broadcast,
        },
      });
    } else if (track.kind === "audio") {
      producer = await this.sendTransport.produce({
        track: track,
        stopTracks: false,
        codecOptions: {
          opusStereo: 1,
          opusDtx: 1,
        },
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
          const consumer = this.peers[peerId] && this.peers[peerId][producerId];
          console.log("existing consumer:", consumer);
          if (!consumer) {
            this.requestConsumer(peerId, producerId);
          }
        }
      }
    }
  }

  requestConsumer(producingPeerId, producerId) {
    // have we seen and added this peer already?
    if (!this.peers[producingPeerId]) {
      this.addPeer(producingPeerId);
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

    // have we seen and added this peer already?
    if (!this.peers[peerId]) {
      this.addPeer(peerId);
    }

    let consumer = this.peers[peerId][producerId];

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

      this.peers[peerId][producerId] = consumer;

      consumer.on("transportclose", () => {
        delete this.peers[consumer.id];
      });

      // tell the server to start the newly created consumer
      await this.socket.request("mediasoupSignaling", {
        type: "resumeConsumer",
        data: {
          producerId: consumer.producerId,
        },
      });
    }

    this.onTrack(
      consumer.track,
      consumer.appData.peerId,
      consumer.appData.label
    );
  }

  async handleSocketMessage(request) {
    switch (request.type) {
      case "availableProducers": {
        console.log("tick");
        this.latestAvailableProducers = request.data;
        this.ensureConnectedToDesiredPeerConnections();
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

        this.peers[producingPeerId][producerId].close();
        delete this.peers[producingPeerId][producerId];

        break;
      }
    }
  }

  // async setupDataProducer() {
  //   this.dataProducer = await this.sendTransport.produceData({
  //     ordered: false,
  //     maxRetransmits: 1,
  //     label: "chat",
  //     priority: "medium",
  //     appData: {},
  //   });
  // }

  addPeer(otherPeerId) {
    this.peers[otherPeerId] = {};
  }

  async removePeer(otherPeerId) {
    for (let producerId in this.peers[otherPeerId]) {
      let consumer = this.peers[otherPeerId][producerId];
      consumer.close();
    }
    delete this.peers[otherPeerId];
  }

  //~~**~~//~~**~~//~~**~~//~~**~~//~~**~~//~~**~~//~~**~~//~~**~~//
  //~~**~~//~~**~~//~~**~~//~~**~~//~~**~~//~~**~~//~~**~~//~~**~~//
  // public methods

  connectToPeer(peerId) {
    this.desiredPeerConnections.add(peerId);

    for (const producerId in this.latestAvailableProducers[peerId]) {
      const existingConsumer =
        this.peers[peerId] && this.peers[peerId][producerId];
      console.log("existingConsumer:", existingConsumer);
      if (!existingConsumer) {
        this.requestConsumer(peerId, producerId);
      }
    }
  }

  disconnectFromPeer(id) {
    // TODO close and remove all consumers
    const consumers = this.peers[producingPeerId];
    for (const producerId in consumers) {
      const consumer = consumers[producerId];
    }

    this.desiredPeerConnections.delete(id);
  }

  async pausePeer(producingPeerId) {
    const consumers = this.peers[producingPeerId];

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
      } else {
        // console.log("Consumer already paused!");
      }
    }
  }

  async resumePeer(producingPeerId) {
    const consumers = this.peers[producingPeerId];

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
      } else {
        // console.log("Consumer already playing!");
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

module.exports = { SimpleMediasoupPeer };
