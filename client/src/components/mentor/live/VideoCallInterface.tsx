"use client"

import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Video, VideoOff, PhoneOff, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import io from "socket.io-client";
import Peer from "simple-peer";

interface ParticipantView {
  id: string;
  stream: MediaStream;
}

export default function MentorVideoCall({ roomId }: { roomId: string }) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [participants, setParticipants] = useState<ParticipantView[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<string>("Connecting...");
  
  const socketRef = useRef<any>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const peersRef = useRef<Record<string, Peer.Instance>>({});
  const pendingSignalsRef = useRef<Record<string, any[]>>({});

  // Initialize socket and media
  useEffect(() => {
    const socket = io("http://localhost:4000");
    socketRef.current = socket;

    const initializeMedia = async () => {
      try {
        setConnectionStatus("Getting media devices...");
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        localStreamRef.current = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        
        setConnectionStatus("Joining room...");
        socket.emit("join-room", roomId, "mentor", "mentor");
        setConnectionStatus("Waiting for participants...");
      } catch (err) {
        console.error("Failed to get media", err);
        setConnectionStatus("Failed to access media devices");
      }
    };

    socket.on("user-joined", (userId: string) => {
      setConnectionStatus(`User ${userId} joining...`);
      console.log(`User ${userId} joined`);
      
      const peer = new Peer({
        initiator: true,
        trickle: false,
        stream: isScreenSharing ? screenStreamRef.current || localStreamRef.current || undefined : localStreamRef.current || undefined,
      });

      peer.on("signal", signal => {
        socket.emit("signal", userId, signal);
      });

      peer.on("stream", stream => {
        setParticipants(prev => [...prev, { id: userId, stream }]);
        setConnectionStatus(`Connected with ${prev.length + 1} participants`);
      });

      peer.on("error", err => {
        console.error("Peer error:", err);
        setConnectionStatus(`Error with user ${userId}`);
        removePeer(userId);
      });

      peer.on("close", () => {
        removePeer(userId);
      });

      // Handle any pending signals
      if (pendingSignalsRef.current[userId]?.length) {
        pendingSignalsRef.current[userId].forEach(signal => {
          peer.signal(signal);
        });
        delete pendingSignalsRef.current[userId];
      }

      peersRef.current[userId] = peer;
    });

    socket.on("signal", (userId: string, signal: any) => {
      if (peersRef.current[userId]) {
        try {
          peersRef.current[userId].signal(signal);
        } catch (err) {
          console.error("Error processing signal:", err);
        }
      } else {
        // Store signal if peer doesn't exist yet
        if (!pendingSignalsRef.current[userId]) {
          pendingSignalsRef.current[userId] = [];
        }
        pendingSignalsRef.current[userId].push(signal);
      }
    });

    socket.on("user-left", (userId: string) => {
      setConnectionStatus(`User ${userId} left`);
      removePeer(userId);
    });

    initializeMedia();

    return () => {
      cleanup();
    };
  }, [roomId]);

  const removePeer = (userId: string) => {
    if (peersRef.current[userId]) {
      peersRef.current[userId].destroy();
      delete peersRef.current[userId];
    }
    setParticipants(prev => prev.filter(p => p.id !== userId));
  };

  const cleanup = () => {
    socketRef.current?.disconnect();
    localStreamRef.current?.getTracks().forEach(track => track.stop());
    screenStreamRef.current?.getTracks().forEach(track => track.stop());
    Object.values(peersRef.current).forEach(peer => peer.destroy());
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      // Stop screen sharing
      screenStreamRef.current?.getTracks().forEach(track => track.stop());
      screenStreamRef.current = null;
      
      // Switch back to camera
      if (localStreamRef.current) {
        Object.values(peersRef.current).forEach(peer => {
          const videoTrack = localStreamRef.current?.getVideoTracks()[0];
          if (videoTrack) {
            peer.replaceTrack(
              peer.streams[0].getVideoTracks()[0],
              videoTrack,
              peer.streams[0]
            );
          }
        });
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStreamRef.current;
        }
      }
      
      setIsScreenSharing(false);
    } else {
      try {
        setConnectionStatus("Starting screen share...");
        // Start screen sharing
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: false,
        });
        
        screenStreamRef.current = screenStream;
        
        // Replace video track in all peer connections
        Object.values(peersRef.current).forEach(peer => {
          const videoTrack = screenStream.getVideoTracks()[0];
          if (videoTrack) {
            peer.replaceTrack(
              peer.streams[0].getVideoTracks()[0],
              videoTrack,
              peer.streams[0]
            );
          }
        });
        
        // Create combined stream with screen video and mic audio
        const combinedStream = new MediaStream();
        screenStream.getVideoTracks().forEach(track => combinedStream.addTrack(track));
        if (localStreamRef.current) {
          localStreamRef.current.getAudioTracks().forEach(track => combinedStream.addTrack(track));
        }
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = combinedStream;
        }
        
        screenStream.getVideoTracks()[0].onended = () => {
          toggleScreenShare();
        };
        
        setIsScreenSharing(true);
        setConnectionStatus("Screen sharing active");
      } catch (err) {
        console.error("Failed to share screen", err);
        setConnectionStatus("Screen share failed");
      }
    }
  };

  const endCall = () => {
    cleanup();
    window.location.href = "/";
  };

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Mentor Room: {roomId}</h1>
        <div className="text-sm text-gray-600">{connectionStatus}</div>
      </div>
      
      <div className="flex gap-2 mb-4">
        <Button
          variant={isMuted ? "destructive" : "outline"}
          onClick={toggleMute}
          size="icon"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </Button>
        <Button
          variant={isVideoOff ? "destructive" : "outline"}
          onClick={toggleVideo}
          size="icon"
          title={isVideoOff ? "Enable Video" : "Disable Video"}
        >
          {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
        </Button>
        <Button
          variant={isScreenSharing ? "destructive" : "outline"}
          onClick={toggleScreenShare}
          size="icon"
          title={isScreenSharing ? "Stop Sharing" : "Share Screen"}
        >
          <Monitor className="h-5 w-5" />
        </Button>
        <Button 
          variant="destructive" 
          onClick={endCall}
          size="icon"
          title="End Call"
        >
          <PhoneOff className="h-5 w-5" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-white">
            You (Mentor)
          </div>
        </div>

        {participants.map(participant => (
          <div key={participant.id} className="relative bg-black rounded-lg overflow-hidden aspect-video">
            <video
              autoPlay
              playsInline
              className="w-full h-full object-cover"
              ref={videoRef => {
                if (videoRef) {
                  videoRef.srcObject = participant.stream;
                }
              }}
            />
            <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-white">
              User {participant.id.slice(0, 5)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}