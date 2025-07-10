
import { Server, Socket } from "socket.io";
interface Participant {
  socketId: string; 
  role: 'mentor' | 'user';
}
interface Room {
  mentorSocketId: string | null;
  participants: Record<string, Participant>;
}
const rooms: Record<string, Room> = {};
export function socketHandler(io: Server) {
  io.on('connection', (socket: Socket) => {
    console.log(`New connection: ${socket.id}`);
    socket.on('join-room', (roomId: string, clientProvidedId: string, role: 'mentor' | 'user') => {
      const currentSocketId = socket.id;
      for (const existingRoomId in rooms) {
        if (rooms[existingRoomId].participants[currentSocketId]) {
          console.log(`Socket ${currentSocketId} leaving previous room ${existingRoomId}`);
          socket.leave(existingRoomId);
          delete rooms[existingRoomId].participants[currentSocketId];

          if (rooms[existingRoomId].mentorSocketId === currentSocketId) {
            rooms[existingRoomId].mentorSocketId = null;
            io.to(existingRoomId).emit('mentor-disconnected');
            console.log(`Mentor ${currentSocketId} disconnected from room ${existingRoomId}`);
          }
          io.to(existingRoomId).emit('user-left', currentSocketId);
          
          if (Object.keys(rooms[existingRoomId].participants).length === 0) {
            console.log(`Room ${existingRoomId} is empty, deleting.`);
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
      console.log(`Socket ${currentSocketId} (role: ${role}, clientProvidedId: ${clientProvidedId}) joined room: ${roomId}`);

      if (!rooms[roomId]) {
        rooms[roomId] = {
          mentorSocketId: null,
          participants: {},
        };
        console.log(`Room ${roomId} created.`);
      }

      rooms[roomId].participants[currentSocketId] = { socketId: currentSocketId, role };
      console.log(`Current participants in room ${roomId}:`, Object.keys(rooms[roomId].participants).map(id => rooms[roomId].participants[id].role === 'mentor' ? `${id} (Mentor)` : `${id} (User)`));

      if (role === 'mentor') {
        rooms[roomId].mentorSocketId = currentSocketId;
        io.to(roomId).emit('mentor-available', currentSocketId);
        console.log(`Mentor ${currentSocketId} is now available in room ${roomId}`);
      } else {
        if (rooms[roomId].mentorSocketId) {
          io.to(rooms[roomId].mentorSocketId!).emit('user-joined', currentSocketId, currentSocketId);
          console.log(`Notified mentor ${rooms[roomId].mentorSocketId} about new user ${currentSocketId}`);
        } else {
            console.log(`User ${currentSocketId} joined room ${roomId} but no mentor is currently available.`);
        }
      }
    });
    socket.on('rtc-offer', (targetSocketId: string, offer: any) => {
      console.log(`Relaying RTC offer from ${socket.id} to ${targetSocketId}`);
      io.to(targetSocketId).emit('rtc-offer', socket.id, offer);
    });
    socket.on('rtc-answer', (targetSocketId: string, answer: any) => {
      console.log(`Relaying RTC answer from ${socket.id} to ${targetSocketId}`);
      io.to(targetSocketId).emit('rtc-answer', socket.id, answer);
    });
    socket.on('ice-candidate', (targetSocketId: string, candidate: any) => {
      console.log(`Relaying ICE candidate from ${socket.id} to ${targetSocketId}`);
      if (socket.id === targetSocketId) { 
        console.warn(`ICE candidate from ${socket.id} targeting self. Skipping.`);
        return;
      }
      io.to(targetSocketId).emit('ice-candidate', socket.id, candidate);
    });
    socket.on('send-comment', (roomId: string, message: string, sender: string) => {
      console.log(`Received comment in room ${roomId} from ${sender} (socket: ${socket.id}): "${message}"`);
      io.to(roomId).emit('receive-comment', message, sender);
    });
        socket.on("register-user", (userId: string) => {
      if (userId) {
        socket.join(userId);
        console.log(`[Room Join] User ${userId} joined personal room via ${socket.id}`);
      } else {
        console.warn("[register-user] Missing userId");
      }
    });

    // Join role-based room
    socket.on("join-room", (room: string) => {
      socket.join(room);
      console.log(`[Room Join] Socket ${socket.id} joined room: ${room}`);
    });

    socket.on("disconnect", () => {
      console.log(`[Socket Disconnected] ${socket.id}`);
    });
    socket.on("stream-ended", (roomId) => {
      io.to(roomId).emit("end-stream","Stream was ended")
    })
    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
      for (const roomId in rooms) {
        if (rooms[roomId].participants[socket.id]) {
          const disconnectedParticipant = rooms[roomId].participants[socket.id];
          const wasMentor = rooms[roomId].mentorSocketId === socket.id;

          delete rooms[roomId].participants[socket.id];
          console.log(`Participant ${socket.id} (role: ${disconnectedParticipant.role}) left room ${roomId}.`);
          io.to(roomId).emit('user-left', socket.id); 

          if (wasMentor) {
            rooms[roomId].mentorSocketId = null; 
            console.log(`Mentor (socket ${socket.id}) disconnected from room ${roomId}.`);
            io.to(roomId).emit('mentor-disconnected');
          }
          if (Object.keys(rooms[roomId].participants).length === 0) {
            console.log(`Room ${roomId} is empty, deleting.`);
            delete rooms[roomId];
          }
          break; 
        }
      }
    });
  });
}