"use client";
import { useContext, useEffect} from "react";
import MentorList from "@/src/components/admin/mentor/MentorList";
import { AdminContext, useAdminContext } from "@/src/context/adminContext";

const MainPage = () => {
const {mentors} =useAdminContext()
  return (
    <div>
      <MentorList mentors={mentors||[]} />
    </div>
  );
};

export default MainPage;
