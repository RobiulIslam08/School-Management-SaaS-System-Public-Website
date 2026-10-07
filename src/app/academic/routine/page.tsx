import { PageIntro, Shell } from "@/components/shell";
import { RoutineBoard } from "@/components/routine-board";
import { getSite } from "@/lib/api";
import { getLang } from "@/lib/locale";

export default async function Page() {
  const [site, lang] = await Promise.all([getSite(), getLang()]);
  if (!site) return <p className="p-8">The school site could not be loaded.</p>;
  const files = site.files.filter((item) => item.kind === "routine");
  return (
    <Shell site={site} lang={lang}>
      <PageIntro kicker="Academic" title={lang === "bn" ? "ক্লাস রুটিন" : "Class routine"} summary={lang === "bn" ? "রবি থেকে বৃহস্পতি, ছয় পিরিয়ড। ক্লাস ও শাখা বদলালে সাপ্তাহিক ছক দেখায়। পিডিএফ থাকলে নিচে।" : "Sunday to Thursday, six periods. Changing the class and section shows the weekly grid. A PDF, when published, sits below."} image={site.config.heroImageUrl} alt={site.school.name} />
      <div className="step-row">
        {(lang === "bn"
          ? [
              ["০১", "ক্লাস বেছে নিন", "শ্রেণি তালিকা থেকে ক্লাস নিন। শাখা থাকলে সেটাও বেছে নিন।"],
              ["০২", "ছক পড়ুন", "রবি থেকে বৃহস্পতি, ছয় পিরিয়ড। ঘরে বিষয় ও শিক্ষকের নাম। খালি ঘরে সেই সময়ে পাঠ নেই।"],
              ["০৩", "বদল নোটিশে", "ছুটি বা বিশেষ ক্লাস আগে নোটিশে। পিডিএফ থাকলে ছকের নিচে।"],
            ]
          : [
              ["01", "Choose a class", "Pick a class from the list, and a section when there is one."],
              ["02", "Read the grid", "Sunday to Thursday, six periods. A cell shows the subject and the teacher. An empty cell means no lesson."],
              ["03", "Changes by notice", "A holiday or a special class is a notice first. A PDF, when published, sits under the grid."],
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
      <RoutineBoard classes={site.classes} lang={lang} />
      {files.length ? (
        <ul className="mx-auto max-w-3xl px-4 pb-16">
          {files.map((file, index) => (
            <li key={file._id} className="index-row">
              <strong>{String(index + 1).padStart(2, "0")}</strong>
              <a className="font-semibold text-brand" href={`/api/v1/public/website/files/${file._id}`}>
                {file.titleBn || file.titleEn || file.filename}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </Shell>
  );
}
