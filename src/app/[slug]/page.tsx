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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const [page, lang] = await Promise.all([getPage(slug), getLang()]);
  return {
    title: pick(lang, page?.titleBn, page?.titleEn) || slug,
    description: pick(lang, page?.seoDescriptionBn, page?.seoDescriptionEn),
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page) notFound();
  const kicker = KICKER[page.menuKey] || "School";
  return <ContentPage slug={slug} kicker={kicker} />;
}
