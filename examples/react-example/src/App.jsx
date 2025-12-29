import { useState, useEffect, useContext, createContext, useRef, useCallback } from "react";
import { SimpleMediasoupPeer } from "simple-mediasoup-peer-client";

// Create the Realtime Context
const RealtimeContext = createContext(null);

// RealtimeContextProvider Component
export function RealtimeContextProvider({ children, roomId }) {
  const [peer, setPeer] = useState(null);
  const [remoteTracks, setRemoteTracks] = useState({});

  // Initialize the SimpleMediasoupPeer client
  useEffect(() => {
    const initializePeer = async () => {
      const newPeer = new SimpleMediasoupPeer({
        url: "http://localhost",
        port: 4000,
        roomId: "fullMesh",
        autoConnect: true,
      });
      await newPeer.joinRoom(roomId);
      const handleTrackAdded = (trackData) => {
        console.log("trackData", trackData);
        const { track, peerId, label, pause, resume } = trackData;
        console.log(`Received ${label} track from peer ${peerId}`);

        setRemoteTracks((prev) => ({
          ...prev,
          [peerId]: {
            ...prev[peerId],
            [label]: {
              track,
              peerId,
              label,
              pause,
              resume,
            },
          },
        }));
      };
      const handleTrackRemoved = (trackData) => {
        const { peerId, label } = trackData;
        console.log(`Track ${label} from peer ${peerId} was removed`);
        setRemoteTracks((prev) => {
          const peerTracks = prev[peerId];
          if (peerTracks) {
            delete peerTracks[label];
            if (Object.keys(peerTracks).length === 0) {
              delete prev[peerId];
              return { ...prev };
            }
            return { ...prev, [peerId]: peerTracks };
          }
          return prev;
        });
      };

      console.log("newPeer", newPeer);
      // console.log('send transport status', newPeer.sendTransport.connectionState)
      newPeer.on("track", handleTrackAdded);
      newPeer.on("trackRemoved", handleTrackRemoved);

      setPeer(newPeer);

      return () => {
        newPeer.off("track", handleTrackAdded);
        newPeer.off("trackRemoved", handleTrackRemoved);
        setPeer(null);
      };
    };
    initializePeer();
  }, [roomId]);

  const value = {
    peer,
    remoteTracks,
  };

  return <RealtimeContext.Provider value={value}>{children}</RealtimeContext.Provider>;
}

// Custom hook to use the Realtime Context
export function useRealtimeContext() {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error("useRealtimeContext must be used within a RealtimeContextProvider");
  }
  return context;
}

const FullMeshRoom = () => {
  const { peer, localTracks, remoteTracks } = useRealtimeContext();
  useEffect(() => {
    // getusermedia
    if (peer) {
      console.log("peer", peer);
      navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then((stream) => {
        peer.addTrack({ track: stream.getVideoTracks()[0], label: "video" });
      });
    }
  }, [peer]);

  return (
    <>
      {Object.entries(remoteTracks).flatMap(([peerId, peerTracks]) =>
        Object.entries(peerTracks).map(([label, trackInfo]) => (
          <RemoteTrack key={`${peerId}-${label}`} trackInfo={trackInfo} />
        ))
      )}
    </>
  );
};

const RemoteTrack = ({ trackInfo }) => {
  const { track, peerId, label, pause, resume } = trackInfo;
  const [videoRef, setVideoRef] = useState(null);
  useEffect(() => {
    if (videoRef) {
      videoRef.srcObject = new MediaStream([track]);
      videoRef.play().catch((error) => {
        console.error("Error playing video:", error);
      });
    }
  }, [videoRef, track]);

  return (
    <div>
      <video style={{ width: "200px" }} ref={setVideoRef} />
      <div>
        <button onClick={pause}>Pause</button>
        <button onClick={resume}>Resume</button>
      </div>
    </div>
  );
};

// Example App component
function App() {
  return (
    <RealtimeContextProvider roomId="fullMesh">
      <div>
        <h1>SimpleMediasoupPeer React Example</h1>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto auto auto",
          padding: "10px",
        }}
      >
        <FullMeshRoom />
      </div>
    </RealtimeContextProvider>
  );
}

export default App;
