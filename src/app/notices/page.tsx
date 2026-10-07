import { PageIntro, Shell } from "@/components/shell";
import { NoticeBoard } from "@/components/notice-board";
import { getNotices, getSite } from "@/lib/api";
import { getLang } from "@/lib/locale";

export default async function Page() {
  const [site, lang, notices] = await Promise.all([getSite(), getLang(), getNotices()]);
  if (!site) return <p className="p-8">The school site could not be loaded.</p>;
  const items = notices ?? site.notices;
  return (
    <Shell site={site} lang={lang}>
      <PageIntro
        kicker={site.school.name}
        title={lang === "bn" ? "নোটিশ বোর্ড" : "Notice board"}
        summary={lang === "bn" ? "ছুটি, পরীক্ষা, ভর্তি ও অফিসের খবর। পিন করা নোটিশ উপরে। তারিখ ও স্মারক চিঠিতে।" : "Holidays, exams, admission, and office news. Pinned notices stay on top. The date and reference sit on the letter."}
        image={site.config.heroImageUrl}
        alt={site.school.name}
      />
      <p className="mx-auto max-w-3xl px-4 pt-4 text-sm leading-6 text-muted">
        {lang === "bn"
          ? "একটি নোটিশ খুললে স্কুলের নাম, EIIN, স্মারক নম্বর ও স্বাক্ষর দেখা যায়। খুঁজতে শিরোনাম বা বিভাগ ব্যবহার করুন। ফির অঙ্ক বা পরীক্ষার নম্বর নোটিশে না থাকলে এখানে বসানো হয় না।"
          : "Opening a notice shows the school name, EIIN, reference, and signature. Search by title or category. A fee amount or an exam mark is not added unless the notice itself states it."}
      </p>
      <NoticeBoard notices={items} lang={lang} />
    </Shell>
  );
}
