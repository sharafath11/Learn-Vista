"use client";
import React, { useState } from "react";
import { Button } from "@/src/components/shared/components/ui/button";
import { ArrowLeft, Mic, BookOpen } from "lucide-react";
import DonationComponent from "@/src/components/user/donation/Donation";
import VoiceNoteModal from "@/src/components/user/sessions/VoiceNoteModal";
import { useRouter } from "next/navigation"; 
import { useUserContext } from "@/src/context/userAuthContext";
import { ILessonHeaderProps } from "@/src/types/userProps";
import { WithTooltip } from "@/src/hooks/UseTooltipProps";  

const LessonHeader: React.FC<ILessonHeaderProps> = ({
  lesson,
  report,
  allSectionsCompleted,
  onBack,
  onViewReport,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { allCourses } = useUserContext();
  const router = useRouter();

  const handleViewNotes = () => {
    router.push(`/user/note/${lesson.id}`);
  };

  const courseName = allCourses.filter((i) => i.id === lesson.courseId);

  return (
    <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
      {/* Back Button with Tooltip */}
      <WithTooltip content="Return to all lessons in this course">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-2 bg-transparent"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Lessons
        </Button>
      </WithTooltip>

      <h1 className="text-2xl font-bold text-gray-800 dark:text-white text-center flex-1">
        Lesson {lesson.order}: {lesson.title}
      </h1>

      <div className="flex items-center gap-3">
        {allSectionsCompleted && report ? (
          <WithTooltip content="View your lesson report with evaluation details">
            <Button
              onClick={onViewReport}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              View Report
            </Button>
          </WithTooltip>
        ) : (
          <WithTooltip content="Support us with a donation to keep lessons free">
            <DonationComponent />
          </WithTooltip>
        )}

        <WithTooltip content="Record and attach a voice note to this lesson">
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
          >
            <Mic className="h-4 w-4" />
            Add Voice Note
          </Button>
        </WithTooltip>

        <WithTooltip content="View and manage your saved lesson notes">
          <Button
            onClick={handleViewNotes}
            className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
          >
            <BookOpen className="h-4 w-4" />
            View My Notes
          </Button>
        </WithTooltip>
      </div>

      {/* Voice Note Modal */}
      <VoiceNoteModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        courseName={courseName[0].title ?? "Unknown Course"}
        lessonName={lesson.title}
        lesson={lesson}
      />
    </div>
  );
};

export default LessonHeader;
