"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/src/components/shared/components/ui/card";
import { Button } from "@/src/components/shared/components/ui/button";
import { Badge } from "@/src/components/shared/components/ui/badge";
import { Progress } from "@/src/components/shared/components/ui/progress";
import { 
    BookOpen, 
    CheckCircle2, 
    Clock, 
    LayoutDashboard, 
    BarChart3, 
    History,
    PlayCircle,
    Loader2,
    AlertCircle
} from "lucide-react";
import { kmatApi } from "@/src/services/kmatService";
import { showErrorToast } from "@/src/utils/Toast";

export default function KmatDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await kmatApi.getDailyData();
        if (res.success) {
          setData(res.data);
        } else {
            setError(res.message || "Failed to load dashboard.");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard.");
        showErrorToast("Error loading KMAT data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Syncing your KMAT journey...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4 text-center">
            <AlertCircle className="w-12 h-12 text-destructive" />
            <h2 className="text-2xl font-bold">Something went wrong</h2>
            <p className="text-muted-foreground max-w-md">{error || "Could not retrieve daily data."}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
    );
  }

  const isGenerated = data.status === "generated";

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">KMAT Kerala Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Day {data.dayNumber} of your preparation journey.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/user/kmat/history">
            <Button variant="outline" className="gap-2">
              <History size={18} /> History
            </Button>
          </Link>
          <Link href={`/user/kmat/report?day=${data.dayNumber}`}>
            <Button variant="outline" className="gap-2">
              <BarChart3 size={18} /> Daily Analysis
            </Button>
          </Link>
        </div>
      </div>

      {!isGenerated ? (
          <Card className="bg-primary/5 border-primary/20">
              <CardContent className="flex flex-col items-center py-12 text-center gap-4">
                  <Clock className="w-12 h-12 text-primary animate-pulse" />
                  <h3 className="text-xl font-bold">Preparation in Progress</h3>
                  <p className="text-muted-foreground max-w-sm">
                      We're tailoring today's study material and mock exam for you. 
                      This usually takes about a minute.
                  </p>
                  <Button variant="secondary" onClick={() => window.location.reload()}>Refresh</Button>
              </CardContent>
          </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Learn Section */}
            <Card className="flex flex-col">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                            <BookOpen size={24} />
                        </div>
                        <Badge variant="secondary">Daily Lessons</Badge>
                    </div>
                    <CardTitle className="mt-4">Concept Nuggets</CardTitle>
                    <CardDescription>Master today's high-yield KMAT topics.</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                    <ul className="space-y-3">
                        {data.learnContent?.map((item: any, idx: number) => (
                            <li key={idx} className="flex items-center gap-2 text-sm text-foreground/80">
                                <CheckCircle2 size={16} className="text-green-500" />
                                {item.section}: {item.topic}
                            </li>
                        ))}
                    </ul>
                </CardContent>
                <CardFooter>
                    <Link href="/user/kmat/learn" className="w-full">
                        <Button className="w-full gap-2">
                            <PlayCircle size={18} /> Start Learning
                        </Button>
                    </Link>
                </CardFooter>
            </Card>

            {/* Practice Section */}
            <Card className="flex flex-col">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                            <LayoutDashboard size={24} />
                        </div>
                        <Badge variant="secondary">Practice</Badge>
                    </div>
                    <CardTitle className="mt-4">Drill Session</CardTitle>
                    <CardDescription>Topic-specific practice questions.</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground">
                        Reinforce today's learning with 10 handpicked practice questions across all sections.
                    </p>
                </CardContent>
                <CardFooter>
                    <Link href="/user/kmat/practice" className="w-full">
                        <Button variant="outline" className="w-full">Start Practice</Button>
                    </Link>
                </CardFooter>
            </Card>

            {/* Mock Exam Section */}
            <Card className="flex flex-col border-primary/20 shadow-md">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-orange-600 dark:text-orange-400">
                            <Clock size={24} />
                        </div>
                        <Badge variant="default" className="bg-orange-600 hover:bg-orange-700">Full Mock</Badge>
                    </div>
                    <CardTitle className="mt-4">Today's Grand Test</CardTitle>
                    <CardDescription>Simulate the real KMAT environment.</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                    <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Duration:</span>
                            <span className="font-semibold">20 Minutes</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Questions:</span>
                            <span className="font-semibold">20 MCQs</span>
                        </div>
                        <Progress value={0} className="h-1.5" />
                    </div>
                </CardContent>
                <CardFooter>
                    <Link href="/user/kmat/exam" className="w-full">
                        <Button variant="default" className="w-full bg-orange-600 hover:bg-orange-700">Attempt Mock</Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
      )}
    </div>
  );
}
