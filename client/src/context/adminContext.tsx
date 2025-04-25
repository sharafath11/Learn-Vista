"use client";
import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { getRequest } from "../services/api";
import { AdminContextType, AdminUser, Mentor } from "../types/adminTypes";
import { AdminAPIMethods } from "../services/APImethods";

export const AdminContext = createContext<AdminContextType | null>(null);

const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState(false);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);

  useEffect(() => {
    getAllMentors();
    getAllUsers();
  }, []);

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
        setAdmin,
        mentors,
        setMentors,
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
