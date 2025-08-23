"use client"
import { useEffect, useRef, useState } from "react"
import { MessageSquare, LogOut } from "lucide-react" 

import { toast } from "sonner"
import io from "socket.io-client"
import Peer from "simple-peer"
import { Textarea } from "@/src/components/shared/components/ui/textarea"
import { Button } from "@/src/components/shared/components/ui/button"
import { showInfoToast } from "@/src/utils/Toast"

export default function UserLiveSession({ roomId }: { roomId: string }) {
  const [mentorStream, setMentorStream] = useState<MediaStream | null>(null)
  const [comments, setComments] = useState<{text: string, sender: string}[]>([])
  const [newComment, setNewComment] = useState("")
  const [isMentorConnected, setIsMentorConnected] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false); 
  
  const socketRef = useRef<any>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const peerRef = useRef<Peer.Instance | null>(null)
  const mentorSocketIdRef = useRef<string | null>(null);
  const exitSession = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }
    mentorStream?.getTracks().forEach(track => track.stop()); 
    setMentorStream(null);
    setIsMentorConnected(false);
    setIsPlaying(false); 
    toast.info("You have left the session.");
    window.location.href = "/user/live-classes"; 
  };

  useEffect(() => {
    const init = async () => {
      try {
        const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000")
        socketRef.current = socket
        socket.on('connect', () => {
          socket.emit("join-room", roomId, socket.id, "user") 
        });

        socket.on("mentor-available", (mentorSocketId: string) => {
          setIsMentorConnected(true);
          mentorSocketIdRef.current = mentorSocketId;
        });

        socket.on("mentor-disconnected", () => {
            setIsMentorConnected(false);
            setMentorStream(null);
            setIsPlaying(false); 
            if (peerRef.current) {
                peerRef.current.destroy();
                peerRef.current = null;
            }
            mentorSocketIdRef.current = null;
            toast.info("Mentor disconnected from the session.");
        });

        socket.on("rtc-offer", async (mentorSocketId: string, offer: any) => {

          if (mentorSocketIdRef.current !== mentorSocketId) {
              mentorSocketIdRef.current = mentorSocketId;
              if (peerRef.current) {
                peerRef.current.destroy();
                peerRef.current = null;
                setMentorStream(null);
                setIsPlaying(false); 
              }
          }

          if (peerRef.current && peerRef.current.connected) {
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
            socket.emit("rtc-answer", mentorSocketId, data);
          });

          peer.on("stream", (stream) => {
            setMentorStream(stream);
          
            if (stream) {
              stream.getVideoTracks().forEach(_track => {
              });
              stream.getAudioTracks().forEach(_track => {
              });
            } else {
            }
          });

          peer.on("connect", () => {
          });

          peer.on("error", (_err) => {
            peerRef.current = null;
            setMentorStream(null);
            setIsPlaying(false); 
            setIsMentorConnected(false);
            toast.error("Error receiving mentor's stream.");
          });

          peer.on('close', () => {
              peerRef.current = null;
              setMentorStream(null);
              setIsPlaying(false);
              setIsMentorConnected(false);
              toast.info("Mentor connection lost.");
          });

          peer.signal(offer);
          peerRef.current = peer;
        });

        socket.on("ice-candidate", (fromSocketId: string, candidate: any) => {
          if (peerRef.current && mentorSocketIdRef.current === fromSocketId) {
            peerRef.current.signal(candidate);
          }
        });

        socket.on("receive-comment", (message: string, sender: string) => {
          setComments(prev => [...prev, { text: message, sender }]);
        });
        socket.on("end-stream", (msg:string) => {
          showInfoToast(msg);
          window.location.href="/user/live-classes"
        })
        socket.on('disconnect', (_reason: any) => {
          toast.error("Disconnected from server. Please refresh.");
        });

      } catch (err) {
        console.warn(err)
        toast.error("Failed to join session");
        window.location.href="/user/live-classes"
      }
    };

    init();

    return () => {
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
      setIsPlaying(false);
    };
  },[roomId]);

  useEffect(() => {
    if (mentorStream && videoRef.current) {
      videoRef.current.srcObject = mentorStream;
      setIsPlaying(false); 
    } else if (!mentorStream && videoRef.current) {
        videoRef.current.srcObject = null;
        setIsPlaying(false); 
    }
  }, [mentorStream]); 
  const handlePlayVideo = () => {
    if (videoRef.current && mentorStream) {
      videoRef.current.play().then(() => {
          setIsPlaying(true); 
      }).catch(_e => {
          toast.error("Failed to play video. Please ensure browser autoplay settings allow it.");
      });
    }
  };


  const submitComment = () => {
    if (newComment.trim()) {
      socketRef.current?.emit("send-comment", roomId, newComment, "Viewer");
      setNewComment("");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen p-4 gap-4">
      <div className="flex-1">
    
        <div className="bg-black rounded-lg overflow-hidden aspect-video relative">
          {mentorStream ? (
            <>
              <video
                ref={videoRef}
                autoPlay={false}
                playsInline
                className="w-full h-full object-cover"
              />
              {!isPlaying && ( 
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