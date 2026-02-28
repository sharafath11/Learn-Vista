"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    gsap?: {
      fromTo: (target: any, fromVars: Record<string, any>, toVars: Record<string, any>) => any;
      set: (target: any, vars: Record<string, any>) => any;
      context: (fn: () => void, scope?: Element | string | object) => { revert: () => void };
    };
  }
}

const GSAP_CDN = "https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js";

const skipPathPrefixes = ["/user/kmat"];

async function ensureGsapLoaded() {
  if (typeof window === "undefined") return null;
  if (window.gsap) return window.gsap;

  await new Promise<void>((resolve, reject) => {
    const existing = document.querySelector(`script[src="${GSAP_CDN}"]`) as HTMLScriptElement | null;
    if (existing) {
      if ((window as any).gsap) return resolve();
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Failed to load GSAP")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = GSAP_CDN;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load GSAP"));
    document.head.appendChild(script);
  });

  return window.gsap || null;
}

export default function GlobalGsapTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const scopeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (skipPathPrefixes.some((prefix) => pathname.startsWith(prefix))) {
      return;
    }

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    ensureGsapLoaded()
      .then((gsap) => {
        if (!gsap || cancelled || !scopeRef.current) return;

        const ctx = gsap.context(() => {
          const root = scopeRef.current as HTMLDivElement;
          const markedTargets = root.querySelectorAll("[data-gsap]");
          let targets: Element[] | HTMLCollection = markedTargets.length
            ? Array.from(markedTargets)
            : root.children;

          if (!markedTargets.length && root.children.length <= 1) {
            const broadTargets = root.querySelectorAll(
              "main > *, section, article, h1, h2, h3, p, form, table, .card, [class*='Card'], [class*='card']"
            );
            if (broadTargets.length) {
              targets = Array.from(broadTargets);
            }
          }

          gsap.set(root, { autoAlpha: 1 });
          gsap.fromTo(root, { autoAlpha: 0.01 }, { autoAlpha: 1, duration: 0.25, ease: "power1.out" });
          gsap.fromTo(
            targets,
            { y: 18, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.05, ease: "power3.out", clearProps: "all" }
          );
        }, scopeRef);

        cleanup = () => ctx.revert();
      })
      .catch(() => {
        // Do not block rendering if GSAP fails to load.
      });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [pathname]);

  return <div ref={scopeRef}>{children}</div>;
}
