"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import AIAssistant from "../components/user/AIAssistant";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import RouteLoader from "../components/RouteLoader";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isRouteChanging, setIsRouteChanging] = useState(false);

  useEffect(() => {

    setIsRouteChanging(true);

    const timer = setTimeout(() => setIsRouteChanging(false), 1200);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <ToastContainer />
      {isRouteChanging && <RouteLoader />}
      {children}
      <AIAssistant />
    </body>
  );
}
