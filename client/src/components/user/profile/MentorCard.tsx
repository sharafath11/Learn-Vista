"use client"

import { postRequest } from "@/src/services/api";
import { MentorApplyFormData } from "@/src/types/authTypes";
import { showSuccessToast, showErrorToast } from "@/src/utils/Toast";
import { validateMentorApplyForm } from "@/src/utils/user/validation";
import { GraduationCap, X, Upload, FileText, Loader2 } from "lucide-react";
import { useRef, useState } from "react";

export default function MentorCard() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<MentorApplyFormData>({
    name: "",
    email: "",
    phoneNumber: ""
  });
  
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    file: ""
  });

  const openModal = () => {
    setIsSubmitted(false);
    setIsLoading(false);
    setSelectedFile(null);
    setFormData({ name: "", email: "", phoneNumber: "" });
    setErrors({ name: "", email: "", phoneNumber: "", file: "" });
    dialogRef.current?.showModal();
  };

  const closeModal = () => {
    dialogRef.current?.close();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setErrors({ ...errors, file: "" });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: "",
    });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { isValid, errors: validationErrors } = validateMentorApplyForm(formData, selectedFile);
  if (!isValid) {
    setErrors(validationErrors);
    return;
  }

    setIsLoading(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phoneNumber', formData.phoneNumber);
      formDataToSend.append('cv', selectedFile||"");

      const res = await postRequest("/apply-mentor", formDataToSend);
     
      if (res?.ok) {
        setIsSubmitted(true);
        showSuccessToast(`We'll contact you at ${formData.email}`);
      } 
    } catch (error) {
      console.error('Submission error:', error);
      showErrorToast("An error occurred during submission");
    } finally {
      setIsLoading(false);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setErrors({ ...errors, file: "" });
  };

  return (
    <>
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
            <button
              className="w-full py-2 px-4 bg-white text-indigo-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              onClick={openModal}
            >
              Become a mentor
            </button>
          </div>
        </div>
      </div>

      <dialog ref={dialogRef} className="rounded-lg shadow-xl p-0 w-full max-w-md backdrop:bg-black/50">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Apply to Become a Mentor</h3>
            <button 
              onClick={closeModal}
              disabled={isLoading}
              className="disabled:opacity-50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  } ${isLoading ? "bg-gray-100" : ""}`}
                  placeholder="Enter your full name"
                  disabled={isLoading || isSubmitted}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } ${isLoading ? "bg-gray-100" : ""}`}
                  placeholder="Enter your email"
                  disabled={isLoading || isSubmitted}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Phone Number Field - NEW */}
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.phoneNumber ? "border-red-500" : "border-gray-300"
                  } ${isLoading ? "bg-gray-100" : ""}`}
                  placeholder="Enter your phone number"
                  disabled={isLoading || isSubmitted}
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
                )}
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Upload Your CV/Resume
                </label>
                {isSubmitted ? (
                  <div className="mt-1 p-4 border-2 border-green-500 rounded-lg bg-green-50">
                    <div className="flex flex-col items-center text-center">
                      <FileText className="h-12 w-12 text-green-500 mb-2" />
                      <p className="font-medium text-green-700">Application Submitted Successfully!</p>
                      <p className="text-sm text-green-600 mt-1">
                        {selectedFile?.name} has been uploaded
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        We'll contact you at {formData.email}
                      </p>
                    </div>
                  </div>
                ) : selectedFile ? (
                  <div className="mt-1 flex items-center justify-between p-3 border-2 border-indigo-300 rounded-lg bg-indigo-50">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-indigo-600 mr-3" />
                      <span className="text-sm font-medium text-indigo-900 truncate max-w-[200px]">
                        {selectedFile.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="text-indigo-600 hover:text-indigo-500 disabled:opacity-50"
                      disabled={isLoading}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg ${
                    errors.file ? "border-red-500" : "border-gray-300"
                  } ${isLoading ? "bg-gray-100" : ""}`}>
                    <div className="space-y-1 text-center">
                      <Upload className={`mx-auto h-8 w-8 ${isLoading ? "text-gray-300" : "text-gray-400"}`} />
                      <div className="flex text-sm text-gray-600 justify-center">
                        <label className={`cursor-pointer rounded-md font-medium ${
                          isLoading ? "text-gray-400" : "text-indigo-600 hover:text-indigo-500"
                        }`}>
                          <span>Upload a file</span>
                          <input
                            ref={fileInputRef}
                            type="file"
                            className="sr-only"
                            onChange={handleFileChange}
                            accept=".pdf,.doc,.docx"
                            disabled={isLoading}
                          />
                        </label>
                        <p className={`pl-1 ${isLoading ? "text-gray-400" : ""}`}>
                          or drag and drop
                        </p>
                      </div>
                      <p className={`text-xs ${isLoading ? "text-gray-400" : "text-gray-500"}`}>
                        PDF, DOCX up to 5MB
                      </p>
                    </div>
                  </div>
                )}
                {errors.file && !isSubmitted && !selectedFile && (
                  <p className="mt-1 text-sm text-red-600">{errors.file}</p>
                )}
              </div>
              
              {/* Form Buttons */}
              <div className="flex justify-end space-x-3 pt-4">
                {!isSubmitted && (
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                )}
                <button
                  type={isSubmitted ? "button" : "submit"}
                  onClick={isSubmitted ? closeModal : undefined}
                  className={`px-4 py-2 text-sm font-medium text-white rounded-md flex items-center justify-center gap-2 ${
                    isSubmitted ? "bg-green-600 hover:bg-green-700" : "bg-indigo-600 hover:bg-indigo-700"
                  } disabled:opacity-70 min-w-[120px]`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : isSubmitted ? (
                    "Close"
                  ) : (
                    "Submit Application"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
}