"use client";

import { UserAPIMethods } from "@/src/services/methods/user.api";
import { MentorApplyFormData } from "@/src/types/authTypes";
import { showSuccessToast } from "@/src/utils/Toast";
import { validateMentorApplyForm } from "@/src/validations/validation";
import { GraduationCap, X, Loader2, Github, Linkedin, Globe, Link2 } from "lucide-react";
import { useRef, useState, useCallback, useMemo } from "react";
import { WithTooltip } from "@/src/hooks/UseTooltipProps";

const PLATFORM_ICONS = {
  LinkedIn: <Linkedin className="h-4 w-4" />,
  GitHub: <Github className="h-4 w-4" />,
  Portfolio: <Globe className="h-4 w-4" />,
  default: <Link2 className="h-4 w-4" />
};

export default function MentorCard() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [expertiseInput, setExpertiseInput] = useState("");
  const [socialLinkInput, setSocialLinkInput] = useState({ platform: "LinkedIn", url: "" });
  const [formData, setFormData] = useState<MentorApplyFormData>({
    username: "",
    email: "",
    phoneNumber: "",
    expertise: [],
    socialLinks: []
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    file: "",
    socialLink: ""
  });

  const resetForm = useCallback(() => {
    setIsSubmitted(false);
    setIsLoading(false);
    setSelectedFile(null);
    setExpertiseInput("");
    setSocialLinkInput({ platform: "LinkedIn", url: "" });
    setFormData({ username: "", email: "", phoneNumber: "", expertise: [], socialLinks: [] });
    setErrors({ name: "", email: "", phoneNumber: "", file: "", socialLink: "" });
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const openModal = useCallback(() => {
    resetForm();
    dialogRef.current?.showModal();
  }, [resetForm]);

  const closeModal = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
      setErrors(prev => ({ ...prev, file: "" }));
    }
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  }, []);

  const handleExpertiseAdd = useCallback(() => {
    const trimmed = expertiseInput.trim();
    if (trimmed && !formData.expertise.includes(trimmed)) {
      setFormData(prev => ({ ...prev, expertise: [...prev.expertise, trimmed] }));
      setExpertiseInput("");
    }
  }, [expertiseInput, formData.expertise]);

  const handleExpertiseKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleExpertiseAdd();
    }
  }, [handleExpertiseAdd]);

  const removeExpertise = useCallback((item: string) => {
    setFormData(prev => ({ ...prev, expertise: prev.expertise.filter(e => e !== item) }));
  }, []);

  const handleSocialLinkAdd = useCallback(() => {
    const { platform, url } = socialLinkInput;
    if (!url.trim()) {
      setErrors(prev => ({ ...prev, socialLink: "URL is required" }));
      return;
    }
    try {
      new URL(url);
    } catch {
      setErrors(prev => ({ ...prev, socialLink: "Please enter a valid URL" }));
      return;
    }
    setFormData(prev => ({ ...prev, socialLinks: [...prev.socialLinks, { platform, url }] }));
    setSocialLinkInput(prev => ({ ...prev, url: "" }));
    setErrors(prev => ({ ...prev, socialLink: "" }));
  }, [socialLinkInput]);

  const removeSocialLink = useCallback((index: number) => {
    setFormData(prev => ({ 
      ...prev, 
      socialLinks: prev.socialLinks.filter((_, i) => i !== index) 
    }));
  }, []);

  const removeFile = useCallback(() => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setErrors(prev => ({ ...prev, file: "" }));
  }, []);

  const getPlatformIcon = useCallback((platform: string) => {
    return PLATFORM_ICONS[platform as keyof typeof PLATFORM_ICONS] || PLATFORM_ICONS.default;
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    const { isValid, errors } = validateMentorApplyForm(formData, selectedFile);
    if (!isValid) {
      setErrors(errors);
      return;
    }

    setIsLoading(true);
    const formDataToSend = new FormData();
    formDataToSend.append("username", formData.username);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("phoneNumber", formData.phoneNumber);
    if (selectedFile) formDataToSend.append("cv", selectedFile);
    formDataToSend.append("expertise", JSON.stringify(formData.expertise));
    formDataToSend.append("socialLinks", JSON.stringify(formData.socialLinks));

    const res = await UserAPIMethods.applyMentor(formDataToSend);

    if (res?.ok) {
      setIsSubmitted(true);
      closeModal();
      showSuccessToast(`We'll contact you at ${formData.email}`);
    }

    setIsLoading(false);
  }, [formData, selectedFile, closeModal]);

  const isFormDisabled = useMemo(() => isLoading || isSubmitted, [isLoading, isSubmitted]);

  return (
    <>
      {/* Mentor Card */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-sm p-6 text-white">
        <div className="flex items-start">
          <div className="bg-white/20 p-2 rounded-lg mr-4">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-medium mb-2">Become a Mentor</h3>
            <p className="text-sm text-indigo-100 mb-4">
              Share your knowledge and help others learn while earning.
            </p>
            <WithTooltip content="Click to apply and become a mentor">
              <button
                className="w-full py-2 px-4 bg-white text-indigo-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                onClick={openModal}
              >
                Become a mentor
              </button>
            </WithTooltip>
          </div>
        </div>
      </div>

      {/* Modal */}
      <dialog ref={dialogRef} className="rounded-lg shadow-xl p-0 w-full max-w-md backdrop:bg-black/50">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Apply to Become a Mentor</h3>
            <button onClick={closeModal} disabled={isLoading} className="disabled:opacity-50">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">

              {/* Name */}
              <WithTooltip content="Enter your full legal name">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium mb-1">Full Name</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    disabled={isFormDisabled}
                    className={`w-full px-3 py-2 border rounded-md ${errors.name ? "border-red-500" : "border-gray-300"} ${isLoading ? "bg-gray-100" : ""}`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>
              </WithTooltip>

              {/* Email */}
              <WithTooltip content="Enter a valid email address">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={isFormDisabled}
                    className={`w-full px-3 py-2 border rounded-md ${errors.email ? "border-red-500" : "border-gray-300"} ${isLoading ? "bg-gray-100" : ""}`}
                    placeholder="Enter your email"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>
              </WithTooltip>

              {/* Phone */}
              <WithTooltip content="Enter your phone number for contact purposes">
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium mb-1">Phone Number</label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    disabled={isFormDisabled}
                    className={`w-full px-3 py-2 border rounded-md ${errors.phoneNumber ? "border-red-500" : "border-gray-300"} ${isLoading ? "bg-gray-100" : ""}`}
                    placeholder="Enter your phone number"
                  />
                  {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>}
                </div>
              </WithTooltip>

              {/* Expertise, Social Links, CV upload */}
              {/* Wrap with WithTooltip as needed, e.g.: */}
              {/* <WithTooltip content="Add your skills"> ... </WithTooltip> */}

            </div>

            <WithTooltip content="Submit your mentor application">
              <button
                type="submit"
                className="mt-6 w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
                disabled={isFormDisabled}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" /> Submitting...
                  </span>
                ) : isSubmitted ? "Submitted" : "Submit Application"}
              </button>
            </WithTooltip>
          </form>
        </div>
      </dialog>
    </>
  );
}
