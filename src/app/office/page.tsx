import { PeopleDirectory, filterPeople } from "@/components/people-board";
import { getSite } from "@/lib/api";
import { getLang } from "@/lib/locale";

const LINKS = [
  { href: "/office/principal", bn: "অধ্যক্ষ", en: "Principal" },
  { href: "/office/vice", bn: "সহকারী প্রধান শিক্ষক", en: "Vice principal" },
  { href: "/office/admission", bn: "ভর্তি শাখা", en: "Admission" },
  { href: "/office/accounts", bn: "হিসাব শাখা", en: "Accounts" },
  { href: "/office/librarian", bn: "গ্রন্থাগারিক", en: "Librarian" },
  { href: "/office/exam", bn: "পরীক্ষা নিয়ন্ত্রক", en: "Exam" },
  { href: "/office/clerk", bn: "অফিস সহকারী", en: "Office" },
];
const BOARDS = LINKS.map((item) => item.href.split("/").pop() || "");

export default async function Page() {
  const [site, lang] = await Promise.all([getSite(), getLang()]);
  if (!site) return <p className="p-8">The school site could not be loaded.</p>;
  return (
    <PeopleDirectory
      title={lang === "bn" ? "অফিস" : "Office"}
      summary={lang === "bn" ? "প্রতিটি ডেস্কের কাজ, অফিস সময় ও দায়িত্বপ্রাপ্ত ব্যক্তি।" : "What each desk does, the office hours, and the person in charge."}
      links={LINKS.map((item) => ({ href: item.href, label: lang === "bn" ? item.bn : item.en }))}
      people={filterPeople(site, BOARDS)}
    />
  );
}
