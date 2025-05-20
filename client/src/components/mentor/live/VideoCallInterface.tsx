"use client"

import { useEffect, useRef, useState } from "react"
import { Mic, MicOff, Video, VideoOff, Phone, Monitor, MessageSquare, Badge } from "lucide-react"

import { toast } from "sonner"
import io from "socket.io-client"
import Peer from "simple-peer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

export default function MentorStream({ roomId }: { roomId: string }) {
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [participants, setParticipants] = useState<string[]>([]) // Store userId for display
  const [comments, setComments] = useState<{text: string, sender: string}[]>([])
  const [newComment, setNewComment] = useState("")
  const socketRef = useRef<any>(null)
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const localStreamRef = useRef<MediaStream | null>(null) // Mentor's camera/mic stream
  const screenStreamRef = useRef<MediaStream | null>(null) // Mentor's screen share stream
  // peersRef will store peer connections, indexed by the *other* peer's Socket ID
  const peersRef = useRef<Record<string, Peer.Instance>>({})
  const userIdToSocketIdMap = useRef<Record<string, string>>({});


  useEffect(() => {
    const init = async () => {
      try {
        console.log("MentorStream: Requesting local media...")
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        localStreamRef.current = stream
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream
        }

        console.log("MentorStream: Connecting to socket server...")
        const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000")
        socketRef.current = socket

        // *** CRITICAL CHANGE: Emit join-room AFTER 'connect' event ***
        socket.on('connect', () => {
          console.log(`MentorStream: Socket connected with ID: ${socket.id}`);
          socket.emit("join-room", roomId, socket.id, "mentor") // Pass socket.id as clientProvidedId
          console.log("MentorStream: Mentor joined room:", roomId, "with ID:", socket.id)
        });

        // Event for a user joining the room (this is for *other* users joining)
        socket.on("user-joined", (socketId: string, userId: string) => {
          console.log(`MentorStream: User (socket: ${socketId}, userId: ${userId}) joined.`);
          userIdToSocketIdMap.current[userId] = socketId; // Store mapping for display
          setParticipants(prev => {
            if (!prev.includes(userId)) {
              return [...prev, userId];
            }
            return prev;
          });
          toast.success(`Viewer ${userId.slice(0, 5)} joined`);

          // For each new user, the mentor initiates a Peer connection
          const peer = new Peer({
            initiator: true, // Mentor initiates the connection
            trickle: false,
            stream: isScreenSharing ? screenStreamRef.current! : localStreamRef.current!
          });

          peer.on("signal", signal => {
            console.log(`MentorStream: Sending offer signal to user ${userId} (socket: ${socketId})`);
            socket.emit("rtc-offer", socketId, signal); // Send offer to the specific user's socket
          });

          peer.on("connect", () => {
            console.log(`MentorStream: Peer connection established with user (socket: ${socketId})`);
          });

          peer.on("error", err => {
            console.error(`MentorStream: Peer error for user ${userId} (socket: ${socketId}):`, err);
            removePeer(socketId);
            toast.error(`Viewer ${userId.slice(0,5)} connection error.`);
          });

          peer.on('close', () => {
              console.log(`MentorStream: Peer connection with user (socket: ${socketId}) closed.`);
              removePeer(socketId);
              toast.info(`Viewer ${userId.slice(0,5)} disconnected.`);
          });

          peersRef.current[socketId] = peer; // Store peer by their socket ID
        });

        socket.on("rtc-answer", (fromSocketId: string, answer: any) => {
          console.log(`MentorStream: Received answer from user (socket: ${fromSocketId})`);
          if (peersRef.current[fromSocketId]) {
            peersRef.current[fromSocketId].signal(answer);
          }
        });

        socket.on("ice-candidate", (fromSocketId: string, candidate: any) => {
          console.log(`MentorStream: Received ICE candidate from ${fromSocketId}`);
          if (peersRef.current[fromSocketId]) {
            peersRef.current[fromSocketId].signal(candidate);
          }
        });

        socket.on("user-left", (socketId: string) => {
          console.log(`MentorStream: User (socket: ${socketId}) left.`);
          const leavingUserId = Object.keys(userIdToSocketIdMap.current).find(key => userIdToSocketIdMap.current[key] === socketId);
          if (leavingUserId) {
            setParticipants(prev => prev.filter(id => id !== leavingUserId));
            delete userIdToSocketIdMap.current[leavingUserId];
          }
          removePeer(socketId);
        });

        socket.on("receive-comment", (message: string, sender: string) => {
          console.log("MentorStream: Received comment:", message, "from", sender);
          setComments(prev => [...prev, { text: message, sender }]);
        });

        // Handle socket disconnection (e.g., server restart or network issue)
        socket.on('disconnect', (reason: any) => {
          console.warn(`MentorStream: Socket disconnected: ${reason}`);
          toast.error("Disconnected from server. Please refresh.");
          // You might want to try to reconnect or destroy peers here
        });

      } catch (err) {
        console.error("MentorStream: Error during initialization:", err);
        toast.error("Failed to initialize stream");
      }
    };

    init();

    return () => {
      console.log("MentorStream: Cleaning up...");
      // Ensure socket is disconnected properly, especially if init() partially ran
      if (socketRef.current) {
        socketRef.current.off('connect'); // Remove listener to prevent re-emission on quick re-mount
        socketRef.current.disconnect();
      }
      localStreamRef.current?.getTracks().forEach(track => track.stop());
      screenStreamRef.current?.getTracks().forEach(track => track.stop());
      Object.values(peersRef.current).forEach(peer => peer.destroy());
      peersRef.current = {};
      userIdToSocketIdMap.current = {};
    };
  }, [roomId]);

  const toggleScreenShare = async () => {
    try {
      if (isScreenSharing) {
        console.log("MentorStream: Stopping screen share");
        screenStreamRef.current?.getTracks().forEach(track => track.stop());
        screenStreamRef.current = null;

        Object.values(peersRef.current).forEach(peer => {
            peer.streams.forEach(s => peer.removeStream(s)); // Remove all current streams
            if (localStreamRef.current) {
                peer.addStream(localStreamRef.current); // Add the local camera/mic stream
            }
        });

        if (localVideoRef.current && localStreamRef.current) {
          localVideoRef.current.srcObject = localStreamRef.current;
        }

        setIsScreenSharing(false);
        toast.success("Screen sharing stopped");
      } else {
        console.log("MentorStream: Starting screen share");
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
        screenStreamRef.current = screenStream;

        const combinedStreamForPeers = new MediaStream();
        screenStream.getVideoTracks().forEach(track => combinedStreamForPeers.addTrack(track));
        localStreamRef.current?.getAudioTracks().forEach(track => combinedStreamForPeers.addTrack(track));

        Object.values(peersRef.current).forEach(peer => {
            peer.streams.forEach(s => peer.removeStream(s)); // Remove all current streams
            peer.addStream(combinedStreamForPeers); // Add the combined screen+audio stream
        });

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = combinedStreamForPeers;
        }

        screenStream.getVideoTracks()[0].onended = () => {
          console.log("MentorStream: Screen share ended by user interaction.");
          if (isScreenSharing) {
            toggleScreenShare();
          }
        };

        setIsScreenSharing(true);
        toast.success("Screen sharing started");
      }
    } catch (err) {
      console.error("MentorStream: Error during screen sharing:", err);
      toast.error("Failed to toggle screen share");
    }
  };

  const submitComment = () => {
    if (newComment.trim()) {
      console.log("MentorStream: Sending comment:", newComment);
      socketRef.current?.emit("send-comment", roomId, newComment, "Mentor");
      setNewComment("");
    }
  };

  const removePeer = (socketId: string) => {
    if (peersRef.current[socketId]) {
      peersRef.current[socketId].destroy();
      delete peersRef.current[socketId];
      console.log(`MentorStream: Peer connection with ${socketId} destroyed.`);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen p-4 gap-4">
      <div className="flex-1 flex flex-col gap-4">
        <div className="bg-black rounded-lg overflow-hidden aspect-video">
          <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
        </div>

        <div className="flex gap-2">
          <Button onClick={() => {
            if (localStreamRef.current) {
              const audioTrack = localStreamRef.current.getAudioTracks()[0];
              if (audioTrack) {
                audioTrack.enabled = !isMuted;
                setIsMuted(!isMuted);
                console.log("MentorStream: Microphone toggled, muted:", !isMuted);
              }
            }
          }}>{isMuted ? <MicOff size={18} /> : <Mic size={18} />}</Button>

          <Button onClick={() => {
            if (localStreamRef.current) {
              const videoTrack = localStreamRef.current.getVideoTracks()[0];
              if (videoTrack) {
                videoTrack.enabled = !isVideoOff;
                setIsVideoOff(!isVideoOff);
                console.log("MentorStream: Video toggled, off:", !isVideoOff);
              }
            }
          }}>{isVideoOff ? <VideoOff size={18} /> : <Video size={18} />}</Button>

          <Button onClick={toggleScreenShare}>{isScreenSharing ? <Monitor size={18} className="text-blue-500" /> : <Monitor size={18} />}</Button>

          <Button variant="destructive" onClick={() => {
            console.log("MentorStream: Disconnecting and redirecting");
            socketRef.current?.disconnect();
            window.location.href = "/"
          }}><Phone size={18} /></Button>
        </div>

        <Card className="p-4">
          <h3 className="font-medium mb-2">Viewers ({participants.length})</h3>
          <div className="flex flex-wrap gap-2">
            {participants.map(id => (
              <Badge key={id}>{id.slice(0, 5)}</Badge>
            ))}
          </div>
        </Card>
      </div>

      <div className="w-full lg:w-80 flex flex-col border rounded-lg">
        <div className="p-3 border-b"><h3 className="font-medium">Chat</h3></div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {comments.map((comment, i) => (
            <div key={i} className={`p-2 rounded ${comment.sender === "Mentor" ? "bg-blue-100" : "bg-gray-100"}`}>
              <p className="font-medium text-sm">{comment.sender}</p>
              <p>{comment.text}</p>
            </div>
          ))}
        </div>
        <div className="p-3 border-t">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Type a message..."
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                submitComment()
              }
            }}
          />
          <Button onClick={submitComment} className="w-full mt-2">Send</Button>
        </div>
      </div>
    </div>
  )
}