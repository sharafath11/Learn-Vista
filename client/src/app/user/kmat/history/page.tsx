"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/shared/components/ui/card";
import { Button } from "@/src/components/shared/components/ui/button";
import { Badge } from "@/src/components/shared/components/ui/badge";
import { 
    History as HistoryIcon, 
    ArrowLeft, 
    Calendar, 
    ChevronRight, 
    CheckCircle2, 
    Clock, 
    BarChart3,
    Loader2
} from "lucide-react";
import { kmatApi } from "@/src/services/kmatService";
import { showErrorToast } from "@/src/utils/Toast";

export default function KmatHistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await kmatApi.getHistory();
        if (res.success) {
          setHistory(res.data);
        }
      } catch (error) {
        showErrorToast("Failed to load preparation history.");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Retrieving your preparation trail...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <Link href="/user/kmat" className="text-primary hover:underline flex items-center gap-2 mb-4 group font-medium">
             <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" /> Back to Dashboard
           </Link>
           <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
             <HistoryIcon className="text-primary" /> Preparation History
           </h1>
           <p className="text-muted-foreground mt-1">Review your journey and track your progress over time.</p>
        </div>
      </div>

      {history.length === 0 ? (
        <Card className="bg-secondary/10 border-dashed border-2">
            <CardContent className="flex flex-col items-center py-20 text-center gap-4">
                <Calendar className="w-12 h-12 text-muted-foreground opacity-20" />
                <h3 className="text-xl font-bold">No history yet</h3>
                <p className="text-muted-foreground max-w-sm">
                    Keep showing up every day. Your preparation history will appear here once you start completing daily tasks.
                </p>
                <Link href="/user/kmat">
                    <Button>Start Today's Prep</Button>
                </Link>
            </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
            {history.sort((a, b) => b.dayNumber - a.dayNumber).map((entry) => (
                <Card key={entry.dayNumber} className="hover:shadow-md transition-shadow overflow-hidden group">
                    <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row items-stretch border-l-4 border-l-primary/60">
                            <div className="bg-secondary/20 p-6 flex flex-col items-center justify-center min-w-[120px] text-center">
                                <span className="text-xs font-black text-muted-foreground uppercase">Day</span>
                                <span className="text-3xl font-black text-primary">{entry.dayNumber}</span>
                            </div>
                            
                            <div className="flex-grow p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-lg font-bold">Concept Exploration</h3>
                                        <Badge variant={entry.status === "generated" ? "default" : "secondary"}>
                                            {entry.status === "generated" ? (
                                                <span className="flex items-center gap-1"><CheckCircle2 size={12} /> Completed</span>
                                            ) : (
                                                <span className="flex items-center gap-1"><Clock size={12} /> In Progress</span>
                                            )}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                                        <Calendar size={14} /> {new Date(entry.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-3 w-full md:w-auto">
                                    {entry.score !== null ? (
                                        <div className="bg-green-50 dark:bg-green-900/10 px-4 py-2 rounded-xl border border-green-100 dark:border-green-800 flex flex-col items-center">
                                            <span className="text-[10px] uppercase font-black text-green-600 dark:text-green-400">Score</span>
                                            <span className="text-xl font-bold text-green-700 dark:text-green-300">{entry.score}</span>
                                        </div>
                                    ) : (
                                        <div className="bg-secondary/40 px-4 py-2 rounded-xl border flex flex-col items-center opacity-60">
                                            <span className="text-[10px] uppercase font-black text-muted-foreground">Score</span>
                                            <span className="text-xl font-bold">—</span>
                                        </div>
                                    )}

                                    <div className="flex flex-col gap-2 flex-grow md:flex-grow-0 min-w-[140px]">
                                        {entry.reportAvailable ? (
                                            <Link href={`/user/kmat/report?day=${entry.dayNumber}`} className="w-full">
                                                <Button size="sm" variant="outline" className="w-full gap-2 border-primary/20 hover:bg-primary/5 text-primary">
                                                    <BarChart3 size={14} /> Performance Report
                                                </Button>
                                            </Link>
                                        ) : entry.score !== null ? (
                                            <Link href={`/user/kmat/report?day=${entry.dayNumber}`} className="w-full">
                                                <Button size="sm" variant="secondary" className="w-full gap-2">
                                                    <BarChart3 size={14} /> Generate Report
                                                </Button>
                                            </Link>
                                        ) : null}
                                        
                                        <Link href={entry.status === "generated" ? "/user/kmat/learn" : "/user/kmat"} className="w-full">
                                            <Button size="sm" variant="ghost" className="w-full gap-2 group/btn">
                                                Review Material <ChevronRight size={14} className="transition-transform group-hover/btn:translate-x-1" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
      )}
    </div>
  );
}
