"use client";

import { createContext, useState, useContext, useEffect } from "react";
import { 
  UserContextType, 
  UserProviderProps, 
  IUser 
} from "../types/authTypes";
import { useRouter } from "next/navigation";
import { UserAPIMethods } from "../services/APImethods";

export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<IUser | null>(null);
  const route = useRouter()

  useEffect(() => {
    const fetchUserData = async () => {
        const res = await UserAPIMethods.fetchUser();
        if (res.ok) {
          setUser(res.user);
        }
        else {
          route.push("/user/login")
        }
    };
  
    fetchUserData();
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
