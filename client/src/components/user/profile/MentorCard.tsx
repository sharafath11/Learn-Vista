"use client"

import { postRequest } from "@/src/services/api";
import { UserAPIMethods } from "@/src/services/APImethods";
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
  const [expertiseInput, setExpertiseInput] = useState("");

  const [formData, setFormData] = useState<MentorApplyFormData>({
    username: "",
    email: "",
    phoneNumber: "",
    expertise: []
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
    setExpertiseInput("");
    setFormData({ username: "", email: "", phoneNumber: "", expertise: [] });
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
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setErrors(prev => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleExpertiseAdd = () => {
    const trimmed = expertiseInput.trim();
    if (trimmed && !formData.expertise.includes(trimmed)) {
      setFormData(prev => ({
        ...prev,
        expertise: [...prev.expertise, trimmed]
      }));
      setExpertiseInput("");
    }
  };

  const handleExpertiseKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleExpertiseAdd();
    }
  };

  const removeExpertise = (item: string) => {
    setFormData(prev => ({
      ...prev,
      expertise: prev.expertise.filter(e => e !== item)
    }));
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
      formDataToSend.append("username", formData.username);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phoneNumber", formData.phoneNumber);
      formDataToSend.append("cv", selectedFile || "");
      formDataToSend.append("expertise", JSON.stringify(formData.expertise));

      const res = await UserAPIMethods.applyMentor(formDataToSend);

      if (res?.ok) {
        setIsSubmitted(true);
        showSuccessToast(`We'll contact you at ${formData.email}`);
      }
    } catch (error) {
      console.error("Submission error:", error);
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
    setErrors(prev => ({ ...prev, file: "" }));
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
            <button onClick={closeModal} disabled={isLoading} className="disabled:opacity-50">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  disabled={isLoading || isSubmitted}
                  className={`w-full px-3 py-2 border rounded-md ${errors.name ? "border-red-500" : "border-gray-300"} ${isLoading ? "bg-gray-100" : ""}`}
                  placeholder="Enter your full name"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLoading || isSubmitted}
                  className={`w-full px-3 py-2 border rounded-md ${errors.email ? "border-red-500" : "border-gray-300"} ${isLoading ? "bg-gray-100" : ""}`}
                  placeholder="Enter your email"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium mb-1">Phone Number</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  disabled={isLoading || isSubmitted}
                  className={`w-full px-3 py-2 border rounded-md ${errors.phoneNumber ? "border-red-500" : "border-gray-300"} ${isLoading ? "bg-gray-100" : ""}`}
                  placeholder="Enter your phone number"
                />
                {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>}
              </div>

              {/* Expertise */}
              <div>
                <label htmlFor="expertise" className="block text-sm font-medium mb-1">Areas of Expertise</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={expertiseInput}
                    onChange={(e) => setExpertiseInput(e.target.value)}
                    onKeyDown={handleExpertiseKeyDown}
                    placeholder="Add expertise and press Enter"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <button
                    type="button"
                    onClick={handleExpertiseAdd}
                    className="bg-indigo-600 text-white px-3 py-2 rounded-md"
                  >
                    Add
                  </button>
                </div>
                {formData.expertise.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.expertise.map((item, idx) => (
                      <span key={idx} className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full flex items-center">
                        {item}
                        <button type="button" onClick={() => removeExpertise(item)} className="ml-1 text-red-500">
                          <X className="h-4 w-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* CV Upload */}
              <div>
                <label className="block text-sm font-medium mb-1">Upload Your CV/Resume</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  disabled={isLoading || isSubmitted}
                  className="w-full text-sm text-gray-500"
                />
                {errors.file && <p className="mt-1 text-sm text-red-600">{errors.file}</p>}
                {selectedFile && (
                  <div className="mt-2 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-green-600" />
                    <span>{selectedFile.name}</span>
                    <button type="button" onClick={removeFile} className="text-red-500">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
              disabled={isLoading || isSubmitted}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" /> Submitting...
                </span>
              ) : isSubmitted ? "Submitted" : "Submit Application"}
            </button>
          </form>
        </div>
      </dialog>
    </>
  );
}
