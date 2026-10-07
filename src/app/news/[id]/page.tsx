import { notFound } from "next/navigation";
import { PageIntro, Shell } from "@/components/shell";
import { getPost, getSite } from "@/lib/api";
import { getLang } from "@/lib/locale";
import { resolvePhoto } from "@/lib/media";
import { formatDay, pick } from "@/lib/text";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [site, lang, post] = await Promise.all([getSite(), getLang(), getPost(id)]);
  if (!site) return <p className="p-8">The school site could not be loaded.</p>;
  if (!post) notFound();
  return (
    <Shell site={site} lang={lang}>
      <PageIntro
        kicker={formatDay(lang, post.eventDate) || post.kind}
        title={pick(lang, post.titleBn, post.titleEn)}
        image={resolvePhoto(post.coverUrl || site.config.heroImageUrl)}
        alt={post.coverAlt}
      />
      <article className="mx-auto max-w-3xl whitespace-pre-wrap px-4 py-12 text-lg leading-8">{pick(lang, post.bodyBn, post.bodyEn)}</article>
    </Shell>
  );
}
