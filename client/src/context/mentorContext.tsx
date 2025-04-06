"use client"
import { createContext, ReactNode, useContext, useState } from "react";
import { IMentorContext, IMentorMentor } from "../types/mentorTypes";
import { Mentor } from "../types/adminTypes";

export const MentorContext = createContext<IMentorContext | null>(null);

export const MentorsContextProvider = ({ children }: { children: ReactNode }) => {
    const [mentor,setMentor]=useState<IMentorMentor|null>(null)
  return (
    <MentorContext.Provider value={{mentor,setMentor}}>
      {children}
    </MentorContext.Provider>
  );
};

