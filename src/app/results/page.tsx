import { MeritList } from "@/components/merit-list";
import { ResultLookup } from "@/components/result-lookup";
import { PageIntro, Shell } from "@/components/shell";
import { getSite } from "@/lib/api";
import { getLang } from "@/lib/locale";

export default async function Page() {
  const [site, lang] = await Promise.all([getSite(), getLang()]);
  if (!site) return <p className="p-8">The school site could not be loaded.</p>;
  return (
    <Shell site={site} lang={lang}>
      <PageIntro
        kicker="Academic"
        title={lang === "bn" ? "ফলাফল ও মার্কশিট" : "Results and marksheet"}
        summary={lang === "bn" ? "প্রকাশিত পরীক্ষার ফল দেখতে শিক্ষার্থী আইডি দিন। মিল না হলে একই বার্তা। মার্কশিট এই পাতা থেকে।" : "Enter the student ID for a published result. A miss uses one message. The marksheet is printed from this page."}
        image={site.config.heroImageUrl}
        alt={site.school.name}
      />
      <div className="step-row step-pair">
        {(lang === "bn"
          ? [
              ["০১", "শিক্ষার্থী আইডি", "প্রকাশিত পরীক্ষার জন্য আইডি দিন। আইডি না মিললে একই বার্তা।"],
              ["০২", "মার্কশিট", "মিললে নম্বর ও এই পাতা থেকে মার্কশিট। অপ্রকাশিত ফল ও বন্ধ মেধাতালিকা আসে না।"],
            ]
          : [
              ["01", "Student ID", "Enter the ID for a published exam. A miss uses one message."],
              ["02", "Marksheet", "A match shows the marks and a marksheet from this page. Unpublished results and a closed merit list do not appear."],
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
      <ResultLookup lang={lang} enabled={site.config.resultLookupEnabled} school={site.school} />
      {site.config.meritListEnabled ? <MeritList lang={lang} /> : null}
    </Shell>
  );
}
