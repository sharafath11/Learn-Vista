"use client"
import { MentorContext } from "@/src/context/mentorContext";
import { useContext } from "react";

export default function ProfileInfo() {
  const mentorDetils = useContext(MentorContext);

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
          <h3 className="text-lg font-semibold">{mentorDetils?.mentor?.username}</h3>
          <p className="text-xs text-gray-400">
            Joined on {mentorDetils?.mentor?.applicationDate &&
              new Date(mentorDetils.mentor.applicationDate).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
              })}
          </p>

          <div className="flex items-center mt-1">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
              <span className="text-xs text-gray-400">4.8 (32 reviews)</span>
            </div>
            <span className="mx-2 text-gray-600">•</span>
            <span className="text-xs text-gray-400">24 sessions</span>
          </div>

          {mentorDetils?.mentor?.socialLinks&&mentorDetils?.mentor?.socialLinks?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {mentorDetils.mentor.socialLinks.map((item, index) => (
                <a
                  key={index}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 bg-gray-100 text-sm text-gray-700 px-3 py-1 rounded-full hover:bg-blue-100 transition"
                >
                  <span className="font-medium">{item.platform}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
