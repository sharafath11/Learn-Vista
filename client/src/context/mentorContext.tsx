"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { IMentor, IMentorContext, } from "../types/mentorTypes";

import { useRouter } from "next/navigation";
import { IPopulatedCourse } from "../types/courseTypes";
import { showErrorToast, showInfoToast } from "../utils/Toast";
import { IConcern } from "../types/concernTypes";
import { INotification } from "../types/notificationsTypes";
import { MentorAPIMethods } from "../services/methods/mentor.api";
import { SharedAPIMethods } from "../services/methods/shared.api";

export const MentorContext = createContext<IMentorContext | null>(null);

export const MentorsContextProvider = ({ children }: { children: ReactNode }) => {
  const [mentor, setMentor] = useState<IMentor | null>(null);
  const [courses, setCourses] = useState<IPopulatedCourse[]>([]);
  const [mentorNotification, setMentorNotifications] = useState<INotification[]>([])
  const [mentorUnreadNotification,setMentorUnreadNotification]=useState<number>(0)
  const [concerns, setConcerns] = useState<IConcern[]>([])
  useEffect(() => {
    localStorage.removeItem("role")
    localStorage.setItem("role", "mentor"); fetchNotifications()
},[])
  const router = useRouter();

  const getMentorDetils = useCallback(async () => {
    const res = await MentorAPIMethods.getMentor();
   
  
    if (res?.ok) {
      setMentor(res.data); 
      
    } else {
      router.push("/mentor/login");
    }
  }, []);
   const fetchNotifications = async () => {
      const res = await SharedAPIMethods.getMyNotifications();
     
      if (res.ok) {
        setMentorNotifications(res.data);
        const unread = res.data.filter((n: INotification) => !n.isRead).length;
        setMentorUnreadNotification(unread);
      }
      else showInfoToast(res.msg)
    }

  const getCourses =async  () => {
    const res = await MentorAPIMethods.getCourses();
    if (res.ok) setCourses(res.data);
  }
  const fetchConcern = async () => {
    const res = await MentorAPIMethods.getConcern({});
    if (res.ok) setConcerns(res.data.data);
    else showErrorToast(res.msg)
  }
  useEffect(() => {
    getCourses()
    getMentorDetils();
    fetchConcern()
    fetchNotifications()
  }, [getMentorDetils]);

  useEffect(() => {
    getCourses();
  }, []);
 
const contextValue: IMentorContext = {
  mentor,
  setMentor,
  refreshMentor: getMentorDetils,
  courses,
  setCourses,
  concerns,
  setConcerns,
  mentorNotification,
  setMentorNotifications,
  mentorUnreadNotification,
  setMentorUnreadNotification, 
  refreshMentorNotification:fetchNotifications
};


  return (
    <MentorContext.Provider value={contextValue}>
      {children}
    </MentorContext.Provider>
  );
};

export const useMentorContext = () => {
  const context = useContext(MentorContext);
  if (!context) {
    throw new Error("useMentorContext must be used within a MentorsContextProvider");
  }
  return context;
};
