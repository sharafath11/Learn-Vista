"use client";
import HeaderTabs from "@/src/components/mentor/profile/HeaderTabs";
import ProfileInfo from "@/src/components/mentor/profile/ProfileInfo";
import { useContext } from "react";
import { MentorContext } from "@/src/context/mentorContext";

export default function ProfilePage() {
  const mentorDetils = useContext(MentorContext);

  return (
    <div className="min-h-screen bg-[#050a1a] text-white p-4 md:p-6">
      <HeaderTabs />
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-1">Profile Information</h2>
        <p className="text-sm text-gray-400 mb-6">
          Update your profile information visible to students.
        </p>
        <ProfileInfo mentor={mentorDetils?.mentor?mentorDetils.mentor:null} />
      </div>
    </div>
  );
}


