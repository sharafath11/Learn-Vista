"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import RouteLoader from "../components/RouteLoader";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isRouteChanging, setIsRouteChanging] = useState(false);

  useEffect(() => {
    setIsRouteChanging(true);
    const timer = setTimeout(() => setIsRouteChanging(false), 1200);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      {isRouteChanging && <RouteLoader />}
      {children}
    </>
  );
}
