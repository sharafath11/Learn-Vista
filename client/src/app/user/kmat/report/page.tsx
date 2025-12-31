"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/shared/components/ui/card";
import { Button } from "@/src/components/shared/components/ui/button";
import { Badge } from "@/src/components/shared/components/ui/badge";
import { 
    BarChart3, 
    ArrowLeft, 
    Zap, 
    Target, 
    AlertTriangle, 
    TrendingUp,
    Lightbulb,
    Loader2,
    CheckCircle2,
    Calendar,
    AlertCircle
} from "lucide-react";
import { kmatApi } from "@/src/services/kmatService";
import { showErrorToast } from "@/src/utils/Toast";

function ReportContent() {
  const searchParams = useSearchParams();
  const day = searchParams.get("day");
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!day) {
        setLoading(false);
        return;
    }
    const fetchReport = async () => {
      try {
        const res = await kmatApi.generateReport(parseInt(day));
        if (res.success) {
          setReport(res.data);
        }
      } catch (error) {
        showErrorToast("Failed to generate AI performance report.");
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [day]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="relative">
            <BarChart3 className="w-16 h-16 text-primary animate-pulse" />
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-150 animate-pulse"></div>
        </div>
        <div className="text-center space-y-2">
            <p className="text-xl font-bold tracking-tight">Synthesizing Your Performance</p>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                Our AI engine is currently analyzing your latest response patterns to build a personalized growth map.
            </p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="text-center py-20 px-4">
        <AlertTriangle className="w-12 h-12 mx-auto text-destructive mb-4" />
        <h3 className="text-xl font-semibold">Report Unavailable</h3>
        <p className="text-muted-foreground mt-2">We need at least one mock exam session for this day to generate a report.</p>
        <Link href="/kmat" className="mt-8 inline-block">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <Link href="/kmat/history" className="text-primary hover:underline flex items-center gap-2 mb-4 group font-medium text-sm">
             <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" /> View Prep History
           </Link>
           <h1 className="text-4xl font-black tracking-tight flex items-center gap-4">
             <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl text-indigo-600 dark:text-indigo-400">
                <TrendingUp size={32} />
             </div>
             AI Performance Insight
           </h1>
           <div className="flex items-center gap-3 mt-4 text-muted-foreground">
              <Badge variant="secondary" className="px-3 py-1 font-bold">DAY {report.dayNumber}</Badge>
              <span className="flex items-center gap-1.5 text-sm"><Calendar size={14} /> {new Date(report.date).toLocaleDateString()}</span>
           </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => window.print()} className="shadow-sm">Save as PDF</Button>
          <Link href="/kmat/practice">
            <Button className="shadow-lg">Back to Drills</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Strengths */}
        <Card className="border-l-8 border-l-green-500 shadow-xl overflow-hidden hover:shadow-2xl transition-all">
          <CardHeader className="bg-green-50/50 dark:bg-green-900/5 pb-6">
            <CardTitle className="flex items-center gap-3 text-green-700 dark:text-green-400">
                <Zap className="fill-current" /> High Command Areas
            </CardTitle>
            <CardDescription>Topics where you demonstrated peak performance.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ul className="space-y-4">
               {report.strengths?.map((item: string, idx: number) => (
                   <li key={idx} className="flex items-start gap-4 p-4 bg-background border rounded-2xl group">
                      <div className="mt-1 p-1 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full shrink-0 group-hover:scale-110 transition-transform">
                        <CheckCircle2 size={16} />
                      </div>
                      <p className="text-foreground/90 font-medium leading-relaxed">{item}</p>
                   </li>
               ))}
            </ul>
          </CardContent>
        </Card>

        {/* Weaknesses */}
        <Card className="border-l-8 border-l-amber-500 shadow-xl overflow-hidden hover:shadow-2xl transition-all">
          <CardHeader className="bg-amber-50/50 dark:bg-amber-900/5 pb-6">
            <CardTitle className="flex items-center gap-3 text-amber-700 dark:text-amber-400">
                <Target className="fill-current" /> Growth Opportunities
            </CardTitle>
            <CardDescription>Concepts requiring focused remediation.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ul className="space-y-4">
               {report.weaknesses?.map((item: string, idx: number) => (
                   <li key={idx} className="flex items-start gap-4 p-4 bg-background border rounded-2xl group">
                      <div className="mt-1 p-1 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-full shrink-0 group-hover:scale-110 transition-transform">
                        <AlertTriangle size={16} />
                      </div>
                      <p className="text-foreground/90 font-medium leading-relaxed">{item}</p>
                   </li>
               ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Negative Marking Impact */}
      <Card className="shadow-xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white border-none overflow-hidden relative">
         <div className="absolute bottom-0 right-0 p-12 opacity-5 pointer-events-none">
            <BarChart3 size={200} />
         </div>
         <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3 text-indigo-300">
                <AlertCircle /> Strategical Analysis
            </CardTitle>
         </CardHeader>
         <CardContent className="space-y-6 relative z-10">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                <p className="text-lg leading-relaxed font-medium">
                    {report.negativeMarkingImpact}
                </p>
            </div>
         </CardContent>
      </Card>

      {/* Next Steps */}
      <div className="space-y-6">
          <h3 className="text-2xl font-bold flex items-center gap-3 pl-2">
            <Lightbulb className="text-primary fill-primary/20" /> Actionable Roadmap
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {report.nextSteps?.map((step: string, idx: number) => (
                <div key={idx} className="bg-background border-2 p-6 rounded-3xl shadow-sm hover:border-primary/40 transition-all flex flex-col gap-4">
                   <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-sm">
                      0{idx + 1}
                   </div>
                   <p className="font-semibold leading-snug">{step}</p>
                </div>
            ))}
          </div>
      </div>
    </div>
  );
}

export default function KmatDailyReportPage() {
  return (
    <Suspense fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
    }>
      <ReportContent />
    </Suspense>
  );
}
