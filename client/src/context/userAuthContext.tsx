"use client";

import { createContext, useState, useContext, useEffect } from "react";
import { 
  UserContextType, 
  UserProviderProps, 
  IUser 
} from "../types/authTypes";
import { getRequest } from "../services/api";
import { useRouter } from "next/navigation";

export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<IUser | null>(null);
  const route=useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const res = await getRequest("/get-user");
      if (res.ok) {
        setUser(res.user);
      }
      else {
        route.push("/user/login")
      }
    };

    fetchUser();
  }, []); 
  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
