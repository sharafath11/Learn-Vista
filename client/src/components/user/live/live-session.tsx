"use client"
import { useEffect, useRef, useState } from "react"
import { MessageSquare } from "lucide-react"

import { toast } from "sonner"
import io from "socket.io-client"
import Peer from "simple-peer"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export default function UserLiveSession({ roomId }: { roomId: string }) {
  const [mentorStream, setMentorStream] = useState<MediaStream | null>(null)
  const [comments, setComments] = useState<{text: string, sender: string}[]>([])
  const [newComment, setNewComment] = useState("")
  const [isMentorConnected, setIsMentorConnected] = useState(false);

  const socketRef = useRef<any>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const peerRef = useRef<Peer.Instance | null>(null)
  const mentorSocketIdRef = useRef<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000")
        socketRef.current = socket

        // *** CRITICAL CHANGE: Emit join-room AFTER 'connect' event ***
        socket.on('connect', () => {
          console.log(`UserLiveSession: Socket connected with ID: ${socket.id}`);
          socket.emit("join-room", roomId, socket.id, "user") // Pass socket.id as clientProvidedId
          console.log(`User ${socket.id} joined room ${roomId}`);
        });

        socket.on("mentor-available", (mentorSocketId: string) => {
          console.log(`User: Mentor ${mentorSocketId} is available. Preparing for connection...`);
          setIsMentorConnected(true);
          mentorSocketIdRef.current = mentorSocketId;
        });

        socket.on("mentor-disconnected", () => {
            console.log("User: Mentor disconnected.");
            setIsMentorConnected(false);
            setMentorStream(null);
            if (peerRef.current) {
                peerRef.current.destroy();
                peerRef.current = null;
            }
            mentorSocketIdRef.current = null;
            toast.info("Mentor disconnected from the session.");
        });

        socket.on("rtc-offer", async (mentorSocketId: string, offer: any) => {
          console.log(`User: Received RTC offer from mentor ${mentorSocketId}`);

          if (mentorSocketIdRef.current !== mentorSocketId) {
              console.warn("User: Received offer from unexpected mentor. Updating mentorSocketIdRef.");
              mentorSocketIdRef.current = mentorSocketId;
              if (peerRef.current) {
                peerRef.current.destroy();
                peerRef.current = null;
                setMentorStream(null);
              }
          }

          if (peerRef.current && peerRef.current.connected) {
              console.log("User: Already connected to mentor, ignoring duplicate offer.");
              return;
          }

          const peer = new Peer({
            initiator: false,
            trickle: false,
          });

          peer.on("signal", (data) => {
            console.log(`User: Sending RTC answer signal to mentor ${mentorSocketId}`);
            socket.emit("rtc-answer", mentorSocketId, data);
          });

          peer.on("stream", (stream) => {
            console.log("User: Received mentor's stream.");
            setMentorStream(stream);
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
              videoRef.current.play().catch(console.error);
            }
          });

          peer.on("connect", () => {
            console.log("User: Peer connection established with mentor.");
          });

          peer.on("error", (err) => {
            console.error("User: Peer error:", err);
            peerRef.current = null;
            setMentorStream(null);
            setIsMentorConnected(false);
            toast.error("Error receiving mentor's stream.");
          });

          peer.on('close', () => {
              console.log("User: Peer connection closed.");
              peerRef.current = null;
              setMentorStream(null);
              setIsMentorConnected(false);
              toast.info("Mentor connection lost.");
          });

          peer.signal(offer);
          peerRef.current = peer;
        });

        socket.on("ice-candidate", (fromSocketId: string, candidate: any) => {
          console.log(`User: Received ICE candidate from ${fromSocketId}`);
          if (peerRef.current && mentorSocketIdRef.current === fromSocketId) {
            peerRef.current.signal(candidate);
          }
        });

        socket.on("receive-comment", (message: string, sender: string) => {
          console.log(`User: Received comment: "${message}" from ${sender}`);
          setComments(prev => [...prev, { text: message, sender }]);
        });

        // Handle socket disconnection
        socket.on('disconnect', (reason: any) => {
          console.warn(`UserLiveSession: Socket disconnected: ${reason}`);
          toast.error("Disconnected from server. Please refresh.");
        });

      } catch (err) {
        console.error("User: Init error:", err);
        toast.error("Failed to join session");
      }
    };

    init();

    return () => {
      console.log("User: Cleaning up...");
      if (socketRef.current) {
        socketRef.current.off('connect'); // Remove listener to prevent re-emission
        socketRef.current.disconnect();
      }
      if (peerRef.current) {
        peerRef.current.destroy();
        peerRef.current = null;
      }
      mentorStream?.getTracks().forEach(track => track.stop());
      setMentorStream(null);
    };
  }, [roomId]);

  const submitComment = () => {
    if (newComment.trim()) {
      console.log("User: Sending comment:", newComment);
      socketRef.current?.emit("send-comment", roomId, newComment, "Viewer");
      setNewComment("");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen p-4 gap-4">
      <div className="flex-1">
        <div className="bg-black rounded-lg overflow-hidden aspect-video">
          {mentorStream ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-white">
              {isMentorConnected ? "Loading mentor's stream..." : "Waiting for mentor to connect..."}
            </div>
          )}
        </div>
      </div>

      <div className="w-full lg:w-80 flex flex-col border rounded-lg">
        <div className="p-3 border-b">
          <h3 className="font-medium flex items-center gap-2">
            <MessageSquare size={18} /> Chat
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {comments.map((comment, i) => (
            <div key={i} className={`p-2 rounded ${comment.sender === "Viewer" ? "bg-blue-100" : "bg-gray-100"}`}>
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
          <Button onClick={submitComment} className="w-full mt-2">
            Send
          </Button>
        </div>
      </div>
    </div>
  )
}