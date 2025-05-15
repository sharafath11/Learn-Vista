"use client";
import { MobileView } from "@/src/components/mentor/live/MobailVC";
import VideoCallInterface from "@/src/components/mentor/live/VideoCallInterface";
import { useParams } from "next/navigation";

export default function Home() {
  const params = useParams();
  const liveId = params.liveId as string;

  return (
    <main className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-900">
      <div className="hidden md:flex flex-1 p-4">
        <div className="w-full h-[calc(100vh-2rem)] rounded-xl overflow-hidden shadow-lg">
          <VideoCallInterface roomId={liveId} />
        </div>
      </div>
      <div className="md:hidden flex flex-1">
        <MobileView roomId={liveId} />
      </div>
    </main>
  );
}
