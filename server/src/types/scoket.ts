export interface Participant {
  socketId: string; 
  role: 'mentor' | 'user';
}
export interface Room {
  mentorSocketId: string | null;
  participants: Record<string, Participant>;
}