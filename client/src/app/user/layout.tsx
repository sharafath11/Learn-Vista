"use client"

import { ReactNode } from "react";
import Footer from "@/src/components/user/Footer";
import { UserProvider, useUserContext } from "@/src/context/userAuthContext";
import { SessionProvider } from "next-auth/react";
import { NotificationListener } from "@/src/components/NotificationListener";
import { Header } from "@/src/components/user/header/Header";
import ClientLayout from "../client-layout";

interface UserLayoutProps {
  children: ReactNode;
}
function NotificationWrapper() {
  const { user } = useUserContext();

  if (!user) return null;

  return (
    <NotificationListener
      userId={user.id || user.id}
      role="user"
    />
  );
}


export default function UserLayout({ children }: UserLayoutProps) {
  return (
    <SessionProvider>
      <UserProvider>
        <NotificationWrapper />
        <div className="min-h-screen flex flex-col bg-white overflow-x-hidden">
          <Header />
          <main className="flex-grow"> <ClientLayout>{children}</ClientLayout></main>
          <Footer />
        </div>
      </UserProvider>
    </SessionProvider>
  );
}
