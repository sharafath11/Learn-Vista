"use client";

import { useState } from "react";
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
import { AlertCircle, CheckCircle2, Lightbulb } from "lucide-react";

// Mock Data for KMAT Content
const kmatSections = [
  {
    id: "quantitative",
    title: "Quantitative Aptitude",
    topics: [
      {
        id: "arithmetic",
        title: "Arithmetic",
        concept: "Focus on percentages, ratios, and averages. These are foundational for DI.",
        example: "If A is 20% more than B, B is how much percent less than A? Answer: 16.66%",
        mistake: "Confusing simple interest with compound interest formulas on short durations.",
      },
      {
        id: "algebra",
        title: "Algebra",
        concept: "Master quadratic equations and basic linear inequalities.",
        example: "Roots of x^2 - 5x + 6 = 0 are 2 and 3.",
        mistake: "Forgetting to change the inequality sign when multiplying by a negative number.",
      }
    ]
  },
  {
    id: "logical",
    title: "Logical Reasoning",
    topics: [
      {
        id: "series",
        title: "Number Series",
        concept: "Look for differences, squares, cubes, and prime patterns.",
        example: "2, 5, 10, 17, ...? Next is 26 (n^2 + 1 format).",
        mistake: "Overcomplicating simple difference patterns.",
      },
      {
        id: "syllogism",
        title: "Syllogisms",
        concept: "Use Venn diagrams to verify all conclusion possibilities.",
        example: "All cats are dogs. Some dogs are birds. -> Some cats may be birds (possibility).",
        mistake: "Assuming 'Some' implies 'Some not'.",
      }
    ]
  },
  {
    id: "verbal",
    title: "Verbal Ability",
    topics: [
      {
        id: "rc",
        title: "Reading Comprehension",
        concept: "Read the first and last paragraph to grasp the main idea quickly.",
        example: "Passage tone identification: Satirical vs Critical.",
        mistake: "Bringing outside knowledge into passage-based questions.",
      }
    ]
  },
  {
    id: "gk",
    title: "General Knowledge",
    topics: [
      {
        id: "current_affairs",
        title: "Current Affairs",
        concept: "Focus on last 6 months of business and economic news.",
        example: "CEO appointments, Mergers & Acquisitions.",
        mistake: "Ignoring static GK like Headquarters of international orgs.",
      }
    ]
  }
  
];

export default function KmatLearnPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            KMAT Kerala Preparation
          </h1>
          <p className="text-muted-foreground mt-2">
            Master concepts, avoid common pitfalls, and practice for success.
          </p>
        </div>
        <div className="flex gap-3">
           <Link href="/kmat/exam">
             <Button variant="outline" className="gap-2">
               Take Full Mock Exam
             </Button>
           </Link>
           <Link href="/kmat/practice">
             <Button className="gap-2">
               start Practice
             </Button>
           </Link>
        </div>
      </div>

      <Tabs defaultValue="quantitative" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-8 h-auto p-1">
          {kmatSections.map((section) => (
            <TabsTrigger key={section.id} value={section.id} className="py-3">
              {section.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {kmatSections.map((section) => (
          <TabsContent key={section.id} value={section.id} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
              {section.topics.map((topic) => (
                <Card key={topic.id} className="overflow-hidden border-l-4 border-l-primary/60">
                  <CardHeader className="bg-secondary/20 pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{topic.title}</CardTitle>
                        <CardDescription>Key Concept</CardDescription>
                      </div>
                      <Link href={`/kmat/practice?section=${
                        section.id === "quantitative" ? "Quantitative Ability" :
                        section.id === "logical" ? "Logical Reasoning" :
                        section.id === "verbal" ? "Language Comprehension" : "General Knowledge"
                      }&topic=${topic.title}`}>
                         <Button size="sm" variant="secondary" className="hover:bg-primary hover:text-primary-foreground">
                           Practice {topic.title}
                         </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 grid gap-4 md:grid-cols-3">
                    
                    <div className="space-y-2 col-span-1">
                       <h4 className="font-semibold flex items-center gap-2 text-primary">
                         <Lightbulb size={18} /> Concept
                       </h4>
                       <p className="text-sm text-foreground/80 leading-relaxed">
                         {topic.concept}
                       </p>
                    </div>

                    <div className="space-y-2 col-span-1 bg-green-50/50 dark:bg-green-900/10 p-3 rounded-lg border border-green-100 dark:border-green-900/20">
                       <h4 className="font-semibold flex items-center gap-2 text-green-700 dark:text-green-400">
                         <CheckCircle2 size={18} /> Example
                       </h4>
                       <p className="text-sm text-foreground/80 italic">
                         "{topic.example}"
                       </p>
                    </div>

                    <div className="space-y-2 col-span-1 bg-red-50/50 dark:bg-red-900/10 p-3 rounded-lg border border-red-100 dark:border-red-900/20">
                       <h4 className="font-semibold flex items-center gap-2 text-destructive">
                         <AlertCircle size={18} /> Watch Out
                       </h4>
                       <p className="text-sm text-foreground/80">
                         {topic.mistake}
                       </p>
                    </div>

                  </CardContent>
                </Card>
              ))}
            </div>
            
             <Card className="bg-primary/5 text-primary-foreground border-none mt-8">
               <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                 <div className="text-primary">
                   <h3 className="text-lg font-bold">Ready to test your knowledge in {section.title}?</h3>
                   <p className="text-sm opacity-90">Attempt mixed bag questions from this section.</p>
                 </div>
                 <Link href={`/kmat/practice?section=${
                   section.id === "quantitative" ? "Quantitative Ability" :
                   section.id === "logical" ? "Logical Reasoning" :
                   section.id === "verbal" ? "Language Comprehension" : "General Knowledge"
                 }&topic=General`}>
                   <Button size="lg" className="shadow-lg">
                     Start {section.title} Practice
                   </Button>
                 </Link>
               </CardContent>
             </Card>

          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
