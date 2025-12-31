"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/src/components/shared/components/ui/card";
import { Button } from "@/src/components/shared/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/src/components/shared/components/ui/radio-group";
import { Label } from "@/src/components/shared/components/ui/label";
import { Badge } from "@/src/components/shared/components/ui/badge";
import { ChevronRight, Trophy, Loader2, Bookmark, CheckCircle2 } from "lucide-react";
import { kmatApi } from "@/src/services/kmatService";
import { showInfoToast, showErrorToast } from "@/src/utils/Toast";
import Link from "next/link";

export default function KmatPracticePage() {
  const [data, setData] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<any[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchPractice = async () => {
      setLoading(true);
      try {
        const res = await kmatApi.getDailyData();
        if (res.success && res.data) {
          setData(res.data);
          const practiceSet = res.data.practiceSet || [];
          setQuestions(practiceSet);
        }
      } catch (error) {
        showErrorToast("Failed to load practice questions.");
      } finally {
        setLoading(false);
      }
    };
    fetchPractice();
  }, []);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  const handleNext = () => {
    if (selectedOption === null) return;
    
    // Collect answer
    const newAnswers = [...userAnswers, { 
        questionId: currentQuestion._id, 
        userAnswerIndex: selectedOption 
    }];
    setUserAnswers(newAnswers);

    if (isLastQuestion) {
      submitPractice(newAnswers);
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
    }
  };

  const submitPractice = async (finalAnswers: any[]) => {
    setSubmitting(true);
    try {
      const res = await kmatApi.submitPractice(data.dayNumber, finalAnswers);
      if (res.success) {
        setShowSummary(true);
        showInfoToast("Practice session completed and saved.");
      }
    } catch (error) {
      showErrorToast("Failed to save practice session.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground">Preparing your practice session...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-20 bg-secondary/10 rounded-2xl mx-4">
        <Bookmark className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold">No practice questions available for today yet.</h3>
        <Link href="/kmat" className="mt-6 inline-block">
            <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  if (showSummary) {
    return (
      <div className="container mx-auto py-12 px-4 max-w-2xl text-center">
        <Card className="border-2 border-primary/20 shadow-xl overflow-hidden">
          <CardHeader className="bg-primary/5 pb-8">
            <div className="mx-auto bg-primary/10 p-6 rounded-full w-24 h-24 flex items-center justify-center mb-4">
               <Trophy className="w-12 h-12 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold">Session Complete!</CardTitle>
            <p className="text-muted-foreground mt-2">Your practice session has been recorded.</p>
          </CardHeader>
          <CardContent className="py-10 space-y-6">
            <div className="flex justify-center gap-4 text-lg">
                <Badge variant="secondary" className="px-4 py-2 text-md">
                    Questions Attempted: {userAnswers.length}
                </Badge>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Ready for the real challenge? Head over to the Mock Exam or check your detailed history and reports.
            </p>
          </CardContent>
          <CardFooter className="justify-center gap-4 bg-secondary/10 py-6">
             <Link href="/kmat">
                <Button variant="outline" size="lg">Dashboard</Button>
             </Link>
             <Link href="/kmat/exam">
                <Button size="lg" className="bg-orange-600 hover:bg-orange-700">Attempt Mock</Button>
             </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <div className="flex justify-between items-end mb-8 border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">KMAT Daily Practice</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Day {data.dayNumber} • Question {currentIndex + 1} of {questions.length}
          </p>
        </div>
        <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 mb-1">
            {currentQuestion.section}
        </Badge>
      </div>

      <Card className="min-h-[450px] flex flex-col justify-between border-2 shadow-sm">
        <CardContent className="pt-8">
           <div className="bg-secondary/20 p-4 rounded-lg mb-8 border border-secondary">
            <p className="text-lg font-medium leading-relaxed">
                {currentQuestion.question}
            </p>
           </div>

          <RadioGroup 
             value={selectedOption?.toString() || ""} 
             onValueChange={(val) => setSelectedOption(parseInt(val))} 
             className="space-y-4"
          >
            {currentQuestion.options.map((option: string, idx: number) => (
              <div key={idx} className={`flex items-center space-x-3 border-2 rounded-xl p-4 transition-all ${
                  selectedOption === idx 
                  ? "bg-primary/5 border-primary shadow-sm" 
                  : "hover:bg-secondary/50 border-transparent bg-secondary/10"
              }`}>
                <RadioGroupItem value={idx.toString()} id={`option-${idx}`} />
                <Label htmlFor={`option-${idx}`} className="flex-grow cursor-pointer font-medium text-md">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-end pt-6 pb-8 px-8 border-t bg-secondary/5">
            <Button 
                onClick={handleNext} 
                disabled={selectedOption === null || submitting} 
                size="lg" 
                className="gap-2 min-w-[140px] shadow-md"
            >
              {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
              ) : isLastQuestion ? (
                  <>Finish & Analyze <CheckCircle2 size={18} /></>
              ) : (
                  <>Next Question <ChevronRight size={18} /></>
              )}
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
