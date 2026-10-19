import React from "react";

export interface AdmitCardStudent {
  name: string;
  nameBn?: string;
  studentId: string;
  rollNo?: string;
  className?: string;
  section?: string;
  group?: string;
  session?: string;
  photoUrl?: string;
}

export interface AdmitCardSchool {
  name: string;
  logoUrl?: string;
  motto?: string;
  address?: string;
  eiin?: string;
  academicYear?: string;
}

export interface AdmitCardExam {
  name: string;
  academicYear?: string;
  subjects?: Array<{
    name: string;
    code?: string;
    date?: string;
    time?: string;
  }>;
}

export function PublicAdmitCard({
  student,
  school,
  exam,
}: {
  student: AdmitCardStudent;
  school: AdmitCardSchool;
  exam: AdmitCardExam;
}) {
  const subjectsList =
    exam.subjects && exam.subjects.length > 0
      ? exam.subjects
      : [
          { name: "বাংলা (Bangla)", code: "101", date: "2026-11-01", time: "10:00 AM - 01:00 PM" },
          { name: "ইংরেজি (English)", code: "107", date: "2026-11-03", time: "10:00 AM - 01:00 PM" },
          { name: "গণিত (Mathematics)", code: "109", date: "2026-11-05", time: "10:00 AM - 01:00 PM" },
          { name: "বিজ্ঞান (Science)", code: "127", date: "2026-11-08", time: "10:00 AM - 01:00 PM" },
          { name: "ধর্ম ও নৈতিক শিক্ষা (Religion)", code: "111", date: "2026-11-10", time: "10:00 AM - 01:00 PM" },
          { name: "বাংলাদেশ ও বিশ্বপরিচয় (BGS)", code: "150", date: "2026-11-12", time: "10:00 AM - 01:00 PM" },
          { name: "তথ্য ও যোগাযোগ প্রযুক্তি (ICT)", code: "154", date: "2026-11-15", time: "10:00 AM - 12:00 PM" },
        ];

  return (
    <div className="w-full max-w-3xl mx-auto bg-white text-slate-900 border-2 border-slate-900 p-6 sm:p-8 rounded-xl shadow-lg print:border-2 print:shadow-none print:p-6 print:m-0 font-sans">
      {/* Top School Header */}
      <div className="border-b-2 border-slate-900 pb-4 text-center relative">
        <div className="flex items-center justify-between gap-4">
          <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full border border-slate-400 bg-slate-50 flex items-center justify-center shrink-0 overflow-hidden">
            {school.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={school.logoUrl} alt="Logo" className="h-full w-full object-cover" />
            ) : (
              <span className="text-3xl">🏛️</span>
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-black text-slate-950 uppercase tracking-wide">
              {school.name}
            </h1>
            {school.motto && <p className="text-xs text-slate-600 italic mt-0.5">{school.motto}</p>}
            <p className="text-xs text-slate-700 mt-1">
              {school.address || "বাংলাদেশ"} {school.eiin ? `· ইআইআইএন (EIIN): ${school.eiin}` : ""}
            </p>
            <div className="mt-2 inline-block rounded-full bg-slate-900 px-4 py-1 text-xs font-black uppercase text-white tracking-widest">
              প্রবেশপত্র · ADMIT CARD
            </div>
          </div>

          {/* Student Photo Box */}
          <div className="h-20 w-18 border-2 border-dashed border-slate-400 rounded bg-slate-50 flex flex-col items-center justify-center text-[10px] text-slate-500 font-bold shrink-0 overflow-hidden">
            {student.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={student.photoUrl} alt="Student" className="h-full w-full object-cover" />
            ) : (
              <>
                <span className="text-xl mb-0.5">👤</span>
                <span>ছবি / Photo</span>
              </>
            )}
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-slate-200 flex justify-between text-xs font-bold text-slate-800">
          <span>পরীক্ষা: <strong className="text-slate-950">{exam.name}</strong></span>
          <span>শিক্ষাবর্ষ: <strong className="text-slate-950">{exam.academicYear || school.academicYear || "2026"}</strong></span>
        </div>
      </div>

      {/* Student Credentials Grid */}
      <div className="my-4 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs">
        <div>
          <span className="text-slate-500 block text-[11px]">শিক্ষার্থীর নাম (Name):</span>
          <strong className="text-slate-900 font-bold block">{student.name}</strong>
          {student.nameBn && <span className="text-[11px] text-slate-600 block">{student.nameBn}</span>}
        </div>
        <div>
          <span className="text-slate-500 block text-[11px]">শিক্ষার্থী আইডি (ID):</span>
          <strong className="font-mono text-slate-950 font-bold text-sm block">{student.studentId}</strong>
        </div>
        <div>
          <span className="text-slate-500 block text-[11px]">শ্রেণি ও শাখা (Class &amp; Sec):</span>
          <strong className="text-slate-900 font-bold block">
            {student.className || "Class"} {student.section ? `(${student.section})` : ""}
          </strong>
        </div>
        <div>
          <span className="text-slate-500 block text-[11px]">শ্রেণি রোল (Roll No):</span>
          <strong className="font-mono text-slate-950 font-bold text-sm block">#{student.rollNo || "-"}</strong>
        </div>
      </div>

      {/* Exam Schedule Table */}
      <div className="mt-4 border border-slate-300 rounded-lg overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-800 text-white font-bold uppercase text-[11px]">
              <th className="p-2.5 text-center w-12">ক্র.</th>
              <th className="p-2.5">বিষয় ও কোড (Subject)</th>
              <th className="p-2.5 text-center">তারিখ (Date)</th>
              <th className="p-2.5 text-center">সময় (Time)</th>
              <th className="p-2.5 text-center w-28">কক্ষ পরিদর্শকের স্বাক্ষর</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-800">
            {subjectsList.map((sub, idx) => (
              <tr key={idx} className="hover:bg-slate-50">
                <td className="p-2 text-center font-mono font-bold text-slate-600">{idx + 1}</td>
                <td className="p-2 font-semibold text-slate-900">
                  {sub.name} {sub.code ? `(${sub.code})` : ""}
                </td>
                <td className="p-2 text-center font-mono">{sub.date || "নির্ধারিত"}</td>
                <td className="p-2 text-center font-mono">{sub.time || "১০:০০ - ০১:০০"}</td>
                <td className="p-2 text-center border-l border-slate-200"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Instructions for Examinees */}
      <div className="mt-4 border border-slate-200 bg-amber-50/50 p-3 rounded-lg text-[11px] text-slate-700 space-y-1">
        <strong className="text-slate-900 block font-bold">পরীক্ষার্থীদের জন্য বিশেষ নির্দেশাবলী:</strong>
        <ul className="list-disc list-inside space-y-0.5 text-slate-600">
          <li>পরীক্ষা শুরুর অন্তত ৩০ মিনিট পূর্বে পরীক্ষার হলে উপস্থিত হতে হবে।</li>
          <li>এই প্রবেশপত্র এবং আইডি কার্ড অবশ্যই সাথে নিয়ে আসতে হবে।</li>
          <li>পরীক্ষা কক্ষে মোবাইল ফোন বা কোনো ইলেকট্রনিক ডিভাইস সম্পূর্ণ নিষিদ্ধ।</li>
          <li>উত্তরপত্রে প্রয়োজনীয় তথ্য ও রোল সঠিকভাবে বৃত্ত ভরাট করতে হবে।</li>
        </ul>
      </div>

      {/* Official Signatures */}
      <div className="mt-8 pt-6 border-t-2 border-slate-900 flex items-end justify-between px-4 text-xs font-bold text-slate-900">
        <div className="text-center">
          <div className="w-36 border-b border-slate-700 mb-1"></div>
          <span>শিক্ষার্থীর স্বাক্ষর</span>
          <span className="block text-[10px] text-slate-500">Student Signature</span>
        </div>

        <div className="text-center">
          <div className="w-36 border-b border-slate-700 mb-1"></div>
          <span>শ্রেণি শিক্ষকের স্বাক্ষর</span>
          <span className="block text-[10px] text-slate-500">Class Teacher</span>
        </div>

        <div className="text-center">
          <div className="w-36 border-b-2 border-slate-900 mb-1"></div>
          <span className="text-slate-950 font-black">প্রধান শিক্ষক / অধ্যক্ষ</span>
          <span className="block text-[10px] text-slate-500 font-normal">Head of Institution</span>
        </div>
      </div>
    </div>
  );
}
