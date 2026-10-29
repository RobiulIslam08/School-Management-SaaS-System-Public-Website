"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/** Cached static pages swap well under this, so the pill only shows on a genuinely slow hop. */
const SPINNER_DELAY_MS = 400;

export function RouteProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [active, setActive] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [progress, setProgress] = useState(0);
  const spinnerTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (spinnerTimerRef.current) {
      window.clearTimeout(spinnerTimerRef.current);
      spinnerTimerRef.current = null;
    }
    // When path or search parameters change, complete progress and fade out quickly
    const frame = requestAnimationFrame(() => {
      setShowSpinner(false);
      setProgress(100);
    });
    const timer = setTimeout(() => {
      setActive(false);
      setProgress(0);
    }, 150);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
    };
  }, [pathname, searchParams]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = (e.target as HTMLElement)?.closest("a");
      if (!target) return;
      const href = target.getAttribute("href");
      if (!href) return;

      // Skip external, anchor-only, modifier keys, download, target=_blank
      if (
        href.startsWith("#") ||
        href.startsWith("tel:") ||
        href.startsWith("mailto:") ||
        target.target === "_blank" ||
        target.hasAttribute("download") ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }

      try {
        const url = new URL(target.href, window.location.href);
        const currentUrl = new URL(window.location.href);
        // Locale cookie route is a redirect hop — never show the global loader for it.
        if (url.pathname === "/locale") return;
        if (url.origin === currentUrl.origin && (url.pathname !== currentUrl.pathname || url.search !== currentUrl.search)) {
          setActive(true);
          setProgress(35);
          if (spinnerTimerRef.current) window.clearTimeout(spinnerTimerRef.current);
          spinnerTimerRef.current = window.setTimeout(() => {
            setShowSpinner(true);
          }, SPINNER_DELAY_MS);
        }
      } catch {
        // invalid URL, ignore
      }
    }

    document.addEventListener("click", handleClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
      if (spinnerTimerRef.current) window.clearTimeout(spinnerTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        const diff = Math.max(2, (90 - prev) * 0.25);
        return Math.min(90, prev + diff);
      });
    }, 80);
    return () => clearInterval(interval);
  }, [active]);

  if (!active && progress === 0) return null;

  const label = typeof document !== "undefined" && document.documentElement.lang === "en" ? "Loading..." : "লোড হচ্ছে...";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999] transition-opacity duration-150 motion-reduce:transition-none"
      style={{ opacity: active ? 1 : 0 }}
    >
      <div
        className="absolute left-0 top-0 h-[3px] transition-[width] duration-150 ease-out motion-reduce:transition-none"
        style={{
          width: `${progress}%`,
          background: "linear-gradient(90deg, var(--brand, #14532d), var(--accent, #8a6a32), var(--brand, #14532d))",
          boxShadow: "0 0 10px rgba(var(--brand-rgb, 20, 83, 45), 0.7), 0 0 5px rgba(var(--accent-rgb, 138, 106, 50), 0.5)",
        }}
      />

      {showSpinner ? (
        <div className="flex h-full w-full items-center justify-center">
          <div className="flex items-center gap-2 rounded-full border border-line/40 bg-card px-4 py-2 shadow-lg">
            <svg className="h-4 w-4 animate-spin text-brand motion-reduce:animate-none" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path
                className="opacity-90"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="text-sm font-semibold text-brand">{label}</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
