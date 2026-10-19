"use client";

import { useState } from "react";
import type { Lang } from "@/lib/types";

interface AdmissionResultItem {
  _id: string;
  roll: string;
  applicantName: string;
  applicantNameBn?: string;
  phone?: string;
  marks: number;
  status: "pass" | "fail" | "pending";
  notes?: string;
  examId?: {
    _id: string;
    name: string;
    academicYear: string;
    totalMark: number;
    passMark: number;
    className?: string;
  };
}

export function AdmissionResultLookup({
  lang,
  schoolName,
}: {
  lang: Lang;
  schoolName: string;
}) {
  const [roll, setRoll] = useState("");
  const [phone, setPhone] = useState("");
  const [results, setResults] = useState<AdmissionResultItem[]>([]);
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!roll.trim() && !phone.trim()) {
      setMessage(
        lang === "bn"
          ? "রোল নম্বর অথবা মোবাইল নম্বর দিন।"
          : "Please enter your Roll number or Phone number."
      );
      return;
    }

    setPending(true);
    setMessage("");
    setResults([]);

    try {
      const params = new URLSearchParams();
      if (roll.trim()) params.set("roll", roll.trim());
      if (phone.trim()) params.set("phone", phone.trim());

      const response = await fetch(`/api/v1/public/admission-exam-results?${params.toString()}`);
      const json = await response.json().catch(() => ({}));

      if (!response.ok || !json.data || !json.data.length) {
        setMessage(
          json.message ||
            (lang === "bn"
              ? "কোনো ফলাফল পাওয়া যায়নি। রোল বা ফোন নম্বর সঠিক আছে কিনা যাচাই করুন।"
              : "No admission result found. Please check your roll number or phone number.")
        );
        return;
      }

      setResults(json.data);
    } catch {
      setMessage(
        lang === "bn"
          ? "ফলাফল লোড করতে সমস্যা হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।"
          : "Failed to connect to result server. Please try again later."
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      {/* Search Box */}
      <form
        onSubmit={submit}
        className="mx-auto max-w-lg rounded-2xl border border-line bg-card p-6 shadow-sm space-y-4 no-print"
      >
        <div className="text-center">
          <h3 className="text-lg font-bold text-foreground">
            {lang === "bn" ? "ভর্তি পরীক্ষার ফলাফল অনুসন্ধান" : "Admission Exam Result Search"}
          </h3>
          <p className="text-xs text-muted mt-1">
            {lang === "bn"
              ? "আপনার ভর্তি পরীক্ষার রোল অথবা আবেদনকৃত মোবাইল নম্বর দিয়ে খুঁজুন।"
              : "Search using your admission roll number or application phone number."}
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1">
            {lang === "bn" ? "ভর্তি রোল নম্বর (Roll No)" : "Admission Roll Number"}
          </label>
          <input
            type="text"
            className="h-11 w-full rounded-lg border border-line bg-background px-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            placeholder="e.g. 1001"
            value={roll}
            onChange={(e) => setRoll(e.target.value)}
          />
        </div>

        <div className="relative text-center">
          <span className="bg-card px-2 text-xs text-muted font-medium">
            {lang === "bn" ? "অথবা" : "OR"}
          </span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1">
            {lang === "bn" ? "মোবাইল নম্বর (Phone Number)" : "Phone Number"}
          </label>
          <input
            type="tel"
            className="h-11 w-full rounded-lg border border-line bg-background px-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            placeholder="017xxxxxxxx"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <button
          disabled={pending}
          type="submit"
          className="h-11 w-full rounded-full bg-brand px-5 font-bold text-on-brand hover:opacity-90 transition disabled:opacity-60"
        >
          {pending
            ? lang === "bn"
              ? "অনুসন্ধান করা হচ্ছে…"
              : "Searching…"
            : lang === "bn"
            ? "ফলাফল দেখুন"
            : "Search Result"}
        </button>
      </form>

      {/* Message */}
      {message && (
        <div className="mx-auto mt-6 max-w-lg rounded-xl border border-rose-200 bg-rose-50 p-4 text-center text-sm font-medium text-rose-800">
          {message}
        </div>
      )}

      {/* Results View */}
      {results.length > 0 && (
        <div className="mt-8 space-y-6">
          <div className="no-print flex justify-end">
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-full bg-foreground px-4 py-2 text-xs font-bold text-background hover:opacity-90"
            >
              {lang === "bn" ? "ফলাফল প্রিন্ট করুন" : "Print Result Slip"}
            </button>
          </div>

          {results.map((res) => {
            const isPassed = res.status === "pass";
            return (
              <div
                key={res._id}
                className="mx-auto max-w-xl rounded-2xl border-2 border-line bg-card p-8 shadow-md print:border-foreground print:shadow-none"
              >
                {/* Result Slip Header */}
                <div className="text-center border-b border-line pb-4">
                  <h2 className="text-xl font-black text-foreground">{schoolName}</h2>
                  <h3 className="text-sm font-bold text-brand mt-1">
                    {res.examId?.name || "Admission Examination"}
                  </h3>
                  <div className="mt-3 inline-block rounded-full px-5 py-1 text-sm font-black tracking-wide border">
                    {isPassed ? (
                      <span className="text-emerald-700 bg-emerald-50 px-4 py-1 rounded-full border border-emerald-300">
                        {lang === "bn" ? "উত্তীর্ণ (PASSED / QUALIFIED)" : "PASSED (QUALIFIED)"}
                      </span>
                    ) : (
                      <span className="text-rose-700 bg-rose-50 px-4 py-1 rounded-full border border-rose-300">
                        {lang === "bn" ? "অনুত্তীর্ণ (NOT QUALIFIED)" : "NOT QUALIFIED"}
                      </span>
                    )}
                  </div>
                </div>

                {/* Candidate details table */}
                <div className="my-6 space-y-3 text-sm">
                  <div className="flex justify-between border-b border-line/60 pb-2">
                    <span className="text-muted">{lang === "bn" ? "পরীক্ষার্থীর নাম" : "Applicant Name"}:</span>
                    <strong className="text-foreground">
                      {res.applicantName} {res.applicantNameBn ? `(${res.applicantNameBn})` : ""}
                    </strong>
                  </div>
                  <div className="flex justify-between border-b border-line/60 pb-2">
                    <span className="text-muted">{lang === "bn" ? "ভর্তি রোল নম্বর" : "Roll Number"}:</span>
                    <strong className="font-mono text-base font-black text-brand">{res.roll}</strong>
                  </div>
                  {res.examId?.className && (
                    <div className="flex justify-between border-b border-line/60 pb-2">
                      <span className="text-muted">{lang === "bn" ? "ভর্তির শ্রেণি" : "Target Class"}:</span>
                      <strong className="text-foreground">{res.examId.className}</strong>
                    </div>
                  )}
                  <div className="flex justify-between border-b border-line/60 pb-2">
                    <span className="text-muted">{lang === "bn" ? "প্রাপ্ত নম্বর" : "Marks Obtained"}:</span>
                    <strong className="font-mono text-lg font-black text-foreground">
                      {res.marks} <span className="text-xs text-muted">/ {res.examId?.totalMark || 100}</span>
                    </strong>
                  </div>
                  <div className="flex justify-between border-b border-line/60 pb-2">
                    <span className="text-muted">{lang === "bn" ? "পাস নম্বর" : "Pass Mark"}:</span>
                    <span className="font-mono text-muted">{res.examId?.passMark || 40}</span>
                  </div>
                  {res.notes && (
                    <div className="flex justify-between border-b border-line/60 pb-2">
                      <span className="text-muted">{lang === "bn" ? "মন্তব্য" : "Remarks"}:</span>
                      <span className="text-foreground font-medium">{res.notes}</span>
                    </div>
                  )}
                </div>

                <div className="rounded-lg bg-background/60 p-3 text-center text-xs text-muted">
                  {isPassed
                    ? lang === "bn"
                      ? "অভিনন্দন! নির্ধারিত সময়ের মধ্যে প্রয়োজনীয় কাগজপত্রসহ বিদ্যালয় অফিসে যোগাযোগ করে চূড়ান্ত ভর্তি সম্পন্ন করুন।"
                      : "Congratulations! Please visit the school office with required documents within the stipulated date to complete admission."
                    : lang === "bn"
                    ? "ভর্তি পরীক্ষায় অংশগ্রহণের জন্য ধন্যবাদ।"
                    : "Thank you for participating in the admission examination."}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
