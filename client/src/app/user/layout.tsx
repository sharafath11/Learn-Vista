import { ReactNode } from "react";
import Footer from "@/src/components/user/Footer";
import Header from "@/src/components/user/Header";
import { UserProvider } from "@/src/context/userAuthContext";

interface UserLayoutProps {
  children: ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
  return (
    <UserProvider>
      <div className="min-h-screen flex flex-col bg-white overflow-x-hidden">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
    </UserProvider>
  );
}
