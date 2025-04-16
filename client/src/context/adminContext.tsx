"use client";
import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { getRequest } from "../services/api";
import { AdminContextType } from "../types/adminTypes";
import { AdminAPIMethods } from "../services/APImethods";

export const AdminContext = createContext<AdminContextType | null>(null);

const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState(false);
  const [mentors, setMentors] = useState<any[]>([]);

  useEffect(() => {
    getAllMentors();
  }, []);

  async function getAllMentors() {
    try {
      const res = await AdminAPIMethods.fetchMentor();
      if (res.ok) {
        setMentors(res.mentors);
      } else {
        console.error(res.msg);
      }
    } catch (error) {
      console.error("Failed to fetch mentors:", error);
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
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export default AdminProvider;
