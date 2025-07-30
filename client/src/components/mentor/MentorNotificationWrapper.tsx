"use client";

import { NotificationListener } from "@/src/components/NotificationListener";
import { useMentorContext } from "@/src/context/mentorContext";

export function MentorNotificationWrapper() {
  const { mentor} = useMentorContext();
  if (!mentor) return null;
 
  return (
    <NotificationListener
      userId={mentor.id || mentor.id}
      role="mentor"
    />
  );
}
