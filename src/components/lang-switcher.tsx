"use client";

import { useState } from "react";
import type { Lang } from "@/lib/types";

const YEAR = 60 * 60 * 24 * 365;

function writeLangCookie(lang: Lang) {
  document.cookie = `lang=${lang}; path=/; SameSite=Lax; Max-Age=${YEAR}`;
}

/**
 * Language lives in the hidden `[lang]` root segment, so switching swaps the root
 * layout; a reload of the (static, cached) page is the reliable way to do that.
 */
export function LangSwitcher({ lang }: { lang: Lang }) {
  const [pending, setPending] = useState(false);

  function onSwitch() {
    if (pending) return;
    setPending(true);
    writeLangCookie(lang === "bn" ? "en" : "bn");
    window.location.reload();
  }

  const label = lang === "bn" ? "English" : "বাংলা";
  const aria = lang === "bn" ? "Switch to English" : "বাংলায় দেখুন";

  return (
    <button
      type="button"
      className="lang-switch"
      onClick={onSwitch}
      aria-busy={pending}
      aria-label={aria}
      title={aria}
    >
      {label}
    </button>
  );
}
