import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentPage } from "@/components/content-page";
import { getPage } from "@/lib/api";
import { getLang } from "@/lib/locale";
import { pick } from "@/lib/text";

const KICKER: Record<string, string> = {
  about: "About",
  academic: "Academic",
  admission: "Admission",
  students: "Students",
};

/** Rendered on first visit, then served from the ISR cache. */
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const [page, lang] = await Promise.all([getPage(slug), getLang(params)]);
  return {
    title: pick(lang, page?.titleBn, page?.titleEn) || slug,
    description: pick(lang, page?.seoDescriptionBn, page?.seoDescriptionEn),
  };
}

export default async function Page({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page) notFound();
  const kicker = KICKER[page.menuKey] || "School";
  return <ContentPage lang={await getLang(params)} slug={slug} kicker={kicker} />;
}
