"use client";

import { useEffect, useState } from "react";
import { getRandomUnsplashImage } from "../utils/unsplash";

export default function RouteLoader() {
  const [bgImage, setBgImage] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let progressInterval: NodeJS.Timeout;
    getRandomUnsplashImage().then(setBgImage);
    progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.floor(Math.random() * 8) + 3;
      });
    }, 200);

    return () => clearInterval(progressInterval);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black text-white"
      style={{
        backgroundImage: bgImage
          ? `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${bgImage})`
          : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="text-center">
        {/* Loader Circle */}
        <div className="relative w-24 h-24 mx-auto mb-6">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#ffffff20"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="white"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${progress * 2.83}, 283`}
              transform="rotate(-90 50 50)"
              className="transition-all duration-200 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-xl font-bold">
            {progress}%
          </div>
        </div>

        {/* Text */}
        <h1 className="text-2xl font-bold animate-pulse mb-2">
          Loading Wonders...
        </h1>
        <p className="text-white/80 text-sm">
          {progress < 30 && "Preparing amazing content..."}
          {progress >= 30 && progress < 70 && "Almost there..."}
          {progress >= 70 && "Final touches..."}
        </p>

        {/* Dots */}
        <div className="flex justify-center mt-4 space-x-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-3 h-3 bg-white rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
