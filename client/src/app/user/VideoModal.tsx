"use client"
import { X } from "lucide-react"
import { useEffect, useRef } from "react"

interface VideoModalProps {
  showVideo: boolean
  onClose: () => void
}

export default function VideoModal({ showVideo, onClose }: VideoModalProps) {
  const bodyRef = useRef<HTMLBodyElement | null>(null)

  useEffect(() => {
    bodyRef.current = document.body as HTMLBodyElement
    if (showVideo) {
      bodyRef.current.style.overflow = "hidden"
    } else {
      bodyRef.current.style.overflow = ""
    }
    return () => {
      if (bodyRef.current) {
        bodyRef.current.style.overflow = ""
      }
    }
  }, [showVideo])

  if (!showVideo) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl rounded-lg overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors duration-200 z-50 p-2 rounded-full"
          onClick={onClose}
          aria-label="Close video"
        >
          <X className="h-10 w-10" />
        </button>
        <div className="aspect-video w-full">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/10lQWsFbPTU?si=YzxusCPHG_1umRjA"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  )
}
