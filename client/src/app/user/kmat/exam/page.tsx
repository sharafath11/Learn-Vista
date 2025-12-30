"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/src/components/shared/components/ui/card";
import { Button } from "@/src/components/shared/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/src/components/shared/components/ui/radio-group";
import { Label } from "@/src/components/shared/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/src/components/shared/components/ui/tabs";
import { Flag, Timer, ChevronLeft, ChevronRight, Save, LayoutGrid, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/src/components/shared/components/ui/alert-dialog";
import { Badge } from "@/src/components/shared/components/ui/badge";
import { SECTIONS, SectionId } from "../data";
import { kmatApi } from "@/src/services/kmatService";
import { showErrorToast } from "@/src/utils/Toast";

export default function KmatExamPage() {
  const router = useRouter();
  
  // --- State ---
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentSection, setCurrentSection] = useState<SectionId>("quantitative");
  const [answers, setAnswers] = useState<Record<string, number>>({}); // questionId -> answerIndex
  const [reviewStatus, setReviewStatus] = useState<Record<string, boolean>>({});
  const [visitedStatus, setVisitedStatus] = useState<Record<string, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(180 * 60); // 180 minutes in seconds
  const [currentQuestionId, setCurrentQuestionId] = useState<string>("");

  useEffect(() => {
    const startExam = async () => {
      try {
        const res = await kmatApi.startExam();
        if (res.success && res.data) {
          setSessionId(res.data.sessionId);
          // Add custom ID for easier internal handling if needed, or just use _id
           const formatted = res.data.questions.map((q: any) => ({
             ...q,
             id: q._id, // Use _id as main ID
           }));
           setQuestions(formatted);
           if (formatted.length > 0) {
             setCurrentQuestionId(formatted[0].id);
           }
        }
      } catch (error) {
        showErrorToast("Failed to start exam. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    startExam();
  }, []);

  // Derived state
  const currentSectionQuestions = questions.filter(q => q.section === (
    currentSection === "quantitative" ? "Quantitative Ability" : 
    currentSection === "logical" ? "Logical Reasoning" :
    currentSection === "verbal" ? "Language Comprehension" : "General Knowledge"
  ));
  
  const currentQuestionIndex = currentSectionQuestions.findIndex(q => q.id === currentQuestionId);
  const activeQuestion = currentSectionQuestions[currentQuestionIndex !== -1 ? currentQuestionIndex : 0];
  
  // Ensure we are always viewing a valid question when section changes
  useEffect(() => {
    if (activeQuestion && activeQuestion.id !== currentQuestionId) {
       setCurrentQuestionId(activeQuestion.id);
    }
    if (activeQuestion) {
      setVisitedStatus(prev => ({ ...prev, [activeQuestion.id]: true }));
    }
  }, [currentSection, activeQuestion, currentQuestionId]);

  // --- Timer ---
  useEffect(() => {
    if (loading) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [loading]);

  // --- Handlers ---
  const handleAnswer = (optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [activeQuestion.id]: optionIndex }));
  };

  const handleMarkReview = () => {
    setReviewStatus(prev => ({ ...prev, [activeQuestion.id]: !prev[activeQuestion.id] }));
  };

  const handleClearResponse = () => {
     const newAnswers = { ...answers };
     delete newAnswers[activeQuestion.id];
     setAnswers(newAnswers);
  };

  const handleNext = () => {
    const nextIdx = currentQuestionIndex + 1;
    if (nextIdx < currentSectionQuestions.length) {
      setCurrentQuestionId(currentSectionQuestions[nextIdx].id);
    }
  };
  
  const handlePrev = () => {
    const prevIdx = currentQuestionIndex - 1;
    if (prevIdx >= 0) {
      setCurrentQuestionId(currentSectionQuestions[prevIdx].id);
    }
  };

  const handleSectionChange = (val: string) => {
     setCurrentSection(val as SectionId);
  };

  const handleSubmitExam = async () => {
    if (!sessionId) return;
    try {
      setLoading(true);
      // Format answers for backend: [{ questionId, userAnswerIndex }]
      const formattedAnswers = Object.entries(answers).map(([qId, idx]) => ({
        questionId: qId,
        userAnswerIndex: idx
      }));

      const res = await kmatApi.submitExam(sessionId, formattedAnswers);
      if (res.success) {
        router.push(`/kmat/result?id=${sessionId}`);
      }
    } catch (error) {
      showErrorToast("Failed to submit exam.");
      setLoading(false);
    }
  };

  // --- Format Timer ---
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex bg-background h-screen w-full items-center justify-center flex-col gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Preparing Exam Environment...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4 px-4 h-[calc(100vh-80px)] flex flex-col">
      {/* Header Bar */}
      <div className="flex justify-between items-center bg-card p-4 rounded-lg shadow-sm border mb-4">
        <div>
          <h1 className="text-xl font-bold">KMAT Kerala Mock Exam</h1>
          <p className="text-xs text-muted-foreground">Standard 180 Mins • +1/-0.25 Marking</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-secondary px-4 py-2 rounded-md font-mono text-lg font-bold text-primary">
            <Timer className="w-5 h-5" />
            {formatTime(timeLeft)}
          </div>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
               <Button variant="destructive">Submit Exam</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to submit?</AlertDialogTitle>
                <AlertDialogDescription>
                  You have attempted {Object.keys(answers).length} out of {questions.length} questions. 
                  Once submitted, you cannot review your answers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleSubmitExam}>Submit Exam</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-grow overflow-hidden">
        {/* Main Question Area */}
        <div className="lg:col-span-3 flex flex-col h-full gap-4">
          <Tabs value={currentSection} onValueChange={handleSectionChange} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              {SECTIONS.map(sec => (
                <TabsTrigger key={sec.id} value={sec.id} className="text-xs md:text-sm">
                  {sec.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <Card className="flex-grow flex flex-col">
             <CardHeader className="pb-2 border-b">
               <div className="flex justify-between items-center">
                 <Badge variant="outline">Question {currentQuestionIndex + 1}</Badge>
                 <div className="flex gap-2">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div> +1 Correct 
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div> -0.25 Wrong
                    </span>
                 </div>
               </div>
             </CardHeader>
             <CardContent className="flex-grow pt-6 overflow-y-auto">
               {activeQuestion && (
                 <>
                   <p className="text-lg font-medium mb-8 leading-relaxed">
                     {activeQuestion.question}
                   </p>
                   <RadioGroup 
                      value={answers[activeQuestion.id]?.toString() ?? ""} 
                      onValueChange={(val) => handleAnswer(parseInt(val))} 
                      className="space-y-4"
                   >
                     {activeQuestion.options.map((opt: string, idx: number) => (
                       <div key={idx} className={`flex items-center space-x-3 border rounded-lg p-3 hover:bg-secondary/50 transition-colors ${
                         answers[activeQuestion.id] === idx ? "bg-secondary border-primary/40 shadow-sm" : ""
                       }`}>
                         <RadioGroupItem value={idx.toString()} id={`q-${activeQuestion.id}-opt-${idx}`} />
                         <Label htmlFor={`q-${activeQuestion.id}-opt-${idx}`} className="flex-grow cursor-pointer text-base">
                           {opt}
                         </Label>
                       </div>
                     ))}
                   </RadioGroup>
                 </>
               )}
             </CardContent>
             <CardFooter className="border-t pt-4 flex justify-between bg-secondary/10">
                <div className="flex gap-2">
                   <Button variant="ghost" onClick={handleMarkReview} className={reviewStatus[activeQuestion?.id || ""] ? "text-yellow-600 bg-yellow-50" : ""}>
                      <Flag size={16} className="mr-2" /> 
                      {reviewStatus[activeQuestion?.id || ""] ? "Unmark" : "Review"}
                   </Button>
                   <Button variant="ghost" onClick={handleClearResponse} disabled={answers[activeQuestion?.id || ""] === undefined}>
                      Clear
                   </Button>
                </div>
                <div className="flex gap-2">
                   <Button variant="outline" onClick={handlePrev} disabled={currentQuestionIndex === 0}>
                     <ChevronLeft size={16} className="mr-1" /> Prev
                   </Button>
                   <Button onClick={handleNext} disabled={currentQuestionIndex === currentSectionQuestions.length - 1} className="w-28">
                     Next <ChevronRight size={16} className="ml-1" />
                   </Button>
                </div>
             </CardFooter>
          </Card>
        </div>

        {/* Question Palette Sidebar */}
        <Card className="hidden lg:flex flex-col h-full bg-secondary/5 border-l">
          <CardHeader className="pb-2 border-b bg-card">
            <CardTitle className="flex items-center gap-2 text-md">
              <LayoutGrid size={18} /> Question Palette
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow overflow-y-auto pt-4">
             <div className="grid grid-cols-5 gap-2">
                {questions.map((q, idx) => {
                  const isAnswered = answers[q.id] !== undefined;
                  const isReview = !!reviewStatus[q.id];
                  const isCurrent = q.id === currentQuestionId;
                  const isVisited = !!visitedStatus[q.id];
                  
                  // Determine Color
                  let variantClass = "bg-secondary text-secondary-foreground hover:bg-secondary/80"; // Not Visited
                  if (isCurrent) variantClass = "ring-2 ring-primary ring-offset-2";
                  
                  if (isReview) {
                    variantClass = "bg-yellow-500 text-white hover:bg-yellow-600";
                  } else if (isAnswered) {
                    variantClass = "bg-green-600 text-white hover:bg-green-700";
                  } else if (isVisited && !isAnswered) {
                    variantClass = "bg-red-500 text-white hover:bg-red-600"; // Visited but not answered
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => {
                        // Map Section string back to ID
                        const secId = 
                           q.section === "Quantitative Ability" ? "quantitative" : 
                           q.section === "Logical Reasoning" ? "logical" :
                           q.section === "Language Comprehension" ? "verbal" : "gk";

                        setCurrentSection(secId);
                        setCurrentQuestionId(q.id);
                      }}
                      className={`h-9 w-9 text-xs font-bold rounded-md flex items-center justify-center transition-all ${variantClass}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
             </div>
             
             <div className="mt-8 space-y-2 text-xs text-muted-foreground p-3 bg-card rounded border">
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-600 rounded"></div> Answered</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded"></div> Not Answered</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-yellow-500 rounded"></div> Mark for Review</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-secondary border rounded"></div> Not Visited</div>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

