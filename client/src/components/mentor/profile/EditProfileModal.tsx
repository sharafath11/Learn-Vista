"use client";

import { useState, useRef, useEffect, useCallback, memo } from "react";
import Image from "next/image";
import { X, ChevronLeft, Mail, Lock, User, Camera, CheckCircle, Loader2, Edit } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MentorAPIMethods, UserAPIMethods } from "@/src/services/APImethods";
import { showSuccessToast, showErrorToast } from "@/src/utils/Toast";
import { useMentorContext } from "@/src/context/mentorContext";
import { validateMentorProfile } from "@/src/validations/mentorValidation";

type View = "profile" | "forgotPassword" | "resetSent";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const maskEmail = (email: string): string => {
  if (!email) return "";
  
  const [username, domain] = email.split('@');
  if (!username || !domain) return email;
  
  return `${username[0]}${'*'.repeat(Math.max(0, username.length - 1))}@${domain}`;
};

const InputField = memo(({ 
  icon, 
  value, 
  onChange, 
  placeholder, 
  readOnly = false, 
  className = "",
  type = "text"
}: {
  icon: React.ReactNode;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
  type?: string;
}) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      {icon}
    </div>
    {type === "textarea" ? (
      <textarea
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        className={`w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${className} text-black min-h-[100px]`}
        placeholder={placeholder}
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        className={`w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${className} text-black`}
        placeholder={placeholder}
      />
    )}
  </div>
));

const Button = memo(({ 
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
    {loading ? <Loader2 className="animate-spin" size={20} /> : children}
  </button>
));

export default function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
  const { mentor, setMentor } = useMentorContext();
  const [name, setName] = useState(mentor?.username || "");
  const [bio, setBio] = useState(mentor?.bio || "");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<View>("profile");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetState = useCallback(() => {
    setName(mentor?.username || "");
    setBio(mentor?.bio || "");
    setCurrentView("profile");
    setSelectedImage(null);
    setImagePreview(null);
    setIsLoading(false);
  }, [mentor?.username, mentor?.bio]);

  useEffect(() => {
    if (isOpen) resetState();
  }, [isOpen, resetState]);
   console.log("abcd e",mentor)
  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    if (!file.type.startsWith('image/')) {
      showErrorToast('Only image files are allowed');
      return;
    }
  
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  }, []);

  const handleForgotPassword = useCallback(async () => {
    if (!mentor?.email) return;
    
    setIsLoading(true);
    try {
      const res = await MentorAPIMethods.forgotPassword(mentor.email);
      if (res.ok) {
        setCurrentView("resetSent");
        showSuccessToast(res.msg);
      } else {
        showErrorToast(res.msg);
      }
    } catch (error) {
      showErrorToast("Failed to send reset link");
    } finally {
      setIsLoading(false);
    }
  }, [mentor?.email]);

  const handleSaveChanges = useCallback(async () => {
    if (!mentor) return;
    if(!validateMentorProfile({ username:name, bio,image:selectedImage }))return
    setIsLoading(true);
    try {

      const formData = new FormData();
      formData.append("username", name);
      formData.append("bio", bio);
      if (selectedImage) formData.append("image", selectedImage);
    
      const res = await MentorAPIMethods.editProfile(formData);
      
      if (res.ok) {
        console.log(res.data)
        setMentor(prev => prev ? { 
          ...prev, 
          username: res.data.username, 
          bio: res.data.bio,
          profilePicture: res.data.image 
        } : null);
        showSuccessToast(res.msg);
        onClose();
      } else {
        showErrorToast(res.msg || "Failed to save changes");
      }
    } catch (error) {
      showErrorToast("Failed to save changes");
    } finally {
      setIsLoading(false);
    }
  }, [name, bio, selectedImage, mentor, setMentor, onClose]);

  if (!isOpen || !mentor) return null;

  const views: Record<View, React.ReactNode> = {
    profile: (
      <>
        <div className="flex flex-col items-center mb-6">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative h-28 w-28 rounded-full bg-gray-100 border-4 border-white shadow-lg cursor-pointer group overflow-hidden"
            aria-label="Profile picture"
          >
            {imagePreview ? (
              <Image 
                src={imagePreview} 
                alt="Preview" 
                fill 
                className="object-cover"
                priority
                sizes="112px"
              />
            ) : mentor.profilePicture ? (
              <Image 
                src={mentor.profilePicture} 
                alt="Profile" 
                fill 
                className="object-cover"
                priority
                sizes="112px"
              />
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
            icon={<Edit size={18} className="text-gray-400" />}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about yourself..."
            type="textarea"
          />
          
          <InputField 
            icon={<Mail size={18} className="text-gray-400" />}
            value={maskEmail(mentor.email)}
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
            Save Changes
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
          Send Reset Link
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
      {isOpen && (
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
              aria-label="Close modal"
            >
              <X size={24} />
            </button>

            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
              {currentView !== "profile" && (
                <button
                  onClick={() => setCurrentView("profile")}
                  className="absolute top-4 left-4 text-white hover:text-indigo-200 transition-colors"
                  disabled={isLoading}
                  aria-label="Go back"
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
      )}
    </AnimatePresence>
  );
}