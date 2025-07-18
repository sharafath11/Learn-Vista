"use client";
import { AdminContext } from '@/src/context/adminContext';
import { AdminAPIMethods } from '@/src/services/APImethods';
import { IMentor } from '@/src/types/mentorTypes';
import { showSuccessToast } from '@/src/utils/Toast';
import { useContext, useEffect, useState } from 'react';

interface MentorInfoCardProps {
  mentor: IMentor;
}

const MentorInfoCard = ({ mentor }: MentorInfoCardProps) => {
  const adminContext = useContext(AdminContext);
  const [currentStatus, setCurrentStatus] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (mentor?.status) {
      setCurrentStatus(mentor.status);
      setIsLoading(false);
    }
  }, [mentor]); 
  const handleStatusChange = async (status: string) => {
    setIsUpdating(true);
    try {
      const res = await AdminAPIMethods.mentorChangeStatus(
        mentor.id,
        status ?? "", 
        mentor.email
      );
      if (res.ok) {
        adminContext?.refreshMentors();
        setCurrentStatus(status);
        showSuccessToast(res.msg);
      }
    } catch (err) {
      console.error("Status update failed:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const statusClass =
    currentStatus === 'approved'
      ? 'bg-green-100 text-green-800'
      : currentStatus === 'pending'
        ? 'bg-yellow-100 text-yellow-800'
        : currentStatus === 'rejected'
          ? 'bg-red-100 text-red-800'
          : 'bg-gray-200 text-gray-700';

  const statusLabel = currentStatus
    ? currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)
    : '';

  if (isLoading) {
    return (
      <div className="rounded-xl shadow-lg overflow-hidden bg-white animate-pulse">
        <div className="md:flex">
          <div className="md:w-1/3 p-6 flex flex-col items-center">
            {/* Profile Picture Skeleton */}
            <div className="w-40 h-40 rounded-full overflow-hidden mb-4 border-4 border-indigo-500 bg-gray-300"></div>
            
            {/* Name Skeleton */}
            <div className="h-6 w-3/4 bg-gray-300 rounded mb-4"></div>
            
            {/* Expertise Skeleton */}
            <div className="h-4 w-1/2 bg-gray-300 rounded mb-4"></div>
            
            {/* Status Skeleton */}
            <div className="h-6 w-20 bg-gray-300 rounded-full mb-4"></div>
            
            {/* Download Resume Skeleton */}
            <div className="h-4 w-32 bg-gray-300 rounded mb-4"></div>
            
            {/* Contact Info Skeleton */}
            <div className="w-full p-4 rounded-lg mb-4 bg-gray-100 space-y-2">
              <div className="h-4 w-1/3 bg-gray-300 rounded"></div>
              <div className="h-3 w-full bg-gray-300 rounded"></div>
              <div className="h-3 w-2/3 bg-gray-300 rounded"></div>
              <div className="h-3 w-1/2 bg-gray-300 rounded"></div>
            </div>
            
            {/* Social Media Skeleton */}
            <div className="w-full space-y-2">
              <div className="h-3 w-1/4 bg-gray-300 rounded"></div>
              <div className="flex gap-2">
                <div className="h-6 w-20 bg-gray-300 rounded-full"></div>
                <div className="h-6 w-20 bg-gray-300 rounded-full"></div>
              </div>
            </div>
            
            {/* Buttons Skeleton */}
            <div className="flex flex-wrap gap-2 w-full mt-4">
              <div className="h-10 flex-1 bg-gray-300 rounded-lg"></div>
              <div className="h-10 flex-1 bg-gray-300 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl shadow-lg overflow-hidden bg-white">
      <div className="md:flex">
        <div className="md:w-1/3 p-6 flex flex-col items-center">
          <div className="w-40 h-40 rounded-full overflow-hidden mb-4 border-4 border-indigo-500">
            <img
              src={mentor?.profilePicture || ''}
              alt={mentor?.profilePicture || ''}
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="text-xl font-bold text-center text-red-500">{ mentor.isVerified?"":"Not verified"}</h3>
          <h2 className="text-xl font-bold text-center">{mentor?.username}</h2>
          <p className="text-sm text-center mb-4 text-gray-600">{mentor?.expertise}</p>

          {/* Status */}
          <div className="mb-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusClass}`}>
              {statusLabel}
            </span>
          </div>

          {/* Download Resume */}
          {mentor?.cvOrResume && (
            <a
              href={mentor?.cvOrResume}
              className="text-indigo-600 underline hover:text-indigo-800"
            >
              Download Resume
            </a>
          )}

          {/* Contact Info */}
          <div className="w-full p-4 rounded-lg mb-4 bg-gray-100">
            <h3 className="font-semibold mb-2">Contact Information</h3>
            <p className="text-sm mb-1">
              <span className="font-medium">Email:</span> {mentor?.email}
            </p>
            <p className="text-sm mb-1">
              <span className="font-medium">Phone:</span> {mentor?.phoneNumber}
            </p>
            <div className="mt-2">
              <h4 className="font-medium text-sm mb-1">Social Media:</h4>
              <div className="flex flex-wrap gap-2">
                {mentor?.socialLinks?.map((link) => (
                  <a
                    key={link?.url}
                    href={link?.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-700 text-sm rounded-full hover:bg-indigo-100 transition"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M14 3v2h3.59L9 13.59 10.41 15 19 6.41V10h2V3z" />
                    </svg>
                    <span>{link?.platform}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Status Actions - Only show if status is not approved */}
          {currentStatus !== 'approved' && (
            <div className="flex flex-wrap gap-2 w-full">
              <button
                onClick={() => handleStatusChange('approved')}
                disabled={isUpdating}
                className={`flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isUpdating ? 'Processing...' : 'Approve'}
              </button>
              {currentStatus !== 'rejected' && (
                <button
                  onClick={() => handleStatusChange('rejected')}
                  disabled={isUpdating}
                  className={`flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg text-sm font-medium ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isUpdating ? 'Processing...' : 'Reject'}
                </button>
              )}
              {currentStatus !== 'pending' && (
                <button
                  onClick={() => handleStatusChange('pending')}
                  disabled={isUpdating}
                  className={`flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg text-sm font-medium ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isUpdating ? 'Processing...' : 'Pending'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorInfoCard;