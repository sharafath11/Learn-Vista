"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/src/components/shared/components/ui/card";
import { Button } from "@/src/components/shared/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/src/components/shared/components/ui/radio-group";
import { Label } from "@/src/components/shared/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/src/components/shared/components/ui/tabs";
import { Flag, Timer, ChevronLeft, ChevronRight, LayoutGrid, Loader2, AlertTriangle } from "lucide-react";
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
import { kmatApi } from "@/src/services/kmatService";
import { showErrorToast } from "@/src/utils/Toast";

const SECTIONS = [
  { id: "quantitative", label: "Quantitative" },
  { id: "logical", label: "Logical" },
  { id: "verbal", label: "Verbal" },
  { id: "gk", label: "GK" }
];

export default function KmatExamPage() {
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentSection, setCurrentSection] = useState<string>("quantitative");
  const [answers, setAnswers] = useState<Record<string, number>>({}); 
  const [reviewStatus, setReviewStatus] = useState<Record<string, boolean>>({});
  const [visitedStatus, setVisitedStatus] = useState<Record<string, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes for mock
  const [currentQuestionId, setCurrentQuestionId] = useState<string>("");

  useEffect(() => {
    const startExam = async () => {
      try {
        const res = await kmatApi.startExam();
        if (res.success && res.data) {
          setSessionId(res.data.sessionId);
          setQuestions(res.data.questions);
          if (res.data.questions.length > 0) {
            setCurrentQuestionId(res.data.questions[0]._id);
          }
        }
      } catch (error) {
        showErrorToast("Failed to initialize exam environment.");
      } finally {
        setLoading(false);
      }
    };
    startExam();
  }, []);

  const currentSectionQuestions = questions.filter(q => {
      const qSec = q.section.toLowerCase();
      if (currentSection === "quantitative") return qSec.includes("quantitative");
      if (currentSection === "logical") return qSec.includes("logical");
      if (currentSection === "verbal") return qSec.includes("language") || qSec.includes("verbal");
      if (currentSection === "gk") return qSec.includes("general") || qSec.includes("gk");
      return false;
  });
  
  const activeQuestion = questions.find(q => q._id === currentQuestionId) || currentSectionQuestions[0];
  const currentQuestionIdxInTotal = questions.findIndex(q => q._id === currentQuestionId);

  useEffect(() => {
    if (activeQuestion) {
      setVisitedStatus(prev => ({ ...prev, [activeQuestion._id]: true }));
    }
  }, [currentQuestionId, activeQuestion]);

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

  const handleAnswer = (optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [activeQuestion._id]: optionIndex }));
  };

  const handleNext = () => {
    if (currentQuestionIdxInTotal < questions.length - 1) {
      setCurrentQuestionId(questions[currentQuestionIdxInTotal + 1]._id);
      // Auto-switch tab if section changes
      const nextQ = questions[currentQuestionIdxInTotal + 1];
      updateSectionTab(nextQ.section);
    }
  };
  
  const handlePrev = () => {
    if (currentQuestionIdxInTotal > 0) {
      setCurrentQuestionId(questions[currentQuestionIdxInTotal - 1]._id);
      const prevQ = questions[currentQuestionIdxInTotal - 1];
      updateSectionTab(prevQ.section);
    }
  };

  const updateSectionTab = (sectionName: string) => {
      const qSec = sectionName.toLowerCase();
      if (qSec.includes("quantitative")) setCurrentSection("quantitative");
      else if (qSec.includes("logical")) setCurrentSection("logical");
      else if (qSec.includes("language") || qSec.includes("verbal")) setCurrentSection("verbal");
      else if (qSec.includes("general") || qSec.includes("gk")) setCurrentSection("gk");
  };

  const handleSubmitExam = async () => {
    if (!sessionId) return;
    setLoading(true);
    try {
      const formattedAnswers = Object.entries(answers).map(([qId, idx]) => ({
        questionId: qId,
        userAnswerIndex: idx
      }));

      const res = await kmatApi.submitExam(sessionId, formattedAnswers);
      if (res.success) {
        router.push(`/kmat/result?id=${sessionId}`);
      }
    } catch (error) {
      showErrorToast("Critical: Submission failed. Contact support.");
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex bg-background h-screen w-full items-center justify-center flex-col gap-6">
        <Loader2 className="w-16 h-16 animate-spin text-primary" />
        <div className="text-center animate-pulse">
            <p className="text-xl font-bold">Secure Exam Session</p>
            <p className="text-muted-foreground text-sm">Validating environment and fetching authorized questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-secondary/5">
      {/* Header Bar */}
      <header className="bg-background border-b px-6 py-4 flex justify-between items-center shadow-sm z-10">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-2 rounded-lg">
             <LayoutGrid className="text-primary w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold leading-none">KMAT Kerala Mock</h1>
            <p className="text-xs text-muted-foreground mt-1">Practice Mode • Strict Timing</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 bg-secondary px-6 py-2 rounded-full border shadow-inner">
            <Timer className={`w-5 h-5 ${timeLeft < 300 ? "text-destructive animate-pulse" : "text-muted-foreground"}`} />
            <span className={`font-mono text-xl font-bold ${timeLeft < 300 ? "text-destructive" : "text-foreground"}`}>
                {formatTime(timeLeft)}
            </span>
          </div>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
               <Button variant="destructive" className="px-8 shadow-lg">End & Submit</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="text-destructive" /> Final Submission
                </AlertDialogTitle>
                <AlertDialogDescription>
                  You've attempted {Object.keys(answers).length} of {questions.length} questions.
                  Are you ready to submit your authorized response for evaluation?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep Working</AlertDialogCancel>
                <AlertDialogAction onClick={handleSubmitExam} className="bg-destructive hover:bg-destructive/90">Submit Now</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </header>

      <main className="flex-grow grid grid-cols-1 lg:grid-cols-4 overflow-hidden p-6 gap-6">
        <div className="lg:col-span-3 flex flex-col gap-6 overflow-hidden">
          <Tabs value={currentSection} onValueChange={setCurrentSection} className="w-full">
            <TabsList className="grid w-full grid-cols-4 h-12 bg-background border shadow-sm">
              {SECTIONS.map(sec => (
                <TabsTrigger key={sec.id} value={sec.id} className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  {sec.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <Card className="flex-grow flex flex-col shadow-lg border-2 overflow-hidden">
             <CardContent className="flex-grow p-8 overflow-y-auto bg-background">
               {activeQuestion && (
                 <div className="max-w-3xl mx-auto space-y-10">
                    <div className="space-y-4">
                        <Badge variant="outline" className="text-primary tracking-widest uppercase text-[10px] font-bold">
                            Question {currentQuestionIdxInTotal + 1}
                        </Badge>
                        <h2 className="text-2xl font-semibold leading-relaxed">
                            {activeQuestion.question}
                        </h2>
                    </div>

                    <RadioGroup 
                       value={answers[activeQuestion._id]?.toString() ?? ""} 
                       onValueChange={(val) => handleAnswer(parseInt(val))} 
                       className="grid gap-4"
                    >
                      {activeQuestion.options.map((opt: string, idx: number) => (
                        <div key={idx} className={`relative group transition-all`}>
                          <RadioGroupItem value={idx.toString()} id={`opt-${idx}`} className="sr-only" />
                          <Label 
                            htmlFor={`opt-${idx}`} 
                            className={`flex items-center p-5 rounded-2xl border-2 cursor-pointer transition-all hover:bg-secondary/10 ${
                                answers[activeQuestion._id] === idx 
                                ? "border-primary bg-primary/5 shadow-md scale-[1.01]" 
                                : "border-secondary/40 bg-background"
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-4 shrink-0 transition-colors ${
                                answers[activeQuestion._id] === idx ? "bg-primary border-primary text-primary-foreground" : "border-secondary"
                            }`}>
                                {String.fromCharCode(65 + idx)}
                            </div>
                            <span className="text-lg font-medium">{opt}</span>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                 </div>
               )}
             </CardContent>
             <CardFooter className="border-t p-6 flex justify-between bg-secondary/5">
                <div className="flex gap-4">
                   <Button 
                    variant="outline" 
                    onClick={() => setReviewStatus(prev => ({ ...prev, [activeQuestion._id]: !prev[activeQuestion._id] }))} 
                    className={reviewStatus[activeQuestion?._id] ? "bg-yellow-100 border-yellow-400 text-yellow-700" : ""}
                   >
                      <Flag size={18} className="mr-2" /> 
                      {reviewStatus[activeQuestion?._id] ? "Flagged" : "Flag for Review"}
                   </Button>
                </div>
                <div className="flex gap-4">
                   <Button variant="ghost" onClick={handlePrev} disabled={currentQuestionIdxInTotal === 0} size="lg">
                     <ChevronLeft size={20} className="mr-2" /> Previous
                   </Button>
                   <Button onClick={handleNext} disabled={currentQuestionIdxInTotal === questions.length - 1} size="lg" className="px-10">
                     Next <ChevronRight size={20} className="ml-2" />
                   </Button>
                </div>
             </CardFooter>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="hidden lg:flex flex-col gap-6 h-full overflow-hidden">
             <Card className="flex-grow flex flex-col shadow-lg border-2 overflow-hidden bg-background">
                <CardHeader className="border-b bg-secondary/10 px-6 py-4">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                        <LayoutGrid size={16} /> Question Matrix
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow overflow-y-auto p-4 custom-scrollbar">
                    <div className="grid grid-cols-4 gap-2">
                        {questions.map((q, idx) => {
                            const isAnswered = answers[q._id] !== undefined;
                            const isReview = !!reviewStatus[q._id];
                            const isCurrent = q._id === currentQuestionId;
                            const isVisited = !!visitedStatus[q._id];
                            
                            let statusClass = "bg-secondary/30 text-muted-foreground border-transparent";
                            if (isCurrent) statusClass = "ring-2 ring-primary ring-offset-2 border-primary text-primary";
                            else if (isReview) statusClass = "bg-yellow-500 text-white border-yellow-600";
                            else if (isAnswered) statusClass = "bg-green-600 text-white border-green-700";
                            else if (isVisited) statusClass = "bg-destructive/10 text-destructive border-destructive/20";

                            return (
                                <button
                                    key={q._id}
                                    onClick={() => {
                                        setCurrentQuestionId(q._id);
                                        updateSectionTab(q.section);
                                    }}
                                    className={`h-10 w-full text-xs font-bold rounded-xl border flex items-center justify-center transition-all hover:scale-105 ${statusClass}`}
                                >
                                    {(idx + 1).toString().padStart(2, '0')}
                                </button>
                            );
                        })}
                    </div>
                </CardContent>
                <CardFooter className="bg-secondary/10 p-4 border-t">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 w-full text-[10px] font-bold uppercase tracking-tighter">
                        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-600 rounded-sm shadow-sm"></div> Answered</div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-destructive/20 border border-destructive/30 rounded-sm shadow-sm"></div> Skipped</div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-yellow-500 rounded-sm shadow-sm"></div> Flagged</div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-secondary rounded-sm shadow-sm"></div> Not Seen</div>
                    </div>
                </CardFooter>
             </Card>
        </div>
      </main>
    </div>
  );
}
