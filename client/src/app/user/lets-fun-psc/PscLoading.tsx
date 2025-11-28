"use client";
import { Loader2 } from "lucide-react";
import { Card } from "@/src/components/shared/components/ui/card";

export function PscLoading() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="p-8 text-center bg-white/90 backdrop-blur-sm border-0 shadow-xl max-w-md">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Loading Question...</h3>
        <p className="text-gray-600">
          Please wait while we fetch your PSC question
        </p>
      </Card>
    </div>
  );
}
