"use client";

import { useState } from "react";
import type { Lang } from "@/lib/types";

export function ContactForm({ lang }: { lang: Lang }) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "", website: "" });
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/v1/public/website/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = (await response.json().catch(() => ({}))) as { message?: string };
      if (!response.ok) {
        setError(json.message || (lang === "bn" ? "বার্তা যায়নি।" : "Message was not sent."));
        return;
      }
      setDone(true);
    } catch {
      setError(lang === "bn" ? "বার্তা যায়নি।" : "Message was not sent.");
    } finally {
      setPending(false);
    }
  }

  if (done) return <p>{lang === "bn" ? "বার্তা পৌঁছেছে। স্কুল অফিস দেখে উত্তর দেবে।" : "Message received. The school office will reply."}</p>;

  return (
    <form className="space-y-3" onSubmit={submit}>
      <label className="block text-sm">{lang === "bn" ? "নাম" : "Name"}
        <input required className="mt-1 h-11 w-full rounded-md border border-line bg-paper px-3" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      </label>
      <label className="block text-sm">{lang === "bn" ? "ফোন" : "Phone"}
        <input className="mt-1 h-11 w-full rounded-md border border-line bg-paper px-3" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      </label>
      <label className="block text-sm">Email
        <input type="email" className="mt-1 h-11 w-full rounded-md border border-line bg-paper px-3" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      </label>
      <label className="block text-sm">{lang === "bn" ? "বার্তা" : "Message"}
        <textarea required minLength={5} className="mt-1 min-h-28 w-full rounded-md border border-line bg-paper px-3 py-2" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
      </label>
      <label className="hidden">Website
        <input tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
      </label>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <button disabled={pending} className="h-11 rounded-full bg-brand px-5 font-semibold text-on-brand disabled:opacity-60" type="submit">
        {lang === "bn" ? "পাঠান" : "Send"}
      </button>
    </form>
  );
}
