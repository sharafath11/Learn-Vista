"use client";
import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { getRequest } from "../services/api";
import { AdminContextType, AdminUser, ICategory, ICourse, Mentor } from "../types/adminTypes";
import { AdminAPIMethods } from "../services/APImethods";
import { showInfoToast } from "../utils/Toast";

export const AdminContext = createContext<AdminContextType | null>(null);

const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState(false);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [cat, setCat] = useState<ICategory[]>([])
  const [courses,setCourses]=useState<ICourse[]>([])

  useEffect(() => {
    getAllMentors();
    getAllUsers();
    getCategories();
    getCourse()
  }, []);
  async function getCategories() {
    const res = await AdminAPIMethods.getGetegories();
    if (res.ok) setCat(res.data);
    else showInfoToast(res.msg)
  }
  async function getAllMentors() {
    try {
      const res = await AdminAPIMethods.fetchMentor();
      if (res.ok) {
        setMentors(res.data);
      } else {
        console.error(res.msg);
      }
    } catch (error) {
      console.error("Failed to fetch mentors:", error);
    }
  }
  async function getCourse(){
    const res = await AdminAPIMethods.getCourses();
    if (res.ok) setCourses(res.data);

  }

  async function getAllUsers() {
    try {
      const res = await AdminAPIMethods.fetchUser();
      if (res.ok) {
        setUsers(res.data);
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
        mentors,
        setMentors,
        cat,
        setCat,
        refreshMentors: getAllMentors,
        users,
        setUsers,
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
