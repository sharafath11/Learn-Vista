"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { IMentorContext, IMentorMentor, IPopulatedCourse } from "../types/mentorTypes";
import { ICourse } from "../types/adminTypes";
import { useRouter } from "next/navigation";
import { MentorAPIMethods } from "../services/APImethods";

export const MentorContext = createContext<IMentorContext | null>(null);

export const MentorsContextProvider = ({ children }: { children: ReactNode }) => {
  const [mentor, setMentor] = useState<IMentorMentor | null>(null);
  const [courses, setCourses] = useState<IPopulatedCourse[]>([]);
  const router = useRouter();

  const getMentorDetils = useCallback(async () => {
    const res = await MentorAPIMethods.getMentor();
   
  
    if (res?.ok) {
      setMentor(res.data); 
    } else {
      router.push("/mentor/login");
    }
  }, [router]);
  

  const getCourses = useCallback(async () => {
    const res = await MentorAPIMethods.getCourses();
    if (res.ok) setCourses(res.data);
    console.log("mentor side", res);
  }, []);

  useEffect(() => {
    alert("triger")
    getMentorDetils();
  }, [getMentorDetils]);

  useEffect(() => {
    getCourses();
  }, [getCourses]);

  const contextValue: IMentorContext = {
    mentor,
    setMentor,
    refreshMentor: getMentorDetils,
    courses,
    setCourses,
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
