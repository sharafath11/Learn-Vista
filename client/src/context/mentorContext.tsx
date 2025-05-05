"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import { IMentorContext, IMentorMentor } from "../types/mentorTypes";
import { ICourse } from "../types/adminTypes";
import { useRouter } from "next/navigation";
import { MentorAPIMethods } from "../services/APImethods";

export const MentorContext = createContext<IMentorContext | null>(null);

export const MentorsContextProvider = ({ children }: { children: ReactNode }) => {
  const [mentor, setMentor] = useState<IMentorMentor | null>(null);
  const [courses, setCourses] = useState<ICourse[]>([]);
  const router = useRouter();

  const getMentorDetils = useCallback(async () => {
    const res = await MentorAPIMethods.getMentor();
    if (res?.ok) {
      if (res.msg.includes("Logged out successfully")) {
        router.push("/mentor/login");
      } 
      console.log(res)
    } else {
      router.push("/mentor/login");
    }
  }, [router]);
  const getCourses = useCallback(async () => {
    const res = await MentorAPIMethods.getCourses();
    if (res.ok) setCourses(res.data);
    console.log(res.data)
  },[courses])

  useEffect(() => {
    getMentorDetils();
    getCourses();
  }, [getMentorDetils]);

  const contextValue = useMemo<IMentorContext>(() => ({
    mentor,
    setMentor,
    refreshMentor: getMentorDetils,
    courses,
    setCourses,
  }), [mentor, getMentorDetils, courses]);

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
