"use client";

import { useEffect, useMemo, useState } from "react";
import type { Lang } from "@/lib/types";

const MONTH_NAMES = [
  { bn: "জানুয়ারি", en: "January" },
  { bn: "ফেব্রুয়ারি", en: "February" },
  { bn: "মার্চ", en: "March" },
  { bn: "এপ্রিল", en: "April" },
  { bn: "মে", en: "May" },
  { bn: "জুন", en: "June" },
  { bn: "জুলাই", en: "July" },
  { bn: "আগস্ট", en: "August" },
  { bn: "সেপ্টেম্বর", en: "September" },
  { bn: "অক্টোবর", en: "October" },
  { bn: "নভেম্বর", en: "November" },
  { bn: "ডিসেম্বর", en: "December" },
];

const TYPE_COLORS: Record<string, { bg: string; text: string; labelBn: string; labelEn: string }> = {
  holiday: { bg: "bg-rose-100", text: "text-rose-800", labelBn: "সরকারি / সাধারণ ছুটি", labelEn: "Holiday" },
  exam: { bg: "bg-blue-100", text: "text-blue-800", labelBn: "পরীক্ষা", labelEn: "Examination" },
  event: { bg: "bg-emerald-100", text: "text-emerald-800", labelBn: "অনুষ্ঠান", labelEn: "Event" },
  meeting: { bg: "bg-amber-100", text: "text-amber-800", labelBn: "মিটিং", labelEn: "Meeting" },
  other: { bg: "bg-gray-100", text: "text-gray-800", labelBn: "অন্যান্য", labelEn: "Other" },
};

interface CalendarEventItem {
  _id: string;
  title: string;
  titleBn?: string;
  type: string;
  date: string;
  description?: string;
}

export function PublicCalendar({ lang }: { lang: Lang }) {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [events, setEvents] = useState<CalendarEventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/v1/public/calendar-events?year=${currentYear}`);
        const json = await res.json().catch(() => ({}));
        setEvents(json.data || []);
      } catch {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [currentYear]);

  // Calendar days
  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push({ day: null, dateStr: null });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const mStr = String(currentMonth + 1).padStart(2, "0");
      const dStr = String(d).padStart(2, "0");
      days.push({
        day: d,
        dateStr: `${currentYear}-${mStr}-${dStr}`,
      });
    }

    return days;
  }, [currentYear, currentMonth]);

  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEventItem[]>();
    for (const ev of events) {
      if (!ev.date) continue;
      const dStr = new Date(ev.date).toISOString().slice(0, 10);
      if (!map.has(dStr)) map.set(dStr, []);
      map.get(dStr)!.push(ev);
    }
    return map;
  }, [events]);

  function prevMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  }

  function nextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  }

  const currentMonthEvents = useMemo(() => {
    return events.filter((ev) => {
      const d = new Date(ev.date);
      return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
    });
  }, [events, currentYear, currentMonth]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      {/* Month Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-card p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={prevMonth}
            className="rounded-full border border-line bg-card px-3.5 py-1.5 text-xs font-bold text-ink/80 hover:bg-brand/10 hover:text-brand hover:border-brand/40 transition"
          >
            ‹ {lang === "bn" ? "পূর্ববর্তী" : "Prev"}
          </button>
          <span className="text-lg font-black text-brand min-w-[160px] text-center">
            {lang === "bn" ? MONTH_NAMES[currentMonth].bn : MONTH_NAMES[currentMonth].en} {currentYear}
            {loading && <span className="ml-2 text-xs text-muted font-normal">...</span>}
          </span>
          <button
            type="button"
            onClick={nextMonth}
            className="rounded-full border border-line bg-card px-3.5 py-1.5 text-xs font-bold text-ink/80 hover:bg-brand/10 hover:text-brand hover:border-brand/40 transition"
          >
            {lang === "bn" ? "পরবর্তী" : "Next"} ›
          </button>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {Object.entries(TYPE_COLORS).map(([k, c]) => (
            <span key={k} className="flex items-center gap-1.5 font-medium">
              <span className={`inline-block h-3 w-3 rounded-full ${c.bg}`} />
              <span>{lang === "bn" ? c.labelBn : c.labelEn}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="rounded-2xl border border-line bg-card overflow-hidden shadow-sm">
        {/* Days Header */}
        <div className="grid grid-cols-7 border-b border-line bg-muted/40 py-2.5 text-center text-xs font-bold uppercase tracking-wider text-muted">
          <div className="text-rose-600">{lang === "bn" ? "রবি" : "Sun"}</div>
          <div>{lang === "bn" ? "সোম" : "Mon"}</div>
          <div>{lang === "bn" ? "মঙ্গল" : "Tue"}</div>
          <div>{lang === "bn" ? "বুধ" : "Wed"}</div>
          <div>{lang === "bn" ? "বৃহস্পতি" : "Thu"}</div>
          <div className="text-rose-600">{lang === "bn" ? "শুক্র" : "Fri"}</div>
          <div className="text-rose-600">{lang === "bn" ? "শনি" : "Sat"}</div>
        </div>

        {/* Day Cells */}
        <div className="grid grid-cols-7 gap-px bg-line">
          {calendarDays.map((cell, idx) => {
            if (!cell.day) {
              return <div key={idx} className="min-h-[100px] bg-background/50 p-2" />;
            }

            const dayEvents = cell.dateStr ? eventsByDate.get(cell.dateStr) ?? [] : [];
            const isToday =
              cell.day === today.getDate() &&
              currentMonth === today.getMonth() &&
              currentYear === today.getFullYear();

            return (
              <div
                key={idx}
                className={`min-h-[100px] bg-card p-2 flex flex-col justify-between ${
                  isToday ? "ring-2 ring-brand ring-inset" : ""
                }`}
              >
                <div className="flex justify-between items-center">
                  <span
                    className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                      isToday ? "bg-brand text-on-brand" : "text-foreground"
                    }`}
                  >
                    {cell.day}
                  </span>
                </div>

                <div className="mt-1 space-y-1 flex-1 overflow-y-auto max-h-[70px]">
                  {dayEvents.map((ev) => {
                    const style = TYPE_COLORS[ev.type] || TYPE_COLORS.other;
                    const eventTitle = (lang === "bn" && ev.titleBn) ? ev.titleBn : ev.title;
                    return (
                      <div
                        key={ev._id}
                        className={`rounded px-1.5 py-0.5 text-[10px] font-semibold truncate ${style.bg} ${style.text}`}
                        title={eventTitle}
                      >
                        {eventTitle}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Monthly Holidays & Events List */}
      <div className="rounded-2xl border border-line bg-card p-6 shadow-sm">
        <h3 className="text-base font-bold text-foreground mb-4">
          {lang === "bn"
            ? `${MONTH_NAMES[currentMonth].bn} মাসের ছুটির তালিকা ও ইভেন্টসমূহ`
            : `Events & Holidays in ${MONTH_NAMES[currentMonth].en}`}
        </h3>

        {!currentMonthEvents.length ? (
          <p className="text-xs text-muted italic">
            {lang === "bn" ? "এই মাসে কোনো ছুটির দিন বা ইভেন্ট তালিকাভুক্ত নেই।" : "No events scheduled for this month."}
          </p>
        ) : (
          <div className="space-y-2">
            {currentMonthEvents.map((ev) => {
              const style = TYPE_COLORS[ev.type] || TYPE_COLORS.other;
              const title = (lang === "bn" && ev.titleBn) ? ev.titleBn : ev.title;
              return (
                <div
                  key={ev._id}
                  className="flex items-center justify-between rounded-xl border border-line/60 bg-background/50 p-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-brand whitespace-nowrap">
                      {new Date(ev.date).toLocaleDateString()}
                    </span>
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold ${style.bg} ${style.text}`}>
                      {lang === "bn" ? style.labelBn : style.labelEn}
                    </span>
                    <span className="text-sm font-semibold text-foreground">{title}</span>
                  </div>
                  {ev.description && (
                    <span className="text-xs text-muted max-w-xs truncate">{ev.description}</span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
