"use client";
import React, { useState } from "react";
import { Button } from "@/src/components/shared/components/ui/button";
import { ArrowLeft, Mic, BookOpen } from "lucide-react";
import DonationComponent from "@/src/components/user/donation/Donation";
import VoiceNoteModal from "@/src/components/user/sessions/VoiceNoteModal";
import { useRouter } from "next/navigation"; 
import { useUserContext } from "@/src/context/userAuthContext";
import { ILessonHeaderProps } from "@/src/types/userProps";



const LessonHeader: React.FC<ILessonHeaderProps> = ({
  lesson,
  report,
  allSectionsCompleted,
  onBack,
  onViewReport,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {allCourses}=useUserContext()
  const router = useRouter();
  const handleViewNotes = () => {
    router.push(`/user/note/${lesson.id}`);
  };
  const courseName=allCourses.filter((i)=>i.id===lesson.courseId)
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
        courseName={courseName[0].title ?? "Unknown Course"}
        lessonName={lesson.title}
        lesson={lesson}
      />
    </div>
  );
};

export default LessonHeader;
