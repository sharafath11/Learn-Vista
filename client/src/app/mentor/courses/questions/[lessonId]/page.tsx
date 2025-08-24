"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/src/components/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/shared/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/shared/components/ui/tabs";
import { Plus, Edit, BookOpen, Code, GraduationCap, Info, List, CheckCircle } from "lucide-react";
import { QuestionModal } from "../QuestionModal";
import { IQuestions, QuestionType } from "@/src/types/lessons";
import { MentorAPIMethods } from "@/src/services/methods/mentor.api";
import { showErrorToast, showSuccessToast } from "@/src/utils/Toast";
import { useParams } from "next/navigation";
import { isValidQuestion } from "@/src/validations/mentorValidation";

export default function MentorQuestionManagePage() {
  const [questions, setQuestions] = useState<IQuestions[] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<IQuestions | null>(null);
  const [currentTab, setCurrentTab] = useState<QuestionType>("theory");
  const params = useParams();
  const lessonId = params.lessonId as string;
const fetchQuestions = useCallback(async () => {
  const res = await MentorAPIMethods.getQustion(lessonId);
  if (res.ok) {
    setQuestions(res.data || []);
  } else {
    showErrorToast(res.error || "Failed to fetch questions");
    setQuestions([]);
  }
}, [lessonId]); 

useEffect(() => {
  fetchQuestions();
}, [fetchQuestions]);

  

  const questionTypes: QuestionType[] = ["theory", "practical", "mcq"];
  
  const filteredQuestions = (type: QuestionType) => {
    return questions?.filter((q) => q.type === type) || [];
  };

const theoryQuestions = questions?.filter(q => q.type === "theory");
const practicalQuestions = questions?.filter(q => q.type === "practical");
const mcqQuestions = questions?.filter(q => q.type === "mcq");


  const totalQuestionsCount = questions?.length || 0;
  const hasNoQuestions = totalQuestionsCount === 0;

  const handleAddQuestion = (type: QuestionType) => {
    setEditingQuestion(null);
    setCurrentTab(type);
    setModalOpen(true);
  };

  const handleEditQuestion = (question: IQuestions) => {
    setEditingQuestion(question);
    setCurrentTab(question.type);
    setModalOpen(true);
  };

  const handleSaveQuestion = async (
    questionData: Omit<IQuestions, "id" | "isCompleted" | "lessonId">
  ) => {
    if (questions === null) {
      showErrorToast("Questions data not loaded. Cannot save question.");
      return;
    }

    if (!isValidQuestion(questionData)) return;

    let res;
    if (editingQuestion) {
      const updatedQuestion: IQuestions = {
        ...editingQuestion,
        ...questionData,
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

  const renderQuestionCard = (question: IQuestions, index: number) => {
    return (
      <Card key={question.id} className="border-0 shadow-md hover:shadow-lg transition-shadow bg-slate-800">
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mt-1 ${
                question.type === "theory" ? "bg-blue-900/30 text-blue-400" :
                question.type === "practical" ? "bg-green-900/30 text-green-400" :
                "bg-purple-900/30 text-purple-400"
              }`}>
                {index + 1}
              </div>
              <div className="flex-1">
                <p className="text-slate-100 leading-relaxed">{question.question}</p>
                {question.type === "mcq" && question.options && (
                  <div className="mt-3 space-y-2">
                    {question.options.map((option, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                          question.correctAnswer?.includes(option) ? 
                          "bg-emerald-900/30 text-emerald-400" : 
                          "bg-slate-700 text-slate-400"
                        }`}>
                          {String.fromCharCode(65 + i)}
                        </div>
                        <span className={`text-sm ${
                          question.correctAnswer?.includes(option) ? 
                          "text-emerald-300" : "text-slate-400"
                        }`}>
                          {option}
                        </span>
                        {question.correctAnswer?.includes(option) && (
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
           <Button
  variant="ghost"
  size="sm"
  
  onClick={() => handleEditQuestion(question)}
  className="flex items-center gap-2 bg-amber-50"
>
  <Edit className="w-4 h-4" />
  Edit
</Button>

          </div>
        </CardContent>
      </Card>
    );
  };

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

        {hasNoQuestions ? (
          <Card className="border-dashed border-2 border-slate-700 shadow-none bg-slate-800/50 backdrop-blur-sm mb-8">
            <CardContent className="p-12 text-center flex flex-col items-center justify-center">
              <Info className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-slate-100 mb-2">
                No Questions Added for This Lesson Yet!
              </h3>
              <p className="text-slate-400 mb-6 max-w-md">
                It looks like this lesson is empty. Start by adding your first question.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button onClick={() => handleAddQuestion("theory")} className="px-6 py-3">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Add Theory Question
                </Button>
                <Button onClick={() => handleAddQuestion("practical")} className="px-6 py-3">
                  <Code className="w-4 h-4 mr-2" />
                  Add Practical Question
                </Button>
                <Button onClick={() => handleAddQuestion("mcq")} className="px-6 py-3">
                  <List className="w-4 h-4 mr-2" />
                  Add MCQ Question
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-0 shadow-lg bg-slate-800/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Theory Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-100">{theoryQuestions?.length}</div>
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
                <div className="text-2xl font-bold text-slate-100">{practicalQuestions?.length}</div>
                <div className="text-sm text-slate-400">Total questions</div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-slate-800/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                  <List className="w-4 h-4" />
                  MCQ Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-100">{mcqQuestions?.length}</div>
                <div className="text-sm text-slate-400">Total questions</div>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="theory" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger 
              value="theory" 
              className="flex items-center gap-2"
              onClick={() => setCurrentTab("theory")}
            >
              <BookOpen className="w-4 h-4" />
              Theory
            </TabsTrigger>
            <TabsTrigger 
              value="practical" 
              className="flex items-center gap-2"
              onClick={() => setCurrentTab("practical")}
            >
              <Code className="w-4 h-4" />
              Practical
            </TabsTrigger>
            <TabsTrigger 
              value="mcq" 
              className="flex items-center gap-2"
              onClick={() => setCurrentTab("mcq")}
            >
              <List className="w-4 h-4" />
              MCQ
            </TabsTrigger>
          </TabsList>

          {questionTypes.map((type) => (
            <TabsContent key={type.length} value={type} className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-slate-100">
                  {type.charAt(0).toUpperCase() + type.slice(1)} Questions
                </h2>
                <Button 
                  onClick={() => handleAddQuestion(type)}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add {type.charAt(0).toUpperCase() + type.slice(1)} Question
                </Button>
              </div>

              <div className="grid gap-4">
                {filteredQuestions(type).length > 0 ? (
                  filteredQuestions(type).map((question, index) => renderQuestionCard(question, index))
                ) : (
                  <Card className="border-0 shadow-md bg-slate-800">
                    <CardContent className="p-12 text-center">
                      {type === "theory" ? (
                        <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      ) : type === "practical" ? (
                        <Code className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      ) : (
                        <List className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      )}
                      <h3 className="text-lg font-medium text-slate-100 mb-2">
                        No {type} questions yet
                      </h3>
                      <p className="text-slate-400 mb-4">
                        Create your first {type} question to get started.
                      </p>
                      <Button onClick={() => handleAddQuestion(type)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add {type.charAt(0).toUpperCase() + type.slice(1)} Question
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          ))}
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