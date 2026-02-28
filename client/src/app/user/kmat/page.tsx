"use client";

import Link from "next/link";
import { Button } from "@/src/components/shared/components/ui/button";
import { Sparkles, Rocket, Clock3 } from "lucide-react";

export default function KmatDashboard() {
  return (
    <div className="relative overflow-hidden min-h-[82vh] px-4">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl animate-pulse [animation-delay:600ms]" />
        <div className="absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl animate-pulse [animation-delay:1200ms]" />
      </div>

      <div className="relative mx-auto max-w-5xl py-16 md:py-24">
        <div className="rounded-3xl border border-white/20 bg-white/70 backdrop-blur-xl shadow-2xl p-8 md:p-12">
          <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg animate-bounce">
            <Rocket className="h-8 w-8" />
          </div>

          <p className="text-center text-xs font-black uppercase tracking-[0.2em] text-cyan-700">
            KMAT Kerala
          </p>
          <h1 className="mt-3 text-center text-4xl md:text-6xl font-black tracking-tight bg-gradient-to-r from-cyan-600 via-blue-700 to-emerald-600 bg-clip-text text-transparent">
            Coming Soon
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-center text-base md:text-lg text-slate-600">
            We are crafting a world-class KMAT experience with adaptive prep, intelligent analysis,
            and real exam simulation. It will be live very soon.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-cyan-100 bg-cyan-50/70 p-4 text-center animate-[pulse_2.6s_ease-in-out_infinite]">
              <Sparkles className="mx-auto mb-2 h-5 w-5 text-cyan-600" />
              <p className="text-sm font-bold text-slate-800">AI-Powered Learning</p>
            </div>
            <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4 text-center animate-[pulse_2.6s_ease-in-out_infinite] [animation-delay:300ms]">
              <Clock3 className="mx-auto mb-2 h-5 w-5 text-blue-600" />
              <p className="text-sm font-bold text-slate-800">Real Exam Timing</p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 text-center animate-[pulse_2.6s_ease-in-out_infinite] [animation-delay:600ms]">
              <Sparkles className="mx-auto mb-2 h-5 w-5 text-emerald-600" />
              <p className="text-sm font-bold text-slate-800">Deep Performance Insights</p>
            </div>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/user">
              <Button className="w-44 bg-blue-600 hover:bg-blue-700">Back To Home</Button>
            </Link>
            <Link href="/user/courses">
              <Button variant="outline" className="w-44 border-cyan-300 text-cyan-700 hover:bg-cyan-50">
                Explore Courses
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
