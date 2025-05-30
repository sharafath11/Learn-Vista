"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, BookOpen, Code, GraduationCap, Info } from "lucide-react";
import { QuestionModal } from "../QuestionModal";
import { IQuestions, qustionType } from "@/src/types/lessons";
import { MentorAPIMethods } from "@/src/services/APImethods";
import { showErrorToast, showInfoToast, showSuccessToast } from "@/src/utils/Toast";
import { useParams } from "next/navigation";
import { isValidQuestion } from "@/src/validations/mentorValidation";

export default function MentorQuestionManagePage() {
  const [questions, setQuestions] = useState<IQuestions[] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<IQuestions | null>(null);
  const [currentTab, setCurrentTab] = useState<qustionType>("theory");
  const params = useParams();
  const lessonId = params.lessonId as string;

  useEffect(() => {
    fetchQuestions();
  }, [lessonId]);

  const fetchQuestions = async () => {
    const res = await MentorAPIMethods.getQustion(lessonId);
    if (res.ok) {
      setQuestions(res.data || []); 
    } else {
      showErrorToast(res.error || "Failed to fetch questions");
      setQuestions([]); 
    }
  };
  const theoryQuestions = useMemo(() => {
    return questions?.filter((q) => q.type === "theory") || [];
  }, [questions]);

  const practicalQuestions = useMemo(() => {
    return questions?.filter((q) => q.type === "practical") || [];
  }, [questions]);

  const totalQuestionsCount = questions?.length || 0;
  const hasNoQuestions = totalQuestionsCount === 0;
  const handleAddQuestion = (type: qustionType) => {
    setEditingQuestion(null); 
    setCurrentTab(type);
    setModalOpen(true);
  };

  const handleEditQuestion = (question: IQuestions, type: qustionType) => {
    setEditingQuestion(question);
    setCurrentTab(type);
    setModalOpen(true);
  };
  const handleSaveQuestion = async (
    questionData: Omit<IQuestions, "id" | "isCompleted" | "lessonId"> 
  ) => {
    if (questions === null) {
        showErrorToast("Questions data not loaded. Cannot save question.");
        return;
    }
    const isValid = isValidQuestion(questionData);
if (!isValid) return;

    let res;
    if (editingQuestion) {
      const updatedQuestion: IQuestions = {
        ...editingQuestion,
        question: questionData.question, 
        type: questionData.type, 
      };
      res = await MentorAPIMethods.editQustion(editingQuestion.id, updatedQuestion);
    } else {

      const newQuestionPayload: Omit<IQuestions, "id" | "isCompleted"> = {
        ...questionData,
        lessonId: lessonId, 
       
      };
      res = await MentorAPIMethods.addQustion(newQuestionPayload);
    }

    if (res.ok) {
      await fetchQuestions(); 
      setModalOpen(false);
      setEditingQuestion(null);
      showSuccessToast(res.msg);
    } else {
      showErrorToast(res.error || `Failed to ${editingQuestion ? "edit" : "add"} question.`);
    }
  };


  if (questions === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center text-slate-500">
        Loading questions...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-900/30 rounded-lg">
              <GraduationCap className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-100">Mentor Dashboard</h1>
              <p className="text-slate-400 text-lg">
                Manage questions for Lesson ****
              </p>
            </div>
          </div>
        </div>

        {hasNoQuestions && (
          <Card className="border-dashed border-2 border-slate-700 shadow-none bg-slate-800/50 backdrop-blur-sm mb-8">
            <CardContent className="p-12 text-center flex flex-col items-center justify-center">
              <Info className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-slate-100 mb-2">
                No Questions Added for This Lesson Yet!
              </h3>
              <p className="text-slate-400 mb-6 max-w-md">
                It looks like this lesson is empty. Start by adding your first theory or practical question.
              </p>
              <div className="flex gap-4">
                <Button onClick={() => handleAddQuestion("theory")} className="px-6 py-3">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Theory Question
                </Button>
                <Button onClick={() => handleAddQuestion("practical")} className="px-6 py-3">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Practical Question
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {!hasNoQuestions && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-0 shadow-lg bg-slate-800/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Theory Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-100">{theoryQuestions.length}</div>
                <div className="text-sm text-slate-400">Total questions</div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-slate-800/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  Practical Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-100">{practicalQuestions.length}</div>
                <div className="text-sm text-slate-400">Total questions</div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-slate-800/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-400">Total Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-100">
                  {totalQuestionsCount}
                </div>
                <div className="text-sm text-slate-400">All questions</div>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="theory" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="theory" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Theory Questions
            </TabsTrigger>
            <TabsTrigger value="practical" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              Practical Questions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="theory" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-slate-100">Theory Questions</h2>
              <Button onClick={() => handleAddQuestion("theory")} className="flex items-center gap-2">
                <Plus className="w-4 h-4 mr-2" />
                Add Theory Question
              </Button>
            </div>

            <div className="grid gap-4">
              {theoryQuestions.length > 0 ? (
                theoryQuestions.map((question, index) => (
                  <Card
                    key={question.id}
                    className="border-0 shadow-md hover:shadow-lg transition-shadow bg-slate-800"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="w-8 h-8 bg-blue-900/30 rounded-full flex items-center justify-center text-sm font-medium text-blue-400 mt-1">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="text-slate-100 leading-relaxed">{question.question}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditQuestion(question, "theory")}
                          className="flex items-center gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="border-0 shadow-md bg-slate-800">
                  <CardContent className="p-12 text-center">
                    <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-100 mb-2">
                      No theory questions yet
                    </h3>
                    <p className="text-slate-400 mb-4">
                      Create your first theory question to get started.
                    </p>
                    <Button onClick={() => handleAddQuestion("theory")}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Theory Question
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="practical" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-slate-100">Practical Questions</h2>
              <Button onClick={() => handleAddQuestion("practical")} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Practical Question
              </Button>
            </div>

            <div className="grid gap-4">
              {practicalQuestions.length > 0 ? (
                practicalQuestions.map((question, index) => (
                  <Card
                    key={question.id}
                    className="border-0 shadow-md hover:shadow-lg transition-shadow bg-slate-800"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="w-8 h-8 bg-green-900/30 rounded-full flex items-center justify-center text-sm font-medium text-green-400 mt-1">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="text-slate-100 leading-relaxed">{question.question}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditQuestion(question, "practical")}
                          className="flex items-center gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="border-0 shadow-md bg-slate-800">
                  <CardContent className="p-12 text-center">
                    <Code className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-100 mb-2">
                      No practical questions yet
                    </h3>
                    <p className="text-slate-400 mb-4">
                      Create your first practical question to get started.
                    </p>
                    <Button onClick={() => handleAddQuestion("practical")}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Practical Question
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <QuestionModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          question={editingQuestion} 
          type={currentTab}
          onSave={handleSaveQuestion}
        />
      </div>
    </div>
  );
}