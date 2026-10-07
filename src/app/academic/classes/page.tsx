import { PageIntro, Shell } from "@/components/shell";
import { getSite } from "@/lib/api";
import { getLang } from "@/lib/locale";
import type { ClassItem, Lang } from "@/lib/types";

function band(level: number | undefined): string {
  if (level === undefined || level <= 0) return "early";
  if (level <= 5) return "primary";
  if (level <= 8) return "junior";
  return "secondary";
}

const BANDS: Record<string, { bn: string; en: string; introBn: string; introEn: string }> = {
  early: {
    bn: "প্রাক-প্রাথমিক",
    en: "Early years",
    introBn: "খেলার মাধ্যমে অক্ষর ও সংখ্যা। শাখা ও বিষয় নিচের কার্ডে। রুটিন ও সিলেবাস সেই শ্রেণির লিংকে।",
    introEn: "Letters and numbers through play. Sections and subjects are on the cards below. The routine and syllabus open from that class.",
  },
  primary: {
    bn: "প্রাথমিক",
    en: "Primary",
    introBn: "প্রথম থেকে পঞ্চম। প্রতিটি কার্ডে শাখার সংখ্যা ও বিষয়ের সংখ্যা। নতুন বিষয় যোগ হলে কার্ডেই দেখা যাবে।",
    introEn: "Class one through five. Each card shows how many sections and subjects. A new subject appears on the card.",
  },
  junior: {
    bn: "নিম্ন মাধ্যমিক",
    en: "Junior",
    introBn: "ষষ্ঠ থেকে অষ্টম। বিষয়ের তালিকা সিলেবাসের অধ্যায়ের সঙ্গে মিলে। পরীক্ষার সপ্তাহ ক্যালেন্ডারে, দিন নোটিশে।",
    introEn: "Class six through eight. The subject list matches the syllabus chapters. Exam weeks are on the calendar. The day is a notice.",
  },
  secondary: {
    bn: "মাধ্যমিক",
    en: "Secondary",
    introBn: "নবম ও দশম। শাখা আলাদা থাকলে কার্ডে নাম। আসন সংখ্যা এই পাতায় নেই — ভর্তি নোটিশ ও অফিস চূড়ান্ত।",
    introEn: "Class nine and ten. A named section is on the card. Seat counts are not on this page. The admission notice and the office are final.",
  },
};

export default async function Page() {
  const [site, lang] = await Promise.all([getSite(), getLang()]);
  if (!site) return <p className="p-8">The school site could not be loaded.</p>;
  const groups = ["early", "primary", "junior", "secondary"].filter((key) => site.classes.some((item) => band(item.level) === key));
  return (
    <Shell site={site} lang={lang}>
      <PageIntro kicker="Academic" title={lang === "bn" ? "ক্লাস ও বিষয়" : "Classes and subjects"} summary={lang === "bn" ? "প্রাক-প্রাথমিক থেকে মাধ্যমিক। প্রতিটি শ্রেণির শাখা ও বিষয় একাডেমিক তালিকা থেকে। খালি বিষয় মানে এখনো যোগ হয়নি।" : "From early years through secondary. Sections and subjects come from the academic list. An empty subject line means none have been added yet."} image={site.config.heroImageUrl} alt={site.school.name} />
      <p className="mx-auto max-w-3xl px-4 pt-4 text-sm leading-6 text-muted">
        {lang === "bn"
          ? "রুটিন ও সিলেবাস এই শ্রেণির ওপর বসে। নতুন বিষয় যোগ হলে কার্ডে দেখা যাবে। আসন সংখ্যা এই পাতায় নেই — ভর্তি নোটিশ ও অফিস চূড়ান্ত।"
          : "The routine and syllabus sit on these classes. A new subject shows on the card. Seat counts are not on this page. The admission notice and the office are final."}
      </p>
      <div className="mx-auto max-w-7xl space-y-12 px-4 py-12">
        {groups.map((key) => (
          <section key={key}>
            <h2 className="display text-xl font-semibold">{lang === "bn" ? BANDS[key].bn : BANDS[key].en}</h2>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-muted">{lang === "bn" ? BANDS[key].introBn : BANDS[key].introEn}</p>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {site.classes.filter((item) => band(item.level) === key).map((item) => (
                <ClassCard key={item._id} item={item} lang={lang} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </Shell>
  );
}

function ClassCard({ item, lang }: { item: ClassItem; lang: Lang }) {
  const bn = lang === "bn";
  return (
    <article className="sheet p-6">
      <h3 className="text-2xl font-semibold">{item.name}</h3>
      <p className="mt-1 text-sm font-medium text-brand">
        {bn ? `${item.sections.length}টি শাখা · ${item.subjects.length}টি বিষয়` : `${item.sections.length} sections · ${item.subjects.length} subjects`}
      </p>
      {item.sections.length ? <p className="mt-1 text-sm text-muted">{item.sections.join(" · ")}</p> : null}
      <ul className="mt-4 flex flex-wrap gap-2">
        {item.subjects.length ? item.subjects.map((subject, index) => (
          <li key={`${subject.code}-${index}`} className="rounded-full bg-paper px-3 py-1 text-sm">
            {bn && subject.nameBn ? subject.nameBn : subject.name}
          </li>
        )) : <li className="text-sm text-muted">{bn ? "বিষয় এখনো যোগ হয়নি।" : "Subjects are not listed yet."}</li>}
      </ul>
      <p className="mt-4 flex gap-4 text-sm font-semibold">
        <a className="text-brand" href="/academic/routine">{bn ? "রুটিন" : "Routine"}</a>
        <a className="text-brand" href="/academic/syllabus">{bn ? "সিলেবাস" : "Syllabus"}</a>
      </p>
    </article>
  );
}
