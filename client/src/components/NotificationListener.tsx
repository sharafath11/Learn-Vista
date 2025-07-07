// components/NotificationListener.tsx
"use client"

import { useEffect, useRef } from "react"
import { showInfoToast } from "../utils/Toast"
import { initializeSocket } from "../utils/socket"
import { INotification } from "../types/notificationsTypes"

interface Props {
  userId: string
  role: "user" | "mentor" | "admin"
}

export const NotificationListener = ({ userId, role }: Props) => {
  const socketRef = useRef<any>(null)

  useEffect(() => {
    if (!userId || !role) return

    const roomId = `${role}:${userId}`
    const socket = initializeSocket(roomId, role)

    socketRef.current = socket

    socket.on("connect", () => {
      console.log("🔌 Notification socket connected")
    })

    socket.on("notification", (data:INotification) => {
      showInfoToast(`${data.title}: ${data.message}`)
    })

    socket.on("disconnect", () => {
      console.log("🔌 Notification socket disconnected")
    })

    return () => {
      socket.disconnect()
    }
  }, [userId, role])

  return null
}
