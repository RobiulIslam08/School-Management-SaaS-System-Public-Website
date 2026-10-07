"use client";

import { useEffect, useState } from "react";
import type { ClassItem, Lang } from "@/lib/types";

interface Slot {
  day: number;
  period: number;
  section: string;
  subject?: { name?: string; nameBn?: string } | null;
  teacherName?: string;
}

const DAYS = [
  { id: 0, bn: "রবি", en: "Sun" },
  { id: 1, bn: "সোম", en: "Mon" },
  { id: 2, bn: "মঙ্গল", en: "Tue" },
  { id: 3, bn: "বুধ", en: "Wed" },
  { id: 4, bn: "বৃহস্পতি", en: "Thu" },
];

const PERIODS = [1, 2, 3, 4, 5, 6];

export function RoutineBoard({ classes, lang }: { classes: ClassItem[]; lang: Lang }) {
  const [classId, setClassId] = useState(classes[0]?._id ?? "");
  const [section, setSection] = useState(classes[0]?.sections[0] ?? "");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [message, setMessage] = useState("");
  const selected = classes.find((item) => item._id === classId);
  const bn = lang === "bn";

  useEffect(() => {
    if (!classId) return;
    let cancelled = false;
    setMessage("");
    fetch(`/api/v1/public/website/routine?classId=${classId}&section=${encodeURIComponent(section)}`)
      .then(async (response) => {
        const json = (await response.json()) as { data?: Slot[]; message?: string };
        if (cancelled) return;
        if (!response.ok) {
          setSlots([]);
          setMessage(json.message || (bn ? "রুটিন লোড হয়নি।" : "Routine could not be loaded."));
          return;
        }
        setSlots(json.data ?? []);
        if (!json.data?.length) setMessage(bn ? "এই শাখায় এখনো রুটিন নেই।" : "No routine for this section yet.");
      })
      .catch(() => {
        if (!cancelled) setMessage(bn ? "রুটিন লোড হয়নি।" : "Routine could not be loaded.");
      });
    return () => {
      cancelled = true;
    };
  }, [classId, section, bn]);

  function cell(day: number, period: number) {
    return slots.find((slot) => slot.day === day && slot.period === period);
  }

  return (
    <div className="mx-auto max-w-6xl space-y-4 px-4 py-8">
      <div className="flex flex-wrap gap-3">
        <label className="text-sm">
          {bn ? "ক্লাস" : "Class"}
          <select
            className="mt-1 block h-11 rounded-md border border-line bg-card px-3"
            value={classId}
            onChange={(event) => {
              const next = classes.find((item) => item._id === event.target.value);
              setClassId(event.target.value);
              setSection(next?.sections[0] ?? "");
            }}
          >
            {classes.map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}
          </select>
        </label>
        <label className="text-sm">
          {bn ? "শাখা" : "Section"}
          <select className="mt-1 block h-11 rounded-md border border-line bg-card px-3" value={section} onChange={(event) => setSection(event.target.value)}>
            {(selected?.sections ?? []).map((name) => <option key={name} value={name}>{name}</option>)}
          </select>
        </label>
      </div>
      <p className="text-sm leading-6 text-muted">
        {bn
          ? "সপ্তাহ রবি থেকে বৃহস্পতি, ছয়টি পিরিয়ড। খালি ঘর মানে সেই সময়ে ক্লাস বসানো হয়নি। বিষয় ও শিক্ষক ড্যাশবোর্ডের রুটিন থেকে আসে।"
          : "The week runs Sunday to Thursday, six periods. An empty cell means no lesson is set. Subjects and teachers come from the dashboard routine."}
      </p>
      {message ? <p className="text-sm text-muted">{message}</p> : null}
      <div className="sheet overflow-x-auto">
        <table className="w-full min-w-[40rem] border-collapse text-sm">
          <thead>
            <tr>
              <th className="border border-line p-2 text-left">{bn ? "পিরিয়ড" : "Period"}</th>
              {DAYS.map((day) => (
                <th key={day.id} className="border border-line p-2 text-left">{bn ? day.bn : day.en}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PERIODS.map((period) => (
              <tr key={period}>
                <td className="border border-line p-2 font-semibold">{period}</td>
                {DAYS.map((day) => {
                  const slot = cell(day.id, period);
                  const subject = slot?.subject?.nameBn || slot?.subject?.name;
                  return (
                    <td key={day.id} className="border border-line p-2 align-top">
                      <span className="block font-medium">{subject || "—"}</span>
                      {slot?.teacherName ? <span className="text-xs text-muted">{slot.teacherName}</span> : null}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
