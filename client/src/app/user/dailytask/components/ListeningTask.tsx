"use client";

interface ListeningTaskProps {
  audioUrl: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function ListeningTask({
  audioUrl,
  value,
  onChange,
  disabled = false,
}: ListeningTaskProps) {
  return (
    <div className="space-y-4">
      {/* AUDIO PLAYER */}
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

      {/* TEXT RESPONSE */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Response:
        </label>

        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="w-full h-32 p-3 border border-gray-300 rounded-lg
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     disabled:bg-gray-100 disabled:cursor-not-allowed"
          placeholder="Type what you heard or understood..."
        />
      </div>

      <p className="text-xs text-gray-500 italic">
        Listen to the audio above and write your response.
      </p>
    </div>
  );
}
