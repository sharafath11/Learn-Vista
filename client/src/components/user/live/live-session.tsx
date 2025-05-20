"use client"

import { useEffect, useRef, useState } from "react"
import { PhoneOff, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import io from "socket.io-client"
import Peer from "simple-peer"

// Types
interface Comment {
  text: string
  timestamp: string
  sender: string
  isMentor: boolean
}

export function UserLiveSession({ roomId }: { roomId: string }) {
  const [mentorStream, setMentorStream] = useState<MediaStream | null>(null)
  const [connectionStatus, setConnectionStatus] = useState("Connecting...")
  const [debugMessages, setDebugMessages] = useState<string[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [isDebugOpen, setIsDebugOpen] = useState(true)
  const [userName, setUserName] = useState(`User-${Math.floor(Math.random() * 1000)}`)

  const socketRef = useRef<any>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const peerRef = useRef<Peer.Instance | null>(null)
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

  // Initialize socket and WebRTC connection
  useEffect(() => {
    const initializeConnection = () => {
      addDebugMessage("Initializing connection to server...")

      try {
        // Connect to socket server
        const socket = io(process.env.NEXT_PUBLIC_SOCKET_SERVER || "http://localhost:4000", {
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          transports: ["websocket", "polling"],
        })

        socketRef.current = socket
        addDebugMessage("Socket.io instance created")

        // Handle connection
        socket.on("connect", () => {
          addDebugMessage("Socket connected to server")
          addDebugMessage(`Socket ID: ${socket.id}`)
          setConnectionStatus("Joining room...")

          // Join room as user
          socket.emit("join-room", roomId, "user")
          addDebugMessage(`Emitted join-room for room ${roomId}`)

          toast.info("Joining session...")
        })

        // Handle mentor availability
        socket.on("mentor-available", (mentorId: string) => {
          addDebugMessage(`Mentor available with ID: ${mentorId}`)
          setConnectionStatus("Waiting for connection from mentor...")
        })

        // Handle RTC offers
        socket.on("rtc-offer", (mentorId: string, signal: any) => {
          addDebugMessage(`Received signal from mentor ${mentorId}: ${signal.type || "candidate"}`)
          if (peerRef.current) {
            try {
              peerRef.current.signal(signal)
            } catch (err) {
              addDebugMessage(`Error processing signal: ${err instanceof Error ? err.message : String(err)}`)
            }
          } else {
            addDebugMessage("Creating new peer for incoming signal")
            handleOfferSignal(mentorId, signal)
          }
        })

        // Handle ICE candidates
        socket.on("ice-candidate", (mentorId: string, candidate: any) => {
          addDebugMessage(`Received ICE candidate from ${mentorId}`)
          if (peerRef.current) {
            try {
              peerRef.current.signal(candidate)
            } catch (err) {
              addDebugMessage(`Error processing ICE candidate: ${err instanceof Error ? err.message : String(err)}`)
            }
          } else {
            addDebugMessage("Received ICE candidate but peer connection not established yet")
          }
        })

        // Handle mentor disconnection
        socket.on("mentor-disconnected", () => {
          addDebugMessage("Mentor has disconnected")
          toast.warning("Mentor has left the session")
          cleanupPeer()
          setConnectionStatus("Waiting for mentor to reconnect...")
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
              isMentor: sender === "Mentor",
            },
          ])
        })

        // Handle connection errors
        socket.on("connect_error", (err: any) => {
          addDebugMessage(`Connection error: ${err.message}`)
          toast.error("Failed to connect to server. Retrying...")
          setConnectionStatus("Connection failed")
        })

        // Handle disconnection
        socket.on("disconnect", (reason: string) => {
          addDebugMessage(`Socket disconnected: ${reason}`)
          toast.warning("Disconnected from server")
          setConnectionStatus("Disconnected")
        })

        // Handle reconnection
        socket.on("reconnect", (attemptNumber: number) => {
          addDebugMessage(`Socket reconnected after ${attemptNumber} attempts`)
          toast.success(`Reconnected to server after ${attemptNumber} attempts`)

          // Rejoin room after reconnection
          socket.emit("join-room", roomId, "user")
          addDebugMessage(`Rejoined room ${roomId} after reconnection`)
        })
      } catch (err) {
        addDebugMessage(`Initialization error: ${err instanceof Error ? err.message : String(err)}`)
        toast.error("Failed to initialize connection")
        setConnectionStatus("Initialization failed")
      }
    }

    initializeConnection()

    // Cleanup on unmount
    return () => {
      endCall()
    }
  }, [roomId])

  // Handle offer signal
  const handleOfferSignal = (mentorId: string, offer: any) => {
    addDebugMessage("Creating new Peer instance for mentor offer")

    if (peerRef.current) {
      addDebugMessage("Cleaning up existing peer connection")
      peerRef.current.destroy()
      peerRef.current = null
    }

    const peer = new Peer({
      initiator: false,
      trickle: true,
      config: {
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }, { urls: "stun:global.stun.twilio.com:3478" }],
      },
    })

    peer.on("signal", (data: any) => {
      addDebugMessage(`Peer generated signal (${data.type || "candidate"})`)
      if (socketRef.current) {
        socketRef.current.emit("rtc-answer", mentorId, data)
      }
    })

    peer.on("stream", (stream: MediaStream) => {
      addDebugMessage("Received mentor stream")
      setMentorStream(stream)
      setConnectionStatus("Connected to mentor")

      toast.success("Connected to mentor")

      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream
        remoteVideoRef.current.play().catch((err) => {
          addDebugMessage(`Video play error: ${err.message}`)
          toast.error("Could not play video stream")
        })
      }
    })

    peer.on("error", (err) => {
      addDebugMessage(`Peer error: ${err.message}`)
      toast.error("Connection error with mentor")
      cleanupPeer()
    })

    peer.on("close", () => {
      addDebugMessage("Peer connection closed")
      cleanupPeer()
    })

    try {
      addDebugMessage("Processing mentor's offer signal")
      peer.signal(offer)
      peerRef.current = peer
      addDebugMessage("Successfully processed mentor's offer signal")
    } catch (err) {
      addDebugMessage(`Error processing offer signal: ${err instanceof Error ? err.message : String(err)}`)
      toast.error("Failed to establish connection with mentor")
      setConnectionStatus("Connection failed")
    }
  }

  // Cleanup peer connection
  const cleanupPeer = () => {
    addDebugMessage("Cleaning up peer connection")
    if (peerRef.current) {
      peerRef.current.destroy()
      peerRef.current = null
    }
    setMentorStream(null)
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null
    }
  }

  // End call
  const endCall = () => {
    addDebugMessage("Ending call and cleaning up")

    if (socketRef.current) {
      socketRef.current.emit("leave-room", roomId)
      socketRef.current.disconnect()
    }

    cleanupPeer()
    toast.info("You have left the session")
    window.location.href = "/"
  }

  // Submit comment
  const submitComment = () => {
    if (!newComment.trim()) {
      toast.error("Please enter a message")
      return
    }

    addDebugMessage(`Sending comment: ${newComment}`)
    socketRef.current?.emit("send-comment", roomId, newComment, userName)

    // Add comment to local state
    setComments((prev) => [
      ...prev,
      {
        text: newComment,
        timestamp: new Date().toLocaleTimeString(),
        sender: userName,
        isMentor: false,
      },
    ])

    setNewComment("")
  }

  return (
    <div className="container mx-auto p-4 min-h-screen bg-gray-100 dark:bg-gray-900">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Session: {roomId}</h1>
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-600 dark:text-gray-300">{connectionStatus}</div>
          <Button variant="destructive" onClick={endCall} size="icon" title="Leave Session">
            <PhoneOff className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
            {mentorStream ? (
              <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full text-white text-lg">
                {connectionStatus === "Connected to mentor" ? "Mentor video not available" : connectionStatus}
              </div>
            )}
            <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-white text-sm">
              Mentor Stream
            </div>
          </div>

          {/* Debug Console */}
          <Card className="overflow-hidden">
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

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden flex flex-col">
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
                    item.isMentor ? "bg-blue-100 dark:bg-blue-900/30 mr-6" : "bg-gray-100 dark:bg-gray-700 ml-6"
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
              disabled={!socketRef.current?.connected}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  submitComment()
                }
              }}
            />
            <Button onClick={submitComment} className="w-full" disabled={!socketRef.current?.connected}>
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
