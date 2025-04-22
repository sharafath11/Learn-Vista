
'use client';

import { useLoading } from "../hooks/useLoading";



export const LoadingSpinner = () => {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 grid place-items-center">
      <div className="animate-spin h-10 w-10 border-4 border-white/30 rounded-full border-t-white"></div>
    </div>
  );
};