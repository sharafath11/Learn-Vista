"use client"
import { createContext, useState, useContext, ReactNode } from "react";

export interface AdminContextType {
  admin: boolean;
  setAdmin: React.Dispatch<React.SetStateAction<boolean>>;
}
export const AdminContext = createContext<AdminContextType | null>(null);
const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState(false);

  return (
    <AdminContext.Provider value={{ admin, setAdmin }}>
      {children}
    </AdminContext.Provider>
  );
};

export default AdminProvider;
