import { useState, useEffect, useContext, createContext, useRef, useCallback } from 'react'
import { SimpleMediasoupPeer } from 'simple-mediasoup-peer-client'

// Create the Realtime Context
const RealtimeContext = createContext(null)

// RealtimeContextProvider Component
export function RealtimeContextProvider({ children, serverUrl, serverPort = 3000, roomId }) {
  const peerRef = useRef(null)
  const [isConnected, setIsConnected] = useState(false)
  const [currentRoomId, setCurrentRoomId] = useState(null)
  const [localTracks, setLocalTracks] = useState({})
  const [remoteTracks, setRemoteTracks] = useState({})

  // Initialize the SimpleMediasoupPeer client
  useEffect(() => {
    if (!peerRef.current) {
      peerRef.current = new SimpleMediasoupPeer({
        url: serverUrl || window.location.hostname,
        port: serverPort,
        roomId: roomId || null,
        autoConnect: true,
      })

      // Listen for remote tracks
      peerRef.current.on('track', (trackData) => {
        const { track, peerId, label, pause, resume } = trackData
        console.log(`Received ${label} track from peer ${peerId}`)
        
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
        }))
      })

      // Monitor connection state
      const socket = peerRef.current.socket
      if (socket) {
        socket.on('connect', () => {
          setIsConnected(true)
          console.log('Connected to signaling server')
        })
        
        socket.on('disconnect', () => {
          setIsConnected(false)
          console.log('Disconnected from signaling server')
        })
      }
    }

    return () => {
      if (peerRef.current) {
        // Clean up on unmount
        peerRef.current.disconnectFromMediasoup()
      }
    }
  }, [serverUrl, serverPort, roomId])


  const value = {
    peer: peerRef.current,
    isConnected,
    currentRoomId,
    localTracks,
    remoteTracks,
    addTrack,
    removeTrack,
    joinRoom,
    leaveRoom,
  }

  return (
    <RealtimeContext.Provider value={value}>
      {children}
    </RealtimeContext.Provider>
  )
}

// Custom hook to use the Realtime Context
export function useRealtimeContext() {
  const context = useContext(RealtimeContext)
  if (!context) {
    throw new Error('useRealtimeContext must be used within a RealtimeContextProvider')
  }
  return context
}

const fullMeshClient = () => {
  const { peer } = useRealtimeContext()
  useEffect(() => {
    // getusermedia
    navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then((stream) => {
      peer.addTrack(stream.getVideoTracks()[0], "video")
    })
  })
  useEffect(() => {
    if (peer) {
      peer.joinRoom("fullMesh")
    }
  }, [peer])
  return (
    <div>
      <h1>Full Mesh Client</h1>
      <p>Connected to the full mesh</p>
    </div>
  )
}
// Example App component
function App() {
  return (
    <RealtimeContextProvider serverUrl="localhost" serverPort={4000}>
      <div>
        <h1>SimpleMediasoupPeer React Example</h1>
        <p>Realtime context is ready!</p>
      </div>
    </RealtimeContextProvider>
  )
}

export default App
