"use client";

import { useState } from "react";
import { PublicMarksheet, type MarksheetSchool, type PublicResultCard } from "@/components/public-marksheet";
import type { Lang } from "@/lib/types";

function toBnDigits(str: string): string {
  return str.replace(/\d/g, (digit) => "০১২৩৪৫৬৭৮৯"[Number(digit)] ?? digit);
}

export function ResultLookup({ lang, enabled, school }: { lang: Lang; enabled: boolean; school: MarksheetSchool }) {
  const currentYear = new Date().getFullYear();
  const defaultYear = school.academicYear || String(currentYear);
  const [studentId, setStudentId] = useState("");
  const [academicYear, setAcademicYear] = useState(defaultYear);
  const [rows, setRows] = useState<PublicResultCard[]>([]);
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  const bn = lang === "bn";
  const years = [
    String(currentYear + 1),
    String(currentYear),
    String(currentYear - 1),
    String(currentYear - 2),
    String(currentYear - 3),
    String(currentYear - 4),
  ];
  if (!years.includes(defaultYear)) years.unshift(defaultYear);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    setRows([]);
    try {
      const response = await fetch("/api/v1/public/website/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: studentId.trim(),
          academicYear: academicYear.trim(),
        }),
      });
      const json = (await response.json().catch(() => ({}))) as { data?: PublicResultCard[]; message?: string };
      if (!response.ok) {
        setMessage(json.message || (bn ? "ফলাফল মেলেনি।" : "No result matched."));
        return;
      }
      setRows(json.data ?? []);
    } catch {
      setMessage(bn ? "ফলাফল খোঁজা যায়নি।" : "Result lookup failed.");
    } finally {
      setPending(false);
    }
  }

  if (!enabled) {
    return <p className="mx-auto max-w-xl px-4 pb-16">{bn ? "ফলাফল খোঁজা এখন বন্ধ আছে।" : "Result lookup is not open yet."}</p>;
  }

  return (
    <div className="public-results mx-auto max-w-7xl px-4 py-12">
      <form className="sheet mx-auto grid max-w-xl gap-4 p-6 shadow-md rounded-2xl border border-line bg-card" onSubmit={submit}>
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="text-sm font-semibold text-foreground">
            {bn ? "শিক্ষার্থী আইডি (Student ID)" : "Student ID"}
            <input
              required
              placeholder={bn ? "যেমন: 121204" : "e.g. 121204"}
              className="mt-1 h-11 w-full rounded-md border border-line bg-background px-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            />
          </label>
          <label className="text-sm font-semibold text-foreground">
            {bn ? "শিক্ষাবর্ষ (Academic Year)" : "Academic Year"}
            <select
              className="mt-1 h-11 w-full rounded-md border border-line bg-background px-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {bn ? `${toBnDigits(y)} শিক্ষাবর্ষ` : `Year ${y}`}
                </option>
              ))}
            </select>
          </label>
        </div>
        <button
          disabled={pending}
          className="h-11 rounded-full bg-brand px-5 font-semibold text-on-brand hover:opacity-90 transition disabled:opacity-60 shadow-xs flex items-center justify-center gap-2"
          type="submit"
        >
          {pending ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>{bn ? "ফলাফল খোঁজা হচ্ছে…" : "Looking up…"}</span>
            </>
          ) : (
            <span>🔍 {bn ? "ফলাফল দেখুন" : "Look up result"}</span>
          )}
        </button>
      </form>
      {message ? <p className="mx-auto mt-4 max-w-xl text-sm text-center text-rose-700 bg-rose-50 p-3 rounded-xl border border-rose-200" role="alert">{message}</p> : null}
      {rows.length ? (
        <div className="marksheet-stack">
          <button type="button" className="no-print marksheet-print" onClick={() => window.print()}>
            {bn ? "মার্কশিট প্রিন্ট" : "Print marksheet"}
          </button>
          {rows.map((row, index) => (
            <PublicMarksheet key={`${row.exam.name}-${index}`} row={row} school={school} lang={lang} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
