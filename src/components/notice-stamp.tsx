import type { Lang } from "@/lib/types";
import { dateParts } from "@/lib/text";

export const NOTICE_LABEL: Record<string, { bn: string; en: string }> = {
  all: { bn: "সব", en: "All" },
  exam: { bn: "পরীক্ষা", en: "Exam" },
  holiday: { bn: "ছুটি", en: "Holiday" },
  fee: { bn: "ফি", en: "Fee" },
  admission: { bn: "ভর্তি", en: "Admission" },
  general: { bn: "সাধারণ", en: "General" },
  other: { bn: "অন্যান্য", en: "Other" },
};

export function noticeLabel(lang: Lang, category?: string): string {
  const row = NOTICE_LABEL[category || "general"] ?? NOTICE_LABEL.general;
  return lang === "bn" ? row.bn : row.en;
}

export function NoticeStamp({ lang, value }: { lang: Lang; value?: string }) {
  const parts = dateParts(lang, value);
  if (!parts) return <span className="date-stamp date-stamp-empty">—</span>;
  return (
    <span className="date-stamp">
      <b>{parts.day}</b>
      <span>{parts.month}</span>
    </span>
  );
}
