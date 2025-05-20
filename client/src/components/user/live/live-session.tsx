"use client"
import { useEffect, useRef, useState } from "react"
import { MessageSquare, LogOut } from "lucide-react" // Import LogOut icon

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
  const [isPlaying, setIsPlaying] = useState(false); // NEW: State to track if video is playing

  const socketRef = useRef<any>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const peerRef = useRef<Peer.Instance | null>(null)
  const mentorSocketIdRef = useRef<string | null>(null);

  // Function to handle exiting the session
  const exitSession = () => {
    console.log("User: Exiting session...");
    if (socketRef.current) {
      // Optionally emit a "leave-room" event to the server
      // socketRef.current.emit("leave-room", roomId, socketRef.current.id);
      socketRef.current.disconnect(); // Disconnect the socket
    }
    if (peerRef.current) {
      peerRef.current.destroy(); // Destroy the peer connection
      peerRef.current = null;
    }
    mentorStream?.getTracks().forEach(track => track.stop()); // Stop any active media tracks
    setMentorStream(null);
    setIsMentorConnected(false);
    setIsPlaying(false); // Reset playing state
    toast.info("You have left the session.");
    // Redirect to a different page, e.g., home page or a session list
    window.location.href = "/"; // Redirect to home page
  };

  useEffect(() => {
    const init = async () => {
      try {
        const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000")
        socketRef.current = socket

        // Emit join-room AFTER 'connect' event
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
            setIsPlaying(false); // Reset playing state on disconnect
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
                setIsPlaying(false); // Reset playing state
              }
          }

          if (peerRef.current && peerRef.current.connected) {
              console.log("User: Already connected to mentor, ignoring duplicate offer.");
              return;
          }

          const peer = new Peer({
            initiator: false,
            trickle: false,
            config: {
              iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' },
              ]
            },
          });

          peer.on("signal", (data) => {
            console.log(`User: Sending RTC answer signal to mentor ${mentorSocketId}`);
            socket.emit("rtc-answer", mentorSocketId, data);
          });

          peer.on("stream", (stream) => {
            console.log("User: Received mentor's stream.");
            setMentorStream(stream); // This will trigger the new useEffect below
          
            if (stream) {
              console.log("User: Stream received. Number of video tracks:", stream.getVideoTracks().length);
              console.log("User: Stream received. Number of audio tracks:", stream.getAudioTracks().length);
              stream.getVideoTracks().forEach(track => {
                console.log(`User: Video track - id: ${track.id}, kind: ${track.kind}, enabled: ${track.enabled}, readyState: ${track.readyState}`);
              });
              stream.getAudioTracks().forEach(track => {
                console.log(`User: Audio track - id: ${track.id}, kind: ${track.kind}, enabled: ${track.enabled}, readyState: ${track.readyState}`);
              });
            } else {
              console.warn("User: Received an empty or null stream!");
            }
          });

          peer.on("connect", () => {
            console.log("User: Peer connection established with mentor.");
          });

          peer.on("error", (err) => {
            console.error("User: Peer error:", err);
            peerRef.current = null;
            setMentorStream(null);
            setIsPlaying(false); // Reset playing state
            setIsMentorConnected(false);
            toast.error("Error receiving mentor's stream.");
          });

          peer.on('close', () => {
              console.log("User: Peer connection closed.");
              peerRef.current = null;
              setMentorStream(null);
              setIsPlaying(false); // Reset playing state
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
        socketRef.current.off('connect');
        socketRef.current.disconnect();
      }
      if (peerRef.current) {
        peerRef.current.destroy();
        peerRef.current = null;
      }
      mentorStream?.getTracks().forEach(track => track.stop());
      setMentorStream(null);
      setIsPlaying(false); // Ensure state is reset on unmount
    };
  }, [roomId]);

  // NEW useEffect to handle mentorStream assignment to videoRef.current.srcObject
  useEffect(() => {
    if (mentorStream && videoRef.current) {
      console.log("User: Assigning mentorStream to videoRef.current.srcObject.");
      videoRef.current.srcObject = mentorStream;
      // Do NOT call play() here automatically, wait for user interaction
      setIsPlaying(false); // Set to false to show the "Click to Start Stream" button
    } else if (!mentorStream && videoRef.current) {
        // If mentorStream becomes null (e.g., mentor disconnects), clear srcObject
        videoRef.current.srcObject = null;
        console.log("User: Cleared videoRef.current.srcObject as mentorStream is null.");
        setIsPlaying(false); // Reset playing state
    }
  }, [mentorStream]); // Depend on mentorStream

  // NEW: Function to handle manual play button click
  const handlePlayVideo = () => {
    if (videoRef.current && mentorStream) {
      videoRef.current.play().then(() => {
          console.log("User: Video playback initiated successfully by user interaction.");
          setIsPlaying(true); // Update state to reflect playing
      }).catch(e => {
          console.error("User: Error playing video after user interaction:", e);
          toast.error("Failed to play video. Please ensure browser autoplay settings allow it.");
      });
    }
  };


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
        {/* Added relative positioning to parent div for overlay */}
        <div className="bg-black rounded-lg overflow-hidden aspect-video relative">
          {mentorStream ? (
            <>
              <video
                ref={videoRef}
                autoPlay={false} // Set autoPlay to false
                playsInline
                className="w-full h-full object-cover"
              />
              {!isPlaying && ( // Show overlay if mentorStream exists but is not playing
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 text-white p-4">
                  <p className="text-lg font-semibold mb-4 text-center">Mentor stream is ready!</p>
                  <Button onClick={handlePlayVideo} size="lg" className="text-white">
                    Click to Start Stream
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-white">
              {isMentorConnected ? "Loading mentor's stream..." : "Waiting for mentor to connect..."}
            </div>
          )}
        </div>

        {/* Add the Exit Session Button here */}
        <div className="mt-4 flex justify-center">
            <Button variant="destructive" onClick={exitSession}>
                <LogOut size={18} className="mr-2" /> Exit Session
            </Button>
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