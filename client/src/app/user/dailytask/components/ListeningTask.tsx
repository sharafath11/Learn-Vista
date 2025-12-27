"use client";

import { ListeningTaskProps } from "@/src/types/dailyTaskTypes";

export function ListeningTask({
  audioUrl,
  value,
  onChange,
  disabled = false,
}: ListeningTaskProps) {
  return (
    <div className="space-y-4">

      {/* AUDIO */}
      {audioUrl ? (
        <audio
          controls
          src={audioUrl}
          className="w-full max-w-md"
        />
      ) : (
        <p className="text-sm text-red-500">
          Audio not available
        </p>
      )}

      {/* ANSWER (single line, NOT textarea) */}
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
