"use client";

import UserLiveSession from "@/src/components/user/live/live-session";
import { UserAPIMethods } from "@/src/services/methods/user.api";
import { showErrorToast } from "@/src/utils/Toast";
import { useEffect, useState } from "react";

export default function LiveSessionPage({ params }: { params: { liveId: string } }) {
  const [isEnrolledUser, setEnrolledUser] = useState<boolean | null>(null);

  useEffect(() => {
    const checkEnrollment = async () => {
      const res = await UserAPIMethods.checkValidUser(params.liveId);
      if (!res.ok) {
        showErrorToast(res.msg);
        setEnrolledUser(false);
      } else {
        setEnrolledUser(true);
      }
    };

    checkEnrollment();
  }, [params.liveId]);
  if (isEnrolledUser === null) return <div>Loading...</div>;
  if (!isEnrolledUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <h2 className="text-xl text-red-600">You are not enrolled for this live session.</h2>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-slate-50">
      <UserLiveSession roomId={params.liveId} />
    </div>
  );
}
