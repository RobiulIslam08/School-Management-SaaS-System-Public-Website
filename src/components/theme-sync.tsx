"use client";

import { useEffect, useRef } from "react";
import { hasThemePrimary, resolveThemeVars, themeCss, themeKey, themeStyle, type ThemeVars } from "@/lib/theme-vars";
import type { ThemeTokens } from "@/lib/types";

const POLL_MS = 15_000;
const MIN_GAP_MS = 2_000;
/** First check runs after the page is interactive so it never competes with LCP. */
const FIRST_CHECK_MS = 1_500;

function applyThemeToDom(vars: ThemeVars): void {
  const root = document.documentElement;
  for (const [name, value] of Object.entries(themeStyle(vars))) root.style.setProperty(name, value);
  const styleEl = document.getElementById("school-theme-vars");
  if (styleEl) styleEl.textContent = themeCss(vars);
}

/**
 * The server already painted `initialTheme`; this only picks up a theme saved in the
 * dashboard after the static page was generated (once after load, on tab focus, and every
 * 15s while visible). Applies the full token set, and only when it actually differs, so normal
 * navigation never touches colors.
 */
export function ThemeSync({ initialTheme }: { initialTheme: ThemeVars }) {
  const currentKeyRef = useRef(themeKey(initialTheme));
  const inFlightRef = useRef(false);
  const lastSyncAtRef = useRef(0);

  useEffect(() => {
    let cancelled = false;

    function applyIfChanged(theme: Partial<ThemeTokens> | undefined) {
      if (!hasThemePrimary(theme)) return;
      const vars = resolveThemeVars(theme);
      const key = themeKey(vars);
      if (key === currentKeyRef.current) return;
      currentKeyRef.current = key;
      applyThemeToDom(vars);
    }

    async function syncFromServer(force = false) {
      if (inFlightRef.current || cancelled) return;
      const now = Date.now();
      if (!force && now - lastSyncAtRef.current < MIN_GAP_MS) return;
      inFlightRef.current = true;
      lastSyncAtRef.current = now;
      try {
        const res = await fetch(`/api/v1/public/branding?_t=${now}`, { cache: "no-store" });
        if (!res.ok || cancelled) return;
        const json = (await res.json()) as { data?: { theme?: Partial<ThemeTokens> } };
        applyIfChanged(json?.data?.theme);
      } catch {
        // Keep the server-painted theme on network errors.
      } finally {
        inFlightRef.current = false;
      }
    }

    const onFocus = () => void syncFromServer();
    const onVisibility = () => {
      if (document.visibilityState === "visible") void syncFromServer();
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === "school-theme-updated" && event.newValue) void syncFromServer(true);
    };

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("storage", onStorage);

    let channel: BroadcastChannel | null = null;
    if (typeof BroadcastChannel !== "undefined") {
      try {
        channel = new BroadcastChannel("school-theme-sync");
        channel.onmessage = () => void syncFromServer(true);
      } catch {
        channel = null;
      }
    }

    const firstCheck = window.setTimeout(() => void syncFromServer(true), FIRST_CHECK_MS);
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") void syncFromServer();
    }, POLL_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(firstCheck);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("storage", onStorage);
      window.clearInterval(timer);
      channel?.close();
    };
  }, []);

  return null;
}
