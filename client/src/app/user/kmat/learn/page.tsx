"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/src/components/shared/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/shared/components/ui/card";
import { Button } from "@/src/components/shared/components/ui/button";
import { Badge } from "@/src/components/shared/components/ui/badge";
import { ScrollArea } from "@/src/components/shared/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/shared/components/ui/tabs";
import { AlertCircle, CheckCircle2, Lightbulb, Loader2 } from "lucide-react";
import { kmatApi } from "@/src/services/kmatService";
import { showErrorToast } from "@/src/utils/Toast";

export default function KmatLearnPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await kmatApi.getDailyData();
        if (res.success) {
          setData(res.data);
        }
      } catch (error) {
        showErrorToast("Failed to load learn content.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading study material...</p>
      </div>
    );
  }

  if (!data?.learnContent || data.status !== "generated") {
    return (
      <div className="text-center py-20 px-4">
        <h3 className="text-xl font-semibold">Content is still being prepared.</h3>
        <p className="text-muted-foreground mt-2">Please check back in a minute.</p>
        <Link href="/kmat" className="mt-6 inline-block">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  // Group by section for the Tabs UI
  const groupedSections = data.learnContent.reduce((acc: any, item: any) => {
    if (!acc[item.section]) acc[item.section] = [];
    acc[item.section].push(item);
    return acc;
  }, {});

  const sectionKeys = Object.keys(groupedSections);

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Daily Preparation: Day {data.dayNumber}</h1>
          <p className="text-muted-foreground mt-2">
            Focus on these core concepts for today's high-yield KMAT preparation.
          </p>
        </div>
        <div className="flex gap-3">
           <Link href="/kmat/exam">
             <Button variant="outline" className="gap-2">Take Full Mock</Button>
           </Link>
           <Link href="/kmat/practice">
             <Button className="gap-2 shadow-sm">Start Practice</Button>
           </Link>
        </div>
      </div>

      <Tabs defaultValue={sectionKeys[0]} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-8 h-auto p-1 bg-secondary/50">
          {sectionKeys.map((section) => (
            <TabsTrigger key={section} value={section} className="py-2.5">
              {section}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(groupedSections).map(([sectionName, topics]: [string, any]) => (
          <TabsContent key={sectionName} value={sectionName} className="space-y-6">
            <div className="grid gap-6">
              {topics.map((item: any, idx: number) => (
                <Card key={idx} className="overflow-hidden border-l-4 border-l-primary/60 hover:shadow-md transition-shadow">
                  <CardHeader className="bg-secondary/10 pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{item.topic}</CardTitle>
                        <CardDescription>{sectionName}</CardDescription>
                      </div>
                      <Badge variant="outline" className="bg-background">Concept {idx + 1}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6 grid gap-6 md:grid-cols-3">
                    
                    <div className="space-y-3 col-span-1">
                       <h4 className="font-semibold flex items-center gap-2 text-primary uppercase text-xs tracking-wider">
                         <Lightbulb size={16} /> The Concept
                       </h4>
                       <p className="text-sm text-foreground/90 leading-relaxed font-medium">
                         {item.concept}
                       </p>
                    </div>

                    <div className="space-y-3 col-span-1 bg-green-50/40 dark:bg-green-900/10 p-4 rounded-xl border border-green-100/50 dark:border-green-900/20">
                       <h4 className="font-semibold flex items-center gap-2 text-green-700 dark:text-green-400 uppercase text-xs tracking-wider">
                         <CheckCircle2 size={16} /> Solved Example
                       </h4>
                       <div className="space-y-2">
                          {item.solvedExamples?.map((ex: any, eIdx: number) => (
                              <div key={eIdx} className="text-sm">
                                  <p className="font-bold mb-1">Q: {ex.question}</p>
                                  <p className="text-foreground/80 italic bg-background/50 p-2 rounded">Sol: {ex.solution}</p>
                              </div>
                          ))}
                       </div>
                    </div>

                    <div className="space-y-3 col-span-1 bg-amber-50/40 dark:bg-amber-900/10 p-4 rounded-xl border border-amber-100/50 dark:border-amber-900/20">
                       <h4 className="font-semibold flex items-center gap-2 text-amber-700 dark:text-amber-400 uppercase text-xs tracking-wider">
                         <AlertCircle size={16} /> Exam Strategy
                       </h4>
                       <div className="space-y-2 text-sm text-foreground/80">
                          <p><span className="font-bold">Avoid:</span> {item.commonMistakes?.[0]}</p>
                          <p><span className="font-bold">Tip:</span> {item.examTips?.[0]}</p>
                       </div>
                    </div>

                  </CardContent>
                </Card>
              ))}
            </div>
            
             <div className="bg-primary/5 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-primary/10">
               <div>
                 <h3 className="text-xl font-bold text-primary">Mastered {sectionName}?</h3>
                 <p className="text-muted-foreground">Test your understanding with handpicked problems.</p>
               </div>
               <Link href="/kmat/practice">
                 <Button size="lg" className="px-8 shadow-md">
                   Start {sectionName} Drills
                 </Button>
               </Link>
             </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
