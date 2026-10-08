"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PublicReceipt, type PublicReceiptSlip, type ReceiptSchool } from "@/components/public-receipt";
import type { Lang } from "@/lib/types";

const METHODS = ["Cash", "bKash", "Nagad", "Rocket", "Bank Transfer", "Cheque", "Other"] as const;

type ReceiptRow = {
  receiptNo: string;
  date: string;
  method: string;
  refNo: string;
  academicYear: string;
  lines: Array<{ title: string; amount: number }>;
  amount: number;
};

type LookupPayload = {
  student: { name: string; nameBn: string; studentId: string; className: string };
  receipts: ReceiptRow[];
};

const text = {
  bn: {
    id: "শিক্ষার্থী আইডি",
    submit: "রসিদ দেখুন",
    pending: "খোঁজা হচ্ছে…",
    closed: "রসিদ খোঁজা এখন বন্ধ আছে।",
    miss: "রসিদ মেলেনি।",
    failed: "রসিদ খোঁজা যায়নি।",
    collected: "মোট জমা",
    count: "রসিদ",
    search: "খাত, রসিদ নং বা রেফারেন্স",
    methods: "সব মাধ্যম",
    particular: "বিবরণ",
    date: "তারিখ",
    method: "মাধ্যম",
    amount: "টাকা",
    actions: "কাজ",
    view: "দেখুন",
    pdf: "রসিদ PDF",
    print: "প্রিন্ট",
    close: "বন্ধ",
    empty: "এই খোঁজায় রসিদ নেই।",
    title: "টাকা জমার রশিদ",
    hint: "এই রশিদ স্কুল অফিস কর্তৃক ইস্যুকৃত। প্রিন্ট ডায়ালগে Save as PDF বেছে নিন।",
  },
  en: {
    id: "Student ID",
    submit: "Look up receipts",
    pending: "Looking up…",
    closed: "Receipt lookup is not open yet.",
    miss: "No receipt matched.",
    failed: "Receipt lookup failed.",
    collected: "Total paid",
    count: "Receipts",
    search: "Particular, receipt no., or reference",
    methods: "All methods",
    particular: "Particulars",
    date: "Date",
    method: "Method",
    amount: "Amount",
    actions: "Actions",
    view: "View",
    pdf: "Receipt PDF",
    print: "Print",
    close: "Close",
    empty: "No receipt matched this search.",
    title: "Payment receipt",
    hint: "Issued by the school office. Choose Save as PDF in the print dialog.",
  },
} as const;

function money(n: number, lang: Lang) {
  return `৳ ${n.toLocaleString(lang === "bn" ? "bn-BD" : "en-BD")}`;
}

function paidDate(value: string, lang: Lang) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(lang === "bn" ? "bn-BD" : "en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function ReceiptLookup({ lang, enabled, school }: { lang: Lang; enabled: boolean; school: ReceiptSchool }) {
  const t = text[lang];
  const [studentId, setStudentId] = useState("");
  const [payload, setPayload] = useState<LookupPayload | null>(null);
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [query, setQuery] = useState("");
  const [methodFilter, setMethodFilter] = useState("");
  const [preview, setPreview] = useState<PublicReceiptSlip | null>(null);
  const [printQueued, setPrintQueued] = useState(false);
  const receiptAnchor = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const rows = payload?.receipts ?? [];
    const needle = query.trim().toLowerCase();
    return rows.filter((row) => {
      if (methodFilter && row.method !== methodFilter) return false;
      if (!needle) return true;
      const titles = row.lines.map((line) => line.title.toLowerCase()).join(" ");
      return titles.includes(needle) || row.receiptNo.toLowerCase().includes(needle) || row.refNo.toLowerCase().includes(needle);
    });
  }, [payload, query, methodFilter]);

  const totalPaid = (payload?.receipts ?? []).reduce((sum, row) => sum + row.amount, 0);

  useEffect(() => {
    if (!preview || !printQueued) return;
    const id = window.setTimeout(() => {
      window.print();
      setPrintQueued(false);
    }, 200);
    return () => window.clearTimeout(id);
  }, [preview, printQueued]);

  useEffect(() => {
    if (!preview) return;
    const scroll = () => {
      const el = receiptAnchor.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top;
      if (Math.abs(top - 80) < 24) return;
      el.scrollIntoView({ behavior: "auto", block: "start" });
    };
    scroll();
    const frame = window.requestAnimationFrame(scroll);
    return () => window.cancelAnimationFrame(frame);
  }, [preview]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    setPayload(null);
    setPreview(null);
    setQuery("");
    setMethodFilter("");
    try {
      const response = await fetch("/api/v1/public/website/receipts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId }),
      });
      const json = (await response.json().catch(() => ({}))) as { data?: LookupPayload; message?: string };
      if (!response.ok || !json.data?.receipts?.length) {
        setMessage(json.message || t.miss);
        return;
      }
      setPayload(json.data);
    } catch {
      setMessage(t.failed);
    } finally {
      setPending(false);
    }
  }

  function openReceipt(row: ReceiptRow, andPrint = false) {
    if (!payload) return;
    const studentName = lang === "bn" && payload.student.nameBn.trim() ? payload.student.nameBn : payload.student.name;
    setPreview({
      receiptNo: row.receiptNo,
      lines: row.lines,
      method: row.method,
      refNo: row.refNo,
      date: row.date,
      studentName,
      studentId: payload.student.studentId,
      className: payload.student.className,
      academicYear: row.academicYear,
    });
    if (andPrint) setPrintQueued(true);
  }

  if (!enabled) {
    return <p className="mx-auto max-w-xl px-4 pb-16">{t.closed}</p>;
  }

  const studentName = payload
    ? lang === "bn" && payload.student.nameBn.trim()
      ? payload.student.nameBn
      : payload.student.name
    : "";

  return (
    <div className="public-receipts mx-auto max-w-7xl px-4 py-12">
      <form className="sheet no-print mx-auto grid max-w-xl gap-4 p-6" onSubmit={submit}>
        <label className="text-sm">
          {t.id}
          <input
            required
            className="mt-1 h-11 w-full rounded-md border border-line bg-card px-3"
            value={studentId}
            onChange={(event) => setStudentId(event.target.value)}
            autoComplete="off"
          />
        </label>
        <button disabled={pending} className="h-11 rounded-full bg-brand px-5 font-semibold text-on-brand disabled:opacity-60" type="submit">
          {pending ? t.pending : t.submit}
        </button>
      </form>
      {message ? (
        <p className="no-print mx-auto mt-4 max-w-xl text-sm" role="alert">
          {message}
        </p>
      ) : null}

      {payload ? (
        <section className="no-print mx-auto mt-8 max-w-5xl">
          <div className="grid gap-3 sm:grid-cols-2">
            <article className="rounded-2xl border border-line bg-card p-4">
              <p className="text-sm text-muted">{t.collected}</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums text-brand">{money(totalPaid, lang)}</p>
            </article>
            <article className="rounded-2xl border border-line bg-card p-4">
              <p className="text-sm text-muted">{t.count}</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums">{payload.receipts.length}</p>
            </article>
          </div>
          <p className="mt-4 text-sm">
            <span className="font-semibold">{studentName}</span>
            <span className="ml-2 font-mono text-muted">{payload.student.studentId}</span>
            {payload.student.className ? <span className="text-muted"> · {payload.student.className}</span> : null}
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <input
              className="h-11 min-w-[12rem] flex-1 rounded-md border border-line bg-card px-3"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t.search}
              aria-label={t.search}
            />
            <select
              className="h-11 min-w-[9rem] rounded-md border border-line bg-card px-3"
              value={methodFilter}
              onChange={(event) => setMethodFilter(event.target.value)}
              aria-label={t.method}
            >
              <option value="">{t.methods}</option>
              {METHODS.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>

          {!filtered.length ? <p className="mt-6 text-sm">{t.empty}</p> : null}

          {filtered.length ? (
            <ul className="mt-4 grid gap-3 md:hidden">
              {filtered.map((row) => (
                <li key={row.receiptNo} className="rounded-2xl border border-line bg-card p-4">
                  <div className="flex items-start justify-between gap-3">
                    <p className="min-w-0 break-words text-sm">{row.lines.map((line) => line.title).join(", ")}</p>
                    <p className="shrink-0 font-semibold tabular-nums">{money(row.amount, lang)}</p>
                  </div>
                  <p className="mt-2 text-xs text-muted">
                    {paidDate(row.date, lang)} · {row.method}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button type="button" className="h-9 rounded-full border border-line bg-card px-3 text-sm" onClick={() => openReceipt(row)}>
                      {t.view}
                    </button>
                    <button type="button" className="h-9 rounded-full border border-line bg-card px-3 text-sm" onClick={() => openReceipt(row, true)}>
                      {t.pdf}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : null}

          {filtered.length ? (
            <div className="mt-4 hidden overflow-x-auto rounded-2xl border border-line bg-card md:block">
              <table className="w-full min-w-[40rem] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
                    <th className="px-4 py-3 font-semibold">{t.particular}</th>
                    <th className="px-4 py-3 font-semibold">{t.date}</th>
                    <th className="px-4 py-3 font-semibold">{t.method}</th>
                    <th className="px-4 py-3 text-right font-semibold">{t.amount}</th>
                    <th className="px-4 py-3 font-semibold">{t.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row) => (
                    <tr key={row.receiptNo} className="border-b border-line last:border-0">
                      <td className="px-4 py-3">{row.lines.map((line) => line.title).join(", ")}</td>
                      <td className="whitespace-nowrap px-4 py-3">{paidDate(row.date, lang)}</td>
                      <td className="whitespace-nowrap px-4 py-3">{row.method}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums">{money(row.amount, lang)}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <button type="button" className="h-8 rounded-full px-2 text-sm" onClick={() => openReceipt(row)}>
                            {t.view}
                          </button>
                          <button type="button" className="h-8 rounded-full border border-line px-2 text-sm" onClick={() => openReceipt(row, true)}>
                            {t.pdf}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </section>
      ) : null}

      {preview ? (
        <div ref={receiptAnchor} className="mx-auto mt-8 max-w-[210mm] scroll-mt-20">
          <div className="no-print mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">{t.title}</h2>
              <p className="text-sm text-muted">{t.hint}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" className="h-10 rounded-full bg-brand px-4 text-sm font-semibold text-on-brand" onClick={() => window.print()}>
                {t.pdf}
              </button>
              <button type="button" className="h-10 rounded-full border border-line bg-card px-4 text-sm" onClick={() => window.print()}>
                {t.print}
              </button>
              <button type="button" className="h-10 rounded-full px-4 text-sm" onClick={() => setPreview(null)}>
                {t.close}
              </button>
            </div>
          </div>
          <PublicReceipt item={preview} school={school} lang={lang} />
        </div>
      ) : null}
    </div>
  );
}
