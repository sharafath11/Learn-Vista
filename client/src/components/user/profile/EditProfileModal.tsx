"use client"

import { useState, useRef, useEffect, useCallback, ChangeEvent, JSX } from "react"
import Image from "next/image"
import { X, Mail, User, Camera, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { UserAPIMethods } from "@/src/services/methods/user.api"
import { useUserContext } from "@/src/context/userAuthContext"
import { showSuccessToast, showErrorToast, showInfoToast } from "@/src/utils/Toast"
import { Input } from "../../shared/components/ui/input"
import { Button } from "../../shared/components/ui/button"
import { IEditProfileModalProps, ViewUserProfile } from "@/src/types/userProps"
import { WithTooltip } from "@/src/hooks/UseTooltipProps"

const maskEmail = (email: string): string => {
  if (!email) return ""
  const [username, domain] = email.split("@")
  if (!username || !domain) return email
  return `${username[0]}${"*".repeat(Math.max(0, username.length - 1))}@${domain}`
}

export default function EditProfileModal({
  isOpen,
  onClose,
  username = "",
  email = "",
}: IEditProfileModalProps) {
  const [name, setName] = useState(username)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [currentView] = useState<ViewUserProfile>("profile")
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { setUser } = useUserContext()

  const resetState = useCallback(() => {
    setName(username)
    setSelectedImage(null)
    setImagePreview(null)
    setIsLoading(false)
  }, [username])

  useEffect(() => {
    if (isOpen) resetState()
  }, [isOpen, resetState])

  const handleImageChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      showErrorToast("Only image files are allowed")
      return
    }

    setSelectedImage(file)
    setImagePreview(URL.createObjectURL(file))
  }, [])

  const handleSaveChanges = useCallback(async () => {
    setIsLoading(true)
    if (name.trim().length < 6) {
      showInfoToast("Username must be at least 6 characters")
      setIsLoading(false)
      return
    }

    try {
      const formData = new FormData()
      formData.append("username", name)
      if (selectedImage) formData.append("image", selectedImage)

      const res = await UserAPIMethods.editProfile(formData)

      if (res.ok) {
        setUser((prev) =>
          prev
            ? {
                ...prev,
                username: res.data.username,
                profilePicture: res.data.image,
              }
            : null,
        )
        showSuccessToast(res.msg)
        onClose()
      }
    } catch {
      showErrorToast("Failed to save changes")
    } finally {
      setIsLoading(false)
    }
  }, [name, selectedImage, setUser, onClose])

  if (!isOpen) return null

  const views: Record<ViewUserProfile, JSX.Element> = {
    profile: (
      <>
        <div className="flex flex-col items-center mb-6">
          <WithTooltip content="Click to upload or change your profile picture">
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
              ) : (
                <div className="flex items-center justify-center h-full w-full bg-gradient-to-br from-indigo-100 to-purple-100">
                  <User size={48} className="text-indigo-400" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={24} className="text-white" />
              </div>
            </div>
          </WithTooltip>

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
          {/* Username with tooltip */}
          <WithTooltip content="Your username must be at least 6 characters">
            <div className="relative">
              <User size={18} className="absolute left-3 top-3 text-gray-400" />
              <Input
                value={name}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                placeholder="Enter your username"
                className="pl-10"
              />
            </div>
          </WithTooltip>

          {/* Email with tooltip */}
          <WithTooltip content="Your email is read-only">
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-3 text-gray-400" />
              <Input
                value={maskEmail(email)}
                readOnly
                className="pl-10 bg-gray-100 cursor-not-allowed"
              />
            </div>
          </WithTooltip>

          {/* Save button */}
          <WithTooltip content="Click to save your profile changes">
            <Button onClick={handleSaveChanges} disabled={isLoading} className="w-full">
              {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Save Changes"}
            </Button>
          </WithTooltip>
        </div>
      </>
    ),
  }

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
            <Button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isLoading}
              aria-label="Close modal"
            >
              <X size={24} />
            </Button>

            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
              <h2 className="text-2xl font-bold text-center">Edit Profile</h2>
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
  )
}
