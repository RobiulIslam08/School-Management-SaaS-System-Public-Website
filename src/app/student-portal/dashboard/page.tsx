"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PublicCalendar } from "@/components/public-calendar";
import { PublicReceipt, type PublicReceiptSlip, type ReceiptSchool } from "@/components/public-receipt";
import { PublicMarksheet, type PublicResultCard, type MarksheetSchool } from "@/components/public-marksheet";
import { PublicAdmitCard, type AdmitCardSchool } from "@/components/public-admit-card";

interface PortalUser {
  id?: string;
  name?: string;
  nameBn?: string;
  email?: string;
  role?: string;
  studentId?: string;
  rollNo?: string;
  classId?: { _id?: string; name?: string };
  section?: string;
  phone?: string;
  guardianPhone?: string;
  fatherName?: string;
  motherName?: string;
  bloodGroup?: string;
  group?: string;
}

interface PortalMaterial {
  _id: string;
  title: string;
  fileType: string;
  fileUrl: string;
  description?: string;
  createdAt: string;
  classId?: { _id?: string; name?: string };
  subjectId?: { _id?: string; name?: string };
  teacherName?: string;
}

interface RoutineSlot {
  day: number;
  period: number;
  section: string;
  subject?: { name?: string; nameBn?: string } | null;
  teacherName?: string;
  startTime?: string;
  endTime?: string;
  roomNo?: string;
}

interface ClassOption {
  _id: string;
  name: string;
  sections?: string[];
}

interface ExamOption {
  _id: string;
  name: string;
  academicYear?: string;
}

interface SyllabusChapter {
  _id: string;
  name: string;
  nameBn?: string;
  academicYear?: string;
  chaptersBn?: string[];
  chaptersEn?: string[];
}

interface ReceiptRow {
  receiptNo: string;
  date: string;
  method: string;
  refNo: string;
  academicYear: string;
  lines: Array<{ title: string; amount: number }>;
  amount: number;
}

interface NoticeItem {
  _id: string;
  title: string;
  body?: string;
  category?: string;
  createdAt: string;
}

const DAYS = [
  { id: 0, bn: "রবিবার", en: "Sunday" },
  { id: 1, bn: "সোমবার", en: "Monday" },
  { id: 2, bn: "মঙ্গলবার", en: "Tuesday" },
  { id: 3, bn: "বুধবার", en: "Wednesday" },
  { id: 4, bn: "বৃহস্পতিবার", en: "Thursday" },
];

export default function StudentDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<PortalUser | null>(null);
  const [activeTab, setActiveTab] = useState<
    "materials" | "routine" | "results" | "admit" | "fees" | "syllabus" | "calendar" | "notices"
  >("materials");
  const [loading, setLoading] = useState(true);

  // Student ID tracking for lookup
  const [studentIdInput, setStudentIdInput] = useState("");
  const [activeStudentId, setActiveStudentId] = useState("");

  // Data states
  const [materials, setMaterials] = useState<PortalMaterial[]>([]);
  const [materialSearch, setMaterialSearch] = useState("");
  const [materialTypeFilter, setMaterialTypeFilter] = useState("all");

  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [routineSlots, setRoutineSlots] = useState<RoutineSlot[]>([]);
  const [activeDay, setActiveDay] = useState<number>(new Date().getDay() > 4 ? 0 : new Date().getDay());

  const [exams, setExams] = useState<ExamOption[]>([]);
  const [selectedExamId, setSelectedExamId] = useState("");
  const [resultData, setResultData] = useState<PublicResultCard | null>(null);
  const [resultLoading, setResultLoading] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [showMarksheetModal, setShowMarksheetModal] = useState(false);

  const [showAdmitCardModal, setShowAdmitCardModal] = useState(false);

  const [receipts, setReceipts] = useState<ReceiptRow[]>([]);
  const [receiptsLoading, setReceiptsLoading] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<PublicReceiptSlip | null>(null);

  const [syllabuses, setSyllabuses] = useState<SyllabusChapter[]>([]);
  const [syllabusLoading, setSyllabusLoading] = useState(false);

  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [schoolInfo, setSchoolInfo] = useState<ReceiptSchool & MarksheetSchool & AdmitCardSchool>({
    name: "School Campus",
    logoUrl: "",
    motto: "শিক্ষা শান্তি প্রগতি",
    address: "বাংলাদেশ",
    eiin: "123456",
    establishedYear: 1998,
    academicYear: "2026",
  });

  useEffect(() => {
    async function init() {
      try {
        // 1. Session check
        const meRes = await fetch("/api/v1/auth/me", { credentials: "include" });
        const meJson = await meRes.json().catch(() => ({}));

        let currentUser: PortalUser | null = null;
        if (meRes.ok && meJson.data?.user) {
          currentUser = meJson.data.user;
          setUser(currentUser);
        } else {
          const local = typeof window !== "undefined" ? localStorage.getItem("student_user") : null;
          if (local) {
            try {
              currentUser = JSON.parse(local);
              setUser(currentUser);
            } catch {}
          }
        }

        // Enforce login access: if not authenticated, redirect to portal login
        if (!currentUser) {
          router.replace("/student-portal/login");
          return;
        }

        // Determine initial student ID from logged-in user
        const initialId =
          currentUser?.studentId ||
          (currentUser?.role === "student" || currentUser?.role === "guardian"
            ? currentUser.email?.replace(/@.*/, "")
            : "") ||
          "";
        setStudentIdInput(initialId);
        setActiveStudentId(initialId);

        // 2. School info
        const siteRes = await fetch("/api/v1/public/website");
        const siteJson = await siteRes.json().catch(() => ({}));
        if (siteJson.data?.school) {
          setSchoolInfo({
            name: siteJson.data.school.name || "School Campus",
            logoUrl: siteJson.data.school.logoUrl || "",
            motto: siteJson.data.school.motto || "শিক্ষা শান্তি প্রগতি",
            address: siteJson.data.school.address || "বাংলাদেশ",
            eiin: siteJson.data.school.eiin || "123456",
            establishedYear: siteJson.data.school.establishedYear || 1998,
            academicYear: siteJson.data.school.academicYear || "2026",
          });
        }

        // 3. Classes
        const clsRes = await fetch("/api/v1/public/classes");
        const clsJson = await clsRes.json().catch(() => ({}));
        const clsList: ClassOption[] = clsJson.data || [];
        setClasses(clsList);
        if (currentUser?.classId?._id) {
          setSelectedClassId(currentUser.classId._id);
          setSelectedSection(currentUser.section || "A");
        } else if (clsList.length > 0) {
          setSelectedClassId(clsList[0]._id);
          setSelectedSection(clsList[0].sections?.[0] || "A");
        }

        // 4. Lecture Materials
        const matRes = await fetch("/api/v1/public/lecture-materials");
        const matJson = await matRes.json().catch(() => ({}));
        setMaterials(matJson.data || []);

        // 5. Exams
        const exRes = await fetch("/api/v1/public/website/exams");
        const exJson = await exRes.json().catch(() => ({}));
        const exList: ExamOption[] = exJson.data || [];
        setExams(exList);
        if (exList.length > 0) {
          setSelectedExamId(exList[0]._id);
        }

        // 6. Notices
        const notRes = await fetch("/api/v1/public/notices");
        const notJson = await notRes.json().catch(() => ({}));
        setNotices(notJson.data || []);
      } catch {
        // Handled gracefully
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  // Fetch routine when class changes
  useEffect(() => {
    if (!selectedClassId) return;
    async function loadRoutine() {
      try {
        const res = await fetch(
          `/api/v1/public/website/routine?classId=${selectedClassId}&section=${encodeURIComponent(selectedSection)}`
        );
        const json = await res.json().catch(() => ({}));
        setRoutineSlots(json.data || []);
      } catch {
        setRoutineSlots([]);
      }
    }
    loadRoutine();
  }, [selectedClassId, selectedSection]);

  // Fetch Syllabus when class changes or tab selected
  useEffect(() => {
    if (!selectedClassId || activeTab !== "syllabus") return;
    async function loadSyllabus() {
      setSyllabusLoading(true);
      try {
        const res = await fetch(`/api/v1/public/website/syllabus?classId=${selectedClassId}`);
        const json = await res.json().catch(() => ({}));
        setSyllabuses(json.data || []);
      } catch {
        setSyllabuses([]);
      } finally {
        setSyllabusLoading(false);
      }
    }
    loadSyllabus();
  }, [selectedClassId, activeTab]);

  // Fetch Results when studentId or examId changes
  useEffect(() => {
    if (!activeStudentId || (activeTab !== "results" && activeTab !== "admit")) return;
    async function loadResult() {
      setResultLoading(true);
      setResultMessage("");
      try {
        const res = await fetch("/api/v1/public/website/results", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentId: activeStudentId,
            examTypeId: selectedExamId || undefined,
          }),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok || !json.data) {
          setResultMessage(json.message || "কোনো ফলাফল পাওয়া যায়নি।");
          setResultData(null);
        } else {
          const list = Array.isArray(json.data) ? json.data : [json.data];
          if (list.length > 0) {
            setResultData(list[0]);
          } else {
            setResultMessage("কোনো প্রকাশিত ফলাফল পাওয়া যায়নি।");
            setResultData(null);
          }
        }
      } catch {
        setResultMessage("ফলাফল সার্ভারের সাথে সংযোগ করা যায়নি।");
        setResultData(null);
      } finally {
        setResultLoading(false);
      }
    }
    loadResult();
  }, [activeStudentId, selectedExamId, activeTab]);

  // Fetch receipts when studentId changes
  useEffect(() => {
    if (!activeStudentId || activeTab !== "fees") return;
    async function loadReceipts() {
      setReceiptsLoading(true);
      try {
        const res = await fetch("/api/v1/public/website/receipts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ studentId: activeStudentId }),
        });
        const json = await res.json().catch(() => ({}));
        setReceipts(json.data?.receipts || []);
      } catch {
        setReceipts([]);
      } finally {
        setReceiptsLoading(false);
      }
    }
    loadReceipts();
  }, [activeStudentId, activeTab]);

  function handleStudentIdSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (studentIdInput.trim()) {
      setActiveStudentId(studentIdInput.trim());
    }
  }

  async function handleLogout() {
    try {
      await fetch("/api/v1/auth/logout", { method: "POST", credentials: "include" });
    } catch {}
    if (typeof window !== "undefined") {
      localStorage.removeItem("student_user");
    }
    setUser(null);
    router.replace("/student-portal/login");
  }

  const filteredMaterials = useMemo(() => {
    return materials.filter((m) => {
      const matchQuery =
        !materialSearch ||
        m.title.toLowerCase().includes(materialSearch.toLowerCase()) ||
        (m.description && m.description.toLowerCase().includes(materialSearch.toLowerCase())) ||
        (m.teacherName && m.teacherName.toLowerCase().includes(materialSearch.toLowerCase()));
      const matchType = materialTypeFilter === "all" || m.fileType.toLowerCase() === materialTypeFilter.toLowerCase();
      return matchQuery && matchType;
    });
  }, [materials, materialSearch, materialTypeFilter]);

  const todaySlots = useMemo(() => {
    return routineSlots.filter((s) => s.day === activeDay).sort((a, b) => a.period - b.period);
  }, [routineSlots, activeDay]);

  const totalFeePaid = useMemo(() => {
    return receipts.reduce((sum, r) => sum + r.amount, 0);
  }, [receipts]);

  const currentExamObj = useMemo(() => {
    return exams.find((e) => e._id === selectedExamId) || exams[0] || { _id: "", name: "সাময়িক পরীক্ষা ২০২৬" };
  }, [exams, selectedExamId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand border-t-transparent" />
        <p className="text-sm font-semibold text-brand">স্টুডেন্ট পোর্টাল লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-brand selection:text-on-brand font-sans">
      {/* Top Utility Masthead */}
      <header className="sticky top-0 z-30 border-b border-line bg-card/95 backdrop-blur px-4 py-3 sm:px-8 shadow-xs">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="h-9 w-9 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center text-lg text-brand font-black group-hover:scale-105 transition">
                🎓
              </span>
              <div>
                <span className="text-base font-black text-brand leading-none block">{schoolInfo.name}</span>
                <span className="text-[10px] font-bold text-muted uppercase tracking-wider block mt-0.5">
                  Student &amp; Guardian Portal (শিক্ষার্থী পোর্টাল)
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="hidden sm:inline-flex rounded-full border border-line bg-card px-3.5 py-1.5 text-xs font-semibold text-ink/80 hover:bg-brand/10 hover:text-brand hover:border-brand/40 transition"
            >
              ← মূল ওয়েবসাইট
            </Link>
            <Link
              href="/board"
              target="_blank"
              className="hidden md:inline-flex rounded-full bg-slate-900 border border-slate-700 text-slate-100 px-3 py-1.5 text-xs font-bold hover:bg-slate-800 transition items-center gap-1.5"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              ডিজিটাল ডিসপ্লে বোর্ড (Live TV)
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full bg-rose-50 border border-rose-200 px-3.5 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 transition"
            >
              লগআউট (Sign Out)
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl w-full flex-1 px-4 py-6 sm:px-8 space-y-6">
        {/* Student Profile & Identity Banner */}
        <div className="rounded-3xl border border-line bg-card p-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            {/* Identity */}
            <div className="flex items-start sm:items-center gap-4">
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-brand text-on-brand flex items-center justify-center text-3xl font-black shadow-md shrink-0">
                {resultData?.student?.name ? resultData.student.name.slice(0, 1).toUpperCase() : user?.name ? user.name.slice(0, 1).toUpperCase() : "🎓"}
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-foreground">
                    {resultData?.student?.name || user?.name || "নুসরাত জাহান (Nusrat Jahan)"}
                  </h1>
                  {resultData?.student?.nameBn && (
                    <span className="text-sm font-medium text-muted">({resultData.student.nameBn})</span>
                  )}
                  <span className="rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 px-2.5 py-0.5 text-[11px] font-bold">
                    সক্রিয় শিক্ষার্থী (Active)
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
                  <span>
                    আইডি: <strong className="font-mono text-foreground font-bold">{activeStudentId}</strong>
                  </span>
                  <span>
                    রোল: <strong className="font-mono text-foreground">{resultData?.student?.rollNo || user?.rollNo || "1"}</strong>
                  </span>
                  <span>
                    শ্রেণি: <strong className="text-foreground">{resultData?.student?.className || user?.classId?.name || "Class 6"}</strong>
                  </span>
                  <span>
                    শাখা: <strong className="text-foreground">{resultData?.student?.section || user?.section || "A"}</strong>
                  </span>
                  <span>
                    শিক্ষাবর্ষ: <strong className="text-foreground">{schoolInfo.academicYear || "2026"}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Student Account Status Badge & ID Lookup */}
            <div className="flex flex-col sm:items-end gap-2 shrink-0">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-800 shadow-xs">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  সক্রিয় শিক্ষার্থী প্রোফাইল
                </span>
              </div>
              <form onSubmit={handleStudentIdSubmit} className="flex items-center gap-1.5 bg-card p-1.5 rounded-xl border border-line shadow-xs">
                <input
                  type="text"
                  placeholder="অন্য আইডি দেখতে..."
                  value={studentIdInput}
                  onChange={(e) => setStudentIdInput(e.target.value)}
                  className="h-8 w-28 sm:w-36 rounded-lg border border-line bg-background px-2.5 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-brand"
                />
                <button
                  type="submit"
                  className="h-8 px-3 rounded-lg bg-brand text-on-brand text-xs font-bold hover:opacity-90 transition shadow-xs"
                >
                  দেখুন
                </button>
              </form>
            </div>
          </div>

          {/* Quick Metrics & Attendance Pulse */}
          <div className="mt-6 pt-5 border-t border-line/60 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-xl bg-background/60 p-3.5 border border-line/40">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted block">উপলব্ধ লেকচার শিট</span>
              <span className="text-lg font-black text-brand mt-0.5 block">{materials.length} টি</span>
            </div>
            <div className="rounded-xl bg-background/60 p-3.5 border border-line/40">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted block">মোট পরিশোধিত ফি</span>
              <span className="text-lg font-black text-emerald-700 mt-0.5 block">৳ {totalFeePaid.toLocaleString()}</span>
            </div>
            <div className="rounded-xl bg-background/60 p-3.5 border border-line/40">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted block">জমা রসিদ সংখ্যা</span>
              <span className="text-lg font-black text-foreground mt-0.5 block">{receipts.length} টি</span>
            </div>
            <div className="rounded-xl bg-background/60 p-3.5 border border-line/40">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted block">উপস্থিতির হার</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">চমৎকার</span>
              </div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-lg font-black text-emerald-700">৯৫%</span>
                <span className="text-[11px] text-muted">· ১৯/২০ দিন উপস্থিত</span>
              </div>
            </div>
          </div>
        </div>

        {/* Portal Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-line no-scrollbar">
          {[
            { id: "materials", label: "📚 লেকচার শিট ও স্টাডি ফাইল", count: materials.length },
            { id: "routine", label: "📅 ক্লাস রুটিন", count: routineSlots.length },
            { id: "results", label: "📊 পরীক্ষার ফলাফল ও গ্রেডশীট" },
            { id: "admit", label: "🎫 পরীক্ষার প্রবেশপত্র (Admit Card)" },
            { id: "fees", label: "💰 ফি ও জমার রসিদ", count: receipts.length },
            { id: "syllabus", label: "📖 সিলেবাস ও পাঠ্যক্রম" },
            { id: "calendar", label: "🗓️ ছুটি ও ক্যালেন্ডার" },
            { id: "notices", label: "📢 জরুরি নোটিশ", count: notices.length },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition-all duration-200 flex items-center gap-2 shrink-0 ${
                activeTab === tab.id
                  ? "bg-brand text-on-brand shadow-sm scale-102 ring-2 ring-brand/25"
                  : "bg-card text-ink/80 border border-line hover:bg-brand/10 hover:text-brand hover:border-brand/40 shadow-xs"
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                    activeTab === tab.id
                      ? "bg-white/25 text-white"
                      : "bg-brand/10 text-brand"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ================= TAB 1: LECTURE MATERIALS ================= */}
        {activeTab === "materials" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-black text-foreground">
                  শিক্ষকদের আপলোডকৃত লেকচার শিট, হ্যান্ডনোট ও স্টাডি মেটেরিয়ালস
                </h2>
                <p className="text-xs text-muted">
                  পরীক্ষার প্রস্তুতি ও বাড়ির কাজের জন্য প্রয়োজনীয় ক্লাস শিটগুলো এখান থেকে ডাউনলোড করুন।
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  placeholder="বিষয় বা শিরোনাম খুঁজুন..."
                  value={materialSearch}
                  onChange={(e) => setMaterialSearch(e.target.value)}
                  className="h-9 rounded-xl border border-line bg-card px-3 text-xs w-48 focus:outline-none focus:ring-2 focus:ring-brand"
                />
                <select
                  value={materialTypeFilter}
                  onChange={(e) => setMaterialTypeFilter(e.target.value)}
                  className="h-9 rounded-xl border border-line bg-card px-3 text-xs focus:outline-none focus:ring-2 focus:ring-brand"
                >
                  <option value="all">সব ফাইল ফরম্যাট</option>
                  <option value="pdf">PDF ডকুমেন্টস</option>
                  <option value="video">ভিডিও ক্লাস</option>
                  <option value="doc">Word / Text ফাইল</option>
                </select>
              </div>
            </div>

            {!filteredMaterials.length ? (
              <div className="rounded-3xl border border-line bg-card p-12 text-center space-y-2">
                <div className="text-3xl">📂</div>
                <h3 className="text-sm font-bold text-foreground">কোনো লেকচার শিট পাওয়া যায়নি</h3>
                <p className="text-xs text-muted max-w-sm mx-auto">
                  শিক্ষকগণ এই বিষয়ের লেকচার শিট বা স্টাডি মেটেরিয়ালস আপলোড করলে তা এখানে দেখতে পাবেন।
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredMaterials.map((mat) => {
                  const isPdf = mat.fileType.toLowerCase().includes("pdf");
                  const isVideo = mat.fileType.toLowerCase().includes("video");

                  return (
                    <div
                      key={mat._id}
                      className="rounded-2xl border border-line bg-card p-5 shadow-xs flex flex-col justify-between hover:border-brand/40 transition group"
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs mb-3">
                          <span
                            className={`rounded-md px-2 py-0.5 text-[10px] font-black uppercase ${
                              isPdf ? "bg-rose-100 text-rose-800" : isVideo ? "bg-blue-100 text-blue-800" : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {mat.fileType}
                          </span>
                          <span className="font-mono text-[10px] text-muted">
                            {new Date(mat.createdAt).toLocaleDateString("bn-BD")}
                          </span>
                        </div>

                        <h3 className="text-sm font-black text-foreground group-hover:text-brand transition line-clamp-2">
                          {mat.title}
                        </h3>

                        {mat.description && (
                          <p className="mt-2 text-xs text-muted leading-relaxed line-clamp-2">
                            {mat.description}
                          </p>
                        )}

                        <div className="mt-4 pt-3 border-t border-line/50 space-y-1 text-[11px] text-muted">
                          {mat.classId?.name && (
                            <div className="flex justify-between">
                              <span>শ্রেণি:</span>
                              <strong className="text-foreground">{mat.classId.name}</strong>
                            </div>
                          )}
                          {mat.teacherName && (
                            <div className="flex justify-between">
                              <span>শিক্ষক:</span>
                              <strong className="text-foreground">{mat.teacherName}</strong>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-5 pt-3">
                        <a
                          href={mat.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand py-2 text-xs font-bold text-on-brand hover:opacity-90 transition shadow-xs"
                        >
                          <span>{isVideo ? "▶ ক্লাস ভিডিও দেখুন" : "📥 ফাইল ডাউনলোড / ভিউ"}</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 2: CLASS ROUTINE ================= */}
        {activeTab === "routine" && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-black text-foreground">সাপ্তাহিক ক্লাস রুটিন ও সময়সূচি</h2>
                <p className="text-xs text-muted">শ্রেণি ও শাখা অনুযায়ী সপ্তাহের প্রতিদিনের ক্লাস ও বিষয়ের তালিকা।</p>
              </div>

              {/* Class & Section Switcher */}
              <div className="flex items-center gap-2">
                <select
                  value={selectedClassId}
                  onChange={(e) => {
                    setSelectedClassId(e.target.value);
                    const found = classes.find((c) => c._id === e.target.value);
                    if (found?.sections?.[0]) setSelectedSection(found.sections[0]);
                  }}
                  className="h-9 rounded-xl border border-line bg-card px-3 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand"
                >
                  {classes.map((cls) => (
                    <option key={cls._id} value={cls._id}>
                      {cls.name}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="h-9 rounded-xl border border-line bg-card px-3 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand"
                >
                  {(classes.find((c) => c._id === selectedClassId)?.sections || ["A", "B"]).map((sec) => (
                    <option key={sec} value={sec}>
                      শাখা: {sec}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Day Selector Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {DAYS.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setActiveDay(d.id)}
                  className={`rounded-xl px-4 py-2 text-xs font-black transition ${
                    activeDay === d.id
                      ? "bg-brand text-on-brand shadow-xs"
                      : "bg-card border border-line text-ink/80 hover:bg-brand/10 hover:text-brand hover:border-brand/40"
                  }`}
                >
                  {d.bn} ({d.en})
                </button>
              ))}
            </div>

            {/* Day Routine Cards */}
            {!todaySlots.length ? (
              <div className="rounded-3xl border border-line bg-card p-12 text-center text-xs text-muted">
                এই দিনে কোনো ক্লাস রুটিন পাওয়া যায়নি অথবা ছুটি।
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {todaySlots.map((slot) => (
                  <div
                    key={`${slot.day}-${slot.period}`}
                    className="rounded-2xl border border-line bg-card p-5 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="rounded-md bg-brand/10 text-brand px-2 py-0.5 font-mono font-bold text-[11px]">
                          পিরিয়ড #{slot.period}
                        </span>
                        <span className="font-mono text-xs font-bold text-muted">
                          {slot.startTime && slot.endTime ? `${slot.startTime} - ${slot.endTime}` : "সময়সূচি অনুযায়ী"}
                        </span>
                      </div>

                      <h3 className="text-base font-black text-foreground mt-2">
                        {slot.subject?.name || "বিষয় নির্ধারিত নেই"}
                      </h3>
                      {slot.subject?.nameBn && <p className="text-xs text-muted">{slot.subject.nameBn}</p>}
                    </div>

                    <div className="mt-4 pt-3 border-t border-line/60 flex items-center justify-between text-xs text-muted">
                      <span>
                        শিক্ষক: <strong className="text-foreground">{slot.teacherName || "নির্ধারিত শিক্ষক"}</strong>
                      </span>
                      {slot.roomNo && (
                        <span className="rounded-md bg-brand/10 border border-brand/20 text-brand px-2 py-0.5 text-[10px] font-bold">
                          রুম: {slot.roomNo}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 3: EXAM RESULTS ================= */}
        {activeTab === "results" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-black text-foreground">পরীক্ষার ফলাফল ও মার্কশীট</h2>
                <p className="text-xs text-muted">আইডি নম্বর ও প্রকাশিত পরীক্ষা নির্বাচন করে ফলাফল দেখুন।</p>
              </div>

              {/* Exam Selector */}
              <div className="flex items-center gap-2">
                <select
                  value={selectedExamId}
                  onChange={(e) => setSelectedExamId(e.target.value)}
                  className="h-10 rounded-xl border border-line bg-card px-4 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand"
                >
                  {exams.map((ex) => (
                    <option key={ex._id} value={ex._id}>
                      {ex.name} {ex.academicYear ? `(${ex.academicYear})` : ""}
                    </option>
                  ))}
                </select>

                {resultData && (
                  <button
                    type="button"
                    onClick={() => setShowMarksheetModal(true)}
                    className="h-10 px-4 rounded-xl bg-brand text-on-brand text-xs font-bold hover:opacity-90 transition flex items-center gap-1.5 shrink-0 shadow-xs"
                  >
                    <span>🖨️ পূর্ণ মার্কশীট প্রিন্ট</span>
                  </button>
                )}
              </div>
            </div>

            {resultLoading ? (
              <div className="rounded-3xl border border-line bg-card p-12 text-center text-xs text-muted">
                ফলাফল লোড হচ্ছে...
              </div>
            ) : resultMessage ? (
              <div className="rounded-3xl border border-line bg-card p-12 text-center space-y-3">
                <div className="text-3xl">📋</div>
                <h3 className="text-sm font-bold text-foreground">{resultMessage}</h3>
                <p className="text-xs text-muted">
                  অনুগ্রহ করে সঠিক শিক্ষার্থী আইডি ও প্রকাশিত পরীক্ষা নির্বাচন করুন।
                </p>
              </div>
            ) : resultData ? (
              <div className="space-y-6">
                {/* Result Overview Card */}
                <div className="rounded-3xl border border-line bg-card p-6 shadow-xs">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4 mb-4">
                    <div>
                      <span className="text-xs font-bold text-brand uppercase tracking-wider block">পরীক্ষার নাম</span>
                      <h3 className="text-lg font-black text-foreground mt-0.5">{resultData.exam.name}</h3>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-xs font-bold text-muted block">প্রাপ্ত জিপিএ (GPA)</span>
                        <span className="text-2xl font-black text-emerald-700">{resultData.gpa.toFixed(2)}</span>
                      </div>
                      <div className="h-12 w-12 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 flex items-center justify-center text-xl font-black">
                        {resultData.letter}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-muted block">শিক্ষার্থীর নাম:</span>
                      <strong className="text-foreground">{resultData.student.name}</strong>
                    </div>
                    <div>
                      <span className="text-muted block">রোল ও শ্রেণি:</span>
                      <strong className="text-foreground">
                        {resultData.student.rollNo || "-"} ({resultData.student.className || "-"})
                      </strong>
                    </div>
                    <div>
                      <span className="text-muted block">মোট প্রাপ্ত নম্বর:</span>
                      <strong className="text-foreground">
                        {resultData.totalObtained ?? "-"} / {resultData.totalFull ?? "-"}
                      </strong>
                    </div>
                    <div>
                      <span className="text-muted block">মেধা স্থান (Merit):</span>
                      <strong className="text-emerald-700">
                        {resultData.meritPosition ? `# ${resultData.meritPosition}` : "—"}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Subject Marksheet Table */}
                <div className="overflow-hidden rounded-3xl border border-line bg-card shadow-xs">
                  <div className="p-4 border-b border-line bg-paper/60 flex items-center justify-between">
                    <h4 className="text-sm font-bold text-foreground">বিষয়ভিত্তিক নম্বরপত্র (Subject-wise Breakdown)</h4>
                    <button
                      type="button"
                      onClick={() => setShowMarksheetModal(true)}
                      className="text-xs font-bold text-brand hover:underline"
                    >
                      অফিশিয়াল ট্রান্সক্রিপ্ট ভিউ →
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-line bg-paper font-bold uppercase text-ink/70">
                          <th className="p-3">বিষয়</th>
                          <th className="p-3 text-center">CQ</th>
                          <th className="p-3 text-center">MCQ</th>
                          <th className="p-3 text-center">ব্যবহারিক</th>
                          <th className="p-3 text-center">মোট নম্বর</th>
                          <th className="p-3 text-center">গ্রেড</th>
                          <th className="p-3 text-center">জিপিএ</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-line/60">
                        {resultData.subjects.map((sub, i) => (
                          <tr key={i} className="hover:bg-brand/5 transition">
                            <td className="p-3 font-semibold text-foreground">{sub.name}</td>
                            <td className="p-3 text-center font-mono">{sub.cq ?? "-"}</td>
                            <td className="p-3 text-center font-mono">{sub.mcq ?? "-"}</td>
                            <td className="p-3 text-center font-mono">{sub.practical ?? "-"}</td>
                            <td className="p-3 text-center font-mono font-bold text-foreground">
                              {sub.obtained} / {sub.full}
                            </td>
                            <td className="p-3 text-center font-bold text-emerald-800">{sub.letter}</td>
                            <td className="p-3 text-center font-mono font-bold">{sub.gpa.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Marksheet Modal */}
            {showMarksheetModal && resultData && (
              <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
                <div className="bg-card rounded-3xl p-6 max-w-4xl w-full border border-line shadow-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-line pb-3">
                    <h3 className="text-sm font-bold text-foreground">অফিশিয়াল একাডেমিক ট্রান্সক্রিপ্ট ও মার্কশীট</h3>
                    <button
                      type="button"
                      onClick={() => setShowMarksheetModal(false)}
                      className="rounded-full bg-paper border border-line text-ink/70 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 h-7 w-7 flex items-center justify-center text-xs font-bold transition"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="max-h-[75vh] overflow-y-auto p-2">
                    <PublicMarksheet row={resultData} school={schoolInfo} lang="bn" />
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-line">
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="rounded-xl bg-brand px-5 py-2 text-xs font-bold text-on-brand hover:opacity-90 transition"
                    >
                      🖨️ প্রিন্ট করুন
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 4: ADMIT CARD ================= */}
        {activeTab === "admit" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-black text-foreground">পরীক্ষার প্রবেশপত্র (Exam Admit Card)</h2>
                <p className="text-xs text-muted">
                  পরীক্ষার হলে প্রদর্শনের জন্য অফিশিয়াল প্রবেশপত্র ডাউনলোড ও প্রিন্ট করুন।
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedExamId}
                  onChange={(e) => setSelectedExamId(e.target.value)}
                  className="h-10 rounded-xl border border-line bg-card px-4 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand"
                >
                  {exams.map((ex) => (
                    <option key={ex._id} value={ex._id}>
                      {ex.name} {ex.academicYear ? `(${ex.academicYear})` : ""}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => setShowAdmitCardModal(true)}
                  className="h-10 px-4 rounded-xl bg-brand text-on-brand text-xs font-bold hover:opacity-90 transition flex items-center gap-1.5 shrink-0 shadow-xs"
                >
                  <span>🎫 পূর্ণ প্রবেশপত্র ভিউ ও প্রিন্ট</span>
                </button>
              </div>
            </div>

            {/* Embedded Admit Card Preview */}
            <div className="rounded-3xl border border-line bg-card p-6 shadow-xs overflow-x-auto">
              <PublicAdmitCard
                student={{
                  name: resultData?.student?.name || user?.name || "নুসরাত জাহান",
                  nameBn: resultData?.student?.nameBn || user?.nameBn,
                  studentId: activeStudentId,
                  rollNo: resultData?.student?.rollNo || user?.rollNo || "1",
                  className: resultData?.student?.className || user?.classId?.name || "Class 6",
                  section: resultData?.student?.section || user?.section || "A",
                  session: schoolInfo.academicYear || "2026",
                }}
                school={schoolInfo}
                exam={{
                  name: currentExamObj.name,
                  academicYear: currentExamObj.academicYear || schoolInfo.academicYear || "2026",
                }}
              />
            </div>

            {/* Admit Card Modal */}
            {showAdmitCardModal && (
              <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
                <div className="bg-card rounded-3xl p-6 max-w-4xl w-full border border-line shadow-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-line pb-3">
                    <h3 className="text-sm font-bold text-foreground">অফিশিয়াল পরীক্ষার প্রবেশপত্র (Admit Card)</h3>
                    <button
                      type="button"
                      onClick={() => setShowAdmitCardModal(false)}
                      className="rounded-full bg-paper border border-line text-ink/70 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 h-7 w-7 flex items-center justify-center text-xs font-bold transition"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="max-h-[75vh] overflow-y-auto p-2">
                    <PublicAdmitCard
                      student={{
                        name: resultData?.student?.name || user?.name || "নুসরাত জাহান",
                        nameBn: resultData?.student?.nameBn || user?.nameBn,
                        studentId: activeStudentId,
                        rollNo: resultData?.student?.rollNo || user?.rollNo || "1",
                        className: resultData?.student?.className || user?.classId?.name || "Class 6",
                        section: resultData?.student?.section || user?.section || "A",
                        session: schoolInfo.academicYear || "2026",
                      }}
                      school={schoolInfo}
                      exam={{
                        name: currentExamObj.name,
                        academicYear: currentExamObj.academicYear || schoolInfo.academicYear || "2026",
                      }}
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-line">
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="rounded-xl bg-brand px-5 py-2 text-xs font-bold text-on-brand hover:opacity-90 transition"
                    >
                      🖨️ প্রিন্ট করুন
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 5: FEES & RECEIPTS ================= */}
        {activeTab === "fees" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-black text-foreground">ফি ও জমার রসিদ (Payment History)</h2>
                <p className="text-xs text-muted">স্কুল অফিসে প্রদত্ত যাবতীয় ফি-এর অফিশিয়াল মানি রসিদ ও ভিউ সুবিধা।</p>
              </div>

              {/* Payment Info Card */}
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-3 text-xs text-emerald-900 flex items-center gap-3">
                <span className="text-xl">💳</span>
                <div>
                  <strong className="block font-bold">ম্যানুয়াল ফি পরিশোধ পদ্ধতি</strong>
                  <span className="text-[11px] text-emerald-800">
                    স্কুল ক্যাশ কাউন্টার অথবা নির্ধারিত মোবাইল ব্যাংকিং (bKash/Nagad)-এ পরিশোধযোগ্য।
                  </span>
                </div>
              </div>
            </div>

            {receiptsLoading ? (
              <div className="rounded-3xl border border-line bg-card p-12 text-center text-xs text-muted">
                রশিদ লোড হচ্ছে...
              </div>
            ) : !receipts.length ? (
              <div className="rounded-3xl border border-line bg-card p-12 text-center space-y-2">
                <div className="text-3xl">🧾</div>
                <h3 className="text-sm font-bold text-foreground">কোনো জমার রসিদ পাওয়া যায়নি</h3>
                <p className="text-xs text-muted">
                  এই শিক্ষার্থীর কোনো পেমেন্ট রেকর্ড থাকলে তা এখানে রসিদসহ সংরক্ষিত থাকবে।
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {receipts.map((rc) => (
                  <div
                    key={rc.receiptNo}
                    className="rounded-2xl border border-line bg-card p-5 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-mono font-bold text-brand">#{rc.receiptNo}</span>
                        <span className="text-[10px] text-muted font-mono">
                          {new Date(rc.date).toLocaleDateString("bn-BD")}
                        </span>
                      </div>

                      <div className="my-2">
                        <span className="text-2xl font-black text-foreground">৳ {rc.amount.toLocaleString()}</span>
                        <span className="ml-2 rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold">
                          {rc.method}
                        </span>
                      </div>

                      <div className="space-y-1 pt-2 border-t border-line/60 text-xs">
                        {rc.lines.map((ln, idx) => (
                          <div key={idx} className="flex justify-between text-muted text-[11px]">
                            <span>{ln.title}</span>
                            <span className="font-mono font-bold text-foreground">৳ {ln.amount}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-5 pt-3">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedReceipt({
                            receiptNo: rc.receiptNo,
                            lines: rc.lines,
                            method: rc.method,
                            refNo: rc.refNo,
                            date: rc.date,
                            studentName: resultData?.student?.name || user?.name,
                            studentId: activeStudentId,
                            className: resultData?.student?.className || user?.classId?.name,
                            academicYear: rc.academicYear,
                          });
                        }}
                        className="w-full rounded-xl bg-brand/10 hover:bg-brand hover:text-on-brand text-brand py-2 text-xs font-bold transition text-center"
                      >
                        📄 পূর্ণ রশিদ দেখুন ও প্রিন্ট
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Receipt Modal */}
            {selectedReceipt && (
              <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
                <div className="bg-card rounded-3xl p-6 max-w-2xl w-full border border-line shadow-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-line pb-3">
                    <h3 className="text-sm font-bold text-foreground">অফিশিয়াল পেমেন্ট রসিদ</h3>
                    <button
                      type="button"
                      onClick={() => setSelectedReceipt(null)}
                      className="rounded-full bg-paper border border-line text-ink/70 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 h-7 w-7 flex items-center justify-center text-xs font-bold transition"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="max-h-[70vh] overflow-y-auto p-2">
                    <PublicReceipt item={selectedReceipt} school={schoolInfo} />
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-line">
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="rounded-xl bg-brand px-5 py-2 text-xs font-bold text-on-brand hover:opacity-90 transition"
                    >
                      🖨️ প্রিন্ট করুন
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 6: SYLLABUS ================= */}
        {activeTab === "syllabus" && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-black text-foreground">পাঠ্যক্রম ও সিলেবাস রূপরেখা</h2>
                <p className="text-xs text-muted">শ্রেণিভিত্তিক বাৎসরিক বিষয় ও অধ্যায়ের বিস্তারিত সিলেবাস।</p>
              </div>

              {/* Class Switcher */}
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="h-10 rounded-xl border border-line bg-card px-4 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand"
              >
                {classes.map((cls) => (
                  <option key={cls._id} value={cls._id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>

            {syllabusLoading ? (
              <div className="rounded-3xl border border-line bg-card p-12 text-center text-xs text-muted">
                সিলেবাস লোড হচ্ছে...
              </div>
            ) : !syllabuses.length ? (
              <div className="rounded-3xl border border-line bg-card p-12 text-center text-xs text-muted">
                এই শ্রেণির কোনো পাঠ্যক্রম তালিকাভুক্ত নেই।
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {syllabuses.map((sy) => (
                  <div key={sy._id} className="rounded-2xl border border-line bg-card p-5 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="rounded-md bg-brand/10 text-brand px-2 py-0.5 text-[10px] font-bold">
                          {sy.academicYear || "2026"}
                        </span>
                        <span className="text-[10px] text-muted">
                          {(sy.chaptersBn || sy.chaptersEn || []).length} টি অধ্যায়
                        </span>
                      </div>

                      <h3 className="text-base font-black text-foreground mt-1">
                        {sy.nameBn || sy.name}
                      </h3>
                      {sy.name && sy.nameBn && (
                        <p className="text-xs text-muted">{sy.name}</p>
                      )}

                      <div className="mt-4 pt-3 border-t border-line/60">
                        <span className="text-[11px] font-bold text-muted block mb-2">অধ্যায়সমূহ:</span>
                        <ul className="space-y-1 text-xs text-foreground list-decimal list-inside">
                          {(sy.chaptersBn || sy.chaptersEn || []).map((ch, idx) => (
                            <li key={idx} className="line-clamp-1">
                              {ch}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 7: ACADEMIC CALENDAR ================= */}
        {activeTab === "calendar" && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-black text-foreground">ছুটি ও অ্যাকাডেমিক ক্যালেন্ডার</h2>
              <p className="text-xs text-muted">সরকারি ছুটি, সাময়িক পরীক্ষা ও বাৎসরিক অনুষ্ঠানসমূহের দিনপঞ্জি।</p>
            </div>
            <PublicCalendar lang="bn" />
          </div>
        )}

        {/* ================= TAB 8: NOTICES ================= */}
        {activeTab === "notices" && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-black text-foreground">ক্যাম্পাস নোটিশ ও সার্কুলার</h2>
              <p className="text-xs text-muted">স্কুল কর্তৃপক্ষ কর্তৃক প্রকাশিত সাম্প্রতিক জরুরি নোটিশসমূহ।</p>
            </div>

            {!notices.length ? (
              <div className="rounded-3xl border border-line bg-card p-12 text-center text-xs text-muted">
                বর্তমানে কোনো নতুন নোটিশ নেই।
              </div>
            ) : (
              <div className="space-y-3">
                {notices.map((n) => (
                  <div
                    key={n._id}
                    className="rounded-2xl border border-line bg-card p-5 shadow-xs hover:border-brand/40 transition"
                  >
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="rounded-md bg-brand/10 text-brand px-2 py-0.5 text-[10px] font-bold uppercase">
                        {n.category || "নোটিশ"}
                      </span>
                      <span className="font-mono text-xs text-muted">
                        {new Date(n.createdAt).toLocaleDateString("bn-BD")}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-foreground">{n.title}</h3>
                    {n.body && (
                      <p className="mt-2 text-xs text-muted leading-relaxed whitespace-pre-line">{n.body}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
