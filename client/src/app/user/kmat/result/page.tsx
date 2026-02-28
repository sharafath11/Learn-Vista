"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/src/components/shared/components/ui/card";
import { Button } from "@/src/components/shared/components/ui/button";
import { Progress } from "@/src/components/shared/components/ui/progress";
import { Badge } from "@/src/components/shared/components/ui/badge";
import { Trophy, ArrowLeft, BarChart3, Clock, AlertCircle, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { kmatApi } from "@/src/services/kmatService";
import { showErrorToast } from "@/src/utils/Toast";

function ResultContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("id");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) {
        setLoading(false);
        return;
    }
    const fetchResult = async () => {
      try {
        const res = await kmatApi.getResult(sessionId);
        if (res.success) {
          setResult(res.data);
        }
      } catch (error) {
        showErrorToast("Failed to fetch exam result.");
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Calculating authorized scores...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="text-center py-20 px-4">
        <AlertCircle className="w-12 h-12 mx-auto text-destructive mb-4" />
        <h3 className="text-xl font-semibold">Result Not Found</h3>
        <p className="text-muted-foreground mt-2">We couldn't find the result for this session.</p>
        <Link href="/user/kmat" className="mt-8 inline-block">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const scorePercentage = (result.finalScore / (result.totalQuestions || 1)) * 100;
  const sectionWise = Array.isArray(result.sectionWiseScore)
    ? result.sectionWiseScore
    : Object.values(result.sectionWiseScore || {});

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <Link href="/user/kmat" className="text-primary hover:underline flex items-center gap-2 mb-4 group font-medium">
             <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" /> Back to Dashboard
           </Link>
           <h1 className="text-4xl font-extrabold tracking-tight">Exam Analysis</h1>
           <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs mt-2">
             Official Result Session: {sessionId?.slice(-8)}
           </p>
        </div>
        <Link href={`/user/kmat/report?day=${result.dayNumber}`}>
          <Button className="gap-2 shadow-lg bg-indigo-600 hover:bg-indigo-700" size="lg">
            <BarChart3 size={20} /> View AI Performance Report
          </Button>
        </Link>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Score Overview */}
        <Card className="md:col-span-2 shadow-xl border-2 overflow-hidden hover:shadow-2xl transition-all">
          <CardHeader className="bg-primary pb-10 pt-12 text-primary-foreground relative">
             <div className="absolute top-0 right-0 p-8 opacity-10">
                <Trophy size={140} />
             </div>
             <CardTitle className="text-2xl font-bold opacity-90 uppercase tracking-tighter">Your Final Standing</CardTitle>
             <div className="flex items-baseline gap-4 mt-6">
                <span className="text-7xl font-black">{result.finalScore}</span>
                <span className="text-2xl opacity-80">/ {result.totalQuestions * 4} Marks</span>
             </div>
          </CardHeader>
          <CardContent className="-mt-6 bg-background rounded-t-3xl pt-10">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/10 rounded-2xl border border-green-100 dark:border-green-800">
                <p className="text-xs text-green-600 dark:text-green-400 font-black uppercase mb-1">Correct</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">{result.correct}</p>
              </div>
              <div className="text-center p-4 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-800">
                <p className="text-xs text-red-600 dark:text-red-400 font-black uppercase mb-1">Wrong</p>
                <p className="text-2xl font-bold text-red-700 dark:text-red-300">{result.wrong}</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-2xl border border-yellow-100 dark:border-yellow-800">
                <p className="text-xs text-yellow-600 dark:text-yellow-400 font-black uppercase mb-1">Skipped</p>
                <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{result.unattempted}</p>
              </div>
              <div className="text-center p-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-800">
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-black uppercase mb-1">Accuracy</p>
                <p className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">
                    {result.attempted > 0 ? Math.round((result.correct / result.attempted) * 100) : 0}%
                </p>
              </div>
            </div>

            <div className="mt-12 space-y-4">
              <div className="flex justify-between text-sm font-bold uppercase tracking-wider">
                <span>Overall Mastery</span>
                <span>{Math.round(scorePercentage)}%</span>
              </div>
              <Progress value={scorePercentage} className="h-4 rounded-full" />
            </div>
          </CardContent>
        </Card>

        {/* Breakdown Card */}
        <Card className="shadow-lg border-2">
          <CardHeader className="bg-secondary/20">
            <CardTitle className="text-lg">Sectional Pulse</CardTitle>
            <CardDescription>Performance across domains</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-8">
            {sectionWise.map((data: any, index: number) => (
              <div key={data.section || index} className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold capitalize">{data.section}</span>
                  <Badge variant="outline" className="font-mono">{data.score} / {data.total || 0}</Badge>
                </div>
                <Progress value={((data.score || 0) / (data.total || 1)) * 100} className="h-2" />
                <div className="flex gap-4 text-[10px] uppercase font-black tracking-tighter">
                   <span className="text-green-600 flex items-center gap-1"><CheckCircle2 size={10} /> {data.correct} Correct</span>
                   <span className="text-red-500 flex items-center gap-1"><XCircle size={10} /> {data.wrong} Wrong</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-secondary/10 border-none rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-inner overflow-hidden relative">
         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
         <div className="space-y-4 flex-grow">
            <h3 className="text-2xl font-bold">What's Next?</h3>
            <p className="text-muted-foreground text-lg leading-relaxed">
                Your performance in <span className="text-foreground font-bold">Quantitative Ability</span> shows room for growth. 
                Generate your detailed performance report to see specific topics you should focus on today.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
               <Link href="/user/kmat/history">
                  <Button variant="outline" size="lg" className="rounded-full px-8">Track History</Button>
               </Link>
               <Link href="/user/kmat/practice">
                  <Button size="lg" className="rounded-full px-8 bg-blue-600 hover:bg-blue-700">Practice Drills</Button>
               </Link>
            </div>
         </div>
         <div className="hidden md:block w-48 h-48 bg-primary/10 rounded-full flex items-center justify-center border-8 border-background shadow-xl">
             <BarChart3 className="w-20 h-20 text-primary" />
         </div>
      </Card>
    </div>
  );
}

export default function KmatResultPage() {
  return (
    <Suspense fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
    }>
      <ResultContent />
    </Suspense>
  );
}
