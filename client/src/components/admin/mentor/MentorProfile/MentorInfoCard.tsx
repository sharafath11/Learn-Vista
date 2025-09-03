"use client";
import { AdminContext } from '@/src/context/adminContext';
import { AdminAPIMethods } from '@/src/services/methods/admin.api';
import { IMentor } from '@/src/types/mentorTypes';
import { showSuccessToast } from '@/src/utils/Toast';
import Image from 'next/image';
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
      <div className="rounded-xl shadow-lg overflow-hidden bg-white animate-pulse h-96"></div>
    );
  }

  return (
    <div className="rounded-xl shadow-lg overflow-hidden bg-white flex flex-col md:flex-row">
      {/* Left side (Profile & Info) */}
      <div className="md:w-1/2 p-6 flex flex-col items-center">
        {/* Profile Picture */}
        <div className="w-40 h-40 rounded-full overflow-hidden mb-4 border-4 border-indigo-500">
          <Image
            src={mentor?.profilePicture || "/placeholder.svg"}
            alt={mentor?.username || "Mentor profile"}
            width={160}
            height={160}
            className="object-cover w-40 h-40 rounded-full"
          />
        </div>

        {/* Basic Info */}
        <h3 className="text-lg font-bold text-red-500">
          {mentor.isVerified ? "" : "Not verified"}
        </h3>
        <h2 className="text-2xl font-bold text-center">{mentor?.username}</h2>

        {/* Expertise Tags */}
        <div className="flex flex-wrap justify-center gap-2 mt-2 mb-4">
          {mentor.expertise?.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium"
            >
              {skill}
            </span>
          ))}
        </div>

        {/* Status */}
        <span className={`px-4 py-1 mb-4 rounded-full text-sm font-medium ${statusClass}`}>
          {statusLabel}
        </span>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 w-full mb-4">
          <div className="text-center">
            <p className="text-lg font-bold">{mentor.students}</p>
            <p className="text-xs text-gray-500">Students</p>
          </div>
          <div className="text-center">
  <p className="text-lg font-bold">
    {mentor.courses?.filter(c => c.isActive).length || 0}
  </p>
  <p className="text-xs text-gray-500">Active Courses</p>
</div>

<div className="text-center">
  <p className="text-lg font-bold">
    {mentor.courses?.filter(c => !c.isActive).length || 0}
  </p>
  <p className="text-xs text-gray-500">Inactive Courses</p>
</div>

          <div className="text-center">
            <p className="text-lg font-bold">{mentor.liveClasses?.length}</p>
            <p className="text-xs text-gray-500">Live Classes</p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="w-full p-4 rounded-lg mb-4 bg-gray-100">
          <h3 className="font-semibold mb-2">Contact Information</h3>
          <p className="text-sm mb-1"><span className="font-medium">Email:</span> {mentor?.email}</p>
          <p className="text-sm mb-1"><span className="font-medium">Phone:</span> {mentor?.phoneNumber}</p>
          {mentor?.socialLinks?.length > 0 && (
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
                    <span>{link?.platform}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Approve / Reject / Pending Buttons */}
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

      {/* Right side (Resume Preview) */}
      {mentor?.cvOrResume && (
        <div className="md:w-1/2 p-6 flex flex-col gap-4">
          <a
            href={mentor.cvOrResume}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 underline hover:text-indigo-800 text-sm"
          >
            Download Resume
          </a>
          <div className="h-[500px] w-full border border-gray-300 rounded-xl overflow-hidden">
            <iframe
              src={`https://docs.google.com/gview?url=${encodeURIComponent(mentor.cvOrResume)}&embedded=true`}
              title="Resume Preview"
              className="w-full h-full"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorInfoCard;
