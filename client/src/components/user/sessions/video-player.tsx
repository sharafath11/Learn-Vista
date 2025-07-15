"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from "lucide-react"

interface VideoPlayerProps {
  videoUrl: string
  title: string
  onComplete: () => void
  onProgress: (currentTime: number, totalDuration: number) => void
  isCompleted: boolean
  thumbnail: string
  startTime: number
  totalLengthFromAPI?: number 
}

export default function VideoPlayer({
  videoUrl,
  title,
  onComplete,
  onProgress,
  isCompleted,
  thumbnail,
  startTime ,
  totalLengthFromAPI,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [hasWatched, setHasWatched] = useState(isCompleted)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [hasStartedPlaying, setHasStartedPlaying] = useState(false)

  const lastReportedTimeRef = useRef(0);
  const reportingInterval = 5;

  useEffect(() => {
    setHasWatched(isCompleted)
  }, [isCompleted])
//  alert(startTime)
  useEffect(() => {
    if (videoRef.current && startTime > 0 && videoRef.current.readyState >= 2) {
        videoRef.current.currentTime = startTime;
        setCurrentTime(startTime);
        lastReportedTimeRef.current = startTime;
    }
  }, [startTime]);

  useEffect(() => {
    if (duration > 0) {
      setProgress((currentTime / duration) * 100)
    }
  }, [currentTime, duration])

  useEffect(() => {
    if (progress >= 95 && !hasWatched) {
      setHasWatched(true)
      onComplete()
    }
  }, [progress, hasWatched, onComplete])

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullScreenChange)
    document.addEventListener("webkitfullscreenchange", handleFullScreenChange)
    document.addEventListener("mozfullscreenchange", handleFullScreenChange)
    document.addEventListener("MSFullscreenChange", handleFullScreenChange)

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange)
      document.removeEventListener("webkitfullscreenchange", handleFullScreenChange)
      document.removeEventListener("mozfullscreenchange", handleFullScreenChange)
      document.removeEventListener("MSFullscreenChange", handleFullScreenChange)
    }
  }, [])

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;

      setCurrentTime(current);

      if (total > 0 && current >= (lastReportedTimeRef.current + reportingInterval)) {
          onProgress(current, total);
          lastReportedTimeRef.current = current;
      }
    }
  }

 const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const videoActualDuration = videoRef.current.duration;
      setDuration(videoActualDuration);

      const totalToReport = (totalLengthFromAPI && !isNaN(totalLengthFromAPI) && totalLengthFromAPI > 0)
                            ? totalLengthFromAPI
                            : videoActualDuration;

      if (startTime > 0 && startTime < totalToReport) {
          onProgress(startTime, totalToReport);
          lastReportedTimeRef.current = startTime;
      } else if (totalToReport > 0 && startTime === 0) {
          onProgress(0, totalToReport);
          lastReportedTimeRef.current = 0;
      }
    }
  }

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
        setHasStartedPlaying(true)
      }
      setIsPlaying(!isPlaying)
    }
  }

  const onPlayHandler = () => {
    setIsPlaying(true)
    setHasStartedPlaying(true)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number.parseFloat(e.target.value)
    setVolume(newVolume)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
    }
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume || 1
        setIsMuted(false)
      } else {
        videoRef.current.volume = 0
        setIsMuted(true)
      }
    }
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current && duration) {
      const progressBar = e.currentTarget
      const clickPosition = e.clientX - progressBar.getBoundingClientRect().left
      const clickPercentage = (clickPosition / progressBar.offsetWidth) * 100
      const newTime = (clickPercentage / 100) * duration

      videoRef.current.currentTime = newTime
      setCurrentTime(newTime)
      onProgress(newTime, duration);
      lastReportedTimeRef.current = newTime;
    }
  }

  const handleFullScreenToggle = () => {
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        if (containerRef.current.requestFullscreen) {
          containerRef.current.requestFullscreen()
        } else if ((containerRef.current as any).webkitRequestFullscreen) {
          ;(containerRef.current as any).webkitRequestFullscreen()
        } else if ((containerRef.current as any).mozRequestFullScreen) {
          ;(containerRef.current as any).mozRequestFullScreen()
        } else if ((containerRef.current as any).msRequestFullscreen) {
          ;(containerRef.current as any).msRequestFullscreen()
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if ((document as any).webkitExitFullscreen) {
          ;(document as any).webkitExitFullscreen()
        } else if ((document as any).mozCancelFullScreen) {
          ;(document as any).mozCancelFullScreen()
        } else if ((document as any).msExitFullscreen) {
          ;(document as any).msExitFullscreen()
        }
      }
    }
  }

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return "0:00";
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  return (
    <div className="relative" ref={containerRef}>
      <div className="aspect-video bg-black relative">
        <video
          ref={videoRef}
          className="w-full h-full"
          src={videoUrl}
          poster={thumbnail}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onPlay={onPlayHandler}
          onPause={() => setIsPlaying(false)}
          onEnded={() => {
            setIsPlaying(false)
            if (!hasWatched) {
              setHasWatched(true)
              onComplete()
              if (videoRef.current) {
                onProgress(videoRef.current.duration, videoRef.current.duration);
              }
            }
          }}
        >
          Your browser does not support the video .
        </video>
        {!hasStartedPlaying && !isCompleted && (
          <img
            src={thumbnail}
            alt={title}
            className="absolute top-0 left-0 w-full h-full object-cover cursor-pointer"
            onClick={handlePlayPause}
          />
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        <div className="w-full h-2 bg-gray-600 rounded-full mb-4 cursor-pointer" onClick={handleProgressClick}>
          <div className="h-2 bg-blue-500 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={handlePlayPause} className="text-white hover:text-blue-400 transition-colors">
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </button>

            <div className="flex items-center gap-2">
              <button onClick={toggleMute} className="text-white hover:text-blue-400 transition-colors">
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </button>

              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-20 accent-blue-500"
              />
            </div>

            <div className="text-white text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {hasWatched && (
              <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">Completed</div>
            )}
            <button onClick={handleFullScreenToggle} className="text-white hover:text-blue-400 transition-colors">
              {isFullScreen ? <Minimize className="h-6 w-6" /> : <Maximize className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}