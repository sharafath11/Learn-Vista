"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/src/components/shared/components/ui/card";
import { Button } from "@/src/components/shared/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/src/components/shared/components/ui/radio-group";
import { Label } from "@/src/components/shared/components/ui/label";
import { Badge } from "@/src/components/shared/components/ui/badge";
import { ChevronRight, Trophy, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { kmatApi } from "@/src/services/kmatService";
import { showInfoToast, showErrorToast } from "@/src/utils/Toast";

export default function KmatPracticePage() {
  const searchParams = useSearchParams();
  const initialTopic = searchParams.get("topic") || "General";
  const section = searchParams.get("section") || "Quantitative Ability";

  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState({ correct: 0, wrong: 0, total: 0 });
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const res = await kmatApi.getPracticeQuestions(section, initialTopic, "Medium");
        if (res.success && res.data) {
           // Ensure data format matches expectations. 
           // API returns { question, options, correctAnswerIndex, explanation }
           // Unify it for frontend usage.
           const formatted = res.data.map((q: any) => ({
             id: q._id || Math.random(),
             question: q.question,
             options: q.options,
             correctAnswer: q.options[q.correctAnswerIndex],
             explanation: q.explanation
           }));
           setQuestions(formatted);
        }
      } catch (error) {
        showErrorToast("Failed to load questions. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [initialTopic, section]);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  const handleSubmit = () => {
    if (!selectedOption) return;
    
    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    setScore(prev => ({
      ...prev,
      correct: prev.correct + (isCorrect ? 1 : 0),
      wrong: prev.wrong + (isCorrect ? 0 : 1),
      total: prev.total + 1
    }));
    setIsSubmitted(true);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setShowSummary(true);
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption("");
      setIsSubmitted(false);
    }
  };

  const handleRetry = () => {
    // Reload questions or just reset? Let's reload to get new ones!
    window.location.reload(); 
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground">Generating questions with AI...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-20">
        <h3 className="text-xl font-semibold">No questions generated.</h3>
        <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  if (showSummary) {
    return (
      <div className="container mx-auto py-12 px-4 max-w-2xl text-center">
        <Card>
          <CardHeader>
            <div className="mx-auto bg-yellow-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-4">
               <Trophy className="w-10 h-10 text-yellow-600" />
            </div>
            <CardTitle className="text-2xl">Practice Complete!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center gap-8 text-lg">
              <div className="text-green-600 font-semibold">
                Correct: {score.correct}
              </div>
              <div className="text-red-500 font-semibold">
                Wrong: {score.wrong}
              </div>
            </div>
            <p className="text-muted-foreground">
              Accuracy: {Math.round((score.correct / score.total) * 100) || 0}%
            </p>
          </CardContent>
          <CardFooter className="justify-center gap-4">
             <Button onClick={() => window.location.href = "/kmat/learn"} variant="outline">Back to Learn</Button>
             <Button onClick={handleRetry}>Practice Again</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Practice Mode: {initialTopic}</h2>
          <p className="text-sm text-muted-foreground">
            Question {currentIndex + 1} of {questions.length}
          </p>
        </div>
        <div className="flex gap-2">
           <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
             Match: {score.correct}
           </Badge>
           <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">
             Miss: {score.wrong}
           </Badge>
        </div>
      </div>

      <Card className="min-h-[400px] flex flex-col justify-between">
        <CardContent className="pt-6">
          <p className="text-lg font-medium leading-relaxed mb-6">
            {currentQuestion.question}
          </p>

          <RadioGroup 
             disabled={isSubmitted}
             value={selectedOption} 
             onValueChange={setSelectedOption} 
             className="space-y-3"
          >
            {currentQuestion.options.map((option: string, idx: number) => (
              <div key={idx} className={`flex items-center space-x-2 border rounded-lg p-3 transition-colors ${
                isSubmitted && option === currentQuestion.correctAnswer 
                  ? "bg-green-100 border-green-300 dark:bg-green-900/30 dark:border-green-800" 
                  : isSubmitted && option === selectedOption && option !== currentQuestion.correctAnswer
                  ? "bg-red-100 border-red-300 dark:bg-red-900/30 dark:border-red-800"
                  : selectedOption === option 
                  ? "bg-secondary border-primary/30"
                  : "hover:bg-secondary/50"
              }`}>
                <RadioGroupItem value={option} id={`option-${idx}`} />
                <Label htmlFor={`option-${idx}`} className="flex-grow cursor-pointer font-normal text-md">
                  {option}
                </Label>
                {isSubmitted && option === currentQuestion.correctAnswer && (
                  <CheckCircle className="text-green-600 w-5 h-5" />
                )}
                {isSubmitted && option === selectedOption && option !== currentQuestion.correctAnswer && (
                  <XCircle className="text-red-500 w-5 h-5" />
                )}
              </div>
            ))}
          </RadioGroup>

          {isSubmitted && (
             <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-100 dark:border-blue-900/30 animate-fadeIn">
               <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-1">Explanation:</h4>
               <p className="text-sm text-blue-900/80 dark:text-blue-200/80">
                 {currentQuestion.explanation}
               </p>
             </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end pt-4 pb-6">
          {!isSubmitted ? (
            <Button onClick={handleSubmit} disabled={!selectedOption} size="lg">
              Check Answer
            </Button>
          ) : (
            <Button onClick={handleNext} size="lg" className="gap-2">
              {isLastQuestion ? "Finish Practice" : "Next Question"} <ChevronRight size={16} />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
