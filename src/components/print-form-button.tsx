"use client";

import type { Lang } from "@/lib/types";

export function PrintFormButton({ lang }: { lang: Lang }) {
  return (
    <button
      type="button"
      className="rounded-full bg-brand px-6 py-2.5 text-sm font-bold text-on-brand hover:opacity-90 shadow cursor-pointer"
      onClick={() => window.print()}
    >
      🖨️ {lang === "bn" ? "ভর্তি ফরম প্রিন্ট করুন" : "Print Admission Form"}
    </button>
  );
}
