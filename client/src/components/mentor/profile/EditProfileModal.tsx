"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, Mail, Lock, User, Camera, CheckCircle, Loader2, Edit } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MentorAPIMethods } from "@/src/services/methods/mentor.api";
import { showSuccessToast, showErrorToast } from "@/src/utils/Toast";
import { useMentorContext } from "@/src/context/mentorContext";
import { validateMentorProfile } from "@/src/validations/mentorValidation";
import { Button } from "@/src/components/shared/components/ui/button";
import { Input } from "@/src/components/shared/components/ui/input";
import { Textarea } from "@/src/components/shared/components/ui/textarea";
import { Card, CardHeader, CardContent } from "@/src/components/shared/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/src/components/shared/components/ui/avatar";
import { cn } from "@/lib/utils"; //Added

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

export default function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
  const { mentor, setMentor } = useMentorContext();
  const [name, setName] = useState(mentor?.username || "");
  const [bio, setBio] = useState(mentor?.bio || "");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<View>("profile");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
    const [expertise, setExpertise] = useState<string[]>(mentor?.expertise || []); // Added state for expertise
  const [newExpertise, setNewExpertise] = useState(""); // Added state for new expertise input

  const resetState = useCallback(() => {
    setName(mentor?.username || "");
    setBio(mentor?.bio || "");
    setCurrentView("profile");
    setSelectedImage(null);
    setImagePreview(null);
    setIsLoading(false);
        setExpertise(mentor?.expertise || []); // Reset expertise
        setNewExpertise("");
  }, [mentor?.username, mentor?.bio, mentor?.expertise]);

  useEffect(() => {
    if (isOpen) resetState();
  }, [isOpen, resetState]);

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

    const handleAddExpertise = () => {
        if (newExpertise.trim() && !expertise.includes(newExpertise.trim())) {
            setExpertise([...expertise, newExpertise.trim()]);
            setNewExpertise("");
        }
    };

    const handleRemoveExpertise = (expert: string) => {  
        setExpertise(expertise.filter(e => e !== expert));
    };

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
    
    const validationResult = validateMentorProfile({ 
      username: name, 
      bio, 
      image: selectedImage,
    });
    
    if (!validationResult) return;
    
    setIsLoading(true);
    
      const formData = new FormData();
      formData.append("username", name);
      formData.append("bio", bio);
        formData.append("expertise", JSON.stringify(expertise)); // Send expertise as JSON string
      if (selectedImage) formData.append("image", selectedImage);
    
      const res = await MentorAPIMethods.editProfile(formData);
      
      if (res.ok) {
        setMentor(prev => prev ? { 
          ...prev, 
          username: res.data.username, 
          bio: res.data.bio,
          profilePicture: res.data.image,
                    expertise: res.data.expertise
        } : null);
        showSuccessToast(res.msg);
        onClose();
      } else {
        showErrorToast(res.msg );
      }
    setIsLoading(false);
    
  }, [name, bio, selectedImage, mentor, setMentor, onClose, expertise]);

  if (!isOpen || !mentor) return null;

  const views: Record<View, React.ReactNode> = {
    profile: (
      <Card className="max-h-[600px] overflow-y-auto"> {/* Added max-h and overflow-y */}
        <CardHeader className="flex flex-col items-center">
          <div className="relative group">
            <Avatar className="h-28 w-28 border-4 border-white">
              {imagePreview ? (
                <AvatarImage src={imagePreview} alt="Preview" />
              ) : mentor.profilePicture ? (
                <AvatarImage src={mentor.profilePicture} alt="Profile" />
              ) : (
                <AvatarFallback className="bg-gradient-to-br from-indigo-100 to-purple-100">
                  <User size={48} className="text-indigo-400" />
                </AvatarFallback>
              )}
            </Avatar>
            <div 
              className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full"
              onClick={() => fileInputRef.current?.click()}
            >
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
          <Button 
            variant="link" 
            className="mt-3 text-indigo-600 hover:text-indigo-800"
            onClick={() => fileInputRef.current?.click()}
          >
            Change Profile Photo
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your username"
              className="pl-10"
            />
          </div>
          
          <div className="relative">
            <Edit className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              className="pl-10 min-h-[100px]"
            />
          </div>
          
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              value={maskEmail(mentor.email)}
              readOnly
              className="pl-10 bg-gray-100 cursor-not-allowed"
            />
          </div>

            {/* Expertise Section */}
            <div>
                <h4 className="font-semibold text-gray-700 mb-2">Expertise</h4>
                <div className="flex flex-wrap gap-2 mb-2">
                    {expertise.map(exp => (
                        <div
                            key={exp}
                            className={cn(
                                "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                                "bg-indigo-100 text-indigo-800",
                                "border border-indigo-300",
                                "mr-2"
                            )}
                        >
                            {exp}
                            <button
                                type="button"
                                onClick={() => handleRemoveExpertise(exp)}
                                className="inline-flex items-center justify-center w-4 h-4 ml-2 text-indigo-500 hover:text-indigo-700"
                            >
                                <X className="h-3 w-3" />
                                <span className="sr-only">Remove</span>
                            </button>
                        </div>
                    ))}
                </div>
                <div className="flex flex-col sm:flex-row items-end gap-2">
                    <Input
                        value={newExpertise}
                        onChange={(e) => setNewExpertise(e.target.value)}
                        placeholder="Add expertise"
                        className="flex-1"
                    />
                    <Button
                        type="button"
                        onClick={handleAddExpertise}
                        disabled={!newExpertise.trim()}
                        className="w-full sm:w-auto"
                    >
                        Add
                    </Button>
                </div>
            </div>

          <Button 
            variant="link" 
            className="w-full text-red-600 hover:text-red-800 p-0 justify-start"
            onClick={() => setCurrentView("forgotPassword")}
          >
            Forgot Password?
          </Button>

          <Button 
            onClick={handleSaveChanges} 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </CardContent>
      </Card>
    ),
    forgotPassword: (
      <Card>
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100">
            <Lock size={32} className="text-indigo-600" />
          </div>
          <h3 className="text-lg font-medium">Reset your password</h3>
          <p className="text-sm text-gray-500">
            We'll send a password reset link to your email.
          </p>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleForgotPassword} 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send Reset Link
          </Button>
        </CardContent>
      </Card>
    ),
    resetSent: (
      <Card>
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h3 className="text-lg font-semibold">Reset Link Sent!</h3>
          <p className="text-sm text-gray-600">
            Please check your email for a link to reset your password.
          </p>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={onClose} 
            className="w-full bg-green-600 hover:bg-green-700"
          >
            Close
          </Button>
        </CardContent>
      </Card>
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
            className="relative w-full max-w-md max-h-[80vh] overflow-y-auto" // Added max-h and overflow-y to the modal container
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="absolute top-2 right-2 z-10 text-gray-400 hover:text-gray-600"
              disabled={isLoading}
            >
              <X size={20} />
            </Button>

            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white rounded-t-lg">
              {currentView !== "profile" && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentView("profile")}
                  className="absolute top-2 left-2 text-white hover:text-indigo-200"
                  disabled={isLoading}
                >
                  <ChevronLeft size={20} />
                </Button>
              )}
              <h2 className="text-2xl font-bold text-center">
                {currentView === "profile" ? "Edit Profile" : 
                 currentView === "forgotPassword" ? "Reset Password" : "Check Your Email"}
              </h2>
            </div>

            {views[currentView]}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

