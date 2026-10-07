import { notFound } from "next/navigation";
import { PeopleDirectory, deskCopy, filterPeople } from "@/components/people-board";
import { getSite } from "@/lib/api";
import { getLang } from "@/lib/locale";
import { pick } from "@/lib/text";

const ROLES: Record<string, { bn: string; en: string; noteBn: string; noteEn: string; dutiesBn: string[]; dutiesEn: string[]; visitBn: string[]; visitEn: string[] }> = {
  principal: {
    bn: "অধ্যক্ষ",
    en: "Principal",
    noteBn: "অধ্যক্ষের ডেস্ক ক্লাস চলাকালীন খোলা থাকে। শৃঙ্খলা, দৈনন্দিন শিক্ষা ও অভিভাবকের প্রশ্ন এখানে। ব্যক্তিগত বিষয় প্রকাশিত হয় না।",
    noteEn: "The principal's desk stays open during class. Discipline, daily teaching, and family questions come here. Private matters are not published.",
    dutiesBn: ["ক্লাস চলাকালীন অফিসে থাকেন", "অভিভাবকের প্রশ্ন অফিস সময়ে", "শৃঙ্খলা ও দৈনন্দিন শিক্ষা"],
    dutiesEn: ["In the office during class", "Family questions in office hours", "Discipline and daily teaching"],
    visitBn: ["অফিস সময়ে", "আগে ফোন করলে সাক্ষাৎ সহজ", "জরুরি খবর নোটিশে"],
    visitEn: ["During office hours", "A call ahead makes a meeting easier", "Urgent news is a notice"],
  },
  vice: {
    bn: "সহকারী প্রধান শিক্ষক",
    en: "Vice principal",
    noteBn: "সহকারী প্রধান শিক্ষক রুটিন, উপস্থিতি ও শ্রেণি শিক্ষকদের সমন্বয় দেখেন। দেরির খাতা এই ডেস্কে।",
    noteEn: "The vice principal watches the routine, attendance, and class teachers. The late-arrival note stays at this desk.",
    dutiesBn: ["রুটিন ও উপস্থিতি", "শ্রেণি শিক্ষকদের সমন্বয়", "দেরির খাতা"],
    dutiesEn: ["Routine and attendance", "Coordinates class teachers", "The late-arrival note"],
    visitBn: ["সকালে, ক্লাস শুরুর আগে", "দেরির কারণ এখানে", "রুটিন বদল নোটিশে"],
    visitEn: ["In the morning, before class", "A reason for lateness is written here", "A routine change is a notice"],
  },
  admission: {
    bn: "ভর্তি শাখা",
    en: "Admission office",
    noteBn: "ভর্তি শাখা আবেদন যাচাই করে এবং কাগজ নেয়। অনলাইন ফর্ম জমা মানে অপেক্ষমাণ। অনুমোদনের পর ভর্তি। আসন সংখ্যা এই পাতায় নেই।",
    noteEn: "The admission desk checks applications and takes papers. Submitting the online form means pending. Admission starts after approval. Seat counts are not on this page.",
    dutiesBn: ["আবেদনপত্র যাচাই", "কাগজ অফিসে জমা", "সিট নোটিশের পর"],
    dutiesEn: ["Checks applications", "Papers handed in here", "A seat after the notice"],
    visitBn: ["ভর্তি নোটিশের তারিখে", "কাগজ সঙ্গে আনুন", "আসন সংখ্যা এখানে জিজ্ঞাসা"],
    visitEn: ["On the date in the admission notice", "Bring the papers", "Ask the seat count here"],
  },
  accounts: {
    bn: "হিসাব শাখা",
    en: "Accounts",
    noteBn: "হিসাব শাখা ফির রসিদ দেয়। মাধ্যম নগদ, বিকাশ, নগদ, রকেট, ব্যাংক বা চেক। অনলাইনে টাকা কাটা হয় না। অঙ্ক অফিস বলে।",
    noteEn: "Accounts issues the fee receipt. Payment is by cash, bKash, Nagad, Rocket, bank, or cheque. Nothing is charged online. The office states the amount.",
    dutiesBn: ["ফি রসিদ", "নগদ, বিকাশ, নগদ, রকেট, ব্যাংক বা চেক", "অনলাইনে কাটা হয় না"],
    dutiesEn: ["Fee receipts", "Cash, bKash, Nagad, Rocket, bank, or cheque", "Not charged online"],
    visitBn: ["অফিস সময়ে", "রসিদ নিয়ে যান", "হারানো রসিদের কথা এখানে"],
    visitEn: ["During office hours", "Take the receipt with you", "A lost receipt is raised here"],
  },
  librarian: {
    bn: "গ্রন্থাগারিক",
    en: "Librarian",
    noteBn: "গ্রন্থাগারিক বই ও কার্ড দেখেন। পড়ার আসর হলে তারিখ নোটিশে। নতুন বইয়ের তালিকাও নোটিশে।",
    noteEn: "The librarian keeps books and cards. A reading hour, when held, is dated in a notice. New titles are a notice too.",
    dutiesBn: ["বই ও কার্ড", "পড়ার আসর", "নতুন বইয়ের তালিকা নোটিশে"],
    dutiesEn: ["Books and cards", "Reading hour", "New books by notice"],
    visitBn: ["ক্লাসের বাইরে", "কার্ড সঙ্গে", "ফেরতের দিন কার্ডে"],
    visitEn: ["Outside class time", "Bring the card", "The return day is on the card"],
  },
  exam: {
    bn: "পরীক্ষা নিয়ন্ত্রক",
    en: "Exam controller",
    noteBn: "পরীক্ষা নিয়ন্ত্রক সময়সূচি, কক্ষ ও নম্বরপত্র দেখেন। প্রকাশিত ফল সাইটে। অপ্রকাশিত নম্বর এই ডেস্ক না বলা পর্যন্ত পাতায় আসে না।",
    noteEn: "The exam controller sets the timetable, rooms, and scripts. A published result is on the site. Unpublished marks stay off the page until this desk says otherwise.",
    dutiesBn: ["সময়সূচি ও কক্ষ নোটিশে", "নম্বরপত্র", "প্রকাশিত ফল"],
    dutiesEn: ["Timetable and room by notice", "Scripts", "Published results"],
    visitBn: ["রুটিন নোটিশের পর", "প্রকাশের তারিখ নোটিশে", "মার্কশিট ফল পাতায়"],
    visitEn: ["After the routine notice", "The publication date is a notice", "The marksheet is on the results page"],
  },
  clerk: {
    bn: "অফিস সহকারী",
    en: "Office assistant",
    noteBn: "অফিস সহকারী চিঠি, নোটিশের খসড়া ও কাগজ রাখেন। কপি অফিস সময়ে। দরজা খোলা থাকলে প্রথম জিজ্ঞাসা এখানে।",
    noteEn: "The office assistant keeps letters, notice drafts, and papers. Copies are given in office hours. When the door is open, the first question starts here.",
    dutiesBn: ["চিঠি ও নোটিশের খসড়া", "অফিসের কাগজ", "কপি অফিস সময়ে"],
    dutiesEn: ["Letters and notice drafts", "Office papers", "Copies during office hours"],
    visitBn: ["অফিস সময়ে", "কপির জন্য আইডি", "চিঠির জবাব এখানে"],
    visitEn: ["During office hours", "An ID for a copy", "A letter is answered here"],
  },
};

export default async function Page({ params }: { params: Promise<{ role: string }> }) {
  const { role } = await params;
  const label = ROLES[role];
  if (!label) notFound();
  const [site, lang] = await Promise.all([getSite(), getLang()]);
  if (!site) return <p className="p-8">The school site could not be loaded.</p>;
  const menu = site.config.menus.find((item) => item.key === "office");
  const child = menu?.children.find((item) => item.key === role);
  const copy = deskCopy(site, role, lang, {
    note: lang === "bn" ? label.noteBn : label.noteEn,
    duties: lang === "bn" ? label.dutiesBn : label.dutiesEn,
    visit: lang === "bn" ? label.visitBn : label.visitEn,
  });
  return (
    <PeopleDirectory
      title={pick(lang, child?.labelBn, child?.labelEn) || (lang === "bn" ? label.bn : label.en)}
      summary={lang === "bn" ? "এই ডেস্কে কী হয়, কখন আসবেন, এবং কে দায়িত্বে।" : "What this desk does, when to visit, and who is in charge."}
      note={copy.note}
      duties={copy.duties}
      visit={copy.visit}
      people={filterPeople(site, [role])}
    />
  );
}
