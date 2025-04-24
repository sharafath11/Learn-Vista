"use client";
import { createContext, ReactNode, useContext, useEffect, useState, useMemo, useCallback } from "react";
import { IMentorContext, IMentorMentor } from "../types/mentorTypes";
import { Mentor } from "../types/adminTypes";
import { getRequest, postRequest } from "../services/api";
import { useRouter } from "next/navigation";
import { MentorAPIMethods } from "../services/APImethods";


export const MentorContext = createContext<IMentorContext | null>(null);


export const MentorsContextProvider = ({ children }: { children: ReactNode }) => {
  const [mentor, setMentor] = useState<IMentorMentor | null>(null);
  const route = useRouter();


  const getMentorDetils = useCallback(async () => {
    try {
      const res = await MentorAPIMethods.getMentor();
      if (res?.ok) {
        if (res.msg.includes("Logged out successfully")) {
          route.push("/mentor/login");
        } else {
          setMentor(res?.data);
        }
      } else {
        route.push("/mentor/login");
      }
    } catch (error) {
      console.error("Error fetching mentor details:", error);
      route.push("/mentor/login");
    }
  }, [route]);


  const contextValue = useMemo(() => ({
    mentor,
    setMentor,
    refreshMentor: getMentorDetils
  }), [mentor, getMentorDetils]);

  
  useEffect(() => {
    getMentorDetils();
  }, [getMentorDetils]);
   console.log("context ",mentor)
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
