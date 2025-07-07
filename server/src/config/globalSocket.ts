
import { Server } from "socket.io";
let io: Server | null = null;
export const setIOInstance = (instance: Server) => {
  io = instance;
};
export const getIOInstance = (): Server => {
  if (!io) throw new Error("Socket.IO instance not initialized.");
  return io;
};
