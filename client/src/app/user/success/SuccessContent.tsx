"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import SuccessView from "./SuccessView";
import { UserAPIMethods } from "@/src/services/methods/user.api";
import { IDonation } from "@/src/types/donationTyps";
import { NotificationListener } from "@/src/components/NotificationListener";
import { useUserContext } from "@/src/context/userAuthContext";
import { showErrorToast } from "@/src/utils/Toast";
import { WithTooltip } from "@/src/hooks/UseTooltipProps"; 

export default function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<IDonation>();
  const { user } = useUserContext();

  useEffect(() => {
    if (!sessionId) return;

    const fetchSession = async () => {
      const res = await UserAPIMethods.getStripeCheckoutSession(sessionId);
      if (res.ok) {
        setSession(res.data);
      } else {
        showErrorToast("Failed to fetch donation session");
      }
      setLoading(false);
    };

    fetchSession();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <WithTooltip content="We’re fetching your donation receipt, please wait...">
          <LoaderCircle className="w-10 h-10 animate-spin text-blue-500" />
        </WithTooltip>
        <p className="mt-3 text-gray-600">Fetching your donation receipt...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <WithTooltip content="The donation session ID is missing or invalid">
          <h2 className="text-2xl font-semibold text-red-600">
            Invalid or Missing Session
          </h2>
        </WithTooltip>
        <p className="mt-2 text-gray-500">
          {`We couldn't find your donation session. Please try again.`}
        </p>
      </div>
    );
  }

  return (
    <>
      {user?.id && <NotificationListener userId={user.id} role={"user"} />}
      <WithTooltip content="Here’s your donation receipt">
        <SuccessView session={session} />
      </WithTooltip>
    </>
  );
}
