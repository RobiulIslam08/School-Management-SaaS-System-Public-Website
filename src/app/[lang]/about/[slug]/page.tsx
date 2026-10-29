import type { Metadata } from "next";
import { ContentPage } from "@/components/content-page";
import { getPage, getSite } from "@/lib/api";
import { getLang } from "@/lib/locale";
import { pick } from "@/lib/text";

/** Dedicated App Router pages under /about/* that must not fall through to CMS ContentPage. */
const DEDICATED = new Set(["honorable"]);

/** Rendered on first visit, then served from the ISR cache. */
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (slug === "honorable") {
    const [site, lang] = await Promise.all([getSite(), getLang(params)]);
    const title =
      lang === "bn"
        ? "সাবেক অধ্যক্ষ, সভাপতি ও দাতা সদস্যবৃন্দ"
        : "Former Leadership & Distinguished Donors";
    return { title, description: site?.school.name ?? title };
  }
  const [page, lang] = await Promise.all([getPage(slug), getLang(params)]);
  return {
    title: pick(lang, page?.titleBn, page?.titleEn) || slug,
    description: pick(lang, page?.seoDescriptionBn, page?.seoDescriptionEn),
  };
}

export default async function Page({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { slug } = await params;
  if (DEDICATED.has(slug)) {
    const { default: HonorablePage } = await import("../honorable/page");
    return <HonorablePage params={params} />;
  }
  return <ContentPage lang={await getLang(params)} slug={slug} kicker="About" />;
}
