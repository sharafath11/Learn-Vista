"use client"
import MentorInfoCard from "@/src/components/admin/mentor/MentorProfile/MentorInfoCard";
import { AdminContext } from "@/src/context/adminContext";
import { useParams } from "next/navigation";
import { useContext, useEffect } from "react";

const MentorProfile = () => {
    const params = useParams();
  const id = params?.id;
  console.log(id)
  const adminContext = useContext(AdminContext);
  useEffect(() => {
    adminContext?.refreshMentors()
   },[])

    const mentor = adminContext?.mentors.filter((i) => i.id === id)
    
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="container mx-auto px-4 py-8">
        <MentorInfoCard mentor={mentor?mentor[0]:[]} />
      </div>
    </div>
  );
};

export default MentorProfile;
