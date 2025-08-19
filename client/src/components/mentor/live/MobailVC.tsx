"use client"

import MentorStream from "./VideoCallInterface"
export function MobileView({roomId}:{roomId:string}) {
  return (
    <div className="flex flex-col h-screen w-full p-4 overflow-y-auto">
      <div className="h-full rounded-xl overflow-hidden shadow-lg">
        <MentorStream roomId={roomId} />
      </div>
    </div>
  )
}
