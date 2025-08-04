import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/src/components/shared/components/ui/dialog";
import { Button } from "@/src/components/shared/components/ui/button";
import { CheckCircle2, XCircle } from 'lucide-react';
import { EvaluatedAnswer } from '@/src/types/lessons';

interface ReportModalProps {
  report: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ReportModal({ report, isOpen, onClose }: ReportModalProps) {
  if (!report) return null;

  const cleaned = report
    .replace(/^```json\s*/, '')
    .replace(/\s*```$/, '')
    .trim();

  const truncateAfterJsonArray = (str: string) => {
    const lastIndex = str.lastIndexOf("]");
    if (lastIndex !== -1) {
      return str.slice(0, lastIndex + 1);
    }
    return str;
  };

  const cleanedTruncated = truncateAfterJsonArray(cleaned);
  let parsedReport: EvaluatedAnswer[] = [];

  try {
    parsedReport = JSON.parse(cleanedTruncated);
  } catch (err) {
    return <p>Failed to load report.</p>;
  }

  const processedReport = parsedReport.map(qa => {
    if (qa.type === 'mcq' && qa.isCorrect) {
      return {
        ...qa,
        marks: 10,
        feedback: undefined,
      };
    }
    return qa;
  });

  const totalMarksPossible = processedReport.length * 10;
  const totalMarksObtained = processedReport.reduce((sum, qa) => sum + qa.marks, 0);
  const overallPercentage = totalMarksPossible > 0 ? (totalMarksObtained / totalMarksPossible) * 100 : 0;
  const correctAnswersCount = processedReport.filter(qa => qa.isCorrect).length;


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] p-6 bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b border-gray-200">
          <DialogTitle className="text-3xl font-bold text-gray-900">Lesson Report</DialogTitle>
          <DialogDescription className="text-gray-600 mt-2">
            Detailed breakdown of your performance in this lesson.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 flex flex-col items-center justify-center">
              <span className="text-blue-800 text-sm font-semibold">Overall Score</span>
              <span className="text-blue-700 text-4xl font-extrabold mt-2">{overallPercentage.toFixed(1)}%</span>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-100 flex flex-col items-center justify-center">
              <span className="text-green-800 text-sm font-semibold">Correct Answers</span>
              <span className="text-green-700 text-4xl font-extrabold mt-2">{correctAnswersCount} / {parsedReport.length}</span>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 border-b pb-2">Your Answers</h3>
            {processedReport.length > 0 ? (
              processedReport.map((qa, index) => (
                <div key={index} className="p-5 bg-gray-50 rounded-lg border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-800">
                      {qa.type === 'theory' ? 'Theory Question' :
                       qa.type === 'practical' ? 'Coding Challenge' :
                       qa.type === 'mcq' ? 'Multiple Choice Question' :
                       'Question'}:
                    </span>
                    <span className={`flex items-center font-medium ${qa.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                      {qa.isCorrect ? <CheckCircle2 className="h-4 w-4 mr-1" /> : <XCircle className="h-4 w-4 mr-1" />}
                      {qa.isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>
                  <p className="text-gray-800 mb-2 font-medium">{qa.question}</p>
                  <div className="bg-white p-3 rounded-md border border-gray-200 text-gray-700">
                    <p className="font-semibold text-sm mb-1">Your Answer:</p>
                    <p className="whitespace-pre-wrap text-sm">
                      {Array.isArray(qa.studentAnswer)
                        ? qa.studentAnswer.join(', ')
                        : qa.studentAnswer || qa.answer || "No answer provided"}
                    </p>
                  </div>
                  {qa.feedback && (
                    <div className="mt-3 bg-yellow-50 p-3 rounded-md border border-yellow-100 text-yellow-800 text-sm">
                      <p className="font-semibold mb-1">Feedback:</p>
                      <p className="whitespace-pre-wrap">{qa.feedback}</p>
                    </div>
                  )}
                  <div className="mt-3 text-right">
                    <span className="text-sm font-semibold text-gray-700">Marks: </span>
                    <span className="text-lg font-bold text-[#8525FF]">{qa.marks}/10</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No detailed report available.</p>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button onClick={onClose} className="px-6 py-2 bg-[#8525FF] hover:bg-purple-700 text-white">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}