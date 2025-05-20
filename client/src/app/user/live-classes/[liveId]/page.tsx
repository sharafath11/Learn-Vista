import UserLiveSession from "@/src/components/user/live/live-session";

export default async function LiveSessionPage({ params }: { params: { liveId: string } }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <UserLiveSession roomId={params.liveId} />
    </div>
  );
}
