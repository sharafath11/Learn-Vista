"use client"

import { useEffect, useRef, useState } from "react"
import { Mic, MicOff, Video, VideoOff, PhoneOff, Monitor, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import io from "socket.io-client"
import Peer from "simple-peer"

// Types
interface Participant {
  id: string
  stream?: MediaStream
}

interface Comment {
  text: string
  timestamp: string
  sender: string
  isMentor: boolean
}

export function MentorStream({ roomId }: { roomId: string }) {
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [connectionStatus, setConnectionStatus] = useState("Initializing...")
  const [newComment, setNewComment] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [debugMessages, setDebugMessages] = useState<string[]>([])
  const [isDebugOpen, setIsDebugOpen] = useState(false)

  const socketRef = useRef<any>(null)
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const localStreamRef = useRef<MediaStream | null>(null)
  const screenStreamRef = useRef<MediaStream | null>(null)
  const peersRef = useRef<Record<string, Peer.Instance>>({})
  const commentsEndRef = useRef<HTMLDivElement>(null)

  // Add debug message
  const addDebugMessage = (message: string) => {
    const timestampedMsg = `${new Date().toLocaleTimeString()}: ${message}`
    setDebugMessages((prev) => [...prev.slice(-100), timestampedMsg])
    console.log(timestampedMsg)
  }

  // Auto-scroll to latest comment
  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [comments])

  // Initialize media and socket connection
  useEffect(() => {
    const initializeMedia = async () => {
      try {
        addDebugMessage("Initializing connection...")
        setConnectionStatus("Accessing camera and microphone...")

        // Get user media
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        })

        addDebugMessage("Media access successful")
        localStreamRef.current = stream
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream
        }

        // Connect to socket server
        setConnectionStatus("Connecting to server...")
        addDebugMessage("Creating Socket.IO connection")
        const socket = io(process.env.NEXT_PUBLIC_SOCKET_SERVER || "http://localhost:4000", {
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          transports: ["websocket", "polling"],
        })

        socketRef.current = socket

        socket.on("connect", () => {
          addDebugMessage(`Socket connected with ID: ${socket.id}`)

          // Join room as mentor
          socket.emit("join-room", roomId, "mentor")
          addDebugMessage(`Emitted join-room for room ${roomId}`)

          setConnectionStatus("Room created. Waiting for participants...")
          toast.success("Room created successfully!")
        })

        // Handle user joining
        socket.on("user-joined", (userId: string) => {
          addDebugMessage(`User joined: ${userId}`)

          if (!localStreamRef.current && !screenStreamRef.current) {
            addDebugMessage("No media stream available for sharing")
            toast.error("No media stream available for sharing")
            return
          }

          // Create a new peer connection
          addDebugMessage(`Creating new peer connection for user ${userId}`)
          const peer = new Peer({
            initiator: true,
            trickle: true,
            stream: isScreenSharing ? screenStreamRef.current! : localStreamRef.current!,
            config: {
              iceServers: [{ urls: "stun:stun.l.google.com:19302" }, { urls: "stun:global.stun.twilio.com:3478" }],
            },
          })

          // Handle peer signaling
          peer.on("signal", (signal) => {
            addDebugMessage(`Generated ${signal.type || "candidate"} for user ${userId}`)
            socketRef.current.emit("rtc-offer", userId, signal)
          })

          // Handle errors
          peer.on("error", (err) => {
            addDebugMessage(`Peer error for ${userId}: ${err.message}`)
            toast.error(`Connection issue with user ${userId.slice(0, 5)}`)
            removePeer(userId)
          })

          // Store the peer
          peersRef.current[userId] = peer
          setParticipants((prev) => [...prev, { id: userId }])

          toast.info(`User ${userId.slice(0, 5)} joined the session`)
        })

        // Handle RTC answers
        socket.on("rtc-answer", (userId: string, answer: any) => {
          addDebugMessage(`Received answer from user ${userId}`)
          if (peersRef.current[userId]) {
            try {
              peersRef.current[userId].signal(answer)
            } catch (err) {
              addDebugMessage(
                `Error processing answer from ${userId}: ${err instanceof Error ? err.message : String(err)}`,
              )
              toast.error(`Failed to connect with user ${userId.slice(0, 5)}`)
            }
          }
        })

        // Handle ICE candidates
        socket.on("ice-candidate", (userId: string, candidate: any) => {
          addDebugMessage(`Received ICE candidate from user ${userId}`)
          if (peersRef.current[userId]) {
            try {
              peersRef.current[userId].signal(candidate)
            } catch (err) {
              addDebugMessage(
                `Error processing ICE candidate from ${userId}: ${err instanceof Error ? err.message : String(err)}`,
              )
            }
          }
        })

        // Handle user leaving
        socket.on("user-left", (userId: string) => {
          addDebugMessage(`User left: ${userId}`)
          toast.warning(`User ${userId.slice(0, 5)} left the session`)
          removePeer(userId)
        })

        // Handle new comments
        socket.on("receive-comment", (comment: string, sender: string) => {
          addDebugMessage(`Received comment from ${sender}: ${comment}`)
          setComments((prev) => [
            ...prev,
            {
              text: comment,
              timestamp: new Date().toLocaleTimeString(),
              sender: sender,
              isMentor: false,
            },
          ])
        })

        // Handle connection errors
        socket.on("connect_error", (err: Error) => {
          addDebugMessage(`Socket connection error: ${err.message}`)
          toast.error("Failed to connect to server. Retrying...")
          setConnectionStatus("Connection failed")
        })

        // Handle reconnection
        socket.on("reconnect", (attemptNumber: number) => {
          addDebugMessage(`Reconnected after ${attemptNumber} attempts`)
          toast.success(`Reconnected to server after ${attemptNumber} attempts`)
          setConnectionStatus("Connected")
        })

        // Handle disconnect
        socket.on("disconnect", (reason: string) => {
          addDebugMessage(`Socket disconnected: ${reason}`)
          setConnectionStatus("Disconnected from server")
        })
      } catch (err) {
        addDebugMessage(`Media access error: ${err instanceof Error ? err.message : String(err)}`)
        console.error("Media access error:", err)
        toast.error("Failed to access camera or microphone. Please check permissions.")
        setConnectionStatus("Media access failed")
      }
    }

    initializeMedia()

    // Cleanup on unmount
    return () => {
      endCall()
    }
  }, [roomId])

  // Remove peer connection
  const removePeer = (userId: string) => {
    addDebugMessage(`Removing peer for user ${userId}`)
    if (peersRef.current[userId]) {
      peersRef.current[userId].destroy()
      delete peersRef.current[userId]
    }
    setParticipants((prev) => prev.filter((p) => p.id !== userId))
  }

  // Toggle microphone
  const toggleMute = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled
      })
      setIsMuted(!isMuted)
      addDebugMessage(isMuted ? "Microphone unmuted" : "Microphone muted")
      toast.info(isMuted ? "Microphone unmuted" : "Microphone muted")
    } else {
      addDebugMessage("No audio stream available")
      toast.error("No audio stream available")
    }
  }

  // Toggle video
  const toggleVideo = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled
      })
      setIsVideoOff(!isVideoOff)
      addDebugMessage(isVideoOff ? "Camera enabled" : "Camera disabled")
      toast.info(isVideoOff ? "Camera enabled" : "Camera disabled")
    } else {
      addDebugMessage("No video stream available")
      toast.error("No video stream available")
    }
  }

  // Toggle screen sharing
  const toggleScreenShare = async () => {
    if (isLoading) return
    setIsLoading(true)

    try {
      if (isScreenSharing) {
        addDebugMessage("Stopping screen sharing")
        // Stop screen sharing
        screenStreamRef.current?.getTracks().forEach((track) => track.stop())
        screenStreamRef.current = null

        // Replace tracks in all peer connections
        if (localStreamRef.current) {
          const videoTrack = localStreamRef.current.getVideoTracks()[0]
          if (videoTrack) {
            addDebugMessage("Replacing screen share track with camera track for all peers")
            Object.entries(peersRef.current).forEach(([userId, peer]) => {
              try {
                peer.replaceTrack(peer.streams[0].getVideoTracks()[0], videoTrack, peer.streams[0])
                addDebugMessage(`Successfully replaced track for user ${userId}`)
              } catch (err) {
                addDebugMessage(
                  `Failed to replace track for user ${userId}: ${err instanceof Error ? err.message : String(err)}`,
                )
              }
            })
          }

          // Update local video
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = localStreamRef.current
          }
        }

        setIsScreenSharing(false)
        toast.success("Screen sharing stopped")
      } else {
        addDebugMessage("Starting screen sharing")
        // Start screen sharing
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        })
        screenStreamRef.current = screenStream

        // Replace tracks in all peer connections
        const videoTrack = screenStream.getVideoTracks()[0]
        if (videoTrack) {
          addDebugMessage("Replacing camera track with screen share track for all peers")
          Object.entries(peersRef.current).forEach(([userId, peer]) => {
            try {
              peer.replaceTrack(peer.streams[0].getVideoTracks()[0], videoTrack, peer.streams[0])
              addDebugMessage(`Successfully replaced track for user ${userId}`)
            } catch (err) {
              addDebugMessage(
                `Failed to replace track for user ${userId}: ${err instanceof Error ? err.message : String(err)}`,
              )
            }
          })
        }

        // Create a combined stream for local preview
        const combinedStream = new MediaStream()
        screenStream.getVideoTracks().forEach((track) => combinedStream.addTrack(track))
        localStreamRef.current?.getAudioTracks().forEach((track) => combinedStream.addTrack(track))

        // Update local video
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = combinedStream
        }

        // Handle screen sharing ended by user
        screenStream.getVideoTracks()[0].onended = () => {
          addDebugMessage("Screen sharing ended by system event")
          toggleScreenShare()
        }

        setIsScreenSharing(true)
        toast.success("Screen sharing started")
      }
    } catch (err) {
      addDebugMessage(`Screen share error: ${err instanceof Error ? err.message : String(err)}`)
      console.error("Screen share error:", err)
      toast.error("Failed to share screen. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // End call
  const endCall = () => {
    addDebugMessage("Ending call and cleaning up")

    // Emit leave room event
    if (socketRef.current) {
      socketRef.current.emit("leave-room", roomId)
      socketRef.current.disconnect()
    }

    // Stop all media tracks
    localStreamRef.current?.getTracks().forEach((track) => track.stop())
    screenStreamRef.current?.getTracks().forEach((track) => track.stop())

    // Destroy all peer connections
    Object.values(peersRef.current).forEach((peer) => peer.destroy())
    peersRef.current = {}

    toast.info("Session ended")

    // Redirect to home page
    window.location.href = "/mentor/upcomming"
  }

  // Submit comment
  const submitComment = () => {
    if (!newComment.trim()) {
      toast.error("Please enter a message")
      return
    }

    addDebugMessage(`Sending comment: ${newComment}`)
    socketRef.current?.emit("send-comment", roomId, newComment, "Mentor")

    // Add comment to local state
    setComments((prev) => [
      ...prev,
      {
        text: newComment,
        timestamp: new Date().toLocaleTimeString(),
        sender: "Mentor",
        isMentor: true,
      },
    ])

    setNewComment("")
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen p-4 gap-4 bg-gray-100 dark:bg-gray-900">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex-1">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Mentor Room: {roomId}</h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="text-sm text-gray-600 dark:text-gray-300">{connectionStatus}</div>
              <Badge variant="outline">{participants.length} Viewers</Badge>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <Button
            variant={isMuted ? "destructive" : "outline"}
            onClick={toggleMute}
            size="icon"
            disabled={isLoading || !localStreamRef.current}
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
          <Button
            variant={isVideoOff ? "destructive" : "outline"}
            onClick={toggleVideo}
            size="icon"
            disabled={isLoading || !localStreamRef.current}
            title={isVideoOff ? "Enable Camera" : "Disable Camera"}
          >
            {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
          </Button>
          <Button
            variant={isScreenSharing ? "destructive" : "outline"}
            onClick={toggleScreenShare}
            size="icon"
            disabled={isLoading}
            title={isScreenSharing ? "Stop Screen Share" : "Start Screen Share"}
          >
            <Monitor className="h-5 w-5" />
          </Button>
          <Button variant="destructive" onClick={endCall} size="icon" title="End Session">
            <PhoneOff className="h-5 w-5" />
          </Button>
        </div>

        <div className="bg-black rounded-lg overflow-hidden aspect-video mb-4 relative">
          <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
          <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-white text-sm">
            You (Mentor) {isScreenSharing && "- Screen Sharing"}
          </div>
        </div>

        {participants.length > 0 ? (
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-2">Connected Viewers: {participants.length}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {participants.map((participant) => (
                <div key={participant.id} className="bg-gray-200 dark:bg-gray-700 p-2 rounded-md text-center">
                  Viewer {participant.id.slice(0, 5)}
                </div>
              ))}
            </div>
          </Card>
        ) : (
          <Card className="p-4 text-center">
            <p className="text-gray-500">No viewers connected yet. Share your room ID to get started.</p>
            <p className="font-mono mt-2 select-all bg-gray-100 dark:bg-gray-800 p-2 rounded">{roomId}</p>
          </Card>
        )}

        {/* Debug Console */}
        <Card className="mt-4 overflow-hidden">
          <div className="flex justify-between items-center p-3 bg-gray-800 text-white">
            <h3 className="font-mono font-bold">Debug Console</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDebugOpen(!isDebugOpen)}
              className="text-white border-white/50"
            >
              {isDebugOpen ? "Hide" : "Show"}
            </Button>
          </div>
          {isDebugOpen && (
            <div className="font-mono text-xs max-h-60 overflow-y-auto space-y-1 p-3 bg-gray-900 text-gray-200">
              {debugMessages.length > 0 ? (
                debugMessages.map((msg, index) => (
                  <div key={index} className="border-b border-gray-700 pb-1">
                    {msg}
                  </div>
                ))
              ) : (
                <div className="text-gray-400">No debug messages yet</div>
              )}
            </div>
          )}
        </Card>
      </div>

      <div className="w-full lg:w-1/3 bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden flex flex-col">
        <div className="p-4 border-b flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          <h2 className="font-semibold text-gray-800 dark:text-white">Session Chat</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {comments.length > 0 ? (
            comments.map((item, index) => (
              <div
                key={index}
                className={`p-3 rounded ${
                  item.isMentor ? "bg-blue-100 dark:bg-blue-900/30 ml-6" : "bg-gray-100 dark:bg-gray-700 mr-6"
                }`}
              >
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                  <span className="font-semibold">{item.sender}</span>
                  <span>{item.timestamp}</span>
                </div>
                <p className="text-gray-800 dark:text-white">{item.text}</p>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">No messages yet</div>
          )}
          <div ref={commentsEndRef} />
        </div>

        <div className="p-4 border-t">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Type your message..."
            className="mb-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            disabled={isLoading || !socketRef.current?.connected}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                submitComment()
              }
            }}
          />
          <Button onClick={submitComment} className="w-full" disabled={isLoading || !socketRef.current?.connected}>
            Send
          </Button>
        </div>
      </div>
    </div>
  )
}
