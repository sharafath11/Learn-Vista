"use client";
import { useContext} from "react";
import MentorList from "@/src/components/admin/mentor/MentorList";
import { AdminContext } from "@/src/context/adminContext";

const MainPage = () => {
const  adminContext=useContext(AdminContext)
  return (
    <div>
      <MentorList mentors={adminContext?.mentors||[]} />
    </div>
  );
};

export default MainPage;
