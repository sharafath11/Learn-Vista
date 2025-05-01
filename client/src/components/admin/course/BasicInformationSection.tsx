import React, { useEffect, useState } from "react";
import { ICourseFormData } from "@/src/types/adminTypes";
import { useAdminContext } from "@/src/context/adminContext";


interface BasicInformationSectionProps {
  formData: ICourseFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export const BasicInformationSection: React.FC<BasicInformationSectionProps> = ({ formData, handleChange }) => {
  const { mentors } = useAdminContext();
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-800">Basic Information</h2>

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Course Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-200 focus:border-sky-400 focus:outline-none transition"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-200 focus:border-sky-400 focus:outline-none transition"
          required
        />
      </div>

      <div>
        <label htmlFor="mentorName" className="block text-sm font-medium text-gray-700">Mentor Name</label>
        <select
          id="mentorName"
          name="mentorName"
          value={formData.mentorName}
          onChange={handleChange}
          className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-200 focus:border-sky-400 focus:outline-none transition"
          required
        >
          <option value="">Select a mentor</option>
          {mentors.map((mentor) => (
              <option key={mentor.username} value={mentor.username}>{mentor.username} {mentor.expertise.map((ex) => <span>{ex }</span>)}</option>
          ))}
        </select>
      </div>
    </div>
  );
};
