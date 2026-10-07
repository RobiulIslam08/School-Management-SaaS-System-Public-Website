"use client";

import { useEffect, useState } from "react";
import type { Lang } from "@/lib/types";

interface Exam {
  _id: string;
  name: string;
  academicYear?: string;
}

interface Row {
  name: string;
  rollNo: string;
  section: string;
  gpa: number;
  letter: string;
  meritPosition?: number | null;
}

export function MeritList({ lang }: { lang: Lang }) {
  const [exams, setExams] = useState<Exam[]>([]);
  const [examTypeId, setExamTypeId] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    void fetch("/api/v1/public/website/exams")
      .then((response) => response.json())
      .then((json: { data?: Exam[] }) => {
        const list = json.data ?? [];
        setExams(list);
        if (list[0]) setExamTypeId(list[0]._id);
      })
      .catch(() => setMessage(lang === "bn" ? "পরীক্ষার তালিকা লোড হয়নি।" : "Exams could not be loaded."));
  }, [lang]);

  useEffect(() => {
    if (!examTypeId) return;
    void fetch(`/api/v1/public/website/merit?examTypeId=${examTypeId}`)
      .then((response) => response.json())
      .then((json: { data?: { enabled?: boolean; rows?: Row[] }; message?: string }) => {
        if (json.data?.enabled === false) {
          setRows([]);
          setMessage("");
          return;
        }
        setRows(json.data?.rows ?? []);
        setMessage(json.data?.rows?.length ? "" : lang === "bn" ? "এই পরীক্ষায় প্রকাশিত মেধা তালিকা নেই।" : "No published merit list for this exam.");
      })
      .catch(() => setMessage(lang === "bn" ? "মেধা তালিকা লোড হয়নি।" : "Merit list could not be loaded."));
  }, [examTypeId, lang]);

  if (!exams.length) return null;

  return (
    <section className="sheet mx-auto max-w-3xl px-6 py-8">
      <h2 className="text-2xl font-semibold">{lang === "bn" ? "মেধা তালিকা" : "Merit list"}</h2>
      <label className="mt-3 block text-sm">
        {lang === "bn" ? "পরীক্ষা" : "Exam"}
        <select className="mt-1 h-11 w-full rounded-md border border-line bg-card px-3" value={examTypeId} onChange={(event) => setExamTypeId(event.target.value)}>
          {exams.map((exam) => (
            <option key={exam._id} value={exam._id}>{exam.name}</option>
          ))}
        </select>
      </label>
      {message ? <p className="mt-3 text-sm text-muted">{message}</p> : null}
      {rows.length ? (
        <table className="mt-4 w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="py-1">{lang === "bn" ? "ক্রম" : "Rank"}</th>
              <th>{lang === "bn" ? "নাম" : "Name"}</th>
              <th>{lang === "bn" ? "রোল" : "Roll"}</th>
              <th>GPA</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${row.rollNo}-${row.name}`} className="border-t border-line">
                <td className="py-1">{row.meritPosition ?? "—"}</td>
                <td>{row.name}</td>
                <td>{row.rollNo}</td>
                <td>{row.gpa} {row.letter}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </section>
  );
}
