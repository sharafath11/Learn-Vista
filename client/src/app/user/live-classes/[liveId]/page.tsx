import LiveSession from "@/src/components/user/live/live-session";

export default function LiveSessionPage({ params }: { params: { liveId: string } }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <LiveSession roomId={params.liveId} />
    </div>
  )
}
