// utils/peerHandler.ts
import Peer from "simple-peer";

type Callbacks = {
  onSignal: (data: any) => void;
  onStream: (stream: MediaStream) => void;
  onError?: (err: Error) => void;
  onClose?: () => void;
  onConnect?: () => void;
  onTrack?: (track: MediaStreamTrack, stream: MediaStream) => void;
};

export const createPeer = (
  initiator: boolean,
  signalData: any,
  callbacks: Callbacks
): Peer.Instance => {
  const peer = new Peer({
    initiator,
    trickle: false,
    config: {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:global.stun.twilio.com:3478" },
      ],
    },
  });

  peer.on("signal", callbacks.onSignal);
  peer.on("stream", callbacks.onStream);

  if (callbacks.onError) peer.on("error", callbacks.onError);
  if (callbacks.onClose) peer.on("close", callbacks.onClose);
  if (callbacks.onConnect) peer.on("connect", callbacks.onConnect);
  if (callbacks.onTrack) peer.on("track", callbacks.onTrack);

  peer.signal(signalData);

  return peer;
};
