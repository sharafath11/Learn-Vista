"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import React from "react"; 
import { showSuccessToast, showErrorToast } from "../utils/Toast";
import { UserAPIMethods } from "../services/methods/user.api";
import { MentorAPIMethods } from "../services/methods/mentor.api";
import { IChangePasswordModalProps } from "../types/sharedProps";
import { WithTooltip } from "../hooks/UseTooltipProps";



const ChangePasswordModal: React.FC<IChangePasswordModalProps> = ({
  isOpen,
  onClose,
  role, 
}) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async(e: React.FormEvent) => {
      e.preventDefault();

      if (newPassword !== confirmPassword) {
        showErrorToast("New password and confirm password do not match.");
        return;
      }

      if (role === "user") {
          const res = await UserAPIMethods.changePassword(currentPassword, newPassword);
          if (res.ok) {
            showSuccessToast(res.msg);
            onClose(); 
          } else {
            showErrorToast(res.msg);
          }
      } else {
        const res = await MentorAPIMethods.changePassword(currentPassword, newPassword);
        if (res.ok) {
          showSuccessToast(res.msg);
          onClose(); 
        } else {
          showErrorToast(res.msg);
        }
      }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
  <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-4">
    <h2 className="text-2xl font-bold mb-4 text-gray-800">Change Password</h2>
    <form onSubmit={handleSubmit}>
      {/* Current Password */}
      <div className="mb-4">
        <label
          htmlFor="currentPassword"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Current Password
        </label>
        <div className="relative">
          <input
            type={showCurrentPassword ? "text" : "password"}
            id="currentPassword"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <WithTooltip content={showCurrentPassword ? "Hide Password" : "Show Password"}>
            <span
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              {showCurrentPassword ? (
                <EyeOff className="h-5 w-5 text-gray-500" />
              ) : (
                <Eye className="h-5 w-5 text-gray-500" />
              )}
            </span>
          </WithTooltip>
        </div>
      </div>

      {/* New Password */}
      <div className="mb-4">
        <label
          htmlFor="newPassword"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          New Password
        </label>
        <div className="relative">
          <input
            type={showNewPassword ? "text" : "password"}
            id="newPassword"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <WithTooltip content={showNewPassword ? "Hide Password" : "Show Password"}>
            <span
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? (
                <EyeOff className="h-5 w-5 text-gray-500" />
              ) : (
                <Eye className="h-5 w-5 text-gray-500" />
              )}
            </span>
          </WithTooltip>
        </div>
      </div>

      {/* Confirm Password */}
      <div className="mb-6">
        <label
          htmlFor="confirmPassword"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Confirm New Password
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <WithTooltip content={showConfirmPassword ? "Hide Password" : "Show Password"}>
            <span
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5 text-gray-500" />
              ) : (
                <Eye className="h-5 w-5 text-gray-500" />
              )}
            </span>
          </WithTooltip>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-between">
        <WithTooltip content="Save changes to your password">
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
          >
            Save Changes
          </button>
        </WithTooltip>

        <WithTooltip content="Cancel and close modal">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
          >
            Cancel
          </button>
        </WithTooltip>
      </div>
    </form>
  </div>
</div>

  );
};

export default ChangePasswordModal;