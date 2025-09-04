"use client";
import React, { useState } from "react";
import { Button } from "@/src/components/shared/components/ui/button";
import { ArrowLeft, Mic, BookOpen } from "lucide-react";
import DonationComponent from "@/src/components/user/donation/Donation";
import { ILessons } from "@/src/types/lessons";
import { EvaluatedAnswer } from "@/src/types/lessons";
import VoiceNoteModal from "@/src/components/user/sessions/VoiceNoteModal";
import { useRouter } from "next/navigation"; 

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const handleViewNotes = () => {
    router.push(`/user/note/${lesson.id}`);
  };

  return (
    <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
      <Button
        variant="outline"
        onClick={onBack}
        className="flex items-center gap-2 bg-transparent"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Lessons
      </Button>

      <h1 className="text-2xl font-bold text-gray-800 dark:text-white text-center flex-1">
        Lesson {lesson.order}: {lesson.title}
      </h1>

      <div className="flex items-center gap-3">
        {allSectionsCompleted && report ? (
          <Button
            onClick={onViewReport}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            View Report
          </Button>
        ) : (
          <DonationComponent />
        )}
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
        >
          <Mic className="h-4 w-4" />
          Add Voice Note
        </Button>
        <Button
          onClick={handleViewNotes}
          className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
        >
          <BookOpen className="h-4 w-4" />
          View My Notes
        </Button>
      </div>

      {/* Voice Note Modal */}
      <VoiceNoteModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        courseName={lesson.courseId ?? "Unknown Course"}
        lessonName={lesson.title}
        lesson={lesson}
      />
    </div>
  );
};

export default LessonHeader;
