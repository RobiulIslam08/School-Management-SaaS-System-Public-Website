"use client";

import { useState } from "react";
import { PublicMarksheet, type MarksheetSchool, type PublicResultCard } from "@/components/public-marksheet";
import type { Lang } from "@/lib/types";

export function ResultLookup({ lang, enabled, school }: { lang: Lang; enabled: boolean; school: MarksheetSchool }) {
  const [studentId, setStudentId] = useState("");
  const [rows, setRows] = useState<PublicResultCard[]>([]);
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    setRows([]);
    try {
      const response = await fetch("/api/v1/public/website/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId }),
      });
      const json = (await response.json().catch(() => ({}))) as { data?: PublicResultCard[]; message?: string };
      if (!response.ok) {
        setMessage(json.message || (lang === "bn" ? "ফলাফল মেলেনি।" : "No result matched."));
        return;
      }
      setRows(json.data ?? []);
    } catch {
      setMessage(lang === "bn" ? "ফলাফল খোঁজা যায়নি।" : "Result lookup failed.");
    } finally {
      setPending(false);
    }
  }

  if (!enabled) {
    return <p className="mx-auto max-w-xl px-4 pb-16">{lang === "bn" ? "ফলাফল খোঁজা এখন বন্ধ আছে।" : "Result lookup is not open yet."}</p>;
  }

  return (
    <div className="public-results mx-auto max-w-7xl px-4 py-12">
      <form className="sheet mx-auto grid max-w-xl gap-4 p-6" onSubmit={submit}>
        <label className="text-sm">{lang === "bn" ? "শিক্ষার্থী আইডি" : "Student ID"}
          <input required className="mt-1 h-11 w-full rounded-md border border-line bg-card px-3" value={studentId} onChange={(e) => setStudentId(e.target.value)} />
        </label>
        <button disabled={pending} className="h-11 rounded-full bg-brand px-5 font-semibold text-on-brand disabled:opacity-60" type="submit">
          {pending ? (lang === "bn" ? "খোঁজা হচ্ছে…" : "Looking up…") : (lang === "bn" ? "ফলাফল দেখুন" : "Look up")}
        </button>
      </form>
      {message ? <p className="mx-auto mt-4 max-w-xl text-sm" role="alert">{message}</p> : null}
      {rows.length ? (
        <div className="marksheet-stack">
          <button type="button" className="no-print marksheet-print" onClick={() => window.print()}>
            {lang === "bn" ? "মার্কশিট প্রিন্ট" : "Print marksheet"}
          </button>
          {rows.map((row, index) => (
            <PublicMarksheet key={`${row.exam.name}-${index}`} row={row} school={school} lang={lang} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
