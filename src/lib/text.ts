import type { Lang } from "./types";

export function pick(lang: Lang, bn?: string, en?: string): string {
  const primary = lang === "en" ? en : bn;
  return (primary || bn || en || "").trim();
}

const MONTHS_BN = ["জানু", "ফেব", "মার্চ", "এপ্রি", "মে", "জুন", "জুল", "আগ", "সেপ", "অক্ট", "নভে", "ডিসে"];
const MONTHS_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatDay(lang: Lang, value?: string): string {
  const parts = dateParts(lang, value);
  if (!parts) return "";
  return `${parts.day} ${parts.month} ${parts.year}`;
}

export function dateParts(lang: Lang, value?: string): { day: string; month: string; year: string } | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const months = lang === "bn" ? MONTHS_BN : MONTHS_EN;
  return { day: String(date.getUTCDate()), month: months[date.getUTCMonth()], year: String(date.getUTCFullYear()) };
}
