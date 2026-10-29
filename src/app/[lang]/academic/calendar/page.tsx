import { PublicCalendar } from "@/components/public-calendar";
import { PageIntro, Shell } from "@/components/shell";
import { getSite } from "@/lib/api";
import { getLang, type LangProps } from "@/lib/locale";

export default async function AcademicCalendarPage({ params }: LangProps) {
  const [site, lang] = await Promise.all([getSite(), getLang(params)]);
  if (!site) return <p className="p-8">The school site could not be loaded.</p>;

  return (
    <Shell site={site} lang={lang}>
      <PageIntro
        kicker={lang === "bn" ? "একাডেমিক" : "Academic"}
        title={lang === "bn" ? "একাডেমিক ক্যালেন্ডার ও বাৎসরিক ছুটির তালিকা" : "Academic Calendar & Annual Holidays"}
        summary={
          lang === "bn"
            ? "বিদ্যালয়ের শিক্ষাবর্ষের সকল সাধারণ ছুটি, পরীক্ষার সময়সূচী ও বার্ষিক অনুষ্ঠানের মাসিক ক্যালেন্ডার।"
            : "Monthly visual academic calendar featuring all school holidays, exam schedules, and annual institutional events."
        }
        image={site.config.heroImageUrl}
        alt={site.school.name}
      />
      <PublicCalendar lang={lang} />
    </Shell>
  );
}
