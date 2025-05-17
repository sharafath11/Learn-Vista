"use client";

import { createContext, useState, useContext, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { UserAPIMethods } from "../services/APImethods";
import { 
  UserContextType, 
  UserProviderProps, 
  IUser 
} from "../types/authTypes";
import { IPopulatedCourse } from "../types/courseTypes";
import { showErrorToast } from "../utils/Toast";

export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [allCourses,setAllCourses]=useState<IPopulatedCourse[]>([])
  const router = useRouter();

  const fetchUserData = useCallback(async () => {
    try {
      const res = await UserAPIMethods.fetchUser();
      console.log(res.data)
      if (res.ok) {
        setUser(res.data);
      } else {
        router.push("/user/login");
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      router.push("/user/login");
    }
  }, [router]);

  useEffect(() => {
    fetchUserData();
    fetchCourses();
  }, [fetchUserData]);
  const fetchCourses = async () => {
    const res = await UserAPIMethods.fetchAllCourse({});
    if (res.ok) setAllCourses(res.data);
    else showErrorToast(res.msg)
  }

  const contextValue = {
    user,
    setUser,
    allCourses,
  };

  return (
    <UserContext.Provider value={contextValue}>
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