// AdminProvider.tsx
"use client";

import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { AdminAPIMethods } from "../services/APImethods";
import { showInfoToast } from "../utils/Toast";
import { AdminContextType } from "../types/adminTypes";
import { IMentor } from "../types/mentorTypes";
import { IUser } from "../types/userTypes";
import { IPopulatedCourse } from "../types/courseTypes";
import { ICategory } from "../types/categoryTypes";


export const AdminContext = createContext<AdminContextType | null>(null);

const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState(false);
  const [mentors, setMentors] = useState<IMentor[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);
  const [cat, setCat] = useState<ICategory[]>([]);
  const [courses, setCourses] = useState<IPopulatedCourse[]>([]);
  const [totalUsersCount, setTotalUsersCount] = useState<number>(0);

  useEffect(() => {
    getAllMentors();
    getCategories();
    getCourse();
  }, []);

  async function getCategories() {
    const res = await AdminAPIMethods.getGetegories();
    if (res.ok) setCat(res.data);
    else showInfoToast(res.msg);
  }

  async function getAllMentors() {
    try {
      const res = await AdminAPIMethods.fetchMentor();
      if (res.ok) setMentors(res.data);
      else console.error(res.msg);
    } catch (error) {
      console.error("Failed to fetch mentors:", error);
    }
  }

  async function getCourse() {
    const res = await AdminAPIMethods.getCourses();
    if (res.ok) setCourses(res.data);
  }

  async function getAllUsers(pageNumber = 1) {
    try {
      const res = await AdminAPIMethods.fetchUser(pageNumber);
      if (res.ok) {
        setUsers(res.data.data);
        setTotalUsersCount(res.data.total); // ✅ total user count
      } else {
        console.error(res.msg);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  }

  return (
    <AdminContext.Provider
      value={{
        admin,
        courses,
        setCourses,
        setAdmin,
        getAllUsers,
        mentors,
        setMentors,
        cat,
        setCat,
        refreshMentors: getAllMentors,
        users,
        setUsers,
        totalUsersCount, 
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export default AdminProvider;

export const useAdminContext = (): AdminContextType => {
  const context = useContext(AdminContext);
  if (!context) throw new Error("useAdminContext must be used within AdminProvider");
  return context;
};
