"use client";

import { useEffect, useState } from "react";
import { ListeningTaskProps } from "@/src/types/dailyTaskTypes";
import { Play, Square } from "lucide-react";

export function ListeningTask({
  audioUrl, // this is TEXT
  value,
  onChange,
  disabled = false,
}: ListeningTaskProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    console.log("ListeningTask mounted");
    console.log("audioUrl value:", audioUrl);
    console.log("speechSynthesis supported:", "speechSynthesis" in window);
  }, [audioUrl]);

  const speak = () => {
    console.log("Play button clicked");

    if (!audioUrl || typeof audioUrl !== "string") {
      alert("audioUrl is empty or invalid");
      console.error("Invalid audioUrl:", audioUrl);
      return;
    }

    if (!("speechSynthesis" in window)) {
      alert("SpeechSynthesis NOT supported in this browser");
      return;
    }

    // Load voices (CRITICAL for Chrome)
    const voices = window.speechSynthesis.getVoices();
    console.log("Available voices:", voices);

    if (!voices.length) {
      alert("Voices not loaded yet. Click Play again.");
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(audioUrl);
    utterance.voice = voices[0]; // force voice
    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onstart = () => {
      console.log("Speech started");
      alert("Audio started");
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      console.log("Speech ended");
      setIsSpeaking(false);
    };

    utterance.onerror = (e) => {
      console.error("Speech error:", e);
      alert("Speech error occurred");
      setIsSpeaking(false);
    };

    console.log("Calling speechSynthesis.speak()");
    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    console.log("Stop button clicked");
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <div className="space-y-4">

      <button
        type="button"
        disabled={disabled}
        onClick={isSpeaking ? stop : speak}
        className="flex items-center gap-2 px-4 py-2 rounded-lg
                   bg-green-600 text-white hover:bg-green-700"
      >
        {isSpeaking ? <Square size={16} /> : <Play size={16} />}
        {isSpeaking ? "Stop Audio" : "Play Audio"}
      </button>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your answer..."
        className="w-full p-3 border rounded-lg"
      />
    </div>
  );
}
