"use client";

import MentorStream from "@/src/components/mentor/live/VideoCallInterface";
import { useParams } from "next/navigation";

export default function Home() {
  const params = useParams();
  const liveId = params.liveId as string;

  return (
    <main className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-900">
      <div className="flex flex-1 p-4">
        {/* The MentorStream component handles all responsiveness internally */}
        <MentorStream roomId={liveId} />
      </div>
    </main>
  );
}