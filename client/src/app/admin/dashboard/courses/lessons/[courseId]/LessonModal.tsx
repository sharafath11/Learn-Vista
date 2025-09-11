"use client";

import {
  IAdminLessonModalProps,
  IComment,
  IQuestions,
} from "@/src/types/lessons";
export default function LessonModal({
  open,
  onClose,
  type,
  lesson,
  comments,
  questions,
}: IAdminLessonModalProps) {
  if (!open || !lesson || !type) return null;

  const data =
    type === "comments"
      ? comments.filter((c) => c.lessonId === lesson?.id)
      : questions.filter((q) => q.lessonId === lesson?.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-11/12 md:w-2/3 lg:max-w-xl max-h-[80vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
            {type === "comments" ? "Lesson Comments" : "Lesson Questions"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-x"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="mt-4 flex-1 overflow-y-auto pr-2">
          <p className="text-sm text-gray-500 mb-4">
            Lesson:{" "}
            <span className="font-medium text-gray-900">{lesson?.title}</span>
          </p>
          {data.length > 0 ? (
            <ul className="space-y-3">
              {data.map((item, idx) => (
                <li
                  key={idx}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-3"
                >
                  {type === "comments" ? (
                    <>
                      <div className="text-sm text-gray-800">
                        {(item as IComment).comment}
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        — {(item as IComment).userName}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-sm text-gray-900 font-medium">
                        {(item as IQuestions).question}
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-xs">
                        <span className="inline-block bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full capitalize">
                          {(item as IQuestions).type}
                        </span>
                        {Array.isArray((item as IQuestions).options) &&
                          ((item as IQuestions).options?.length ?? 0) > 0 && (
                            <span className="text-gray-500">
                              Options: {(item as IQuestions).options?.length}
                            </span>
                          )}
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-sm text-gray-500 p-8">
              No {type} available for this lesson.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
