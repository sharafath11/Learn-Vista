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
            Listen carefully and submit your answer.
          </p>
        </div>
      </div>

      {/* AUDIO ONLY (NO TEXT FALLBACK) */}
      <div className={disabled ? "opacity-60 pointer-events-none" : ""}>
        <audio
          controls
          src={audioUrl}
          className="w-full max-w-md"
        />
      </div>

      {/* ANSWER INPUT ONLY */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="Type your answer..."
        className="w-full p-3 border rounded-lg
                   focus:ring-2 focus:ring-blue-500
                   disabled:bg-gray-100"
      />

    </div>
  );
}
