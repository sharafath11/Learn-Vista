"use client";

interface WritingTaskProps {
  value: string;
  onChange: (value: string) => void;
}

export function WritingTask({ value, onChange }: WritingTaskProps) {
  const wordCount = value.trim().split(/\s+/).filter(word => word.length > 0).length;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Your Response:
          <span className="text-xs text-gray-500 ml-2">
            {wordCount} words, {value.length} characters
          </span>
        </label>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full min-h-[200px] p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
          placeholder="Type your response here..."
        />
      </div>
      
      <div className="text-xs text-gray-500 italic">
        Tip: Write clearly and concisely. Check your grammar and spelling.
      </div>
    </div>
  );
}