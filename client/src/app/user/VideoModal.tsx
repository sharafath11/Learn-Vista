"use client"

import { IVideoModalProps } from "@/src/types/userProps"
import { X } from "lucide-react"
import { useEffect, useRef } from "react"
import { WithTooltip } from "@/src/hooks/UseTooltipProps" 

export default function VideoModal({ showVideo, onClose }: IVideoModalProps) {
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
        <WithTooltip content="Close video">
          <button
            className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors duration-200 z-50 p-2 rounded-full"
            onClick={onClose}
            aria-label="Close video"
          >
            <X className="h-10 w-10" />
          </button>
        </WithTooltip>

        <WithTooltip content="You’re watching our official video 🎥">
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
        </WithTooltip>
      </div>
    </div>
  )
}
