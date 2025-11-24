import { Suspense } from "react";
import SuccessContent from "./SuccessContent";

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-6">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center space-y-6 animate-fadeIn">
            {/* Animated spinner */}
            <div className="relative inline-block">
              <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin animation-delay-200"></div>
            </div>

            {/* Friendly message */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Processing Your Donation
              </h2>
              <p className="text-gray-600">
                We&apos;re confirming your generous contribution. This
                won&apos;t take long!
              </p>
            </div>

            {/* Subtle progress dots */}
            <div className="flex justify-center space-x-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`w-2 h-2 bg-green-500 rounded-full animate-bounce`}
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
