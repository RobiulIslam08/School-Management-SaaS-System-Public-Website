import { PeopleDirectory, filterPeople } from "@/components/people-board";
import { getSite } from "@/lib/api";
import { getLang } from "@/lib/locale";

const LINKS = [
  { href: "/authorities/governing", bn: "পরিচালনা পর্ষদ", en: "Governing body" },
  { href: "/authorities/council", bn: "একাডেমিক কাউন্সিল", en: "Academic council" },
  { href: "/authorities/syndicate", bn: "সিন্ডিকেট", en: "Syndicate" },
  { href: "/authorities/pta", bn: "অভিভাবক কমিটি", en: "Parent committee" },
];

export default async function Page() {
  const [site, lang] = await Promise.all([getSite(), getLang()]);
  if (!site) return <p className="p-8">The school site could not be loaded.</p>;
  return (
    <PeopleDirectory
      title={lang === "bn" ? "কর্তৃপক্ষ" : "Authorities"}
      summary={lang === "bn" ? "পর্ষদ, কাউন্সিল, সিন্ডিকেট ও অভিভাবক কমিটি।" : "The governing body, council, syndicate, and parent committee."}
      links={LINKS.map((item) => ({ href: item.href, label: lang === "bn" ? item.bn : item.en }))}
      people={filterPeople(site, ["governing", "council", "syndicate", "pta"])}
    />
  );
}
