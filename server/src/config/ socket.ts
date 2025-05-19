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

    socket.on('join-room', (roomId: string, userId: string, role: 'mentor' | 'user') => {
      // Leave any previous room
      if (socket.rooms.size > 1) {
        const [previousRoom] = Array.from(socket.rooms).filter(room => room !== socket.id);
        socket.leave(previousRoom);
        
        if (rooms[previousRoom]) {
          delete rooms[previousRoom].participants[socket.id];
          io.to(previousRoom).emit('user-left', socket.id);
        }
      }

      // Join new room
      socket.join(roomId);
      
      // Initialize room if it doesn't exist
      if (!rooms[roomId]) {
        rooms[roomId] = {
          mentorId: role === 'mentor' ? socket.id : '',
          participants: {}
        };
      }

      // Update mentor if joining as mentor
      if (role === 'mentor') {
        rooms[roomId].mentorId = socket.id;
      }

      // Add participant
      rooms[roomId].participants[socket.id] = { id: userId, role };

      // Notify others in the room
      socket.to(roomId).emit('user-joined', socket.id, role);

      // Send current participants to the new user
      socket.emit('room-info', {
        mentorId: rooms[roomId].mentorId,
        participants: rooms[roomId].participants
      });

      console.log(`${role} ${userId} joined room ${roomId}`);
    });

    socket.on('signal', (targetId: string, signal: any) => {
      io.to(targetId).emit('signal', socket.id, signal);
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
      
      // Find and clean up rooms
      for (const roomId in rooms) {
        if (rooms[roomId].participants[socket.id]) {
          // Notify room
          io.to(roomId).emit('user-left', socket.id);
          
          // Remove participant
          delete rooms[roomId].participants[socket.id];
          
          // Clean up empty rooms
          if (Object.keys(rooms[roomId].participants).length === 0) {
            delete rooms[roomId];
          }
          break;
        }
      }
    });
  });
}