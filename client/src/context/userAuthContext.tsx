"use client";

import { createContext, useState, useContext, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { NotificationAPIMethods, UserAPIMethods } from "../services/APImethods";
import { 
  UserContextType, 
  UserProviderProps, 
  IUser 
} from "../types/authTypes";
import { IPopulatedCourse } from "../types/courseTypes";
import { showErrorToast, showInfoToast } from "../utils/Toast";
import { IUserCourseProgress } from "../types/userProgressTypes";
import { INotification } from "../types/notificationsTypes";

export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [allCourses, setAllCourses] = useState<IPopulatedCourse[]>([]);
  const [curentUrl, setCurentUrl] = useState<string>("");
  const [progresses, setProgress] = useState<IUserCourseProgress[]>([]);
  const [userNotifications, setUserNotifications] = useState<INotification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  
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
  const fetchProgress = async () => {
    const res = await UserAPIMethods.getUserProgress();
    if (res.ok) setProgress(res.data);
    else showErrorToast("Somthing wrent wronghhh")
  }
  const fetchNotifications = async () => {
    const res = await NotificationAPIMethods.getMyNotifications();
    console.log("abcdedghijklmno",res)
    if (res.ok) {
      setUserNotifications(res.data);
      const unread = res.data.filter((n: INotification) => !n.isRead).length;
      setUnreadCount(unread);
    }
    else showInfoToast(res.msg)
  }
   
   const fetchLessons = async (courseId:string) => {
     const res = await UserAPIMethods.getLessons(courseId);
     console.log("res",res)
     if (res.ok) {
       return res.data
     }
     else return []
     
   }
  useEffect(() => {
    fetchUserData();
    fetchCourses();
    fetchProgress();
    fetchNotifications()
  }, [fetchUserData]);
  const fetchCourses = async () => {
    const res = await UserAPIMethods.fetchAllCourse({});
    console.log("contecxt",res)
    if (res.ok) setAllCourses(res.data.data);
    else showErrorToast(res.msg)
  }

  const contextValue = {
    user,
    setUser,
    allCourses,
    fetchLessons,
    curentUrl,
    setCurentUrl,
    setProgress,
    progresses,
    setUserNotifications,
    userNotifications,
    unreadCount,
    setUnreadCount,
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