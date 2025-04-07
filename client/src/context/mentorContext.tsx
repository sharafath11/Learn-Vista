"use client"
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { IMentorContext, IMentorMentor } from "../types/mentorTypes";
import { Mentor } from "../types/adminTypes";
import { getRequest, postRequest } from "../services/api";
import { useRouter } from "next/navigation";

export const MentorContext = createContext<IMentorContext | null>(null);

export const MentorsContextProvider = ({ children }: { children: ReactNode }) => {
  const [mentor, setMentor] = useState<IMentorMentor | null>(null);
  const route = useRouter();
  useEffect(() => {
    getMentorDetils()
  },[])
 
  async function getMentorDetils() {
    const res = await getRequest("/mentor/get-mentor");
    console.log(res)
    if (res?.ok) setMentor(res?.mentor)
    else route.push("/mentor/login")
  }
  return (
    <MentorContext.Provider value={{mentor,setMentor,refreshMentor:getMentorDetils}}>
      {children}
    </MentorContext.Provider>
  );
};

