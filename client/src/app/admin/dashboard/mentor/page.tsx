"use client";
import MentorList from "@/src/components/admin/mentor/MentorList";
import {  useAdminContext } from "@/src/context/adminContext";

const MainPage = () => {
const {mentors} =useAdminContext()
  return (
    <div>
      <MentorList mentors={mentors||[]} />
    </div>
  );
};

export default MainPage;
