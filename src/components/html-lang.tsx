"use client";

import { useEffect } from "react";

/** Syncs html[lang] from the lang cookie without forcing the root layout dynamic. */
export function HtmlLang() {
  useEffect(() => {
    const match = document.cookie.match(/(?:^|; )lang=([^;]*)/);
    const lang = match?.[1] === "en" ? "en" : "bn";
    document.documentElement.lang = lang;
  }, []);
  return null;
}
