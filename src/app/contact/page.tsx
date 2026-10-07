import { ContactForm } from "@/components/contact-form";
import { PageIntro, Shell } from "@/components/shell";
import { getSite } from "@/lib/api";
import { getLang } from "@/lib/locale";

export default async function Page() {
  const [site, lang] = await Promise.all([getSite(), getLang()]);
  if (!site) return <p className="p-8">The school site could not be loaded.</p>;
  const map = site.config.mapEmbedUrl.startsWith("https://") ? site.config.mapEmbedUrl : "";
  return (
    <Shell site={site} lang={lang}>
      <PageIntro kicker={site.school.name} title={lang === "bn" ? "যোগাযোগ" : "Contact"} summary={lang === "bn" ? `${site.school.address || "অফিস"}। ফোন, ইমেইল ও ম্যাপ। বার্তা অফিস সময়ে পড়া হয়।` : `${site.school.address || "The office"}. Phone, email, and map. Messages are read during office hours.`} image={site.config.heroImageUrl} alt={site.school.name} />
      <p className="mx-auto max-w-3xl px-4 pt-4 text-sm leading-6 text-muted">
        {lang === "bn"
          ? "ভর্তি, রুটিন বা নোটিশ নিয়ে প্রশ্ন এখানে লিখুন। ফি জমা ও রসিদ অফিসে। এই ফর্ম টাকা নেয় না, এবং শিক্ষার্থীর ব্যক্তিগত কাগজ চাইবে না।"
          : "Write here about admission, the routine, or a notice. Fees and receipts stay at the office. This form does not take payment, and it does not ask for a student's private papers."}
      </p>
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="sheet space-y-4 p-6">
          {site.config.phone ? (
            <p>
              <span className="block text-xs uppercase tracking-[0.16em] text-accent">{lang === "bn" ? "ফোন" : "Phone"}</span>
              <a className="display text-xl font-semibold md:text-2xl" href={`tel:${site.config.phone}`}>{site.config.phone}</a>
            </p>
          ) : null}
          {site.config.email ? (
            <p>
              <span className="block text-xs uppercase tracking-[0.16em] text-accent">Email</span>
              <a className="text-lg" href={`mailto:${site.config.email}`}>{site.config.email}</a>
            </p>
          ) : null}
          {site.config.officeHours ? (
            <p>
              <span className="block text-xs uppercase tracking-[0.16em] text-accent">{lang === "bn" ? "সময়" : "Hours"}</span>
              <span className="text-lg">{site.config.officeHours}</span>
            </p>
          ) : null}
          <p className="text-sm text-muted">{site.school.address}</p>
          <ContactForm lang={lang} />
        </div>
        {map ? <iframe title="Map" className="h-64 w-full rounded-2xl border border-line md:h-80" src={map} loading="lazy" /> : null}
      </div>
    </Shell>
  );
}
