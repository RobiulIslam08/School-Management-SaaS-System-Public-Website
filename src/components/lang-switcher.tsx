"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import type { Lang } from "@/lib/types";

const YEAR = 60 * 60 * 24 * 365;

function writeLangCookie(lang: Lang) {
  document.cookie = `lang=${lang}; path=/; SameSite=Lax; Max-Age=${YEAR}`;
}

/**
 * Instant language toggle: set cookie + soft refresh.
 * Avoids /locale redirect round-trip and the full-page "লোড হচ্ছে" bar.
 */
export function LangSwitcher({ lang }: { lang: Lang }) {
  const router = useRouter();
  const [current, setCurrent] = useState<Lang>(lang);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    setCurrent(lang);
  }, [lang]);

  function onSwitch() {
    if (pending) return;
    const next: Lang = current === "bn" ? "en" : "bn";
    setCurrent(next);
    writeLangCookie(next);
    document.documentElement.lang = next;
    startTransition(() => {
      router.refresh();
    });
  }

  const label = current === "bn" ? "English" : "বাংলা";
  const aria = current === "bn" ? "Switch to English" : "বাংলায় দেখুন";

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
