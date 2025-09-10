// components/user/sessions/LessonProgressBar.tsx
import React from 'react';
import { Progress } from "@/src/components/shared/components/ui/progress";
import { ILessonProgressBarProps } from '@/src/types/userProps';


const LessonProgressBar: React.FC<ILessonProgressBarProps> = ({ progress }) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Lesson Progress</span>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {Math.round(progress)}%
        </span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};

export default LessonProgressBar;