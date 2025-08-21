"use client";

import UserLiveSession from "@/src/components/user/live/live-session";
import { UserAPIMethods } from "@/src/services/methods/user.api";
import { showErrorToast } from "@/src/utils/Toast";
import { useEffect, useState } from "react";
import React from "react";

export default function LiveSessionPage({ params }: { params: Promise<{ liveId: string }> }) {

  const { liveId } = React.use(params);

  const [isEnrolledUser, setEnrolledUser] = useState<boolean | null>(null);

  useEffect(() => {
    const checkEnrollment = async () => {
      const res = await UserAPIMethods.checkValidUser(liveId);
      if (!res.ok) {
        showErrorToast(res.msg);
        setEnrolledUser(false);
      } else {
        setEnrolledUser(true);
      }
    };

    checkEnrollment();
  }, [liveId]);

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
      <UserLiveSession roomId={liveId} />
    </div>
  );
}
