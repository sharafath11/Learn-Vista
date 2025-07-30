// components/user/sessions/LessonHeader.tsx
import React from 'react';
import { Button } from "@/src/components/shared/components/ui/button";
import { ArrowLeft } from "lucide-react";
import DonationComponent from "@/src/components/user/donation/Donation";
import { ILessons } from "@/src/types/lessons";
import { EvaluatedAnswer } from '@/src/types/lessons'; 

interface LessonHeaderProps {
  lesson: ILessons;
  report: EvaluatedAnswer | null;
  allSectionsCompleted: boolean;
  onBack: () => void;
  onViewReport: () => void;
}

const LessonHeader: React.FC<LessonHeaderProps> = ({
  lesson,
  report,
  allSectionsCompleted,
  onBack,
  onViewReport,
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <Button variant="outline" onClick={onBack} className="flex items-center gap-2 bg-transparent">
        <ArrowLeft className="h-4 w-4" />
        Back to Lessons
      </Button>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
        Lesson {lesson.order}: {lesson.title}
      </h1>
      {allSectionsCompleted && report ? (
        <Button
          onClick={onViewReport}
          className="ml-4 bg-blue-600 hover:bg-blue-700 text-white"
        >
          View Report
        </Button>
      ) : (
        <DonationComponent />
      )}
      {(!allSectionsCompleted || !report) && <div className="w-[120px]"></div>}
    </div>
  );
};

export default LessonHeader;