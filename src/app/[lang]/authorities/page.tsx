import { PeopleDirectory, filterPeople } from "@/components/people-board";
import { getSite } from "@/lib/api";
import { getLang, type LangProps } from "@/lib/locale";

const LINKS = [
  { href: "/authorities/committee", bn: "স্কুল কমিটি", en: "School committee" },
  { href: "/authorities/governing", bn: "পরিচালনা পর্ষদ", en: "Governing body" },
  { href: "/authorities/council", bn: "একাডেমিক কাউন্সিল", en: "Academic council" },
  { href: "/authorities/pta", bn: "অভিভাবক কমিটি", en: "Parent committee" },
  { href: "/about/honorable", bn: "সাবেক অধ্যক্ষ, সভাপতি ও দাতা", en: "Former Leaders & Donors" },
];

export default async function Page({ params }: LangProps) {
  const [site, lang] = await Promise.all([getSite(), getLang(params)]);
  if (!site) return <p className="p-8">The school site could not be loaded.</p>;
  return (
    <PeopleDirectory
      lang={lang}
      title={lang === "bn" ? "কর্তৃপক্ষ" : "Authorities"}
      summary={lang === "bn" ? "স্কুল কমিটি, পরিচালনা পর্ষদ, কাউন্সিল ও অভিভাবক কমিটি।" : "The school committee, governing body, council, and parent committee."}
      links={LINKS.map((item) => ({ href: item.href, label: lang === "bn" ? item.bn : item.en }))}
      people={filterPeople(site, ["committee", "governing", "council", "pta"])}
    />
  );
}
