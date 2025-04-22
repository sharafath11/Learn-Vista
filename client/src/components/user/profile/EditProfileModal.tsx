"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, Mail, Lock, User, Camera, CheckCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { UserAPIMethods } from "@/src/services/APImethods";
import { useUserContext } from "@/src/context/userAuthContext";
import { showSuccessToast, showErrorToast } from "@/src/utils/Toast";

type View = "profile" | "forgotPassword" | "resetSent";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  username?: string;
  email?: string;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  username = "",
  email = "",
}: EditProfileModalProps) {
  const [name, setName] = useState(username);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<View>("profile");
  const [emailInput] = useState(email);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setUser } = useUserContext();

  useEffect(() => {
    if (isOpen) {
      setName(username);
      setCurrentView("profile");
      setSelectedImage(null);
      setImagePreview(null);
      setIsLoading(false);
    }
  }, [isOpen, username]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;
  
    // Simple image type check
    if (!file.type.includes('image')) {
      showErrorToast('Only image files are allowed');
      return;
    }
  
    // If valid image, set the state
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleForgotPassword = async () => {
    if (!emailInput) return;
    
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setCurrentView("resetSent");
    } catch (error) {
      showErrorToast("Failed to send reset link");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("username", name);
      if (selectedImage) formData.append("image", selectedImage);

      const res = await UserAPIMethods.editProfile(formData);
      
      if (res.ok) {
        setUser(prev => prev ? { 
          ...prev, 
          username: res.data.username, 
          profilePicture: res.data.image 
        } : null);
        showSuccessToast(res.msg);
        onClose();
      }
    } catch (error) {
      showErrorToast("Failed to save changes");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const views = {
    profile: (
      <>
        <div className="flex flex-col items-center mb-6">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative h-28 w-28 rounded-full bg-gray-100 border-4 border-white shadow-lg cursor-pointer group overflow-hidden"
          >
            {imagePreview ? (
              <Image src={imagePreview} alt="Preview" fill className="object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full w-full bg-gradient-to-br from-indigo-100 to-purple-100">
                <User size={48} className="text-indigo-400" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera size={24} className="text-white" />
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
          <button className="mt-3 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
            Change Profile Photo
          </button>
        </div>

        <div className="space-y-4">
          <InputField 
            icon={<User size={18} className="text-gray-400" />}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your username"
          />
          
          <InputField 
            icon={<Mail size={18} className="text-gray-400" />}
            value={emailInput}
            readOnly
            className="bg-gray-100 cursor-not-allowed"
          />

          <button
            onClick={() => setCurrentView("forgotPassword")}
            className="w-full text-left text-sm font-medium text-red-600 hover:text-red-800 transition-colors"
          >
            Forgot Password?
          </button>

          <Button onClick={handleSaveChanges} gradient loading={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : "Save Changes"}
          </Button>
        </div>
      </>
    ),
    forgotPassword: (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mb-4">
          <Lock size={32} className="text-indigo-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900">Reset your password</h3>
        <p className="text-sm text-gray-500">
          We'll send a password reset link to your email.
        </p>
        <Button onClick={handleForgotPassword} loading={isLoading}>
          {isLoading ? <Loader2 className="animate-spin" /> : "Send Reset Link"}
        </Button>
      </div>
    ),
    resetSent: (
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mx-auto">
          <CheckCircle size={32} className="text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Reset Link Sent!</h3>
        <p className="text-sm text-gray-600">
          Please check your email for a link to reset your password.
        </p>
        <Button onClick={onClose} className="bg-green-600 hover:bg-green-700">
          Close
        </Button>
      </div>
    )
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <X size={24} />
          </button>

          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
            {currentView !== "profile" && (
              <button
                onClick={() => setCurrentView("profile")}
                className="absolute top-4 left-4 text-white hover:text-indigo-200 transition-colors"
                disabled={isLoading}
              >
                <ChevronLeft size={24} />
              </button>
            )}
            <h2 className="text-2xl font-bold text-center">
              {currentView === "profile" ? "Edit Profile" : 
               currentView === "forgotPassword" ? "Reset Password" : "Check Your Email"}
            </h2>
          </div>

          <div className="p-6">
            <motion.div
              key={currentView}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {views[currentView]}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

const InputField = ({ 
  icon, 
  value, 
  onChange, 
  placeholder, 
  readOnly, 
  className = "" 
}: {
  icon: React.ReactNode;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
}) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      {icon}
    </div>
    <input
      type="text"
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      className={`w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${className}`}
      placeholder={placeholder}
    />
  </div>
);

const Button = ({ 
  children, 
  onClick, 
  gradient = false, 
  loading = false,
  className = "" 
}: {
  children: React.ReactNode;
  onClick: () => void;
  gradient?: boolean;
  loading?: boolean;
  className?: string;
}) => (
  <button
    onClick={onClick}
    disabled={loading}
    className={`w-full text-white py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 ${
      gradient 
        ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700" 
        : `bg-indigo-600 hover:bg-indigo-700 ${className}`
    } ${loading ? "opacity-80 cursor-not-allowed" : ""}`}
  >
    {children}
  </button>
);