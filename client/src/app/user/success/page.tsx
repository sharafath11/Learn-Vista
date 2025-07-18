"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import SuccessView from "./SuccessView";
import { UserAPIMethods } from "@/src/services/APImethods";
import { IDonation, IStripeSuccessSession } from "@/src/types/donationTyps";
import { NotificationListener } from "@/src/components/NotificationListener";
import { useUserContext } from "@/src/context/userAuthContext";

export default function SuccessPage() {
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
        console.error("Failed to fetch donation session");
      }
      setLoading(false);
    };

    fetchSession();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <LoaderCircle className="w-10 h-10 animate-spin text-blue-500" />
        <p className="mt-3 text-gray-600">Fetching your donation receipt...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h2 className="text-2xl font-semibold text-red-600">Invalid or Missing Session</h2>
        <p className="mt-2 text-gray-500">
          We couldn't find your donation session. Please try again.
        </p>
      </div>
    );
  }

  return (
    <>
      {user?._id && <NotificationListener userId={user.id} role={"user"} />}
      <SuccessView session={session} />
    </>
  );
}
