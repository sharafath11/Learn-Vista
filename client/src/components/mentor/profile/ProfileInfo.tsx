"use client";
import { IMentor } from "@/src/types/mentorTypes";
import React, { useState } from "react";
import { FiExternalLink, FiEdit2, FiPlay, FiClock, FiUsers } from "react-icons/fi";

interface ProfileInfoProps {
  mentor: IMentor | null;
}

export default function ProfileInfo({ mentor }: ProfileInfoProps) {
  const [activeTab, setActiveTab] = useState<'courses' | 'live'>('courses');
  const [isEditing, setIsEditing] = useState(false);
  console.log(mentor?.applicationDate)

  if (!mentor) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-pulse text-gray-500">Loading profile...</div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        {/* Profile Picture */}
        <div className="relative group w-32 h-32 md:w-40 md:h-40 flex-shrink-0">
          <img
            src={mentor.profilePicture || "/default-avatar.png"}
            alt={`${mentor.username}'s profile`}
            className="w-full h-full rounded-2xl object-cover border-4 border-indigo-500/30 shadow-lg"
          />
          <button 
            onClick={() => setIsEditing(true)}
            className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full transform translate-x-2 translate-y-2 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-indigo-700"
          >
            <FiEdit2 size={16} />
          </button>
        </div>

        {/* Profile Info */}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-white">{mentor.username}</h1>
              <p className="text-indigo-400 font-medium">
                {mentor.expertise?.join(' • ') || 'Mentor'}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-indigo-900/50 text-indigo-300 text-sm rounded-full flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                Active
              </span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center text-gray-400">
              <FiClock className="mr-1" />
              <span>
                Joined {new Date(mentor.applicationDate).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
            </div>
            <div className="flex items-center text-gray-400">
              <FiUsers className="mr-1" />
              <span>24 students</span>
            </div>
            <div className="flex items-center">
              <div className="flex items-center mr-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-4 h-4 ${star <= 4 ? 'text-yellow-400' : 'text-gray-600'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-gray-400">4.0 (32 reviews)</span>
            </div>
          </div>

          <p className="mt-4 text-gray-300 leading-relaxed">
            {mentor.bio || "This mentor hasn't written a bio yet."}
          </p>

          {mentor.socialLinks?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {mentor.socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-full text-sm transition-colors"
                >
                  <span className="text-gray-300">{link.platform}</span>
                  <FiExternalLink className="ml-1 text-gray-400" size={14} />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      

    </div>
  );
}