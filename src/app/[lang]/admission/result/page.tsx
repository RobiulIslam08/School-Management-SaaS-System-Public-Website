import { AdmissionResultLookup } from "@/components/admission-result-lookup";
import { PageIntro, Shell } from "@/components/shell";
import { getSite } from "@/lib/api";
import { getLang, type LangProps } from "@/lib/locale";

export default async function AdmissionResultPage({ params }: LangProps) {
  const [site, lang] = await Promise.all([getSite(), getLang(params)]);
  if (!site) return <p className="p-8">The school site could not be loaded.</p>;

  return (
    <Shell site={site} lang={lang}>
      <PageIntro
        kicker={lang === "bn" ? "ভর্তি কার্যক্রম" : "Admission"}
        title={lang === "bn" ? "ভর্তি পরীক্ষার ফলাফল" : "Admission Exam Results"}
        summary={
          lang === "bn"
            ? "ভর্তি পরীক্ষার রোল অথবা মোবাইল নম্বর দিয়ে অনলাইনে ফলাফল দেখুন ও ফলাফল স্লিপ প্রিন্ট করুন।"
            : "Look up admission test results online using your roll or phone number and print your qualification slip."
        }
        image={site.config.heroImageUrl}
        alt={site.school.name}
      />
      <AdmissionResultLookup lang={lang} schoolName={site.school.name} />
    </Shell>
  );
}
