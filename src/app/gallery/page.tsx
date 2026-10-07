import Link from "next/link";
import { PageIntro, Shell } from "@/components/shell";
import { getSite } from "@/lib/api";
import { getLang } from "@/lib/locale";
import { resolvePhoto } from "@/lib/media";
import { pick } from "@/lib/text";

const KIND: Record<string, { bn: string; en: string }> = {
  campus: { bn: "ক্যাম্পাস", en: "Campus" },
  cultural: { bn: "সাংস্কৃতিক", en: "Cultural" },
  sports: { bn: "খেলা", en: "Sports" },
  other: { bn: "অন্যান্য", en: "Other" },
};

export default async function Page() {
  const [site, lang] = await Promise.all([getSite(), getLang()]);
  if (!site) return <p className="p-8">The school site could not be loaded.</p>;
  return (
    <Shell site={site} lang={lang}>
      <PageIntro
        kicker={site.school.name}
        title={lang === "bn" ? "গ্যালারি" : "Gallery"}
        summary={lang === "bn" ? "ক্যাম্পাস, সাংস্কৃতিক অনুষ্ঠান ও খেলার ছবি আলাদা। ভিডিও নিচে, অ্যালবাম অনুযায়ী।" : "Campus, cultural, and sports photos are separate. Videos sit below, grouped by album."}
        image={site.albums[0]?.coverUrl || site.config.heroImageUrl}
        alt={site.school.name}
      />
      <section className="mx-auto max-w-7xl px-4 pt-8">
        <h2 className="text-2xl font-semibold">{lang === "bn" ? "ছবি" : "Photos"}</h2>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-muted">{lang === "bn" ? "অ্যালবাম খুললে ছবি ও সেই অ্যালবামের ভিডিও। ক্যাম্পাসে যা নেই তা এখানে রাখা হয় না। নতুন ছবি ড্যাশবোর্ডের ওয়েবসাইট ট্যাব থেকে যোগ হয়।" : "An album opens onto its photos and its own videos. What the campus does not have is not kept here. New photos are added from the website tab on the dashboard."}</p>
      </section>
      <div className="masonry mx-auto max-w-7xl px-4 py-4">
        {site.albums.length ? site.albums.map((album) => (
          <Link key={album._id} className="feature-card block" href={`/gallery/${album._id}`}>
            {album.coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={resolvePhoto(album.coverUrl)} alt={pick(lang, album.titleBn, album.titleEn)} className="aspect-[4/3]" />
            ) : null}
            <div className="p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-accent">{(lang === "bn" ? KIND[album.kind ?? ""]?.bn : KIND[album.kind ?? ""]?.en) || album.kind}</p>
              <p className="mt-1 text-lg font-semibold">{pick(lang, album.titleBn, album.titleEn)}</p>
              <p className="text-xs text-muted">
                {lang === "bn"
                  ? `${album.imageCount ?? 0}টি ছবি · ${album.videoCount ?? 0}টি ভিডিও`
                  : `${album.imageCount ?? 0} photos · ${album.videoCount ?? 0} videos`}
              </p>
            </div>
          </Link>
        )) : <p className="text-sm text-muted">{lang === "bn" ? "অ্যালবাম প্রকাশ হলে এখানে দেখা যাবে।" : "Albums will appear here once published."}</p>}
      </div>
      <section className="mx-auto max-w-7xl px-4 pt-4">
        <h2 className="text-2xl font-semibold">{lang === "bn" ? "ভিডিও" : "Video"}</h2>
        <p className="mt-1 text-sm text-muted">{lang === "bn" ? "ইউটিউব বা ফেসবুকের ক্লিপ। ছবির অ্যালবামের সঙ্গে মেশানো নয়।" : "YouTube or Facebook clips, kept apart from the photo albums."}</p>
      </section>
      <div className="mx-auto grid max-w-7xl gap-3 px-4 py-4 sm:grid-cols-2 lg:grid-cols-3">
        {(site.videos ?? []).length ? (site.videos ?? []).map((item) => (
          <Link key={item._id} href={`/gallery/${item.albumId}`} className="sheet block overflow-hidden">
            <div className="flex aspect-video items-end bg-brand p-4 text-on-brand">
              <span className="text-sm">{lang === "bn" ? "ভিডিও চালান" : "Play video"}</span>
            </div>
            <div className="p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-accent">{pick(lang, item.albumTitleBn, item.albumTitleEn)}</p>
              <p className="mt-1 font-semibold">{pick(lang, item.captionBn, item.captionEn) || item.alt}</p>
            </div>
          </Link>
        )) : <p className="text-sm text-muted">{lang === "bn" ? "ভিডিও প্রকাশ হলে এখানে দেখা যাবে।" : "Videos will appear here once published."}</p>}
      </div>
    </Shell>
  );
}
