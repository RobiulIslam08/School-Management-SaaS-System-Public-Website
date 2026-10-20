import type { Metadata } from "next";
import { ContentPage } from "@/components/content-page";
import { getPage, getSite } from "@/lib/api";
import { getLang } from "@/lib/locale";
import { pick } from "@/lib/text";

/** Dedicated App Router pages under /about/* that must not fall through to CMS ContentPage. */
const DEDICATED = new Set(["honorable"]);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (slug === "honorable") {
    const [site, lang] = await Promise.all([getSite(), getLang()]);
    const title =
      lang === "bn"
        ? "সাবেক অধ্যক্ষ, সভাপতি ও দাতা সদস্যবৃন্দ"
        : "Former Leadership & Distinguished Donors";
    return { title, description: site?.school.name ?? title };
  }
  const [page, lang] = await Promise.all([getPage(slug), getLang()]);
  return {
    title: pick(lang, page?.titleBn, page?.titleEn) || slug,
    description: pick(lang, page?.seoDescriptionBn, page?.seoDescriptionEn),
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (DEDICATED.has(slug)) {
    const { default: HonorablePage } = await import("../honorable/page");
    return <HonorablePage />;
  }
  return <ContentPage slug={slug} kicker="About" />;
}
