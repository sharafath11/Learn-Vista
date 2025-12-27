"use client";

import { useEffect, useState } from "react";
import { ListeningTaskProps } from "@/src/types/dailyTaskTypes";
import { Play, Square } from "lucide-react";

export function ListeningTask({
  audioUrl, // this is actually TEXT
  value,
  onChange,
  disabled = false,
}: ListeningTaskProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = () => {
    if (!audioUrl) return;

    // Stop any existing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(audioUrl);
    utterance.rate = 1; // speed (0.5–2)
    utterance.pitch = 1; // voice tone
    utterance.lang = "en-US";

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => window.speechSynthesis.cancel();
  }, []);

  return (
    <div className="space-y-4">

      {/* PLAY / STOP BUTTON */}
      <button
        type="button"
        disabled={disabled}
        onClick={isSpeaking ? stop : speak}
        className="flex items-center gap-2 px-4 py-2 rounded-lg
                   bg-green-600 text-white hover:bg-green-700
                   disabled:opacity-50"
      >
        {isSpeaking ? <Square size={16} /> : <Play size={16} />}
        {isSpeaking ? "Stop Audio" : "Play Audio"}
      </button>

      {/* ANSWER INPUT */}
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
