"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { ToastContainer } from "react-toastify";
import { MentorsContextProvider } from "@/src/context/mentorContext";
import { MentorNotificationWrapper } from "@/src/components/mentor/MentorNotificationWrapper";
import HeaderWrapper from "@/src/components/mentor/header/HeaderWrapper";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import RouteLoader from "@/src/components/RouteLoader";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isRouteChanging, setIsRouteChanging] = useState(false);

  useEffect(() => {
    setIsRouteChanging(true);
    const timer = setTimeout(() => setIsRouteChanging(false), 1000);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {isRouteChanging && <RouteLoader />}
        <MentorsContextProvider>
          <MentorNotificationWrapper />
          <ToastContainer />
          <HeaderWrapper />
          {children}
        </MentorsContextProvider>
      </body>
    </html>
  );
}
