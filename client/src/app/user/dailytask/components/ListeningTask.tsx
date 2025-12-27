"use client";

import { useEffect, useState } from "react";
import { ListeningTaskProps } from "@/src/types/dailyTaskTypes";
import { Play, Square } from "lucide-react";

export function ListeningTask({
  audioUrl, // TEXT from backend (prompt)
  value,
  onChange,
  disabled = false,
}: ListeningTaskProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    console.log("[ListeningTask] mounted");
    console.log("[ListeningTask] audio text:", audioUrl);
    console.log(
      "[ListeningTask] speechSynthesis supported:",
      "speechSynthesis" in window
    );

    // Chrome voice async load fix
    speechSynthesis.onvoiceschanged = () => {
      console.log(
        "[ListeningTask] voices loaded:",
        speechSynthesis.getVoices()
      );
    };
  }, [audioUrl]);

  const speak = () => {
    if (!audioUrl || typeof audioUrl !== "string") {
      console.error("[ListeningTask] Invalid audio text:", audioUrl);
      return;
    }

    if (!("speechSynthesis" in window)) {
      console.error("[ListeningTask] SpeechSynthesis not supported");
      return;
    }

    const voices = speechSynthesis.getVoices();
    if (!voices.length) {
      console.warn("[ListeningTask] Voices not ready yet");
      return;
    }

    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(audioUrl);
    utterance.voice = voices[0];
    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onstart = () => {
      console.log("[ListeningTask] speech started");
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      console.log("[ListeningTask] speech ended");
      setIsSpeaking(false);
    };

    utterance.onerror = (e) => {
      console.error("[ListeningTask] speech error:", e);
      setIsSpeaking(false);
    };

    speechSynthesis.speak(utterance);
  };

  const stop = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <div className="space-y-4">
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
