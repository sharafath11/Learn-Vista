// socketHandler.ts
import { Server, Socket } from "socket.io";

interface Participant {
  socketId: string; // The unique ID of the socket connection
  role: 'mentor' | 'user';
  // You can add a display name or database ID here if needed later:
  // displayName?: string;
  // dbUserId?: string;
}

interface Room {
  mentorSocketId: string | null; // Stores the socket.id of the mentor
  participants: Record<string, Participant>; // Key by socketId for easier lookup
}

const rooms: Record<string, Room> = {};

export function socketHandler(io: Server) {
  io.on('connection', (socket: Socket) => {
    console.log(`New connection: ${socket.id}`);

    socket.on('join-room', (roomId: string, clientProvidedId: string, role: 'mentor' | 'user') => {
      const currentSocketId = socket.id;

      // --- CRITICAL: Clean up any previous room the socket was in ---
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
      // --- End Cleanup ---

      // Check if room exists and if a mentor is already present
      if (role === 'mentor' && rooms[roomId] && rooms[roomId].mentorSocketId) {
        console.warn(`Mentor ${currentSocketId} tried to join room ${roomId}, but a mentor (${rooms[roomId].mentorSocketId}) is already present.`);
        socket.emit('mentor-already-present', rooms[roomId].mentorSocketId); // Notify the joining mentor
        socket.disconnect(true); // Disconnect the unauthorized mentor
        return; // Stop processing this join request
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

    // WebRTC Signaling
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
      if (socket.id === targetSocketId) { // Prevent self-signaling if somehow target is self
        console.warn(`ICE candidate from ${socket.id} targeting self. Skipping.`);
        return;
      }
      io.to(targetSocketId).emit('ice-candidate', socket.id, candidate);
    });

    // Chat
    socket.on('send-comment', (roomId: string, message: string, sender: string) => {
      console.log(`Received comment in room ${roomId} from ${sender} (socket: ${socket.id}): "${message}"`);
      // Use io.to(roomId).emit to send to everyone in the room, including the sender
      io.to(roomId).emit('receive-comment', message, sender);
    });

    // Cleanup on disconnect
    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
      for (const roomId in rooms) {
        // Find if this socket.id was a participant in any room
        if (rooms[roomId].participants[socket.id]) {
          const disconnectedParticipant = rooms[roomId].participants[socket.id];
          const wasMentor = rooms[roomId].mentorSocketId === socket.id;

          delete rooms[roomId].participants[socket.id];
          console.log(`Participant ${socket.id} (role: ${disconnectedParticipant.role}) left room ${roomId}.`);
          io.to(roomId).emit('user-left', socket.id); // Notify everyone in the room

          if (wasMentor) {
            rooms[roomId].mentorSocketId = null; // Clear mentor ID
            console.log(`Mentor (socket ${socket.id}) disconnected from room ${roomId}.`);
            io.to(roomId).emit('mentor-disconnected'); // Notify users that mentor disconnected
          }

          // If no participants left, clean up the room
          if (Object.keys(rooms[roomId].participants).length === 0) {
            console.log(`Room ${roomId} is empty, deleting.`);
            delete rooms[roomId];
          }
          break; // Stop iterating once the socket's room is found and processed
        }
      }
    });
  });
}