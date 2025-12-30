"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/shared/components/ui/card";
import { Button } from "@/src/components/shared/components/ui/button";
import { Badge } from "@/src/components/shared/components/ui/badge";
import { Separator } from "@/src/components/shared/components/ui/separator";
import { Progress } from "@/src/components/shared/components/ui/progress";
import { Award, Loader2 } from "lucide-react";
import { kmatApi } from "@/src/services/kmatService";
import { showErrorToast } from "@/src/utils/Toast";
import { SECTIONS } from "../data";

export default function KmatResultPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("id");
  
  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      if (!sessionId) {
        setLoading(false);
        return;
      }
      try {
        const res = await kmatApi.getResult(sessionId);
        if (res.success) {
          setResult(res.data);
        }
      } catch (error) {
        showErrorToast("Failed to load results.");
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex bg-background h-screen w-full items-center justify-center flex-col gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-muted-foreground">Analyzing performance...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">No Result Found</h2>
        <Link href="/kmat/exam">
          <Button>Take Exam</Button>
        </Link>
      </div>
    );
  }

  const { totalQuestions, correct, wrong, finalScore, attempted } = result;
  
  const accuracy = attempted > 0 
    ? Math.round((correct / attempted) * 100) 
    : 0;

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
       <div className="flex justify-between items-center mb-8">
         <h1 className="text-3xl font-bold">Exam Analysis</h1>
         <Link href="/kmat/learn">
            <Button variant="outline">Back to Dashboard</Button>
         </Link>
       </div>

       {/* Score Summary */}
       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
         <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium text-muted-foreground">Total Score</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="text-4xl font-bold text-primary">{finalScore.toFixed(2)}</div>
               <p className="text-xs text-muted-foreground">Max possible: {totalQuestions}</p>
            </CardContent>
         </Card>
         
         <Card>
            <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium text-muted-foreground">Accuracy</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="text-4xl font-bold text-blue-600">{accuracy}%</div>
               <Progress value={accuracy} className="h-2 mt-2" />
            </CardContent>
         </Card>

         <Card>
            <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium text-muted-foreground">Attempts</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold">{attempted} <span className="text-sm font-normal text-muted-foreground">/ {totalQuestions}</span></div>
               <div className="flex gap-2 mt-2 text-xs">
                 <span className="text-green-600 font-bold">{correct} Correct</span>
                 <span className="text-red-500 font-bold">{wrong} Wrong</span>
               </div>
            </CardContent>
         </Card>

         <Card className="flex flex-col justify-center items-center bg-secondary/10">
             <CardContent className="pt-6 text-center">
                <Award className="w-10 h-10 mx-auto text-yellow-500 mb-2" />
                <div className="font-semibold text-lg">
                  {finalScore > totalQuestions * 0.7 ? "Excellent!" : finalScore > totalQuestions * 0.4 ? "Good Job!" : "Needs Improvement"}
                </div>
                <p className="text-sm text-muted-foreground">Keep practicing!</p>
             </CardContent>
         </Card>
       </div>

       {/* Detailed Analysis */}
       <div className="space-y-8">
          <h2 className="text-xl font-bold">Detailed Solutions</h2>
          
          {SECTIONS.map(section => {
             // Filter answers that belong to this section
             const sectionAnswers = result.answers.filter((ans: any) => {
                // Map DB section string to ID for comparison if needed, or check question.section
                // Result from backend has populated questionId which contains section string.
                const qSection = ans.questionId.section; 
                if (section.id === "quantitative") return qSection === "Quantitative Ability";
                if (section.id === "logical") return qSection === "Logical Reasoning";
                if (section.id === "verbal") return qSection === "Language Comprehension";
                if (section.id === "gk") return qSection === "General Knowledge";
                return false;
             });

             if (sectionAnswers.length === 0) return null;

             return (
               <div key={section.id} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-base px-3 py-1 bg-secondary">{section.label}</Badge>
                    <Separator className="flex-grow" />
                  </div>
                  
                  <div className="grid gap-4">
                    {sectionAnswers.map((ans: any) => {
                       const q = ans.questionId;
                       const isCorrect = ans.isCorrect;
                       const isSkipped = ans.userAnswerIndex === null;
                       const userAnswerText = ans.userAnswerIndex !== null ? q.options[ans.userAnswerIndex] : null;
                       const correctAnswerText = q.options[q.correctAnswerIndex];

                       return (
                         <Card key={q._id} className={`border-l-4 ${
                            isCorrect ? "border-l-green-500" : isSkipped ? "border-l-gray-300" : "border-l-red-500"
                         }`}>
                           <CardHeader className="pb-2">
                             <div className="flex justify-between items-start">
                               <div className="flex gap-3">
                                  <span className="font-medium text-lg">{q.question}</span>
                               </div>
                               <div>
                                  {isCorrect && <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200">Correct (+1)</Badge>}
                                  {!isCorrect && !isSkipped && <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-200 border-red-200">Wrong (-0.25)</Badge>}
                                  {isSkipped && <Badge variant="outline">Unattempted</Badge>}
                               </div>
                             </div>
                           </CardHeader>
                           <CardContent>
                             <div className="grid md:grid-cols-2 gap-4 mt-2">
                               <div className="space-y-1">
                                 <div className="text-sm font-medium text-muted-foreground">Your Answer</div>
                                 <div className={`p-2 rounded border ${
                                    isCorrect ? "bg-green-50 border-green-200 text-green-800" : isSkipped ? "bg-secondary text-muted-foreground italic" : "bg-red-50 border-red-200 text-red-800"
                                 }`}>
                                    {userAnswerText || "Not Answered"}
                                 </div>
                               </div>
                               <div className="space-y-1">
                                 <div className="text-sm font-medium text-muted-foreground">Correct Answer</div>
                                 <div className="p-2 rounded border bg-green-50 border-green-200 text-green-800">
                                    {correctAnswerText}
                                 </div>
                               </div>
                             </div>
                             
                             <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/10 rounded text-sm text-blue-900 dark:text-blue-100">
                                <span className="font-bold">Explanation: </span> {q.explanation}
                             </div>
                           </CardContent>
                         </Card>
                       );
                    })}
                  </div>
               </div>
             );
          })}
       </div>
    </div>
  );
}
