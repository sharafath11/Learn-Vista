// components/MentorInfo.tsx
import { Mentor, MentorStatus } from '@/src/types/adminTypes';
import React from 'react';


interface MentorInfoProps {
  mentor: Mentor;
  mentorStatus: MentorStatus;
}

const MentorInfo: React.FC<MentorInfoProps> = ({ mentor, mentorStatus }) => {
  return (
    <div className="rounded-xl shadow-lg overflow-hidden mb-8 bg-white">
      <div className="md:flex">
        <div className="md:w-1/3 p-6 flex flex-col items-center">
          <div className="w-40 h-40 rounded-full overflow-hidden mb-4 border-4 border-indigo-500">
            <img src="/sir2.png" alt={mentor.name} className="w-full h-full object-cover" />
          </div>
          <h2 className="text-xl font-bold text-center">{mentor.name}</h2>
          <p className="text-sm text-center mb-4 text-gray-600">{mentor.title}</p>

          <div className="mb-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              mentorStatus === 'Approved' ? 'bg-green-100 text-green-800' :
              mentorStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {mentorStatus.charAt(0).toUpperCase() + mentorStatus.slice(1)}
            </span>
          </div>

          <div className="w-full p-4 rounded-lg mb-4 bg-gray-100">
            <h3 className="font-semibold mb-2">Contact Information</h3>
            <p className="text-sm mb-1"><span className="font-medium">Email:</span> {mentor.email}</p>
            <p className="text-sm mb-1"><span className="font-medium">Phone:</span> {mentor.phone}</p>
            <div className="mt-2">
              <h4 className="font-medium text-sm mb-1">Social Media:</h4>
              <div className="flex space-x-2">
                <a href={mentor.social?.linkedin || "#"} className="text-blue-500 hover:text-blue-700">LinkedIn</a>
                <a href={mentor.social?.twitter || "#"} className="text-blue-400 hover:text-blue-600">Twitter</a>
                <a href={mentor.social?.github || "#"} className="text-gray-800 hover:text-gray-600">GitHub</a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MentorInfo;
