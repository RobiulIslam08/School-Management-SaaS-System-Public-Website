"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function toBnDigits(str: string): string {
  return str.replace(/\d/g, (digit) => "০১২৩৪৫৬৭৮৯"[Number(digit)] ?? digit);
}

function toEnDigits(str: string): string {
  const bnToEn: Record<string, string> = {
    "০": "0", "১": "1", "২": "2", "৩": "3", "৪": "4",
    "৫": "5", "৬": "6", "৭": "7", "৮": "8", "৯": "9",
  };
  return (str || "").replace(/[০-৯]/g, (ch) => bnToEn[ch] ?? ch);
}

const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0"));

const MONTHS = [
  { value: "01", bn: "০১ - জানুয়ারি", en: "Jan (01)" },
  { value: "02", bn: "০২ - ফেব্রুয়ারি", en: "Feb (02)" },
  { value: "03", bn: "০৩ - মার্চ", en: "Mar (03)" },
  { value: "04", bn: "০৪ - এপ্রিল", en: "Apr (04)" },
  { value: "05", bn: "০৫ - মে", en: "May (05)" },
  { value: "06", bn: "০৬ - জুন", en: "Jun (06)" },
  { value: "07", bn: "০৭ - জুলাই", en: "Jul (07)" },
  { value: "08", bn: "০৮ - আগস্ট", en: "Aug (08)" },
  { value: "09", bn: "০৯ - সেপ্টেম্বর", en: "Sep (09)" },
  { value: "10", bn: "১০ - অক্টোবর", en: "Oct (10)" },
  { value: "11", bn: "১১ - নভেম্বর", en: "Nov (11)" },
  { value: "12", bn: "১২ - ডিসেম্বর", en: "Dec (12)" },
];

const YEARS = Array.from({ length: 25 }, (_, i) => String(2026 - i));

export default function StudentLoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [useDob, setUseDob] = useState(true);
  const [day, setDay] = useState("01");
  const [month, setMonth] = useState("01");
  const [year, setYear] = useState("2012");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function performLogin(idToUse: string, passOrDob: string) {
    setError("");
    setLoading(true);

    try {
      const cleanId = toEnDigits(idToUse).trim();
      const cleanPass = toEnDigits(passOrDob).trim();

      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: cleanId,
          password: cleanPass,
        }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(
          json.message ||
            "লগইন ব্যর্থ হয়েছে। অনুগ্রহ করে আপনার সঠিক শিক্ষার্থী আইডি ও জন্মতারিখ নির্বাচন করুন।"
        );
        return;
      }

      // Save user to localStorage
      if (json.data?.user) {
        localStorage.setItem("student_user", JSON.stringify(json.data.user));
      }

      router.push("/student-portal/dashboard");
    } catch {
      setError("সার্ভারের সাথে সংযোগ করা সম্ভব হয়নি। ইন্টারনেট সংযোগ পরীক্ষা করুন।");
    } finally {
      setLoading(false);
    }
  }

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!identifier.trim()) {
      setError("অনুগ্রহ করে আপনার শিক্ষার্থী আইডি লিখুন।");
      return;
    }
    if (useDob) {
      // Format as DD-MM-YYYY (or YYYY-MM-DD)
      const formattedDob = `${day}-${month}-${year}`;
      performLogin(identifier, formattedDob);
    } else {
      if (!password.trim()) {
        setError("অনুগ্রহ করে পাসওয়ার্ড লিখুন।");
        return;
      }
      performLogin(identifier, password);
    }
  }

  function handleQuickDemo(id: string, defaultDob: string) {
    setIdentifier(id);
    const parts = defaultDob.split("-");
    if (parts.length === 3) {
      setYear(parts[0]);
      setMonth(parts[1]);
      setDay(parts[2]);
    }
    performLogin(id, defaultDob);
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 selection:bg-brand selection:text-on-brand font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 group mb-3">
          <span className="h-12 w-12 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center text-2xl text-brand group-hover:scale-105 transition shadow-xs">
            🎓
          </span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black text-foreground">
          শিক্ষার্থী ও অভিভাবক পোর্টাল
        </h1>
        <p className="mt-1 text-xs text-muted">
          {"Student & Guardian Smart Portal · ফলাফল, রুটিন, লেকচার শিট ও প্রবেশপত্র"}
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-card py-7 px-5 shadow-lg rounded-3xl border border-line sm:px-9 space-y-5">
          {/* Bengali User Guidance */}
          <div className="rounded-2xl border border-line bg-paper/60 p-4 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-foreground">
              <span className="text-brand">📌</span>
              <span>সহজ লগইন নির্দেশিকা</span>
            </div>
            <p className="text-[11px] text-muted leading-relaxed">
              শিক্ষার্থী আইডি নম্বর এবং ভর্তির সময় প্রদত্ত জন্মতারিখ (<strong>তারিখ, মাস, বছর</strong>) নির্বাচন করে সহজেই আপনার পোর্টালে প্রবেশ করুন।
            </p>
          </div>

          {error && (
            <div className="rounded-2xl bg-rose-50 border border-rose-200 p-3.5 text-xs text-rose-800 font-medium leading-relaxed">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form className="space-y-4" onSubmit={handleFormSubmit}>
            <div>
              <label className="block text-xs font-bold text-foreground mb-1">
                শিক্ষার্থী আইডি (Student ID)
              </label>
              <input
                type="text"
                required
                className="h-11 w-full rounded-xl border border-line bg-background px-3.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                placeholder="যেমন: 121204 বা 121210"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>

            {useDob ? (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-foreground">
                    জন্মতারিখ (Date of Birth)
                  </label>
                  <button
                    type="button"
                    onClick={() => setUseDob(false)}
                    className="text-[11px] text-brand hover:underline font-semibold"
                  >
                    পাসওয়ার্ড দিয়ে প্রবেশ?
                  </button>
                </div>
                
                {/* 3 Selectors: Day, Month, Year */}
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <span className="block text-[10px] text-muted mb-0.5">তারিখ (দিন)</span>
                    <select
                      className="h-10 w-full rounded-lg border border-line bg-background px-2 text-xs font-mono font-medium focus:outline-none focus:ring-2 focus:ring-brand"
                      value={day}
                      onChange={(e) => setDay(e.target.value)}
                    >
                      {DAYS.map((d) => (
                        <option key={d} value={d}>
                          {toBnDigits(d)} তারিখ
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <span className="block text-[10px] text-muted mb-0.5">মাস</span>
                    <select
                      className="h-10 w-full rounded-lg border border-line bg-background px-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand"
                      value={month}
                      onChange={(e) => setMonth(e.target.value)}
                    >
                      {MONTHS.map((m) => (
                        <option key={m.value} value={m.value}>
                          {m.bn}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <span className="block text-[10px] text-muted mb-0.5">সাল (বছর)</span>
                    <select
                      className="h-10 w-full rounded-lg border border-line bg-background px-2 text-xs font-mono font-medium focus:outline-none focus:ring-2 focus:ring-brand"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                    >
                      {YEARS.map((y) => (
                        <option key={y} value={y}>
                          {toBnDigits(y)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-1.5 text-right">
                  <span className="text-[10px] text-muted font-mono bg-paper/80 px-2 py-0.5 rounded border border-line">
                    নির্বাচিত: {toBnDigits(day)}/{toBnDigits(month)}/{toBnDigits(year)}
                  </span>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-foreground">
                    পাসওয়ার্ড (Password)
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setUseDob(true)}
                      className="text-[11px] text-brand hover:underline font-semibold"
                    >
                      জন্মতারিখ দিয়ে প্রবেশ?
                    </button>
                    <span className="text-muted">·</span>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[11px] text-muted hover:text-brand transition"
                    >
                      {showPassword ? "লুকান" : "দেখুন"}
                    </button>
                  </div>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    className="h-11 w-full rounded-xl border border-line bg-background px-3.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand pr-10"
                    placeholder="পাসওয়ার্ড লিখুন (যেমন: 123456)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-brand text-on-brand font-bold text-sm hover:opacity-90 transition disabled:opacity-60 shadow-xs flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>প্রবেশ করা হচ্ছে...</span>
                </>
              ) : (
                <span>লগইন করুন (Sign In)</span>
              )}
            </button>
          </form>

          {/* Quick Demo Shortcuts */}
          <div className="border-t border-line/60 pt-4">
            <p className="text-[11px] font-bold text-muted text-center mb-2">
              ⚡ দ্রুত ডেমো পরীক্ষার অ্যাকাউন্ট (১-ক্লিক লগইন):
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemo("121204", "123456")}
                className="p-2.5 rounded-xl border border-line bg-paper/50 hover:bg-brand/10 hover:border-brand/30 transition text-left space-y-0.5"
              >
                <div className="font-bold text-foreground">নুসরাত জাহান</div>
                <div className="text-[10px] text-muted font-mono">আইডি: 121204</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo("121210", "123456")}
                className="p-2.5 rounded-xl border border-line bg-paper/50 hover:bg-brand/10 hover:border-brand/30 transition text-left space-y-0.5"
              >
                <div className="font-bold text-foreground">সজীব সেন</div>
                <div className="text-[10px] text-muted font-mono">আইডি: 121210</div>
              </button>
            </div>
          </div>

          {/* Footer Back Link */}
          <div className="pt-2 text-center text-xs text-muted border-t border-line/60">
            <Link href="/" className="text-brand font-bold hover:underline inline-flex items-center gap-1">
              ← মূল ওয়েবসাইটে ফিরে যান (Back to Website)
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
