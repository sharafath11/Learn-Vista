"use client";

import { ListeningTaskProps } from "@/src/types/dailyTaskTypes";
import { Headphones } from "lucide-react";
export function ListeningTask({
  audioUrl,
  value,
  onChange,
  disabled = false,
}: ListeningTaskProps) {
  return (
    <div className="space-y-5">
      {/* HEADER */}
<div className="border-b pb-2 flex items-start gap-2">
  <Headphones className="h-5 w-5 text-green-600 mt-0.5" />
  <div>
    <h3 className="text-base font-semibold text-gray-800">
      Listening Task
    </h3>
    <p className="text-xs text-gray-500">
      Listen to the audio carefully and answer the question below.
    </p>
  </div>
</div>


      {/* AUDIO */}
      <div
        className={`flex items-center justify-center ${
          disabled ? "opacity-60 pointer-events-none" : ""
        }`}
      >
        <audio
          controls
          src={audioUrl}
          className="w-full max-w-md"
        />
      </div>

      {/* ANSWER INPUT */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Your Answer
        </label>

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="w-full p-3 border border-gray-300 rounded-lg
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     disabled:bg-gray-100 disabled:cursor-not-allowed"
          placeholder="Type your answer here..."
        />
      </div>

      {/* INFO */}
      <p className="text-xs text-gray-500 italic">
        This is a listening comprehension task. Audio will not be transcribed.
      </p>
    </div>
  );
}
