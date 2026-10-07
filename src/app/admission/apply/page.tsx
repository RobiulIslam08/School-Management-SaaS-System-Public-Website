import { ApplyForm } from "@/components/apply-form";
import { PageIntro, Shell } from "@/components/shell";
import { getSite } from "@/lib/api";
import { getLang } from "@/lib/locale";

export default async function Page() {
  const [site, lang] = await Promise.all([getSite(), getLang()]);
  if (!site) return <p className="p-8">The school site could not be loaded.</p>;
  return (
    <Shell site={site} lang={lang}>
      <PageIntro kicker="Admission" title={lang === "bn" ? "অনলাইন আবেদন" : "Online application"} summary={lang === "bn" ? "ড্যাশবোর্ডের ভর্তি ফর্ম এই এক পাতায়। ধাপ নেই। জমা মানে অপেক্ষমাণ। স্কুল অনুমোদন করলে ভর্তি। ফি অফিসে।" : "The dashboard admission form is this one page. There are no steps. Submitting means pending. Admission starts when the school approves it. The fee is at the office."} image={site.config.heroImageUrl} alt={site.school.name} />
      {site.config.publicAdmission ? (
        <ApplyForm
          classes={site.classes}
          lang={lang}
          year={site.school.academicYear}
          school={{ ...site.school, accent: site.config.theme.primary }}
        />
      ) : (
        <p className="mx-auto max-w-xl px-4 pb-16">{lang === "bn" ? "অনলাইন আবেদন এখন বন্ধ আছে।" : "Online admission is not open yet."}</p>
      )}
    </Shell>
  );
}
