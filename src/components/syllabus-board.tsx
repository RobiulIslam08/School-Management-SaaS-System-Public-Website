"use client";

import { useEffect, useState } from "react";
import type { ClassItem, Lang } from "@/lib/types";

interface Outline {
  _id: string;
  name?: string;
  nameBn?: string;
  chaptersBn?: string[];
  chaptersEn?: string[];
}

export function SyllabusBoard({ classes, lang }: { classes: ClassItem[]; lang: Lang }) {
  const [classId, setClassId] = useState(classes[0]?._id ?? "");
  const [rows, setRows] = useState<Outline[]>([]);
  const [message, setMessage] = useState("");
  const bn = lang === "bn";

  useEffect(() => {
    if (!classId) return;
    let cancelled = false;
    setMessage("");
    fetch(`/api/v1/public/website/syllabus?classId=${classId}`)
      .then(async (response) => {
        const json = (await response.json()) as { data?: Outline[]; message?: string };
        if (cancelled) return;
        if (!response.ok) {
          setRows([]);
          setMessage(json.message || (bn ? "সিলেবাস লোড হয়নি।" : "Syllabus could not be loaded."));
          return;
        }
        setRows(json.data ?? []);
        if (!json.data?.length) setMessage(bn ? "এই ক্লাসের অধ্যায় এখনো প্রকাশিত হয়নি।" : "No chapters are published for this class yet.");
      })
      .catch(() => {
        if (!cancelled) setMessage(bn ? "সিলেবাস লোড হয়নি।" : "Syllabus could not be loaded.");
      });
    return () => {
      cancelled = true;
    };
  }, [classId, bn]);

  return (
    <div className="mx-auto max-w-6xl space-y-4 px-4 py-8">
      <label className="block text-sm">
        {bn ? "ক্লাস" : "Class"}
        <select className="mt-1 block h-11 rounded-md border border-line bg-card px-3" value={classId} onChange={(event) => setClassId(event.target.value)}>
          {classes.map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}
        </select>
      </label>
      <p className="max-w-3xl text-sm leading-6 text-muted">
        {bn
          ? "প্রতিটি বিষয়ের অধ্যায় স্কুল অফিস সাজায়। এটা বইয়ের পাতা নকল নয়। পরীক্ষার তারিখ নোটিশে, আর ফল প্রকাশের আগে এখানে নম্বর থাকে না।"
          : "The office arranges the chapters for each subject. This is not a copy of a textbook. Exam dates sit in a notice, and marks are not listed here before a result is published."}
      </p>
      {message ? <p className="text-sm text-muted">{message}</p> : null}
      <div className="grid gap-4 md:grid-cols-2">
        {rows.map((row) => {
          const chapters = bn ? row.chaptersBn : row.chaptersEn;
          const list = chapters?.length ? chapters : (bn ? row.chaptersEn : row.chaptersBn) ?? [];
          return (
            <article key={row._id} className="sheet p-4">
              <h2 className="text-lg font-semibold">{(bn ? row.nameBn : row.name) || row.name || row.nameBn}</h2>
              <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm leading-6">
                {list.map((chapter, index) => <li key={`${row._id}-${index}`}>{chapter}</li>)}
              </ol>
            </article>
          );
        })}
      </div>
    </div>
  );
}
