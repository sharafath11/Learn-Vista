"use client";
import MentorInfoCard from "@/src/components/admin/mentor/MentorProfile/MentorInfoCard";
import { AdminContext } from "@/src/context/adminContext";
import { useParams } from "next/navigation";
import { useContext } from "react";

const MentorProfile = () => {
  const params = useParams();
  const id = params?.id as string;
  const adminContext = useContext(AdminContext);


  const mentor = adminContext?.mentors?.find((i) => i.id === id);

  if (!mentor) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading mentor data...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="container mx-auto px-4 py-8">
        <MentorInfoCard mentor={mentor} />
      </div>
    </div>
  );
};

export default MentorProfile;
