import { notFound } from "next/navigation";
import { PeopleDirectory, deskCopy, filterPeople } from "@/components/people-board";
import { getSite } from "@/lib/api";
import { getLang } from "@/lib/locale";
import { pick } from "@/lib/text";

const BOARDS: Record<string, { bn: string; en: string; noteBn: string; noteEn: string; dutiesBn: string[]; dutiesEn: string[]; visitBn: string[]; visitEn: string[] }> = {
  governing: {
    bn: "পরিচালনা পর্ষদ",
    en: "Governing body",
    noteBn: "পরিচালনা পর্ষদ বড় সিদ্ধান্ত সভায় নেয়। সভার তারিখ নোটিশে। সদস্যদের নাম এই পাতায়। ব্যক্তিগত ফোন ও ঠিকানা নেই।",
    noteEn: "The governing body takes major decisions in a meeting. The date is a notice. Member names are on this page. Personal phones and addresses are not.",
    dutiesBn: ["বড় সিদ্ধান্ত সভায়", "সভার তারিখ নোটিশে", "সদস্যদের নাম এখানে"],
    dutiesEn: ["Major decisions in a meeting", "The date is a notice", "Member names are listed here"],
    visitBn: ["সভার তারিখ নোটিশে", "অফিস সময়ে যোগাযোগ", "সিদ্ধান্ত নোটিশে"],
    visitEn: ["The meeting date is a notice", "Contact during office hours", "The decision is a notice"],
  },
  council: {
    bn: "একাডেমিক কাউন্সিল",
    en: "Academic council",
    noteBn: "একাডেমিক কাউন্সিল পাঠ্যক্রম ও পরীক্ষার নীতি দেখে। প্রকাশিত ফলের তারিখ নোটিশে চূড়ান্ত। সিলেবাস এই সাইটে।",
    noteEn: "The academic council watches the curriculum and exam policy. A published result is dated by notice. The syllabus is on this site.",
    dutiesBn: ["পাঠ্যক্রম", "পরীক্ষার নীতি", "প্রকাশিত ফলের তারিখ নোটিশে"],
    dutiesEn: ["Curriculum", "Exam policy", "A published result is dated by notice"],
    visitBn: ["সভার আগে নোটিশ", "সিলেবাস এই সাইটে", "ফল প্রকাশের পর"],
    visitEn: ["A notice before the meeting", "The syllabus is on this site", "After the result is published"],
  },
  syndicate: {
    bn: "সিন্ডিকেট",
    en: "Syndicate",
    noteBn: "সিন্ডিকেট একাডেমিক নীতি ও বাজেট আলোচনা করে। ফির অঙ্ক অফিস ঘোষণা করে। এই পাতায় কোনো সংখ্যা নেই।",
    noteEn: "The syndicate discusses academic policy and the budget. The office announces fee amounts. This page has no figures.",
    dutiesBn: ["একাডেমিক নীতি", "বাজেট আলোচনা", "ফির অঙ্ক অফিস ঘোষণা করে"],
    dutiesEn: ["Academic policy", "Budget discussion", "The office announces fee amounts"],
    visitBn: ["সভার তারিখ নোটিশে", "ফির অঙ্ক অফিসে", "নীতি নোটিশে"],
    visitEn: ["The meeting date is a notice", "Fee amounts are at the office", "Policy is a notice"],
  },
  pta: {
    bn: "অভিভাবক কমিটি",
    en: "Parent committee",
    noteBn: "অভিভাবক কমিটি সভার তারিখ ও আলোচ্য বিষয় জানায়। ব্যক্তিগত ফোন ও বাড়ির ঠিকানা এই তালিকায় নেই।",
    noteEn: "The parent committee publishes the meeting date and the agenda. Personal phones and home addresses are not on this list.",
    dutiesBn: ["অভিভাবক সভার তারিখ", "আলোচ্য বিষয়", "ব্যক্তিগত ফোন এই তালিকায় নেই"],
    dutiesEn: ["Parent meeting dates", "The agenda", "Personal phones are not listed"],
    visitBn: ["সভার তারিখ নোটিশে", "অফিস সময়ে নাম লেখান", "আলোচ্য বিষয় আগে"],
    visitEn: ["The meeting date is a notice", "Give a name during office hours", "Read the agenda first"],
  },
};

export default async function Page({ params }: { params: Promise<{ board: string }> }) {
  const { board } = await params;
  const label = BOARDS[board];
  if (!label) notFound();
  const [site, lang] = await Promise.all([getSite(), getLang()]);
  if (!site) return <p className="p-8">The school site could not be loaded.</p>;
  const menu = site.config.menus.find((item) => item.key === "authorities");
  const child = menu?.children.find((item) => item.key === board);
  const copy = deskCopy(site, board, lang, {
    note: lang === "bn" ? label.noteBn : label.noteEn,
    duties: lang === "bn" ? label.dutiesBn : label.dutiesEn,
    visit: lang === "bn" ? label.visitBn : label.visitEn,
  });
  return (
    <PeopleDirectory
      title={pick(lang, child?.labelBn, child?.labelEn) || (lang === "bn" ? label.bn : label.en)}
      summary={lang === "bn" ? "এই কমিটি কী করে, কখন সভা হয়, এবং কারা আছেন।" : "What this body does, when it meets, and who sits on it."}
      note={copy.note}
      duties={copy.duties}
      visit={copy.visit}
      people={filterPeople(site, [board])}
    />
  );
}
