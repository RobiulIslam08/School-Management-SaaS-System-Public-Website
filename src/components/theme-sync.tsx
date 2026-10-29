"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

interface BrandingThemePayload {
  primary?: string;
  onPrimary?: string;
  surface?: string;
  ink?: string;
  accent?: string;
}

function validHex(value: string | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  return /^#[0-9a-fA-F]{6}$/.test(trimmed) ? trimmed.toLowerCase() : null;
}

function hexToRgb(hex: string): string {
  const clean = hex.replace("#", "");
  const normalized = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const num = Number.parseInt(normalized, 16);
  if (Number.isNaN(num)) return "20, 83, 45";
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `${r}, ${g}, ${b}`;
}

function linearize(value: number): number {
  return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  const r = linearize(Number.parseInt(hex.slice(1, 3), 16) / 255);
  const g = linearize(Number.parseInt(hex.slice(3, 5), 16) / 255);
  const b = linearize(Number.parseInt(hex.slice(5, 7), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(fg: string, bg: string): number {
  const l1 = luminance(fg);
  const l2 = luminance(bg);
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

function readableOn(bg: string): "#111111" | "#ffffff" {
  const white = contrastRatio("#ffffff", bg);
  const ink = contrastRatio("#111111", bg);
  if (white >= 4.5 && white >= ink) return "#ffffff";
  if (ink >= 4.5) return "#111111";
  return white >= ink ? "#ffffff" : "#111111";
}

function applyThemeToDom(theme: BrandingThemePayload): void {
  const brand = validHex(theme.primary);
  if (!brand || typeof document === "undefined") return;
  const onBrand = validHex(theme.onPrimary) ?? readableOn(brand);
  const paper = validHex(theme.surface) ?? "#f6f3ec";
  const ink = validHex(theme.ink) ?? "#1c1917";
  const accent = validHex(theme.accent) ?? "#8a6a32";
  const brandRgb = hexToRgb(brand);
  const paperRgb = hexToRgb(paper);
  const inkRgb = hexToRgb(ink);
  const accentRgb = hexToRgb(accent);

  const root = document.documentElement;
  root.style.setProperty("--brand", brand);
  root.style.setProperty("--brand-rgb", brandRgb);
  root.style.setProperty("--on-brand", onBrand);
  root.style.setProperty("--paper", paper);
  root.style.setProperty("--paper-rgb", paperRgb);
  root.style.setProperty("--ink", ink);
  root.style.setProperty("--ink-rgb", inkRgb);
  root.style.setProperty("--accent", accent);
  root.style.setProperty("--accent-rgb", accentRgb);

  const styleEl = document.getElementById("school-theme-vars");
  if (styleEl) {
    styleEl.textContent = `:root{color-scheme:light;--brand:${brand};--brand-rgb:${brandRgb};--on-brand:${onBrand};--paper:${paper};--paper-rgb:${paperRgb};--ink:${ink};--ink-rgb:${inkRgb};--accent:${accent};--accent-rgb:${accentRgb};--card:#fffdf8;--card-rgb:255, 253, 248;}`;
  }
}

export function ThemeSync({ initialPrimary }: { initialPrimary: string }) {
  const pathname = usePathname();
  const currentPrimaryRef = useRef(initialPrimary.toLowerCase());
  const inFlightRef = useRef(false);
  const lastSyncAtRef = useRef(0);

  useEffect(() => {
    const validInitial = validHex(initialPrimary);
    if (validInitial) {
      currentPrimaryRef.current = validInitial;
      applyThemeToDom({ primary: validInitial });
    }
  }, [initialPrimary]);

  useEffect(() => {
    let cancelled = false;

    async function syncFromServer(force = false) {
      if (inFlightRef.current || cancelled) return;
      const now = Date.now();
      if (!force && now - lastSyncAtRef.current < 10_000) return;
      inFlightRef.current = true;
      lastSyncAtRef.current = now;
      try {
        const res = await fetch(`/api/v1/public/branding?_t=${now}`, {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
        });
        if (!res.ok || cancelled) return;
        const json = (await res.json()) as { data?: { theme?: BrandingThemePayload } };
        const theme = json?.data?.theme;
        const nextPrimary = validHex(theme?.primary);
        if (nextPrimary && theme) {
          currentPrimaryRef.current = nextPrimary;
          applyThemeToDom(theme);
        }
      } catch {
        // Ignore transient network errors
      } finally {
        inFlightRef.current = false;
      }
    }

    const initialTimer = window.setTimeout(() => {
      void syncFromServer();
    }, 300);

    const onFocus = () => {
      void syncFromServer(true);
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        void syncFromServer(true);
      }
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === "school-theme-updated" && event.newValue) {
        try {
          const parsed = JSON.parse(event.newValue) as { primary?: string };
          if (validHex(parsed.primary)) {
            applyThemeToDom({ primary: parsed.primary });
          }
        } catch {
          // Ignore malformed storage payload
        }
        void syncFromServer(true);
      }
    };

    window.addEventListener("focus", onFocus);
    window.addEventListener("pageshow", onFocus);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("storage", onStorage);

    let channel: BroadcastChannel | null = null;
    if (typeof BroadcastChannel !== "undefined") {
      try {
        channel = new BroadcastChannel("school-theme-sync");
        channel.onmessage = (event: MessageEvent<{ primary?: string }>) => {
          const primary = validHex(event.data?.primary);
          if (primary) {
            applyThemeToDom({ primary });
          }
          void syncFromServer(true);
        };
      } catch {
        channel = null;
      }
    }

    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        void syncFromServer(true);
      }
    }, 15_000);

    return () => {
      cancelled = true;
      window.clearTimeout(initialTimer);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("pageshow", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("storage", onStorage);
      window.clearInterval(timer);
      if (channel) {
        channel.close();
      }
    };
  }, [pathname]);

  return null;
}
