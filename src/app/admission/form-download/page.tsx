import { PageIntro, Shell } from "@/components/shell";
import { getSite } from "@/lib/api";
import { getLang } from "@/lib/locale";

export default async function BlankAdmissionFormPage() {
  const [site, lang] = await Promise.all([getSite(), getLang()]);
  if (!site) return <p className="p-8">The school site could not be loaded.</p>;

  return (
    <Shell site={site} lang={lang}>
      <div className="no-print">
        <PageIntro
          kicker={lang === "bn" ? "ভর্তি ফরম" : "Admission"}
          title={lang === "bn" ? "ভর্তি ফরম ডাউনলোড ও প্রিন্ট" : "Blank Admission Form Download"}
          summary={
            lang === "bn"
              ? "অফলাইনে আবেদনের জন্য নির্ধারিত ভর্তি আবেদন ফরমটি ডাউনলোড ও প্রিন্ট করুন।"
              : "Download and print the official offline admission application form."
          }
          image={site.config.heroImageUrl}
          alt={site.school.name}
        />
        <div className="mx-auto max-w-3xl px-4 py-4 flex justify-end">
          <button
            type="button"
            className="rounded-full bg-brand px-6 py-2.5 text-sm font-bold text-on-brand hover:opacity-90 shadow"
            onClick={undefined}
          >
            🖨️ {lang === "bn" ? "ভর্তি ফরম প্রিন্ট করুন" : "Print Admission Form"}
          </button>
        </div>
      </div>

      {/* Printable Blank Form */}
      <div className="mx-auto my-6 max-w-3xl rounded-xl border-2 border-foreground bg-white p-8 text-black print:m-0 print:border-none print:p-0 shadow-lg print:shadow-none">
        {/* Letterhead */}
        <div className="text-center border-b-2 border-black pb-4">
          <h1 className="text-2xl font-black uppercase tracking-wider">{site.school.name}</h1>
          <p className="text-xs text-gray-700">{site.school.address}</p>
          {site.school.eiin && <p className="text-xs font-mono font-semibold">EIIN: {site.school.eiin}</p>}
          <div className="mt-3 inline-block rounded border-2 border-black px-6 py-1 text-sm font-black uppercase tracking-widest bg-gray-100">
            ADMISSION APPLICATION FORM / ভর্তি আবেদন ফরম
          </div>
          <p className="mt-1 text-xs font-bold">Academic Session: {site.school.academicYear || "2026"}</p>
        </div>

        {/* Top meta & Photo box */}
        <div className="my-4 flex items-start justify-between gap-4">
          <div className="space-y-1.5 text-xs flex-1">
            <div className="flex gap-2">
              <span className="font-bold">Form No / ফরম নং:</span>
              <span className="border-b border-black w-32 inline-block"></span>
            </div>
            <div className="flex gap-2">
              <span className="font-bold">Application Date:</span>
              <span className="border-b border-black w-32 inline-block"></span>
            </div>
            <div className="flex gap-2">
              <span className="font-bold">Desired Class / ভর্তির শ্রেণি:</span>
              <span className="border-b border-black w-40 inline-block"></span>
            </div>
          </div>

          <div className="h-28 w-24 border-2 border-dashed border-black flex flex-col items-center justify-center text-center text-[10px] text-gray-500 font-semibold p-1">
            Passport Size Color Photo (১ কপি ছবি)
          </div>
        </div>

        {/* Section 1: Student Information */}
        <div className="space-y-3 text-xs border-t border-black pt-3">
          <h3 className="font-bold uppercase tracking-wider bg-gray-200 px-2 py-0.5">
            1. Student Information / শিক্ষার্থীর তথ্যাবলী
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="font-semibold">Full Name (English - BLOCK LETTERS):</span>
              <div className="border-b border-black h-6"></div>
            </div>
            <div>
              <span className="font-semibold">পূর্ণ নাম (বাংলায়):</span>
              <div className="border-b border-black h-6"></div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <span className="font-semibold">Date of Birth / জন্ম তারিখ:</span>
              <div className="border-b border-black h-6"></div>
            </div>
            <div>
              <span className="font-semibold">Birth Reg. No / জন্ম নিবন্ধন নং:</span>
              <div className="border-b border-black h-6"></div>
            </div>
            <div>
              <span className="font-semibold">Blood Group / রক্তের গ্রুপ:</span>
              <div className="border-b border-black h-6"></div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <span className="font-semibold">Gender / লিঙ্গ:</span>
              <div className="border-b border-black h-6 text-gray-500 text-[11px] pt-1">
                [ ] Male  [ ] Female
              </div>
            </div>
            <div>
              <span className="font-semibold">Religion / ধর্ম:</span>
              <div className="border-b border-black h-6"></div>
            </div>
            <div>
              <span className="font-semibold">Previous School / পূর্ববর্তী বিদ্যালয়:</span>
              <div className="border-b border-black h-6"></div>
            </div>
          </div>
        </div>

        {/* Section 2: Parents & Guardian */}
        <div className="space-y-3 text-xs border-t border-black pt-3 mt-4">
          <h3 className="font-bold uppercase tracking-wider bg-gray-200 px-2 py-0.5">
            2. Parents & Guardian / অভিভাবকের তথ্যাবলী
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="font-semibold">Father&apos;s Name / পিতার নাম:</span>
              <div className="border-b border-black h-6"></div>
            </div>
            <div>
              <span className="font-semibold">Father&apos;s Mobile / পিতার মোবাইল:</span>
              <div className="border-b border-black h-6"></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="font-semibold">Mother&apos;s Name / মাতার নাম:</span>
              <div className="border-b border-black h-6"></div>
            </div>
            <div>
              <span className="font-semibold">Mother&apos;s Mobile / মাতার মোবাইল:</span>
              <div className="border-b border-black h-6"></div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <span className="font-semibold">Legal Guardian / অভিভাবক:</span>
              <div className="border-b border-black h-6"></div>
            </div>
            <div>
              <span className="font-semibold">Relation / সম্পর্ক:</span>
              <div className="border-b border-black h-6"></div>
            </div>
            <div>
              <span className="font-semibold">Guardian Phone / মোবাইল:</span>
              <div className="border-b border-black h-6"></div>
            </div>
          </div>
        </div>

        {/* Section 3: Address */}
        <div className="space-y-3 text-xs border-t border-black pt-3 mt-4">
          <h3 className="font-bold uppercase tracking-wider bg-gray-200 px-2 py-0.5">
            3. Address / ঠিকানা
          </h3>

          <div>
            <span className="font-semibold">Present Address / বর্তমান ঠিকানা:</span>
            <div className="border-b border-black h-6"></div>
          </div>

          <div>
            <span className="font-semibold">Permanent Address / স্থায়ী ঠিকানা:</span>
            <div className="border-b border-black h-6"></div>
          </div>
        </div>

        {/* Declaration & Signatures */}
        <div className="mt-6 border-t border-black pt-3 text-[11px] space-y-4">
          <p className="text-gray-700 italic">
            অঙ্গীকারনামা: আমি এই মর্মে ঘোষণা করছি যে, উপরে প্রদত্ত সকল তথ্য সত্য ও সঠিক। কোনো অসত্য তথ্য প্রমাণিত হলে এই আবেদন বাতিল বলে গণ্য হবে।
          </p>

          <div className="flex justify-between pt-8 text-center text-xs">
            <div className="border-t border-black w-40 pt-1">
              <span>শিক্ষার্থীর স্বাক্ষর</span>
              <div className="text-[10px] text-gray-500">Student&apos;s Signature</div>
            </div>
            <div className="border-t border-black w-44 pt-1">
              <span>অভিভাবকের স্বাক্ষর</span>
              <div className="text-[10px] text-gray-500">Guardian&apos;s Signature</div>
            </div>
            <div className="border-t border-black w-40 pt-1">
              <span>অধ্যক্ষ / প্রধান শিক্ষক</span>
              <div className="text-[10px] text-gray-500">Principal / Headmaster</div>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
