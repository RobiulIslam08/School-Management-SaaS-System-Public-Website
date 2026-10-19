"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function StudentLoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function performLogin(idToUse: string, passToUse: string) {
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: idToUse.trim(),
          password: passToUse.trim(),
        }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(
          json.message ||
            "লগইন ব্যর্থ হয়েছে। অনুগ্রহ করে আপনার সঠিক শিক্ষার্থী আইডি ও পাসওয়ার্ড ব্যবহার করুন।"
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
    if (!password.trim()) {
      setError("অনুগ্রহ করে আপনার পাসওয়ার্ড লিখুন।");
      return;
    }
    performLogin(identifier, password);
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
          Student &amp; Guardian Smart Portal · ফলাফল, রুটিন, লেকচার শিট ও প্রবেশপত্র
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-card py-7 px-5 shadow-lg rounded-3xl border border-line sm:px-9 space-y-5">
          {/* Professional Student Login Guidance */}
          <div className="rounded-2xl border border-line bg-paper/60 p-4 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-foreground">
              <span className="text-brand">📌</span>
              <span>লগইন নির্দেশিকা (Login Guide)</span>
            </div>
            <ul className="space-y-1.5 text-[11px] text-muted leading-relaxed list-disc list-inside">
              <li>
                <strong className="text-foreground">আইডি নম্বর:</strong> ভর্তি রশিদ বা আইডি কার্ডে উল্লিখিত শিক্ষার্থী আইডি (Student ID) অথবা নিবন্ধিত অভিভাবকের মোবাইল নম্বর।
              </li>
              <li>
                <strong className="text-foreground">প্রাথমিক পাসওয়ার্ড:</strong> নতুন শিক্ষার্থীর ক্ষেত্রে স্কুলের প্রাথমিক ডিফল্ট পাসওয়ার্ড <span className="font-mono font-bold text-brand">123456</span> অথবা ভর্তির ফরমে প্রদত্ত জন্মতারিখ (<span className="font-mono">YYYY-MM-DD</span>)।
              </li>
              <li>
                পাসওয়ার্ড ভুলে গেলে বা কোনো সমস্যার ক্ষেত্রে স্কুলের প্রধান কার্যালয় বা শ্রেণি শিক্ষকের সাথে যোগাযোগ করুন।
              </li>
            </ul>
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
                শিক্ষার্থী আইডি (Student ID) / ফোন নম্বর
              </label>
              <input
                type="text"
                required
                className="h-11 w-full rounded-xl border border-line bg-background px-3.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                placeholder="শিক্ষার্থী আইডি বা মোবাইল নম্বর লিখুন"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-foreground">
                  পাসওয়ার্ড (Password)
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-muted hover:text-brand transition"
                >
                  {showPassword ? "লুকান" : "দেখুন"}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="h-11 w-full rounded-xl border border-line bg-background px-3.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand pr-10"
                  placeholder="আপনার পাসওয়ার্ড লিখুন"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

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
