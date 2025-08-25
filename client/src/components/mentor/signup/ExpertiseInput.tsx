"use client"
import { useState } from "react";
import type { IMentorSignupData } from "@/src/types/mentorTypes";

type ExpertiseInputProps = {
  mentorData: IMentorSignupData;
  onAddExpertise: (expertise: string[]) => void;
  onRemoveExpertise: (index: number) => void;
};

export const ExpertiseInput = ({
  mentorData,
  onAddExpertise,
  onRemoveExpertise
}: ExpertiseInputProps) => {
  const [expertiseInput, setExpertiseInput] = useState("");

  const handleAddExpertise = () => {
    if (expertiseInput.trim()) {
      const newExpertise = expertiseInput
        .split(',')
        .map(item => item.trim())
        .filter(item => item);
      onAddExpertise(newExpertise);
      setExpertiseInput("");
    }
  };

  return (
    <div className="mb-2">
      <label htmlFor="expertise" className="block text-sm font-medium text-gray-700">
        Expertise (Add comma-separated skills)
      </label>
      <div className="flex mt-1">
        <input
          type="text"
          id="expertise"
          name="expertise"
          value={expertiseInput}
          onChange={(e) => setExpertiseInput(e.target.value)}
          className="block w-full rounded-l-lg border border-gray-300 p-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100 transition-colors"
          placeholder="e.g. React, Node.js, UI/UX"
        />
        <button
          type="button"
          onClick={handleAddExpertise}
          className="rounded-r-lg bg-purple-600 px-3 text-white hover:bg-purple-700 transition-colors"
        >
          Add
        </button>
      </div>
      {mentorData.expertise && mentorData.expertise.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {mentorData.expertise.map((skill, index) => (
            <div 
              key={index} 
              className="flex items-center bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full"
            >
              {skill}
              <button
                type="button"
                onClick={() => onRemoveExpertise(index)}
                className="ml-1 text-purple-500 hover:text-purple-700"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};