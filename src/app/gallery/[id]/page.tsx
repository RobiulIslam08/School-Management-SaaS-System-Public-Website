import { notFound } from "next/navigation";
import { PageIntro, Shell } from "@/components/shell";
import { getSite } from "@/lib/api";
import { getLang } from "@/lib/locale";
import { resolvePhoto } from "@/lib/media";
import { pick } from "@/lib/text";

interface AlbumPayload {
  album: { titleBn?: string; titleEn?: string; kind?: string; coverUrl?: string };
  media: Array<{ _id: string; kind: string; url?: string; videoUrl?: string; alt?: string; captionBn?: string; captionEn?: string }>;
}

async function album(id: string): Promise<AlbumPayload | null> {
  const origin = (process.env.API_PROXY_URL ?? "http://localhost:4000").replace(/\/$/, "");
  try {
    const response = await fetch(`${origin}/api/v1/public/website/albums/${id}`, { next: { revalidate: 60 } });
    if (!response.ok) return null;
    const json = (await response.json()) as { data?: AlbumPayload };
    return json.data ?? null;
  } catch {
    return null;
  }
}

function youtube(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === "youtu.be") return `https://www.youtube-nocookie.com/embed/${parsed.pathname.slice(1)}`;
    if (parsed.hostname.endsWith("youtube.com")) {
      const id = parsed.searchParams.get("v");
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }
  } catch {
    return null;
  }
  return null;
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [site, lang, data] = await Promise.all([getSite(), getLang(), album(id)]);
  if (!site) return <p className="p-8">The school site could not be loaded.</p>;
  if (!data) notFound();
  const cover = data.media.find((item) => item.kind === "image" && item.url)?.url;
  return (
    <Shell site={site} lang={lang}>
      <PageIntro kicker={data.album.kind === "cultural" ? (lang === "bn" ? "সাংস্কৃতিক" : "Cultural") : data.album.kind === "sports" ? (lang === "bn" ? "খেলা" : "Sports") : data.album.kind === "campus" ? (lang === "bn" ? "ক্যাম্পাস" : "Campus") : (data.album.kind || "Gallery")} title={pick(lang, data.album.titleBn, data.album.titleEn)} image={cover || site.config.heroImageUrl} alt={site.school.name} />
      <section className="mx-auto max-w-7xl px-4 pt-8">
        <h2 className="text-2xl font-semibold">{lang === "bn" ? "ছবি" : "Photos"}</h2>
      </section>
      <div className="masonry mx-auto max-w-7xl px-4 py-4">
        {data.media.filter((item) => item.kind !== "video").map((item) => {
          if (!item.url) return null;
          return (
            <figure key={item._id}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={resolvePhoto(item.url)} alt={item.alt || ""} className="w-full rounded-[1.25rem] object-cover" />
              <figcaption className="mt-2 text-sm text-muted">{pick(lang, item.captionBn, item.captionEn)}</figcaption>
            </figure>
          );
        })}
      </div>
      {data.media.some((item) => item.kind === "video") ? (
        <>
          <section className="mx-auto max-w-7xl px-4 pt-2">
            <h2 className="text-2xl font-semibold">{lang === "bn" ? "ভিডিও" : "Video"}</h2>
          </section>
          <div className="mx-auto grid max-w-7xl gap-4 px-4 py-4 md:grid-cols-2">
            {data.media.filter((item) => item.kind === "video" && item.videoUrl).map((item) => {
              const src = youtube(item.videoUrl || "");
              return (
                <figure key={item._id} className="sheet overflow-hidden">
                  {src ? (
                    <iframe className="aspect-video w-full" src={src} title={item.alt || "Video"} allow="encrypted-media; picture-in-picture" allowFullScreen />
                  ) : (
                    <a className="block p-5 font-semibold" href={item.videoUrl}>{pick(lang, item.captionBn, item.captionEn) || "Video"}</a>
                  )}
                  <figcaption className="px-4 py-3 text-sm text-muted">{pick(lang, item.captionBn, item.captionEn)}</figcaption>
                </figure>
              );
            })}
          </div>
        </>
      ) : null}
    </Shell>
  );
}
