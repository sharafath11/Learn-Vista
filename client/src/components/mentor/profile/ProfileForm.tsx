"use client";
import React, { useContext } from "react";
import { MentorContext } from "@/src/context/mentorContext";

export default function ProfileForm() {
  const mentorDetils = useContext(MentorContext);
 

  return (
    <form className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1">First Name</label>
          <input
            type="text"
            defaultValue={mentorDetils?.mentor?.username}
            className="w-full px-3 py-2 bg-[#0a1128] border border-gray-700 rounded-md"
          />
        </div>
        
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          defaultValue={mentorDetils?.mentor?.email }
          className="w-full px-3 py-2 bg-[#0a1128] border border-gray-700 rounded-md"
        />
      </div>
     
       <div>
        <label className="block text-sm font-medium mb-1">Phone Number</label>
        <input
          type="tel"
          defaultValue={mentorDetils?.mentor?.phoneNumber}
          className="w-full px-3 py-2 bg-[#0a1128] border border-gray-700 rounded-md"
        />
      </div> 

      <div>
        <label className="block text-sm font-medium mb-1">Professional Title</label>
        <input
          type="text"
          defaultValue={mentorDetils?.mentor?.expertise[0]}
          className="w-full px-3 py-2 bg-[#0a1128] border border-gray-700 rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Bio</label>
        <textarea
          rows={4}
          defaultValue={mentorDetils?.mentor?.bio||""}
          className="w-full px-3 py-2 bg-[#0a1128] border border-gray-700 rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Areas of Expertise</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {mentorDetils?.mentor?.expertise.map((skill) => (
            <span
              key={skill}
              className="px-2 py-1 bg-gray-800 text-xs rounded-md flex items-center"
            >
              {skill}
              <button className="ml-1 text-gray-400 hover:text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </span>
          ))}
        </div>
      </div>
    </form>
  );
}
