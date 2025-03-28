"use client";

import { createContext, useState, ReactNode } from "react";

export const UserContext = createContext<{ 
  user: string; 
  setUser: React.Dispatch<React.SetStateAction<string>> 
} | null>(null);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState();
  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
};
