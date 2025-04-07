"use client"
import { MentorContext } from "@/src/context/mentorContext";
import { useContext } from "react";

export default function ProfileInfo() {
  const mentorDetils=useContext(MentorContext)
    return (
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gray-700 overflow-hidden">
              <img
                src="/placeholder.svg?height=80&width=80"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <button className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
          </div>
          <div>
            <h3 className="font-medium">{ mentorDetils?.mentor?.username}</h3>
            <p className="text-xs text-gray-400">Joined on {mentorDetils?.mentor?.applicationDate}</p>
            <div className="flex items-center mt-1">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                <span className="text-xs text-gray-400">4.8 (32 reviews)</span>
              </div>
              <span className="mx-2 text-gray-600">•</span>
              <span className="text-xs text-gray-400">24 sessions</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  