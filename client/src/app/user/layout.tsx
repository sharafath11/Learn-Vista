"use client"
import { ReactNode } from "react";
import Footer from "@/src/components/user/Footer";
import Header from "@/src/components/user/header/Header";
import { UserProvider } from "@/src/context/userAuthContext";
import { SessionProvider } from "next-auth/react";

interface UserLayoutProps {
  children: ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
  return (
    <SessionProvider>
    <UserProvider>
      <div className="min-h-screen flex flex-col bg-white overflow-x-hidden">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
      </UserProvider>
      </SessionProvider>
  );
}
