"use client"

import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import io from "socket.io-client";
import Peer from "simple-peer";

export default function UserVideoCall({ roomId }: { roomId: string }) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [mentorStream, setMentorStream] = useState<MediaStream | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<string>("Connecting...");
  
  const socketRef = useRef<any>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerRef = useRef<Peer.Instance | null>(null);
  const pendingSignalsRef = useRef<any[]>([]);

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
        socket.emit("join-room", roomId, "user", "user");
        setConnectionStatus("Waiting for mentor...");
      } catch (err) {
        console.error("Failed to get media", err);
        setConnectionStatus("Failed to access media devices");
      }
    };

    socket.on("signal", (mentorId: string, signal: any) => {
      if (!peerRef.current) {
        setConnectionStatus("Establishing connection...");
        // Create peer if it doesn't exist
        const peer = new Peer({
          initiator: false,
          trickle: false,
          stream: localStreamRef.current || undefined,
        });

        peer.on("signal", signal => {
          socket.emit("signal", mentorId, signal);
        });

        peer.on("stream", stream => {
          setMentorStream(stream);
          if (remoteVideoRef.current) remoteVideoRef.current.srcObject = stream;
          setConnectionStatus("Connected to mentor");
        });

        peer.on("error", err => {
          console.error("Peer error:", err);
          setConnectionStatus("Connection error");
          cleanupPeer();
        });

        peer.on("close", () => {
          cleanupPeer();
        });

        // Process any pending signals
        pendingSignalsRef.current.forEach(s => peer.signal(s));
        pendingSignalsRef.current = [];

        try {
          peer.signal(signal);
          peerRef.current = peer;
        } catch (err) {
          console.error("Error processing initial signal:", err);
        }
      } else {
        // If peer exists but not ready, queue the signal
        if (peerRef.current._pc.signalingState !== 'stable') {
          pendingSignalsRef.current.push(signal);
        } else {
          try {
            peerRef.current.signal(signal);
          } catch (err) {
            console.error("Error processing signal:", err);
          }
        }
      }
    });

    socket.on("user-left", (userId: string) => {
      setConnectionStatus("Mentor disconnected");
      cleanupPeer();
    });

    initializeMedia();

    return () => {
      cleanup();
    };
  }, [roomId]);

  const cleanupPeer = () => {
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }
    setMentorStream(null);
  };

  const cleanup = () => {
    socketRef.current?.disconnect();
    localStreamRef.current?.getTracks().forEach(track => track.stop());
    cleanupPeer();
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

  const endCall = () => {
    cleanup();
    window.location.href = "/";
  };

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">User Room: {roomId}</h1>
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
            You (User)
          </div>
        </div>

        <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
          {mentorStream ? (
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-white">
              Waiting for mentor to connect...
            </div>
          )}
          <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-white">
            Mentor
          </div>
        </div>
      </div>
    </div>
  );
}