"use client"
import { useEffect, useRef, useState } from "react"
import { Mic, MicOff, Video, VideoOff, PhoneOff, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import io from "socket.io-client"

interface Participant {
  id: string
  stream: MediaStream | null
  isMuted: boolean
  isVideoOff: boolean
  name: string
}

export default function VideoCallInterface({ roomId }: { roomId: string }) {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [socket, setSocket] = useState<any>(null)
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const peerConnections = useRef<{[key: string]: RTCPeerConnection}>({})
  const localStream = useRef<MediaStream | null>(null)

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_SERVER || "http://localhost:3001")
    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
    }
  }, [])
  useEffect(() => {
    if (!socket) return

    const initMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        })
        
        localStream.current = stream
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream
        }
        setParticipants(prev => [...prev, {
          id: socket.id,
          stream,
          isMuted: false,
          isVideoOff: false,
          name: "Mentor"
        }])
        socket.emit("join-room", roomId, socket.id)

      } catch (error) {
        console.error("Error accessing media devices:", error)
      }
    }

    initMedia()
    socket.on("user-connected", (userId: string) => {
      createPeerConnection(userId)
    })

    socket.on("offer", async (userId: string, offer: RTCSessionDescriptionInit) => {
      if (!peerConnections.current[userId]) {
        createPeerConnection(userId)
      }
      
      const pc = peerConnections.current[userId]
      await pc.setRemoteDescription(new RTCSessionDescription(offer))
      const answer = await pc.createAnswer()
      await pc.setLocalDescription(answer)
      socket.emit("answer", userId, answer)
    })

    socket.on("answer", async (userId: string, answer: RTCSessionDescriptionInit) => {
      const pc = peerConnections.current[userId]
      await pc.setRemoteDescription(new RTCSessionDescription(answer))
    })

    socket.on("ice-candidate", (userId: string, candidate: RTCIceCandidateInit) => {
      const pc = peerConnections.current[userId]
      if (pc) {
        pc.addIceCandidate(new RTCIceCandidate(candidate))
      }
    })

    socket.on("user-disconnected", (userId: string) => {
      if (peerConnections.current[userId]) {
        peerConnections.current[userId].close()
        delete peerConnections.current[userId]
      }
      setParticipants(prev => prev.filter(p => p.id !== userId))
    })

    return () => {
      if (localStream.current) {
        localStream.current.getTracks().forEach(track => track.stop())
      }
      Object.values(peerConnections.current).forEach(pc => pc.close())
    }
  }, [socket, roomId])

  const createPeerConnection = async (userId: string) => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
      ]
    })

    peerConnections.current[userId] = pc
    if (localStream.current) {
      localStream.current.getTracks().forEach(track => {
        pc.addTrack(track, localStream.current!)
      })
    }

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", userId, event.candidate)
      }
    }

    pc.ontrack = (event) => {
      setParticipants(prev => {
        const existing = prev.find(p => p.id === userId)
        if (existing) {
          return prev.map(p => 
            p.id === userId ? { ...p, stream: event.streams[0] } : p
          )
        } else {
          return [...prev, {
            id: userId,
            stream: event.streams[0],
            isMuted: false,
            isVideoOff: false,
            name: `Student ${prev.length}`
          }]
        }
      })
    }

    if (socket.id < userId) { 
      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)
      socket.emit("offer", userId, offer)
    }
  }

  const toggleMute = () => {
    if (localStream.current) {
      const audioTracks = localStream.current.getAudioTracks()
      audioTracks.forEach(track => {
        track.enabled = !track.enabled
      })
      setIsMuted(!isMuted)
    }
  }

  const toggleVideo = () => {
    if (localStream.current) {
      const videoTracks = localStream.current.getVideoTracks()
      videoTracks.forEach(track => {
        track.enabled = !track.enabled
      })
      setIsVideoOff(!isVideoOff)
    }
  }

  const endCall = () => {
    if (localStream.current) {
      localStream.current.getTracks().forEach(track => track.stop())
    }
    socket.emit("leave-room", roomId)
    // Redirect or handle call end
  }

  return (
    <div className="flex flex-col h-full bg-slate-100 dark:bg-slate-800">
      {/* Video Grid */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-fr">
          {/* Local video */}
          <div className="relative rounded-lg overflow-hidden shadow-md bg-black">
          <video
  ref={localVideoRef}
  autoPlay
  playsInline
  muted
  className="w-full h-full object-cover"
  style={{ transform: 'scaleX(-1)' }} // <- this mirrors the video
/>

            <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 text-xs rounded-md">
              You (Mentor)
            </div>
            {isMuted && (
              <div className="absolute bottom-2 right-2 bg-red-500 rounded-full p-1">
                <MicOff size={16} className="text-white" />
              </div>
            )}
            {isVideoOff && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                <VideoOff size={48} className="text-white" />
              </div>
            )}
          </div>

          {/* Remote participants */}
          {participants.filter(p => p.id !== socket?.id).map((participant) => (
            <div key={participant.id} className="relative rounded-lg overflow-hidden shadow-md bg-black">
              {participant.stream ? (
                <>
                  <video
                    autoPlay
                    playsInline
                    ref={video => {
                      if (video && participant.stream) video.srcObject = participant.stream
                    }}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 text-xs rounded-md">
                    {participant.name}
                  </div>
                  {participant.isMuted && (
                    <div className="absolute bottom-2 right-2 bg-red-500 rounded-full p-1">
                      <MicOff size={16} className="text-white" />
                    </div>
                  )}
                  {participant.isVideoOff && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                      <VideoOff size={48} className="text-white" />
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-800">
                  <Users size={48} className="text-gray-500" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
        <div className="flex justify-center space-x-4">
          <Button
            variant={isMuted ? "destructive" : "secondary"}
            size="icon"
            onClick={toggleMute}
            className="rounded-full h-12 w-12"
          >
            {isMuted ? <MicOff /> : <Mic />}
          </Button>
          <Button
            variant={isVideoOff ? "destructive" : "secondary"}
            size="icon"
            onClick={toggleVideo}
            className="rounded-full h-12 w-12"
          >
            {isVideoOff ? <VideoOff /> : <Video />}
          </Button>
          <Button 
            variant="destructive" 
            size="icon" 
            className="rounded-full h-12 w-12"
            onClick={endCall}
          >
            <PhoneOff />
          </Button>
        </div>
      </div>
    </div>
  )
}