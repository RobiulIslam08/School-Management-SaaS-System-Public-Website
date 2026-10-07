import Link from "next/link";
import { PageIntro, Shell } from "@/components/shell";
import { getSite } from "@/lib/api";
import { getLang } from "@/lib/locale";
import { resolvePhoto } from "@/lib/media";
import { formatDay, pick } from "@/lib/text";

export default async function Page() {
  const [site, lang] = await Promise.all([getSite(), getLang()]);
  if (!site) return <p className="p-8">The school site could not be loaded.</p>;
  const [lead, ...rest] = site.posts;
  return (
    <Shell site={site} lang={lang}>
      <PageIntro kicker={site.school.name} title={lang === "bn" ? "খবর ও অনুষ্ঠান" : "News and events"} image={resolvePhoto(lead?.coverUrl || site.config.heroImageUrl)} alt={lead?.coverAlt} />
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-[1.3fr_0.7fr]">
        {lead ? (
          <Link href={`/news/${lead._id}`} className="feature-card">
            {lead.coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={resolvePhoto(lead.coverUrl)} alt={lead.coverAlt || ""} className="aspect-[16/10]" />
            ) : null}
            <div className="p-6">
              <p className="text-xs uppercase tracking-[0.16em] text-accent">{lead.kind}</p>
              <p className="display mt-1 text-xl font-semibold md:text-2xl">{pick(lang, lead.titleBn, lead.titleEn)}</p>
            </div>
          </Link>
        ) : <p className="text-sm text-muted">{lang === "bn" ? "এখনো খবর প্রকাশিত হয়নি।" : "No stories published yet."}</p>}
        <ul>
          {rest.map((post, index) => (
            <li key={post._id} className="index-row">
              <strong>{String(index + 2).padStart(2, "0")}</strong>
              <Link href={`/news/${post._id}`}>
                <p className="font-semibold">{pick(lang, post.titleBn, post.titleEn)}</p>
                <p className="text-xs text-muted">{formatDay(lang, post.eventDate) || post.kind}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Shell>
  );
}
