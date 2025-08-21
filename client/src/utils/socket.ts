// utils/socketClient.ts
import io from "socket.io-client";
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL as string;
console.log(SOCKET_URL)
export const initializeSocket = () => {
  const socket = io(SOCKET_URL, {
    transports: ["websocket"],
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });
  return socket;
};
