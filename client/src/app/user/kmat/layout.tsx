"use client";

import ClientLayout from "@/src/app/ClientLayout";
import { Header } from "@/src/components/user/header/Header";
import Footer from "@/src/components/user/Footer";
import { UserProvider } from "@/src/context/userAuthContext";
import { SessionProvider } from "next-auth/react";

export default function KmatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <UserProvider>
        <div className="min-h-screen flex flex-col bg-white overflow-x-hidden">
          <Header />
          <main className="flex-grow">
            <ClientLayout>{children}</ClientLayout>
          </main>
          <Footer />
        </div>
      </UserProvider>
    </SessionProvider>
  );
}
