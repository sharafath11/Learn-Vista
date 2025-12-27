"use client";

import { WritingTaskProps } from "@/src/types/dailyTaskTypes";
import { PenTool } from "lucide-react";



export function WritingTask({ value, onChange }: WritingTaskProps) {
  const wordCount = value
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  return (
    <div className="space-y-5">
      {/* HEADER */}
      <div className="border-b pb-2 flex items-start gap-2">
        <PenTool className="h-5 w-5 text-purple-600 mt-0.5" />
        <div>
          <h3 className="text-base font-semibold text-gray-800">
            Writing Task
          </h3>
          <p className="text-xs text-gray-500">
            Write your response clearly and thoughtfully.
          </p>
        </div>
      </div>

      {/* TEXTAREA */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Your Response
          <span className="text-xs text-gray-500 ml-2">
            {wordCount} words, {value.length} characters
          </span>
        </label>

        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full min-h-[200px] p-4 border border-gray-300 rounded-lg
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
          placeholder="Type your response here..."
        />
      </div>

      {/* HELP TEXT */}
      <p className="text-xs text-gray-500 italic">
        Tip: Write clearly and concisely. Check grammar and spelling before submitting.
      </p>
    </div>
  );
}
