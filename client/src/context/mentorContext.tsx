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
import { MentorAPIMethods } from "../services/APImethods";
import { IPopulatedCourse } from "../types/courseTypes";
import { ILessons } from "../types/lessons";
import { showErrorToast } from "../utils/Toast";
import { IConcern } from "../types/concernTypes";

export const MentorContext = createContext<IMentorContext | null>(null);

export const MentorsContextProvider = ({ children }: { children: ReactNode }) => {
  const [mentor, setMentor] = useState<IMentor | null>(null);
  const [courses, setCourses] = useState<IPopulatedCourse[]>([]);
  const [lessons, setLessons] = useState<ILessons[]>([])
  const [concerns,setConcerns]=useState<IConcern[]>([])

  const router = useRouter();

  const getMentorDetils = useCallback(async () => {
    const res = await MentorAPIMethods.getMentor();
   
  
    if (res?.ok) {
      setMentor(res.data); 
    } else {
      router.push("/mentor/login");
    }
  }, []);
  

  const getCourses =async  () => {
    const res = await MentorAPIMethods.getCourses();
    if (res.ok) setCourses(res.data);
    console.log("mentor side", res);
  }
  const fetchConcern = async () => {
    const res = await MentorAPIMethods.getConcern({});
    console.log("concernsss in context",res.data.data)
    if (res.ok) setConcerns(res.data.data);
    else showErrorToast(res.msg)
  }
  useEffect(() => {
    getCourses()
    getMentorDetils();
    fetchConcern()
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
    setConcerns
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
