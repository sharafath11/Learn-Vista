// utils/socketClient.ts
import io from "socket.io-client";
import type { Socket } from "socket.io-client";

export const initializeSocket = (roomId: string, userType = "user"):typeof Socket => {
  const socket = io("http://localhost:4000", {
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    transports: ["websocket"],
    query: { roomId, userType }
  });

  return socket;
};
