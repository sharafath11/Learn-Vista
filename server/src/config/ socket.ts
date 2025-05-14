import { Server, Socket } from "socket.io"

interface OfferPayload {
  offer: RTCSessionDescriptionInit
  roomId: string
}

interface AnswerPayload {
  answer: RTCSessionDescriptionInit
  roomId: string
}

interface IceCandidatePayload {
  candidate: RTCIceCandidate
  roomId: string
}

export default function socketHandler(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log("User connected:", socket.id)

    socket.on("join-room", (roomId: string) => {
      socket.join(roomId)
      socket.to(roomId).emit("user-joined", socket.id)
    })

    socket.on("offer", ({ offer, roomId }: OfferPayload) => {
      socket.to(roomId).emit("offer", offer)
    })

    socket.on("answer", ({ answer, roomId }: AnswerPayload) => {
      socket.to(roomId).emit("answer", answer)
    })

    socket.on("ice-candidate", ({ candidate, roomId }: IceCandidatePayload) => {
      socket.to(roomId).emit("ice-candidate", candidate)
    })

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id)
    })
  })
}
