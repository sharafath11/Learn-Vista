"use client"
import { MentorContext } from "@/src/context/mentorContext"
import { useContext } from "react"

const page = () => {
    const mentor = useContext(MentorContext);
    console.log("kindi kindi",mentor?.mentor)
  return (
    <div>page</div>
  )
}

export default page