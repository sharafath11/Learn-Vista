"use client"

import { useEffect, useRef, useState } from "react"
import { Mic, MicOff, Video, VideoOff, Phone, Monitor, MessageSquare, Badge } from "lucide-react"

import { toast } from "sonner"
import io, { Socket } from "socket.io-client"
import Peer from "simple-peer"
import { Button } from "@/src/components/shared/components/ui/button"
import { Card } from "@/src/components/shared/components/ui/card"
import { Textarea } from "@/src/components/shared/components/ui/textarea"
import { MentorAPIMethods } from "@/src/services/APImethods"
import { showErrorToast, showInfoToast, showSuccessToast } from "@/src/utils/Toast"


export default function MentorStream({ roomId }: { roomId: string }) {
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [participants, setParticipants] = useState<string[]>([]) 
  const [comments, setComments] = useState<{text: string, sender: string}[]>([])
  const [newComment, setNewComment] = useState("")
  const socketRef = useRef<any>(null)
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const localStreamRef = useRef<MediaStream | null>(null) 
  const screenStreamRef = useRef<MediaStream | null>(null) 
  const peersRef = useRef<Record<string, Peer.Instance>>({})
  const userIdToSocketIdMap = useRef<Record<string, string>>({});
 

  useEffect(() => {
    const init = async () => {
      try {
     
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        localStreamRef.current = stream
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream
          localVideoRef.current.play().catch(e => console.error("Mentor: Error playing local video:", e)); // Ensure mentor's local video plays
        }

      
        const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000")
        socketRef.current = socket
        socket.on('connect', () => {
          socket.emit("join-room", roomId, socket.id, "mentor") 
        });
        socket.on("user-joined", (socketId: string, userId: string) => {
          userIdToSocketIdMap.current[userId] = socketId; 
          setParticipants(prev => {
            if (!prev.includes(userId)) {
              return [...prev, userId];
            }
            return prev;
          });
          toast.success(`Viewer ${userId.slice(0, 5)} joined`);
          const streamToSend = isScreenSharing && screenStreamRef.current ? screenStreamRef.current : localStreamRef.current;
          const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: streamToSend!, 
            config: {
              iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' },
              ]
            },
          });

          peer.on("signal", signal => {
            socket.emit("rtc-offer", socketId, signal);
          });

          peer.on("connect", () => {
          });

          peer.on("error", err => {
            console.error(`MentorStream: Peer error for user ${userId} (socket: ${socketId}):`, err);
            removePeer(socketId);
            toast.error(`Viewer ${userId.slice(0,5)} connection error.`);
          });

          peer.on('close', () => {
              removePeer(socketId);
              toast.info(`Viewer ${userId.slice(0,5)} disconnected.`);
          });

          peersRef.current[socketId] = peer; 
        });

        socket.on("rtc-answer", (fromSocketId: string, answer: any) => {
          if (peersRef.current[fromSocketId]) {
            peersRef.current[fromSocketId].signal(answer);
          }
        });

        socket.on("ice-candidate", (fromSocketId: string, candidate: any) => {
          if (peersRef.current[fromSocketId]) {
            peersRef.current[fromSocketId].signal(candidate);
          }
        });

        socket.on("user-left", (socketId: string) => {
          const leavingUserId = Object.keys(userIdToSocketIdMap.current).find(key => userIdToSocketIdMap.current[key] === socketId);
          if (leavingUserId) {
            setParticipants(prev => prev.filter(id => id !== leavingUserId));
            delete userIdToSocketIdMap.current[leavingUserId];
          }
          removePeer(socketId);
        });

        socket.on("receive-comment", (message: string, sender: string) => {
          setComments(prev => [...prev, { text: message, sender }]);
        });
        socket.on("end-stream", (msg:string) => {
          showInfoToast(msg)
        })
        socket.on('disconnect', (reason: any) => {
          console.warn(`MentorStream: Socket disconnected: ${reason}`);
          toast.error("Disconnected from server. Please refresh.");
        });

      } catch (err) {
        console.error("MentorStream: Error during initialization:", err);
        toast.error("Failed to initialize stream");
      }
    };

    init();

    return () => {

      if (socketRef.current) {
        socketRef.current.off('connect'); 
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
        screenStreamRef.current?.getTracks().forEach(track => track.stop());
        screenStreamRef.current = null;
        Object.values(peersRef.current).forEach(peer => {
            peer.streams.forEach(s => peer.removeStream(s)); 
            if (localStreamRef.current) {
                peer.addStream(localStreamRef.current); 
            }
        });
        if (localVideoRef.current && localStreamRef.current) {
          localVideoRef.current.srcObject = localStreamRef.current;
        }

        setIsScreenSharing(false);
        toast.success("Screen sharing stopped");
      } else {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
        screenStreamRef.current = screenStream;

        const combinedStreamForPeers = new MediaStream();
        screenStream.getVideoTracks().forEach(track => combinedStreamForPeers.addTrack(track));
        localStreamRef.current?.getAudioTracks().forEach(track => combinedStreamForPeers.addTrack(track));
        screenStream.getAudioTracks().forEach(track => {
            if (!combinedStreamForPeers.getAudioTracks().some(t => t.id === track.id)) { 
                combinedStreamForPeers.addTrack(track);
            }
        });

        
        Object.values(peersRef.current).forEach(peer => {
            peer.streams.forEach(s => peer.removeStream(s)); 
            peer.addStream(combinedStreamForPeers); 
        });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = combinedStreamForPeers;
        }
        screenStream.getVideoTracks()[0].onended = () => {
          if (isScreenSharing) { 
            toggleScreenShare(); 
          }
        };

        setIsScreenSharing(true);
        toast.success("Screen sharing started");
      }
    } catch (err) {
      console.error("MentorStream: Error during screen sharing:", err);
      toast.error("Failed to toggle screen share. Ensure permissions are granted.");
    }
  };

  const submitComment = () => {
    if (newComment.trim()) {
      socketRef.current?.emit("send-comment", roomId, newComment, "Mentor");
      setNewComment("");
    }
  };

  const removePeer = (socketId: string) => {
    if (peersRef.current[socketId]) {
      peersRef.current[socketId].destroy();
      delete peersRef.current[socketId];
    }
  };
  const handleEndCall = async () => {
    const res = await MentorAPIMethods.endStream(roomId);
    if (res.ok) {
      socketRef.current.emit("stream-ended");
      
      socketRef.current?.disconnect();
      window.location.href = "/mentor/upcoming";
      showSuccessToast("Stream ended");
      localStorage.removeItem("liveId")
    }
    else showErrorToast(res.msg);

  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen p-4 gap-4">
      <div className="flex-1 flex flex-col gap-4">
        <div className="bg-black rounded-lg overflow-hidden aspect-video">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
            style={{ transform: 'scaleX(-1)' }} 
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={() => {
            if (localStreamRef.current) {
              const audioTrack = localStreamRef.current.getAudioTracks()[0];
              if (audioTrack) {
                audioTrack.enabled = !isMuted;
                setIsMuted(!isMuted);
              } else {
                toast.warning("No microphone audio track found to toggle.");
              }
            } else {
                toast.warning("Local stream not available to toggle microphone.");
            }
          }}>{isMuted ? <MicOff size={18} /> : <Mic size={18} />}</Button>

          <Button onClick={() => {
            if (localStreamRef.current) {
              const videoTrack = localStreamRef.current.getVideoTracks()[0];
              if (videoTrack) {
                videoTrack.enabled = !isVideoOff;
                setIsVideoOff(!isVideoOff);
              } else {
                toast.warning("No video track found to toggle.");
              }
            } else {
                toast.warning("Local stream not available to toggle video.");
            }
          }}>{isVideoOff ? <VideoOff size={18} /> : <Video size={18} />}</Button>

          <Button onClick={toggleScreenShare}>{isScreenSharing ? <Monitor size={18} className="text-blue-500" /> : <Monitor size={18} />}</Button>

          <Button variant="destructive" onClick={handleEndCall}><Phone size={18} /></Button>
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