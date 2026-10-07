import { notFound } from "next/navigation";
import { Blocks } from "@/components/blocks";
import { PageIntro, Shell } from "@/components/shell";
import { getPage, getSite } from "@/lib/api";
import { getLang } from "@/lib/locale";
import { pick } from "@/lib/text";

const BLURB: Record<string, { bn: string; en: string }> = {
  gallery: { bn: "ক্যাম্পাস, সংস্কৃতি ও খেলার অ্যালবাম।", en: "Albums of the campus, culture, and sports." },
  apply: { bn: "সব ঘর এক পাতায়। ফি অফিসে।", en: "Every field on one page. The fee is paid at the office." },
  classes: { bn: "স্তর অনুযায়ী শ্রেণি ও বিষয়।", en: "Classes and subjects by stage." },
  teachers: { bn: "নাম, পদবি ও ছবি।", en: "Name, role, and photo." },
  routine: { bn: "ক্লাস ও শাখা বেছে সাপ্তাহিক রুটিন।", en: "Pick a class and section for the weekly routine." },
  syllabus: { bn: "সিলেবাস, ক্যালেন্ডার ও প্রসপেক্টাস।", en: "Syllabus, calendar, and prospectus files." },
  results: { bn: "শিক্ষার্থী আইডি দিয়ে প্রকাশিত ফল।", en: "A published result with a student ID." },
};

export async function ContentPage({ slug, kicker }: { slug: string; kicker: string }) {
  const [site, lang, page] = await Promise.all([getSite(), getLang(), getPage(slug)]);
  if (!site) return <p className="p-8">The school site could not be loaded.</p>;
  if (!page) notFound();
  const blocks = page.blocks ?? [];
  const banner = blocks.find((block) => block.type === "image" && block.imageUrl);
  const body = banner ? blocks.filter((block) => block !== banner) : blocks;
  return (
    <Shell site={site} lang={lang}>
      <PageIntro
        kicker={kicker}
        title={pick(lang, page.titleBn, page.titleEn)}
        summary={pick(lang, page.summaryBn, page.summaryEn)}
        image={banner?.imageUrl || site.config.heroImageUrl}
        alt={banner?.alt}
      />
      <div className="fact-row">
        {site.school.eiin ? <p><span>EIIN</span>{site.school.eiin}</p> : null}
        {site.school.academicYear ? <p><span>{lang === "bn" ? "শিক্ষাবর্ষ" : "Year"}</span>{site.school.academicYear}</p> : null}
        {site.config.officeHours ? <p><span>{lang === "bn" ? "অফিস সময়" : "Hours"}</span>{site.config.officeHours}</p> : null}
        {site.school.address ? <p><span>{lang === "bn" ? "ঠিকানা" : "Address"}</span>{site.school.address}</p> : null}
      </div>
      <Blocks blocks={body} lang={lang} />
    </Shell>
  );
}

export async function HubPage({ menuKey }: { menuKey: string }) {
  const [site, lang] = await Promise.all([getSite(), getLang()]);
  if (!site) return <p className="p-8">The school site could not be loaded.</p>;
  const menu = site.config.menus.find((item) => item.key === menuKey);
  const pages = site.pages.filter((page) => page.menuKey === menuKey);
  const children = (menu?.children ?? []).filter((child) => child.visible !== false);
  return (
    <Shell site={site} lang={lang}>
      <PageIntro
        kicker={site.school.name}
        title={pick(lang, menu?.labelBn, menu?.labelEn) || menuKey}
        image={site.albums[0]?.coverUrl || site.config.heroImageUrl}
        alt={site.school.name}
      />
      <div className="hub-grid">
        {children.map((child, index) => {
          const page = pages.find((item) => child.href === `/${item.menuKey}/${item.slug}` || child.href === `/${item.slug}`);
          const blurb = page ? pick(lang, page.summaryBn, page.summaryEn) : pick(lang, BLURB[child.key]?.bn, BLURB[child.key]?.en);
          return (
            <a key={child.key} className="hub-card" href={child.href}>
              <strong>{String(index + 1).padStart(2, "0")}</strong>
              <span>
                <span className="block text-base font-semibold text-brand">{pick(lang, child.labelBn, child.labelEn)}</span>
                {blurb ? <span className="mt-1 block text-sm text-muted">{blurb}</span> : null}
              </span>
            </a>
          );
        })}
      </div>
    </Shell>
  );
}
