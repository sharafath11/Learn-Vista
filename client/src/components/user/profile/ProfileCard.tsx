// components/ProfileCard.jsx
"use client";

import Image from "next/image";
import { Settings } from "lucide-react";
import { useUserContext } from "@/src/context/userAuthContext";
import { useState, useEffect } from "react"; 
import EditProfileModal from "./EditProfileModal";
import ChangePasswordModal from "../../ChangePasswordModal";

export default function ProfileCard() {
  const { user } = useUserContext();
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);



  const formattedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  const finalProfileImageSrc = user?.profilePicture || "/default-avatar.png";

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md">
        <div className="relative h-32 bg-gradient-to-r from-indigo-500 to-purple-600">
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
            <div className="relative h-32 w-32 rounded-full border-4 border-white shadow-lg">
              <Image
                // --- Using the determined finalProfileImageSrc ---
                src={finalProfileImageSrc}
                alt="User Avatar"
                width={128}
                height={128}
                className="object-cover rounded-full"
                unoptimized // --- RE-ADDED THIS CRITICAL PROP ---
              />
              <div className="absolute bottom-0 right-0 bg-green-500 rounded-full p-1 border-2 border-white">
                <div className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-20 pb-6 px-6 text-center">
          <h2 className="text-xl font-bold text-gray-900">{user?.username}</h2>

          <div className="mt-4 flex justify-center space-x-4">
            <div className="text-center">
              <p className="text-lg font-bold text-gray-900">Email</p>
              <p className="text-xs text-gray-500">
                {user?.email ?? "N/A"} 
              </p>
            </div>
           
          </div>

          <button
            className="mt-6 w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center justify-center transition-colors"
            onClick={() => setShowEditProfileModal(true)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Edit Profile
          </button>

          <button
            className="mt-3 w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center transition-colors"
            onClick={() => setShowChangePasswordModal(true)}
          >
            Change Password
          </button>
        </div>
      </div>

      <EditProfileModal
        isOpen={showEditProfileModal}
        onClose={() => setShowEditProfileModal(false)}
        username={user?.username}
        email={user?.email}
      />

      <ChangePasswordModal
        role="user"
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
      />
    </>
  );
}