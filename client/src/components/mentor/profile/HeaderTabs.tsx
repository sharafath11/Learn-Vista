"use client";
import React, { useState } from "react";
// Assuming these modals are in the same directory, otherwise, adjust the path
import EditProfileModal from "./EditProfileModal";  
import ChangePasswordModal from "../../ChangePasswordModal";

export default function HeaderTabs() {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  return (
    <div className="mb-6">
      <h1 className="text-2xl font-semibold">Profile</h1>
      <p className="text-sm text-gray-400 mb-4">
        Manage your mentor profile and account settings.
      </p>

      <div className="flex border-b border-gray-800">
        <button className="px-4 py-2 text-sm font-medium text-white border-b-2 border-blue-500">
          Profile Information
        </button>
        <button
          className="px-4 py-2 text-sm font-medium text-white border-b-2"
          onClick={() => setShowEditModal(true)}
        >
          Edit Profile
        </button>
        {/* Change Password Button */}
        <button
          className="px-4 py-2 text-sm font-medium text-white border-b-2"
          onClick={() => setShowChangePasswordModal(true)}
        >
          Change Password
        </button>
      </div>

      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
      />
      <ChangePasswordModal
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
        role="mentor"
      />
    </div>
  );
}