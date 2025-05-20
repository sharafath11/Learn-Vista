import { Server, Socket } from "socket.io";

interface Participant {
  id: string;
  role: 'mentor' | 'user';
}

interface Room {
  mentorId: string;
  participants: Record<string, Participant>;
}

const rooms: Record<string, Room> = {};

export function socketHandler(io: Server) {
  io.on('connection', (socket: Socket) => {
    console.log(`New connection: ${socket.id}`);

    // Store the current room for this socket
    let currentRoomId: string | null = null;

    // Join room handler
    socket.on('join-room', (roomId: string, userId: string, role: 'mentor' | 'user') => {
      console.log(`${role} ${userId} joined room ${roomId} with socket ${socket.id}`);

      // Leave previous room if any
      if (currentRoomId && rooms[currentRoomId]) {
        socket.leave(currentRoomId);
        delete rooms[currentRoomId].participants[socket.id];
        io.to(currentRoomId).emit('user-left', socket.id);

        if (rooms[currentRoomId].mentorId === socket.id) {
          rooms[currentRoomId].mentorId = '';
          io.to(currentRoomId).emit('mentor-disconnected');
        }

        // Delete room if empty
        if (Object.keys(rooms[currentRoomId].participants).length === 0) {
          delete rooms[currentRoomId];
        }
      }

      // Join the new room
      socket.join(roomId);
      currentRoomId = roomId;

      // Create room if doesn't exist
      if (!rooms[roomId]) {
        rooms[roomId] = {
          mentorId: role === 'mentor' ? socket.id : '',
          participants: {},
        };
      }

      // Update mentor if needed
      if (role === 'mentor') {
        rooms[roomId].mentorId = socket.id;
        io.to(roomId).emit('mentor-available', socket.id);
      }

      // Add to participants
      rooms[roomId].participants[socket.id] = { id: userId, role };

      // Send current room state to the user
      socket.emit('room-info', {
        mentorId: rooms[roomId].mentorId,
        participants: rooms[roomId].participants,
      });

      // Notify others
      socket.to(roomId).emit('user-joined', socket.id, role);
    });

    // WebRTC Signaling
    socket.on('rtc-offer', (targetSocketId: string, offer: any) => {
      io.to(targetSocketId).emit('rtc-offer', socket.id, offer);
    });

    socket.on('rtc-answer', (targetSocketId: string, answer: any) => {
      io.to(targetSocketId).emit('rtc-answer', socket.id, answer);
    });

    socket.on('ice-candidate', (targetSocketId: string, candidate: any) => {
      io.to(targetSocketId).emit('ice-candidate', socket.id, candidate);
    });

    // Chat messages
    socket.on("send-comment", (roomId: string, message: string) => {
      socket.to(roomId).emit("receive-comment", message);
    });

    // Disconnect handling
    socket.on('disconnect', () => {
      if (currentRoomId && rooms[currentRoomId]) {
        const wasMentor = rooms[currentRoomId].mentorId === socket.id;

        delete rooms[currentRoomId].participants[socket.id];
        io.to(currentRoomId).emit('user-left', socket.id);

        if (wasMentor) {
          rooms[currentRoomId].mentorId = '';
          io.to(currentRoomId).emit('mentor-disconnected');
        }

        if (Object.keys(rooms[currentRoomId].participants).length === 0) {
          delete rooms[currentRoomId];
        }
      }
    });
  });
}
