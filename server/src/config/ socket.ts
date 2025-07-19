
import { Server, Socket } from "socket.io";
import { Room } from "../types/scoket";
const rooms: Record<string, Room> = {};
export function socketHandler(io: Server) {
  io.on('connection', (socket: Socket) => {
    socket.on('join-room', (roomId: string, clientProvidedId: string, role: 'mentor' | 'user') => {
      const currentSocketId = socket.id;
      for (const existingRoomId in rooms) {
        if (rooms[existingRoomId].participants[currentSocketId]) {
          socket.leave(existingRoomId);
          delete rooms[existingRoomId].participants[currentSocketId];

          if (rooms[existingRoomId].mentorSocketId === currentSocketId) {
            rooms[existingRoomId].mentorSocketId = null;
            io.to(existingRoomId).emit('mentor-disconnected');
          }
          io.to(existingRoomId).emit('user-left', currentSocketId);
          
          if (Object.keys(rooms[existingRoomId].participants).length === 0) {
            delete rooms[existingRoomId];
          }
          break;
        }
      }

      if (role === 'mentor' && rooms[roomId] && rooms[roomId].mentorSocketId) {
        console.warn(`Mentor ${currentSocketId} tried to join room ${roomId}, but a mentor (${rooms[roomId].mentorSocketId}) is already present.`);
        socket.emit('mentor-already-present', rooms[roomId].mentorSocketId);
        socket.disconnect(true); 
        return; 
      }

      socket.join(roomId);

      if (!rooms[roomId]) {
        rooms[roomId] = {
          mentorSocketId: null,
          participants: {},
        };
      }

      rooms[roomId].participants[currentSocketId] = { socketId: currentSocketId, role };

      if (role === 'mentor') {
        rooms[roomId].mentorSocketId = currentSocketId;
        io.to(roomId).emit('mentor-available', currentSocketId);
      } else {
        if (rooms[roomId].mentorSocketId) {
          io.to(rooms[roomId].mentorSocketId!).emit('user-joined', currentSocketId, currentSocketId);
        } else {
        }
      }
    });
    socket.on('rtc-offer', (targetSocketId: string, offer: any) => {
      io.to(targetSocketId).emit('rtc-offer', socket.id, offer);
    });
    socket.on('rtc-answer', (targetSocketId: string, answer: any) => {
      io.to(targetSocketId).emit('rtc-answer', socket.id, answer);
    });
    socket.on('ice-candidate', (targetSocketId: string, candidate: any) => {
      if (socket.id === targetSocketId) { 
        console.warn(`ICE candidate from ${socket.id} targeting self. Skipping.`);
        return;
      }
      io.to(targetSocketId).emit('ice-candidate', socket.id, candidate);
    });
    socket.on('send-comment', (roomId: string, message: string, sender: string) => {
      io.to(roomId).emit('receive-comment', message, sender);
    });
        socket.on("register-user", (userId: string) => {
      if (userId) {
        socket.join(userId);
      } else {
        console.warn("[register-user] Missing userId");
      }
    });

    // Join role-based room
    socket.on("join-room", (room: string) => {
      socket.join(room);
    });

    socket.on("disconnect", () => {
    });
    socket.on("stream-ended", (roomId) => {
      io.to(roomId).emit("end-stream","Stream was ended")
    })
    socket.on('disconnect', () => {
      for (const roomId in rooms) {
        if (rooms[roomId].participants[socket.id]) {
          const disconnectedParticipant = rooms[roomId].participants[socket.id];
          const wasMentor = rooms[roomId].mentorSocketId === socket.id;

          delete rooms[roomId].participants[socket.id];
          io.to(roomId).emit('user-left', socket.id); 

          if (wasMentor) {
            rooms[roomId].mentorSocketId = null; 
            io.to(roomId).emit('mentor-disconnected');
          }
          if (Object.keys(rooms[roomId].participants).length === 0) {
            delete rooms[roomId];
          }
          break; 
        }
      }
    });
  });
}