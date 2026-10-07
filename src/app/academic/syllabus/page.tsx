import { SyllabusBoard } from "@/components/syllabus-board";
import { PageIntro, Shell } from "@/components/shell";
import { getSite } from "@/lib/api";
import { getLang } from "@/lib/locale";
import { pick } from "@/lib/text";
import type { Lang } from "@/lib/types";

const KIND: Record<string, { bn: string; en: string }> = {
  syllabus: { bn: "সিলেবাস", en: "Syllabus" },
  calendar: { bn: "ক্যালেন্ডার", en: "Calendar" },
  form: { bn: "ফর্ম", en: "Form" },
  prospectus: { bn: "প্রসপেক্টাস", en: "Prospectus" },
  routine: { bn: "রুটিন", en: "Routine" },
};

function kindLabel(lang: Lang, kind: string): string {
  const label = KIND[kind];
  if (!label) return kind;
  return lang === "bn" ? label.bn : label.en;
}

export default async function Page() {
  const [site, lang] = await Promise.all([getSite(), getLang()]);
  if (!site) return <p className="p-8">The school site could not be loaded.</p>;
  const files = site.files.filter((item) => item.kind === "syllabus" || item.kind === "calendar" || item.kind === "form" || item.kind === "prospectus");
  return (
    <Shell site={site} lang={lang}>
      <PageIntro kicker="Academic" title={lang === "bn" ? "সিলেবাস ও ডাউনলোড" : "Syllabus and downloads"} summary={lang === "bn" ? "ক্লাস বেছে প্রতিটি বিষয়ের অধ্যায় দেখুন। পিডিএফ থাকলে নিচে নামানো যায়।" : "Pick a class to read the chapters for each subject. Download a PDF below when one is published."} image={site.config.heroImageUrl} alt={site.school.name} />
      <div className="step-row">
        {(lang === "bn"
          ? [
              ["০১", "ক্লাস বেছে নিন", "যে শ্রেণির অধ্যায় দেখবেন, সেই ক্লাস নিন।"],
              ["০২", "বিষয়ের অধ্যায়", "প্রতিটি বিষয়ে ছোট অধ্যায়ের তালিকা। নতুন অধ্যায় অফিস বসালে এখানেই দেখা যাবে।"],
              ["০৩", "পিডিএফ", "সিলেবাস, ক্যালেন্ডার বা প্রসপেক্টাস প্রকাশিত থাকলে নিচে নামানো যায়।"],
            ]
          : [
              ["01", "Choose a class", "Pick the class whose chapters you want to read."],
              ["02", "Chapters by subject", "Each subject has a short list of chapters. A new chapter appears here once the office adds it."],
              ["03", "PDF", "A published syllabus, calendar, or prospectus can be downloaded below."],
            ]
        ).map(([num, title, body]) => (
          <section key={num} className="story-card">
            <span className="story-num">{num}</span>
            <div>
              <h2>{title}</h2>
              <p>{body}</p>
            </div>
          </section>
        ))}
      </div>
      <SyllabusBoard classes={site.classes} lang={lang} />
      <ul className="mx-auto max-w-3xl px-4 pb-12">
        {files.length ? files.map((file, index) => (
          <li key={file._id} className="index-row">
            <strong>{String(index + 1).padStart(2, "0")}</strong>
            <span className="flex items-center justify-between gap-3">
              <span>
                <span className="block font-semibold">{pick(lang, file.titleBn, file.titleEn) || file.filename}</span>
                <span className="text-xs uppercase tracking-wide text-accent">{kindLabel(lang, file.kind)}{file.academicYear ? ` · ${file.academicYear}` : ""}</span>
              </span>
              <a className="text-sm font-semibold text-brand" href={`/api/v1/public/website/files/${file._id}`}>{lang === "bn" ? "ডাউনলোড" : "Download"}</a>
            </span>
          </li>
        )) : <li className="py-8 text-sm text-muted">{lang === "bn" ? "এখনো কোনো ফাইল প্রকাশিত হয়নি।" : "No files published yet."}</li>}
      </ul>
    </Shell>
  );
}
