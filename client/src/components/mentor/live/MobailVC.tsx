"use client"

import VideoCallInterface from "./VideoCallInterface"



export function MobileView({roomId}:{roomId:string}) {
  return (
    <div className="flex flex-col h-screen w-full p-4">
      <div className="h-full rounded-xl overflow-hidden shadow-lg">
        <VideoCallInterface roomId={roomId} />
      </div>
    </div>
  )
}
