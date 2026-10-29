import type { ClassItem, MenuItem, NoticeItem, PageDetail, PublicSite, ThemeTokens } from "./types";

export interface LegacyBranding {
  name?: string;
  logoUrl?: string;
  motto?: string;
  address?: string;
  eiin?: string;
  establishedYear?: number | null;
  academicYear?: string;
  theme?: { primary?: string };
  publicAdmission?: boolean;
}

interface LegacyClass {
  _id: string;
  name: string;
  code?: string;
  group?: string;
  sections?: string[];
  subjects?: ClassItem["subjects"];
}

const MENUS: MenuItem[] = [
  { key: "home", href: "/", labelBn: "হোম", labelEn: "Home", visible: true, locked: true, children: [] },
  {
    key: "about",
    href: "/about",
    labelBn: "আমাদের সম্পর্কে",
    labelEn: "About",
    visible: true,
    children: [
      { key: "history", href: "/about/history", labelBn: "ইতিহাস", labelEn: "History", visible: true },
      { key: "mission", href: "/about/mission", labelBn: "মিশন ও ভিশন", labelEn: "Mission and vision", visible: true },
      { key: "principal", href: "/about/principal", labelBn: "প্রধান শিক্ষকের বাণী", labelEn: "Principal's message", visible: true },
      { key: "facilities", href: "/about/facilities", labelBn: "সুবিধা", labelEn: "Facilities", visible: true },
      { key: "achievements", href: "/about/achievements", labelBn: "কৃতিত্ব", labelEn: "Achievements", visible: true },
      { key: "honorable", href: "/about/honorable", labelBn: "সাবেক অধ্যক্ষ, সভাপতি ও দাতা", labelEn: "Former Leaders & Donors", visible: true },
      { key: "gallery", href: "/gallery", labelBn: "গ্যালারি", labelEn: "Gallery", visible: true },
    ],
  },
  {
    key: "admission",
    href: "/admission",
    labelBn: "ভর্তি",
    labelEn: "Admission",
    visible: true,
    children: [
      { key: "admission-info", href: "/admission/admission-info", labelBn: "ভর্তি তথ্য", labelEn: "Admission information", visible: true },
      { key: "apply", href: "/admission/apply", labelBn: "অনলাইন ভর্তি আবেদন", labelEn: "Online application", visible: true },
      { key: "admission-result", href: "/admission/result", labelBn: "ভর্তি পরীক্ষার ফলাফল", labelEn: "Admission exam result", visible: true },
      { key: "form-download", href: "/admission/form-download", labelBn: "অফলাইন ভর্তি ফর্ম ডাউনলোড", labelEn: "Admission form download", visible: true },
      { key: "eligibility", href: "/admission/eligibility", labelBn: "যোগ্যতা ও আসন", labelEn: "Eligibility and seats", visible: true },
      { key: "documents", href: "/admission/documents", labelBn: "প্রয়োজনীয় কাগজ", labelEn: "Required documents", visible: true },
      { key: "fees-info", href: "/admission/fees-info", labelBn: "ফি তথ্য", labelEn: "Fee information", visible: true },
    ],
  },
  {
    key: "academic",
    href: "/academic",
    labelBn: "একাডেমিক",
    labelEn: "Academic",
    visible: true,
    children: [
      { key: "academic-info", href: "/academic/academic-info", labelBn: "একাডেমিক তথ্য", labelEn: "Academic information", visible: true },
      { key: "classes", href: "/academic/classes", labelBn: "ক্লাস ও বিষয়", labelEn: "Classes and subjects", visible: true },
      { key: "teachers", href: "/academic/teachers", labelBn: "শিক্ষক", labelEn: "Teachers", visible: true },
      { key: "routine", href: "/academic/routine", labelBn: "রুটিন", labelEn: "Routine", visible: true },
      { key: "syllabus", href: "/academic/syllabus", labelBn: "সিলেবাস", labelEn: "Syllabus", visible: true },
      { key: "calendar", href: "/academic/calendar", labelBn: "একাডেমিক ক্যালেন্ডার ও ছুটি", labelEn: "Academic calendar", visible: true },
      { key: "results", href: "/results", labelBn: "ফলাফল ও মার্কশিট", labelEn: "Results and marksheet", visible: true },
      { key: "receipts", href: "/receipts", labelBn: "জমার রসিদ", labelEn: "Payment receipts", visible: true },
      { key: "cocurricular", href: "/academic/cocurricular", labelBn: "সহশিক্ষা", labelEn: "Co-curricular", visible: true },
    ],
  },
  {
    key: "authorities",
    href: "/authorities",
    labelBn: "কর্তৃপক্ষ",
    labelEn: "Authorities",
    visible: true,
    children: [
      { key: "committee", href: "/authorities/committee", labelBn: "স্কুল কমিটি", labelEn: "School committee", visible: true },
      { key: "governing", href: "/authorities/governing", labelBn: "পরিচালনা পর্ষদ", labelEn: "Governing body", visible: true },
      { key: "council", href: "/authorities/council", labelBn: "একাডেমিক কাউন্সিল", labelEn: "Academic council", visible: true },
      { key: "pta", href: "/authorities/pta", labelBn: "অভিভাবক কমিটি", labelEn: "Parent committee", visible: true },
    ],
  },
  {
    key: "office",
    href: "/office",
    labelBn: "অফিস",
    labelEn: "Office",
    visible: true,
    children: [
      { key: "principal", href: "/office/principal", labelBn: "অধ্যক্ষ", labelEn: "Principal", visible: true },
      { key: "vice", href: "/office/vice", labelBn: "সহকারি অধ্যক্ষ", labelEn: "Assistant principal", visible: true },
      { key: "admission", href: "/office/admission", labelBn: "ভর্তি শাখা", labelEn: "Admission office", visible: true },
      { key: "accounts", href: "/office/accounts", labelBn: "হিসাব শাখা", labelEn: "Accounts", visible: true },
      { key: "librarian", href: "/office/librarian", labelBn: "গ্রন্থাগারিক", labelEn: "Librarian", visible: true },
      { key: "exam", href: "/office/exam", labelBn: "পরীক্ষা নিয়ন্ত্রক", labelEn: "Exam controller", visible: true },
      { key: "clerk", href: "/office/clerk", labelBn: "অফিস সহকারী", labelEn: "Office assistant", visible: true },
    ],
  },
  {
    key: "students",
    href: "/students",
    labelBn: "শিক্ষার্থী",
    labelEn: "Students",
    visible: true,
    children: [
      { key: "student-portal", href: "/student-portal/dashboard", labelBn: "স্টুডেন্ট পোর্টাল ও লেকচার শিট", labelEn: "Student Portal & Notes", visible: true },
      { key: "results", href: "/results", labelBn: "পরীক্ষার ফলাফল", labelEn: "Exam Results", visible: true },
      { key: "calendar", href: "/academic/calendar", labelBn: "ছুটি ও ক্যালেন্ডার", labelEn: "Academic Calendar", visible: true },
      { key: "display-board", href: "/board", labelBn: "লাইভ ডিসপ্লে বোর্ড", labelEn: "Live Display Board", visible: true },
      { key: "student-life", href: "/students/student-life", labelBn: "বর্তমান শিক্ষার্থী", labelEn: "Current students", visible: true },
      { key: "future", href: "/students/future", labelBn: "ভবিষ্যৎ শিক্ষার্থী", labelEn: "Future students", visible: true },
      { key: "council", href: "/students/council", labelBn: "স্টুডেন্ট কাউন্সিল", labelEn: "Student council", visible: true },
      { key: "clubs", href: "/students/clubs", labelBn: "ক্লাব", labelEn: "Clubs", visible: true },
      { key: "rules", href: "/students/rules", labelBn: "নিয়মাবলি", labelEn: "Code of conduct", visible: true },
    ],
  },
  { key: "contact", href: "/contact", labelBn: "যোগাযোগ", labelEn: "Contact", visible: true, locked: true, children: [] },
  { key: "login", href: "/login", labelBn: "লগইন", labelEn: "Login", visible: true, locked: true, children: [] },
];

interface FallbackPage {
  menuKey: string;
  titleBn: string;
  titleEn: string;
  summaryBn: string;
  summaryEn: string;
  textBn: string;
  textEn: string;
  seoDescriptionBn: string;
  seoDescriptionEn: string;
}

const PAGES: Record<string, FallbackPage> = {
  history: page("about", "ইতিহাস", "History", "স্কুলের পথচলা ও প্রতিষ্ঠার গল্প।", "How the school began and grew.", "এই স্কুল স্থানীয় অভিভাবক ও শিক্ষকদের উদ্যোগে গড়ে উঠেছে। বিস্তারিত ইতিহাস ড্যাশবোর্ডের ওয়েবসাইট পাতা থেকে সম্পাদনা করুন।", "This school grew from the work of local parents and teachers. Edit this history from the dashboard Website workspace."),
  mission: page("about", "মিশন ও ভিশন", "Mission and vision", "আমরা কী প্রতিজ্ঞা করি এবং কোথায় যেতে চাই।", "What the school promises and where it is going.", "আমাদের মিশন প্রতিটি শিক্ষার্থীকে নিরাপদ পরিবেশে শেখানো। এই লেখা স্কুল নিজের ভাষায় বদলাতে পারবে।", "Our mission is to teach every student in a safe school. Replace this text with the school's own words."),
  principal: page("about", "প্রধান শিক্ষকের বাণী", "Principal's message", "প্রধান শিক্ষকের পূর্ণ বাণী।", "A note from the head of the school.", "পড়াশোনা, চরিত্র ও সহশিক্ষা — তিনটিই আমাদের দৈনন্দিন কাজ। পূর্ণ বাণী ড্যাশবোর্ড থেকে যোগ করুন।", "Study, character, and activities beyond the classroom are our daily work. Add the full message from the dashboard."),
  facilities: page("about", "সুবিধা", "Facilities", "ক্লাসরুম, ল্যাব, খেলার মাঠ ও লাইব্রেরি।", "Classrooms, labs, field, and library.", "ক্লাসরুম, বিজ্ঞানাগার, পাঠাগার ও খেলার মাঠ — যে সুবিধা আছে তা এখানে লিখুন।", "Describe classrooms, science rooms, the library, and the field."),
  achievements: page("about", "কৃতিত্ব", "Achievements", "পরীক্ষা, খেলা ও সংস্কৃতিতে যা অর্জিত হয়েছে।", "What the school has earned in exams, sport, and culture.", "কৃতিত্বের তালিকা ড্যাশবোর্ড থেকে যোগ করুন।", "Add the list of achievements from the dashboard."),
  "admission-info": page("admission", "ভর্তি তথ্য", "Admission information", "কখন আবেদন, কী কাগজ, ফি অফিসে।", "When to apply, which papers, and that the fee is paid at the office.", "অনলাইন ফর্ম জমা মানে অপেক্ষমাণ। অনুমোদনের পর ভর্তি। এই সাইটে টাকা কাটা হয় না।", "Submitting the form means pending. Admission starts after approval. This site does not take payment."),
  eligibility: page("admission", "যোগ্যতা ও আসন", "Eligibility and seats", "কে আবেদন করতে পারে। আসন সংখ্যা অফিস বলে।", "Who may apply. The office states the number of seats.", "আসন সংখ্যা এই পাতায় নেই। ভর্তি নোটিশ ও অফিস চূড়ান্ত।", "Seat counts are not on this page. The admission notice and the office are final."),
  documents: page("admission", "প্রয়োজনীয় কাগজ", "Required documents", "আবেদনের সঙ্গে যে কাগজ লাগে।", "Papers to bring with the application.", "জন্মনিবন্ধন, আগের স্কুলের কাগজ ও ছবি অফিসে জমা দিন। তালিকা নোটিশে বদলাতে পারে।", "Hand in the birth certificate, the previous school's papers, and photos at the office. The notice can change the list."),
  "fees-info": page("admission", "ফি তথ্য", "Fee information", "ফি অফিসে। রসিদ সেখান থেকে।", "Fees are paid at the office. The receipt comes from there.", "নগদ, বিকাশ, নগদ, রকেট, ব্যাংক বা চেক। অনলাইনে টাকা কাটা হয় না। অঙ্ক অফিস বলে।", "Cash, bKash, Nagad, Rocket, bank, or cheque. Nothing is charged online. The office states the amount."),
  "academic-info": page("academic", "একাডেমিক তথ্য", "Academic information", "ক্লাস, রুটিন, সিলেবাস ও প্রকাশিত ফল।", "Classes, routine, syllabus, and published results.", "রুটিন ও সিলেবাস ড্যাশবোর্ড থেকে প্রকাশ হয়। পরীক্ষার দিন নোটিশে।", "The routine and syllabus are published from the dashboard. Exam days are notices."),
  calendar: page("academic", "একাডেমিক ক্যালেন্ডার", "Academic calendar", "ছুটি ও পরীক্ষার সপ্তাহ।", "Holidays and exam weeks.", "নির্দিষ্ট তারিখ নোটিশে। ক্যালেন্ডার ড্যাশবোর্ড থেকে যোগ করুন।", "The exact date is a notice. Add the calendar from the dashboard."),
  cocurricular: page("academic", "সহশিক্ষা", "Co-curricular", "খেলা, সংস্কৃতি ও ক্লাব।", "Sports, culture, and clubs.", "আসরের তারিখ নোটিশে। ক্লাবের বিবরণ ড্যাশবোর্ড থেকে যোগ করুন।", "A meeting date is a notice. Add club details from the dashboard."),
  "student-life": page("students", "বর্তমান শিক্ষার্থী", "Current students", "ক্লাস, নোটিশ ও প্রকাশিত ফল।", "Classes, notices, and published results.", "রুটিন, নোটিশ ও ফল এই সাইটে। ব্যক্তিগত তথ্য প্রকাশিত হয় না।", "The routine, notices, and results are on this site. Private details are not published."),
  future: page("students", "ভবিষ্যৎ শিক্ষার্থী", "Future students", "ভর্তির আগে যা জানা দরকার।", "What to know before admission.", "যোগ্যতা, কাগজ ও ফি আগে পড়ুন। আবেদন এক পাতায়। ফি অফিসে।", "Read eligibility, papers, and fees first. The application is one page. The fee is at the office."),
  council: page("students", "স্টুডেন্ট কাউন্সিল", "Student council", "শিক্ষার্থী প্রতিনিধি।", "Student representatives.", "সদস্যদের নাম ড্যাশবোর্ড থেকে যোগ করুন।", "Add member names from the dashboard."),
  clubs: page("students", "ক্লাব", "Clubs", "খেলা ও সংস্কৃতির দল।", "Sports and culture groups.", "ক্লাবের তালিকা ড্যাশবোর্ড থেকে যোগ করুন। আসর নোটিশে।", "Add the club list from the dashboard. Meetings are notices."),
  rules: page("students", "নিয়মাবলি", "Code of conduct", "ক্যাম্পাসে যা মানা হয়।", "What the campus expects.", "সময়মতো আসা, ইউনিফর্ম ও শৃঙ্খলা। বিস্তারিত ড্যাশবোর্ড থেকে যোগ করুন।", "Arrive on time, wear the uniform, and keep discipline. Add the full rules from the dashboard."),
};

function page(
  menuKey: string,
  titleBn: string,
  titleEn: string,
  summaryBn: string,
  summaryEn: string,
  textBn: string,
  textEn: string,
) {
  return { menuKey, titleBn, titleEn, summaryBn, summaryEn, textBn, textEn, seoDescriptionBn: summaryBn, seoDescriptionEn: summaryEn };
}

function classLevel(name: string): number {
  const lower = name.toLowerCase();
  if (/(play|nursery|kg|pre)/.test(lower)) return 0;
  const match = lower.match(/(\d+)/);
  return match ? Number(match[1]) : 0;
}

function themeFrom(primary: string | undefined): ThemeTokens {
  const color = primary && /^#[0-9a-fA-F]{6}$/.test(primary) ? primary : "#14532d";
  return {
    preset: color.toLowerCase() === "#14532d" ? "heritage" : "custom",
    primary: color,
    onPrimary: "#ffffff",
    accent: "#8a6a32",
    surface: "#f6f3ec",
    ink: "#1c1917",
    radius: "0.75rem",
  };
}

export function siteFromLegacy(branding: LegacyBranding, notices: NoticeItem[], classes: LegacyClass[]): PublicSite {
  const name = (branding.name ?? "").trim() || "বিদ্যালয়";
  return {
    school: {
      name,
      logoUrl: branding.logoUrl ?? "",
      motto: branding.motto ?? "",
      address: branding.address ?? "",
      eiin: branding.eiin ?? "",
      establishedYear: branding.establishedYear ?? null,
      academicYear: branding.academicYear ?? "",
    },
    config: {
      phone: "",
      email: "",
      officeHours: "রবি–বৃহস্পতি, সকাল ৯টা–বিকেল ৪টা",
      mapEmbedUrl: "",
      facebook: "",
      youtube: "",
      theme: themeFrom(branding.theme?.primary),
      heroTitleBn: name,
      heroTitleEn: name,
      heroSubtitleBn: branding.motto || "ফলাফল, নোটিশ ও ভর্তি — এক জায়গায়।",
      heroSubtitleEn: branding.motto || "Results, notices, and admission in one place.",
      heroImageUrl: "/media/campus.webp",
      heroVideoUrl: "",
      whyChooseUs: [
        { titleBn: "নিয়মিত ক্লাস", titleEn: "Steady classes", bodyBn: "রুটিন অনুযায়ী ক্লাস ও বিষয়ভিত্তিক শিক্ষক।", bodyEn: "Classes follow the routine, with a teacher for each subject." },
        { titleBn: "প্রকাশিত ফলাফল", titleEn: "Published results", bodyBn: "পরীক্ষা প্রকাশের পর শিক্ষার্থী আইডি দিয়ে দেখা যায়।", bodyEn: "After an exam is published, families look it up with a student ID." },
        { titleBn: "স্পষ্ট ভর্তি", titleEn: "Clear admission", bodyBn: "যোগ্যতা, কাগজ ও ফি আগে থেকে লেখা থাকে।", bodyEn: "Eligibility, papers, and fees are written down before you apply." },
      ],
      stats: [],
      principalName: "মুহাম্মদ রফিকুল ইসলাম",
      principalDesignation: "প্রধান শিক্ষক",
      principalPhotoUrl: "/media/portrait-0.webp",
      principalQuoteBn:
        "বিসমিল্লাহির রাহমানির রাহিম।\n\nজ্ঞান, শৃঙ্খলা ও নৈতিকতার এক অনন্য মেলবন্ধনে আমাদের এই ঐতিহাসিক বিদ্যাপীঠ ভবিষ্যৎ প্রজন্মকে যোগ্য, দক্ষ ও আদর্শ মানুষ হিসেবে গড়ে তোলার পবিত্র ব্রতে নিয়োজিত। শিক্ষার প্রকৃত উদ্দেশ্য কেবল পুঁথিগত বিদ্যার্জন কিংবা পরীক্ষায় জিপিএ-৫ অর্জন নয়; বরং সুপ্ত প্রতিভার পরিপূর্ণ বিকাশ, মানবিক মূল্যবোধ, পরমতসহিষ্ণুতা, দেশপ্রেম এবং বাস্তবমুখী কর্মদক্ষতার সমন্বয়ে প্রতিটি শিক্ষার্থীকে একবিংশ শতাব্দীর আলোকিত ও দায়িত্বশীল নাগরিক হিসেবে তৈরি করাই আমাদের প্রধান ব্রত।\n\nবর্তমান দ্রুত পরিবর্তনশীল বিশ্বে প্রযুক্তিনির্ভর আধুনিক শিক্ষার গুরুত্ব অপরিসীম। সেই তাগিদ থেকেই আমাদের প্রতিষ্ঠানে সুসজ্জিত স্মার্ট মাল্টিমিডিয়া ক্লাসরুম, আধুনিক কম্পিউটার ল্যাব, সমৃদ্ধ বিজ্ঞানাগার এবং তথ্যসমৃদ্ধ পাঠাগারের ব্যবস্থা নিশ্চিত করা হয়েছে। পাঠ্যক্রমের পাশাপাশি শিক্ষার্থীদের মানসিক ও শারীরিক উৎকর্ষ সাধনের লক্ষ্যে বিতর্ক প্রতিযোগিতা, সাংস্কৃতিক অনুষ্ঠান, স্কাউটিং, বিজ্ঞান মেলা এবং বার্ষিক ক্রীড়া প্রতিযোগিতার মতো সহশিক্ষা কার্যক্রমকে আমরা সমানভাবে উৎসাহিত করি। আমাদের অভিজ্ঞ, দক্ষ ও নিবেদিতপ্রাণ শিক্ষক মণ্ডলী প্রতিটি শিক্ষার্থীর মেধা ও মনন বিকাশে অত্যন্ত যত্ন ও স্নেহের সাথে দিকনির্দেশনা প্রদান করে যাচ্ছেন।\n\nএকটি আদর্শ বিদ্যাপীঠ গড়ে তোলার ক্ষেত্রে শিক্ষক, শিক্ষার্থী এবং অভিভাবকদের সমন্বিত প্রচেষ্টা অনস্বীকার্য। সম্মানিত অভিভাবকবৃন্দের প্রতি আমার সনির্বন্ধ অনুরোধ—আপনার সন্তানের পড়াশোনা, নিয়মিত উপস্থিতি ও মানসিক স্বাস্থ্যের প্রতি সজাগ দৃষ্টি রাখুন এবং তাদের নৈতিক শিক্ষায় অনুপ্রাণিত করুন। প্রতিষ্ঠানের সার্বিক উন্নয়নে আপনাদের সুচিন্তিত মতামত ও গঠনমূলক পরামর্শ আমাদের পথচলাকে আরও সমৃদ্ধ করবে।\n\nপরম করুণাময় মহান আল্লাহ তায়ালার দরবারে প্রার্থনা—আমাদের সকল শুভ উদ্যোগ ও সম্মিলিত প্রচেষ্টা সফল হোক। আমাদের প্রিয় শিক্ষার্থীরা জ্ঞান, সততা ও মানবিকতার আলো ছড়িয়ে দেশ ও জাতির গৌরব বৃদ্ধি করুক—এই আমার আন্তরিক প্রত্যাশা ও শুভকামনা।",
      principalQuoteEn:
        "Bismillahir Rahmanir Rahim.\n\nRooted in a profound synthesis of knowledge, discipline, and ethical values, our historic institution is dedicated to the sacred mission of shaping our future generations into enlightened, skilled, and compassionate human beings. The true essence of education extends far beyond memorization of textbooks or securing top letter grades; our paramount commitment is to cultivate innate potential, human values, mutual tolerance, patriotism, and practical life skills to prepare every student as an enlightened, responsible global citizen for the 21st century.\n\nIn today's rapidly evolving world, science and technology-driven education is indispensable. Embracing this reality, we have established smart multimedia classrooms, modern computer laboratories, fully equipped science laboratories, and an extensive library. Alongside rigorous academic curricula, we actively foster co-curricular engagements including debate competitions, cultural events, scouting, science fairs, and annual athletic tournaments for holistic physical and intellectual development. Our experienced, dedicated faculty members labor untiringly with paternal care and wisdom to guide every learner toward excellence.\n\nThe realization of an ideal educational institution rests upon the unified synergy of teachers, students, and parents. I earnestly appeal to our respected parents and guardians to stay actively engaged in your children's academic progress, daily attendance, and emotional well-being while inspiring them with strong moral values. Your constructive advice and continuous cooperation are invaluable assets to our mission. May the Almighty bless all our collective endeavors and empower our students to bring lasting honor to the nation.",
      homeIntroBn: branding.address ? `${name} — ${branding.address}` : name,
      homeIntroEn: branding.address ? `${name} — ${branding.address}` : name,
      tasks: [
        { titleBn: "প্রকাশিত ফল", titleEn: "Published results", bodyBn: "শিক্ষার্থী আইডি দিয়ে প্রকাশিত ফল ও মার্কশিট।", bodyEn: "A published result and marksheet with a student ID." },
        { titleBn: "এক পাতায় আবেদন", titleEn: "One-page application", bodyBn: "ফি অফিসে, সিট যাচাইয়ের পর। এই সাইটে টাকা কাটা হয় না।", bodyEn: "The fee is at the office, and a seat comes after checking. This site does not take payment." },
        { titleBn: "অফিসের ঘোষণা", titleEn: "Office announcements", bodyBn: "ছুটি, পরীক্ষা ও ভর্তির তারিখ আগে এখানে।", bodyEn: "Holidays, exams, and admission dates are announced here first." },
      ],
      admitTitleBn: "ভর্তি খোলা আছে কি?",
      admitTitleEn: "Is admission open?",
      admitBodyBn: "আবেদন এক পাতায়। ফি ও রসিদ অফিস থেকে।",
      admitBodyEn: "The application is one page. The fee and the receipt come from the office.",
      desks: [],
      resultLookupEnabled: true,
      receiptLookupEnabled: true,
      publicAdmission: branding.publicAdmission !== false,
      meritListEnabled: false,
      seoDescriptionBn: `${name} — নোটিশ, ভর্তি ও প্রকাশিত ফলাফল।`,
      seoDescriptionEn: `${name} — notices, admission, and published results.`,
      menus: MENUS,
    },
    notices,
    posts: [],
    teachers: [
      { _id: "t1", name: "মুহাম্মদ রফিকুল ইসলাম", designation: "প্রধান শিক্ষক", photoUrl: "/media/portrait-0.webp", phone: "01711-100001", joiningDate: "2015-01-10T00:00:00.000Z" },
      { _id: "t2", name: "মুহাম্মদ আবদুল হালিম", designation: "সহকারি প্রধান শিক্ষক (গণিত)", photoUrl: "/media/portrait-1.webp", phone: "01711-100002", joiningDate: "2017-03-15T00:00:00.000Z" },
      { _id: "t3", name: "সালমা আক্তার", designation: "সহকারি প্রধান শিক্ষক", photoUrl: "/media/portrait-1.webp", phone: "01711-100002", joiningDate: "2018-02-01T00:00:00.000Z" },
      { _id: "t4", name: "নাসরীন আক্তার", designation: "সিনিয়র শিক্ষক (ইংরেজি)", photoUrl: "/media/portrait-3.webp", phone: "01711-100015", joiningDate: "2019-07-01T00:00:00.000Z" },
      { _id: "t5", name: "মোহাম্মদ শাহাদাত হোসেন", designation: "সিনিয়র শিক্ষক (বিজ্ঞান)", photoUrl: "/media/portrait-4.webp", phone: "01711-100016", joiningDate: "2020-01-05T00:00:00.000Z" },
      { _id: "t6", name: "তাহমিনা বেগম", designation: "সহকারি শিক্ষক (বাংলা)", photoUrl: "/media/portrait-5.webp", phone: "01711-100017", joiningDate: "2021-09-12T00:00:00.000Z" },
    ],
    classes: classes.map((item) => ({
      _id: item._id,
      name: item.name,
      code: item.code ?? "",
      group: item.group,
      level: classLevel(item.name),
      sections: item.sections ?? [],
      subjects: item.subjects ?? [],
    })),
    people: [
      {
        _id: "demo-principal",
        name: "মুহাম্মদ রফিকুল ইসলাম",
        board: "principal",
        designation: "প্রধান শিক্ষক",
        photoUrl: "/media/portrait-0.webp",
        phone: "01711-100001",
        bioBn:
          "বিসমিল্লাহির রাহমানির রাহিম।\n\nজ্ঞান, শৃঙ্খলা ও নৈতিকতার এক অনন্য মেলবন্ধনে আমাদের এই ঐতিহাসিক বিদ্যাপীঠ ভবিষ্যৎ প্রজন্মকে যোগ্য, দক্ষ ও আদর্শ মানুষ হিসেবে গড়ে তোলার পবিত্র ব্রতে নিয়োজিত। শিক্ষার প্রকৃত উদ্দেশ্য কেবল পুঁথিগত বিদ্যার্জন কিংবা পরীক্ষায় জিপিএ-৫ অর্জন নয়; বরং সুপ্ত প্রতিভার পরিপূর্ণ বিকাশ, মানবিক মূল্যবোধ, পরমতসহিষ্ণুতা, দেশপ্রেম এবং বাস্তবমুখী কর্মদক্ষতার সমন্বয়ে প্রতিটি শিক্ষার্থীকে একবিংশ শতাব্দীর আলোকিত ও দায়িত্বশীল নাগরিক হিসেবে তৈরি করাই আমাদের প্রধান ব্রত।\n\nবর্তমান দ্রুত পরিবর্তনশীল বিশ্বে প্রযুক্তিনির্ভর আধুনিক শিক্ষার গুরুত্ব অপরিসীম। সেই তাগিদ থেকেই আমাদের প্রতিষ্ঠানে সুসজ্জিত স্মার্ট মাল্টিমিডিয়া ক্লাসরুম, আধুনিক কম্পিউটার ল্যাব, সমৃদ্ধ বিজ্ঞানাগার এবং তথ্যসমৃদ্ধ পাঠাগারের ব্যবস্থা নিশ্চিত করা হয়েছে। পাঠ্যক্রমের পাশাপাশি শিক্ষার্থীদের মানসিক ও শারীরিক উৎকর্ষ সাধনের লক্ষ্যে বিতর্ক প্রতিযোগিতা, সাংস্কৃতিক অনুষ্ঠান, স্কাউটিং, বিজ্ঞান মেলা এবং বার্ষিক ক্রীড়া প্রতিযোগিতার মতো সহশিক্ষা কার্যক্রমকে আমরা সমানভাবে উৎসাহিত করি। আমাদের অভিজ্ঞ, দক্ষ ও নিবেদিতপ্রাণ শিক্ষক মণ্ডলী প্রতিটি শিক্ষার্থীর মেধা ও মনন বিকাশে অত্যন্ত যত্ন ও স্নেহের সাথে দিকনির্দেশনা প্রদান করে যাচ্ছেন।\n\nএকটি আদর্শ বিদ্যাপীঠ গড়ে তোলার ক্ষেত্রে শিক্ষক, শিক্ষার্থী এবং অভিভাবকদের সমন্বিত প্রচেষ্টা অনস্বীকার্য। সম্মানিত অভিভাবকবৃন্দের প্রতি আমার সনির্বন্ধ অনুরোধ—আপনার সন্তানের পড়াশোনা, নিয়মিত উপস্থিতি ও মানসিক স্বাস্থ্যের প্রতি সজাগ দৃষ্টি রাখুন এবং তাদের নৈতিক শিক্ষায় অনুপ্রাণিত করুন। প্রতিষ্ঠানের সার্বিক উন্নয়নে আপনাদের সুচিন্তিত মতামত ও গঠনমূলক পরামর্শ আমাদের পথচলাকে আরও সমৃদ্ধ করবে।\n\nপরম করুণাময় মহান আল্লাহ তায়ালার দরবারে প্রার্থনা—আমাদের সকল শুভ উদ্যোগ ও সম্মিলিত প্রচেষ্টা সফল হোক। আমাদের প্রিয় শিক্ষার্থীরা জ্ঞান, সততা ও মানবিকতার আলো ছড়িয়ে দেশ ও জাতির গৌরব বৃদ্ধি করুক—এই আমার আন্তরিক প্রত্যাশা ও শুভকামনা।",
        bioEn:
          "Bismillahir Rahmanir Rahim.\n\nRooted in a profound synthesis of knowledge, discipline, and ethical values, our historic institution is dedicated to the sacred mission of shaping our future generations into enlightened, skilled, and compassionate human beings. The true essence of education extends far beyond memorization of textbooks or securing top letter grades; our paramount commitment is to cultivate innate potential, human values, mutual tolerance, patriotism, and practical life skills to prepare every student as an enlightened, responsible global citizen for the 21st century.\n\nIn today's rapidly evolving world, science and technology-driven education is indispensable. Embracing this reality, we have established smart multimedia classrooms, modern computer laboratories, fully equipped science laboratories, and an extensive library. Alongside rigorous academic curricula, we actively foster co-curricular engagements including debate competitions, cultural events, scouting, science fairs, and annual athletic tournaments for holistic physical and intellectual development. Our experienced, dedicated faculty members labor untiringly with paternal care and wisdom to guide every learner toward excellence.\n\nThe realization of an ideal educational institution rests upon the unified synergy of teachers, students, and parents. I earnestly appeal to our respected parents and guardians to stay actively engaged in your children's academic progress, daily attendance, and emotional well-being while inspiring them with strong moral values. Your constructive advice and continuous cooperation are invaluable assets to our mission. May the Almighty bless all our collective endeavors and empower our students to bring lasting honor to the nation.",
      },
      {
        _id: "demo-vice",
        name: "সালমা আক্তার",
        board: "vice",
        designation: "সহকারি প্রধান শিক্ষক",
        photoUrl: "/media/portrait-1.webp",
        phone: "01711-100002",
        bioBn: "সুশৃঙ্খল পরিবেশ ও মানসম্মত পাঠদান নিশ্চিত করাই আমাদের প্রধান অঙ্গীকার।",
        bioEn: "Ensuring an orderly environment and quality teaching is our primary commitment.",
      },
      {
        _id: "gov-1",
        name: "আবদুল মান্নান",
        board: "governing",
        designation: "পরিচালনা পর্ষদের সভাপতি",
        photoUrl: "/media/portrait-0.webp",
        phone: "01711-100009",
        bioBn:
          "বিসমিল্লাহির রাহমানির রাহিম।\n\nএকটি জাতির আত্মবিকাশ, মর্যাদা ও টেকসই অর্থনৈতিক সমৃদ্ধির অন্যতম প্রধান চালিকাশক্তি হলো মানসম্মত শিক্ষা। সেই সুমহান আদর্শকে সামনে রেখে আমাদের পরিচালনা পর্ষদ এই প্রাচীন ও ঐতিহ্যবাহী প্রতিষ্ঠানকে অত্র অঞ্চলের অন্যতম সেরা, আধুনিক ও যুগোপযোগী শিক্ষাঙ্গন হিসেবে রূপান্তর করতে নিরবচ্ছিন্নভাবে দায়িত্ব পালন করে যাচ্ছে। প্রতিষ্ঠালগ্ন থেকেই এলাকার সুধীজন, দূরদর্শী শিক্ষানুরাগী, সম্মানিত অভিভাবক এবং আপামর জনসাধারণের অকৃত্রিম ভালোবাসা ও সহযোগিতায় এ প্রতিষ্ঠানটি এক গৌরবময় ঐতিহ্যের ধারক হয়ে উঠেছে।\n\nপরিচালনা পর্ষদের মূল লক্ষ্য হলো শিক্ষার্থীদের জন্য একটি নিরাপদ, নান্দনিক, সুশৃঙ্খল এবং বিশ্বমানের শিক্ষা পরিবেশ নিশ্চিত করা। আমরা প্রতিষ্ঠানের অবকাঠামোগত উন্নয়ন, স্মার্ট শ্রেণিকক্ষ নির্মাণ, অত্যাধুনিক ডিজিটাল ল্যাব স্থাপন এবং খেলাধুলার উপযুক্ত পরিবেশ তৈরিতে অগ্রাধিকার ভিত্তিতে কাজ করে যাচ্ছি। প্রশাসনিক স্বচ্ছতা, জবাবদিহিতা, যোগ্য ও মেধাবী শিক্ষক নির্বাচন এবং শিক্ষার উপযুক্ত পরিবেশ বজায় রাখা আমাদের পরিচালনা নীতির মূল ভিত্তি। আমরা বিশ্বাস করি, সুযোগ্য পরিচালনা ও নিষ্ঠাবান শিক্ষক সমাজের মেলবন্ধনে আমাদের কোমলমতি শিক্ষার্থীরা দেশীয় ও আন্তর্জাতিক পরিমণ্ডলে যেকোনো প্রতিযোগিতায় নিজেদের শ্রেষ্ঠত্ব প্রমাণ করতে সক্ষম হবে।\n\nশিক্ষার সাথে যদি গভীর নীতিবোধ ও দেশপ্রেমের সংযোগ ঘটে, তবে সেই প্রজন্মই দেশকে সমৃদ্ধির সর্বোচ্চ শিখরে পৌঁছে দিতে পারে। প্রতিষ্ঠানের উত্তরোত্তর সমৃদ্ধি ও অগ্রগতিতে শিক্ষক, অভিভাবক, শুভাকাঙ্ক্ষী এবং সরকারি-বেসরকারি সকল মহলের আন্তরিক সহযোগিতার জন্য পরিচালনা পর্ষদের পক্ষ থেকে জানাই আন্তরিক কৃতজ্ঞতা ও অভিনন্দন। আসুন, আমরা সকলে ঐক্যবদ্ধভাবে আমাদের আগামী প্রজন্মকে আলোকিত মানুষ হিসেবে গড়ে তোলার এই মহতী যাত্রায় শামিল হই। পরম করুণাময় আমাদের সহায় হোন।",
        bioEn:
          "Bismillahir Rahmanir Rahim.\n\nQuality education is the quintessential engine of national enlightenment, self-dignity, and sustainable prosperity. Upholding this noble mandate, our Governing Body is steadfastly committed to steering this esteemed institution into a pioneering citadel of modern learning, disciplined governance, and moral excellence. Since its inception, the enduring trust, visionary philanthropy, and active cooperation of local patrons, dedicated educationists, respected guardians, and the community have nurtured this institution into a symbol of pride and achievement.\n\nThe prime responsibility of the Governing Body is to guarantee a secure, inspiring, aesthetically refined, and world-class educational ecosystem. We place utmost priority on physical infrastructure development, state-of-the-art smart classrooms, cutting-edge ICT labs, and expansive sports and cultural grounds. Uncompromising transparency, administrative accountability, meritocratic teacher recruitment, and pedagogical excellence constitute the bedrocks of our governance. We firmly believe that the union of visionary governance and dedicated faculty will enable our students to distinguish themselves across national and international horizons.\n\nWhen education is steeped in integrity and love for the motherland, that generation possesses the power to lead the nation to the pinnacle of greatness. On behalf of the Governing Body, I extend my heartfelt gratitude to our teachers, parents, alumni, well-wishers, and government authorities for their steadfast support. Let us join hands to guide our upcoming generations toward a radiant and prosperous future. May the Almighty be our guide.",
      },
      {
        _id: "gov-2",
        name: "ফরিদা ইয়াসমিন",
        board: "governing",
        designation: "পর্ষদ সদস্য",
        photoUrl: "/media/portrait-9.webp",
        phone: "01711-100012",
        bioBn: "শিক্ষক নিয়োগ ও ক্যাম্পাসের নিরাপত্তা নিয়ে মত দেন।",
        bioEn: "Advises on teacher appointments and campus safety.",
      },
      {
        _id: "gov-3",
        name: "ড. শামসুল হক",
        board: "governing",
        designation: "বিদ্যোৎসাহী সদস্য",
        photoUrl: "/media/portrait-2.webp",
        phone: "01711-100018",
        bioBn: "পাঠদান মান ও একাডেমিক উৎকর্ষ সাধনে পরামর্শ দেন।",
        bioEn: "Advises on teaching quality and academic excellence.",
      },
      {
        _id: "gov-4",
        name: "মুহাম্মদ মোশাররফ হোসেন",
        board: "governing",
        designation: "অভিভাবক সদস্য",
        photoUrl: "/media/portrait-4.webp",
        phone: "01711-100019",
        bioBn: "অভিভাবকদের মতামত পর্ষদের সভায় তুলে ধরেন।",
        bioEn: "Represents parent views at the governing body.",
      },
      {
        _id: "comm-1",
        name: "মো. করিম উদ্দিন",
        board: "committee",
        designation: "সভাপতি",
        photoUrl: "/media/portrait-0.webp",
        phone: "01711-100020",
        bioBn:
          "বিসমিল্লাহির রাহমানির রাহিম।\n\nশিক্ষার আলোয় একটি সম্ভাবনাময়, দক্ষ ও সুশৃঙ্খল ভবিষ্যৎ প্রজন্ম গড়ে তোলার মহান লক্ষ্য নিয়ে আমাদের বিদ্যালয় অবিচল পদক্ষেপে এগিয়ে চলেছে। স্কুল কমিটির পক্ষ থেকে আমি এই ঐতিহ্যবাহী বিদ্যাপীঠের সকল শিক্ষক, শিক্ষার্থী, সম্মানিত অভিভাবক এবং শুভানুধ্যায়ীদের জানাই আন্তরিক শুভেচ্ছা ও অভিনন্দন। একটি আদর্শ শিক্ষাপ্রতিষ্ঠান কেবল পাঠ্যপুস্তকের জ্ঞান বিতরণের স্থান নয়, বরং তা নৈতিকতা, চারিত্রিক দৃঢ়তা, সৃজনশীলতা ও মানবিক মূল্যবোধের উন্মেষ ঘটানোর পবিত্র পাদপীঠ। শিক্ষার্থীদের মেধার সুষম বিকাশ ও শৃঙ্খলাপরায়ণ নাগরিক হিসেবে গড়ে তোলাই আমাদের প্রধান অঙ্গীকার।\n\nবিদ্যালয়ের একাডেমিক পরিবেশকে আধুনিক ও যুগোপযোগী করতে আমাদের কমিটি নিরলসভাবে কাজ করছে। শ্রেণিকক্ষে নিয়মিত ও আকর্ষণীয় পাঠদান নিশ্চিত করা, প্রযুক্তিভিত্তিক স্মার্ট শিক্ষা পদ্ধতির প্রসার, সমৃদ্ধ লাইব্রেরি ও বিজ্ঞানাগারের সুষ্ঠু ব্যবহার নিশ্চিতকরণে আমরা সর্বদা সচেষ্ট। শিক্ষার পাশাপাশি শিক্ষার্থীদের শারীরিক ও মানসিক সুস্থতা বজায় রাখার জন্য বার্ষিক ক্রীড়া, বিতর্ক প্রতিযোগিতা, সাংস্কৃতিক অনুষ্ঠান ও স্কাউটিংয়ের মতো সহশিক্ষা কার্যক্রমে সমান গুরুত্ব দেওয়া হচ্ছে। আমরা বিশ্বাস করি, ইতিবাচক ও অনুপ্রেরণাদায়ী পরিবেশেই একটি শিশুর পরিপূর্ণ মানসিক বিকাশ সম্ভব।\n\nশিক্ষার গুণগত মান বৃদ্ধিতে শিক্ষক, অভিভাবক ও বিদ্যালয় পরিচালনা কমিটির মধ্যে পারস্পরিক সৌহার্দ্য ও নিবিড় সমন্বয় অপরিহার্য। শ্রদ্ধেয় অভিভাবকগণের প্রতি আমার বিনীত আহ্বান—সন্তানদের নিয়মিত বিদ্যালয়ে উপস্থিতি, বাড়ির পড়া ও তাদের নৈতিক আচরণের প্রতি সজাগ দৃষ্টি রাখুন। আপনাদের যেকোনো গঠনমূলক পরামর্শ ও সহযোগিতা বিদ্যালয়কে সামনের দিকে এগিয়ে নিতে আমাদের প্রেরণা যোগাবে। আমাদের সুদক্ষ ও নিবেদিতপ্রাণ শিক্ষক সমাজের আন্তরিক পাঠদানে প্রতিটি শিক্ষার্থী যেন সাফল্যের শীর্ষে পৌঁছাতে পারে, সে লক্ষ্যে আমরা প্রয়োজনীয় সকল সুযোগ-সুবিধা প্রদানে বদ্ধপরিকর।\n\nপরম করুণাময় মহান আল্লাহর নিকট আমাদের প্রার্থনা—তিনি যেন আমাদের এই শিক্ষাঙ্গনকে জ্ঞানের আলোয় সদা প্রদীপ্ত রাখেন। আমাদের কোমলমতি শিক্ষার্থীরা দেশপ্রেম, সততা ও যোগ্যতায় বলীয়ান হয়ে দেশ ও জাতির মুখ উজ্জ্বল করুক এবং বিশ্বমঞ্চে নিজেদের যোগ্য আসন তৈরি করে নিক। সবার সার্বিক কল্যাণ ও সুস্বাস্থ্য কামনা করছি।",
        bioEn:
          "Bismillahir Rahmanir Rahim.\n\nWith the noble aspiration of cultivating an enlightened, skilled, and disciplined future generation, our institution steadily marches forward on the path of academic excellence. On behalf of the School Committee, I extend my heartfelt greetings and congratulations to our dedicated educators, dear students, respected parents, and well-wishers. An ideal educational institution is not merely a center for textbook instruction, but a sacred crucible where moral integrity, creativity, and humanitarian values are nurtured. Inspiring our students to achieve holistic intellectual growth and flourish as responsible citizens remains our foremost commitment.\n\nOur School Committee works untiringly to elevate our academic ecosystem to modern and dynamic standards. We are actively committed to ensuring disciplined classroom instruction, expanding multimedia smart education, and optimizing the resources of our science laboratories and library. Concurrently, to foster both mental agility and physical well-being, we place strong emphasis on co-curricular activities, including sports, debates, cultural pursuits, and scouting. We believe that an inspiring, positive, and supportive campus atmosphere is paramount to unlocking every learner's limitless potential.\n\nThe pursuit of academic excellence fundamentally depends upon the symbiotic partnership between teachers, guardians, and the school administration. I warmly request our esteemed guardians to remain attentive to their children's daily attendance, academic progress, and moral conduct. Your constructive insights and steadfast support will continually energize our collective endeavors. May the Almighty grant our institution continued success, and may our beloved learners illuminate the nation and humanity with integrity and knowledge.",
      },
      {
        _id: "comm-2",
        name: "রাবেয়া সুলতানা",
        board: "committee",
        designation: "সহ-সভাপতি",
        photoUrl: "/media/portrait-9.webp",
        phone: "01711-100021",
        bioBn: "অভিভাবকদের সঙ্গে নিয়মিত আলোচনার দায়িত্বে আছেন।",
        bioEn: "Leads communications with families.",
      },
      {
        _id: "comm-3",
        name: "জাহিদ হাসান",
        board: "committee",
        designation: "সদস্য",
        photoUrl: "/media/portrait-2.webp",
        phone: "01711-100022",
        bioBn: "ক্যাম্পাস ও শ্রেণি কার্যক্রম তদারকিতে যুক্ত।",
        bioEn: "Supports campus development.",
      },
      {
        _id: "comm-4",
        name: "নাসরিন আক্তার",
        board: "committee",
        designation: "সদস্য",
        photoUrl: "/media/portrait-7.webp",
        phone: "01711-100023",
        bioBn: "সভার সিদ্ধান্ত বাস্তবায়নে সহযোগিতা করেন।",
        bioEn: "Follows up on committee resolutions.",
      },
      {
        _id: "counc-1",
        name: "ড. আনিসুর রহমান",
        board: "council",
        designation: "একাডেমিক কাউন্সিলের সভাপতি",
        photoUrl: "/media/portrait-2.webp",
        phone: "01711-100006",
        bioBn: "পাঠ্যক্রম ও পরীক্ষার নীতি নিয়ে কাউন্সিলে আলোচনা করেন।",
        bioEn: "Leads curriculum and academic policy.",
      },
      {
        _id: "pta-1",
        name: "কামাল উদ্দিন",
        board: "pta",
        designation: "অভিভাবক কমিটির আহ্বায়ক",
        photoUrl: "/media/portrait-4.webp",
        phone: "01711-100011",
        bioBn: "অভিভাবক সভার তারিখ ও আলোচ্য বিষয় জানান।",
        bioEn: "Sets parent meetings and agenda.",
      },
      {
        _id: "pta-2",
        name: "শাহনাজ পারভীন",
        board: "pta",
        designation: "অভিভাবক প্রতিনিধি",
        photoUrl: "/media/portrait-5.webp",
        phone: "01711-100014",
        bioBn: "অভিভাবকদের মতামত তুলে ধরেন।",
        bioEn: "Brings family queries to the committee.",
      },
      {
        _id: "demo-accounts",
        name: "কাজী জহিরুল হক",
        board: "accounts",
        designation: "হিসাব কর্মকর্তা",
        photoUrl: "/media/portrait-3.webp",
        phone: "01711-100004",
        bioBn: "স্বচ্ছতা ও জবাবদিহিতার সাথে শিক্ষার্থীদের সকল হিসাব ও ফি সংক্রান্ত সেবা প্রদান করা হয়।",
        bioEn: "Serving all student accounts and fee collections with transparency.",
      },
      {
        _id: "demo-librarian",
        name: "রেহানা খাতুন",
        board: "librarian",
        designation: "গ্রন্থাগারিক",
        photoUrl: "/media/portrait-5.webp",
        phone: "01711-100003",
        bioBn: "পাঠাগারের বই, কার্ড ও পড়ার আসর পরিচালনা করেন।",
        bioEn: "Looks after books, library cards, and reading activities.",
      },
      {
        _id: "demo-admission",
        name: "ফারহানা চৌধুরী",
        board: "admission",
        designation: "ভর্তি শাখা",
        photoUrl: "/media/portrait-7.webp",
        phone: "01711-100005",
        bioBn: "ভর্তি আবেদন ও তথ্যসেবা প্রদান করেন।",
        bioEn: "Assists with admission processing and enquiries.",
      },
      {
        _id: "demo-exam",
        name: "জাহাঙ্গীর আলম",
        board: "exam",
        designation: "পরীক্ষা নিয়ন্ত্রক",
        photoUrl: "/media/portrait-6.webp",
        phone: "01711-100007",
        bioBn: "পরীক্ষার সময়সূচি ও ফলাফল প্রকাশের দায়িত্বে আছেন।",
        bioEn: "Manages exam scheduling and results.",
      },
      {
        _id: "fp-1",
        name: "ড. সামসুল হুদা",
        board: "former_principal",
        designation: "প্রতিষ্ঠাতা প্রধান শিক্ষক (১৯৯৮ - ২০০৮)",
        photoUrl: "/media/portrait-2.webp",
        bioBn: "প্রতিষ্ঠালগ্নে স্কুলের পাঠদান কার্যক্রম ও শৃঙ্খলার মজবুত ভিত্তি স্থাপন করেন।",
        bioEn: "Founding principal who laid the rock-solid foundation for discipline and pedagogy.",
      },
      {
        _id: "fp-2",
        name: "এম. এ. জলিল",
        board: "former_principal",
        designation: "সাবেক প্রধান শিক্ষক (২০০৮ - ২০১৮)",
        photoUrl: "/media/portrait-0.webp",
        bioBn: "দশ বছর নিষ্ঠার সাথে প্রতিষ্ঠানের প্রধান হিসেবে পাঠদান ও অবকাঠামো উন্নয়নে নেতৃত্ব দিয়েছেন।",
        bioEn: "Led the institution with distinction for ten years, fostering academic growth.",
      },
      {
        _id: "fp-3",
        name: "আলহাজ্ব নূর মোহাম্মদ",
        board: "former_principal",
        designation: "সাবেক প্রধান শিক্ষক (২০১৮ - ২০২২)",
        photoUrl: "/media/portrait-6.webp",
        bioBn: "আধুনিক বিজ্ঞানাগার ও ডিজিটাল ক্লাসরুম চালুকরণে বিশেষ অবদান রেখেছেন।",
        bioEn: "Spearheaded the integration of modern science laboratories and digital classrooms.",
      },
      {
        _id: "fp-4",
        name: "প্রফেসর এ. কে. এম. মোস্তফা",
        board: "former_principal",
        designation: "ভারপ্রাপ্ত প্রধান শিক্ষক (২০২২ - ২০২৩)",
        photoUrl: "/media/portrait-4.webp",
        bioBn: "করোনাকালীন অনলাইন শিক্ষা কার্যক্রম ও একাডেমিক সমন্বয় দক্ষতার সাথে পরিচালনা করেন।",
        bioEn: "Expertly managed academic coordination and remote learning transitions during the pandemic.",
      },
      {
        _id: "fpres-1",
        name: "প্রফেসর রফিকুল ইসলাম",
        board: "former_president",
        designation: "সাবেক সভাপতি, পরিচালনা পর্ষদ (২০০২ - ২০১২)",
        photoUrl: "/media/portrait-4.webp",
        bioBn: "ক্যাম্পাসের জমি অধিগ্রহণ ও মূল একাডেমিক ভবন নির্মাণে অসামান্য অবদান রাখেন।",
        bioEn: "Contributed immensely to land acquisition and the primary academic building construction.",
      },
      {
        _id: "fpres-2",
        name: "আলহাজ্ব শফিকুল ইসলাম",
        board: "former_president",
        designation: "সাবেক সভাপতি, পরিচালনা পর্ষদ (২০১২ - ২০২০)",
        photoUrl: "/media/portrait-6.webp",
        bioBn: "বিজ্ঞানাগার ও পাঠাগার সম্প্রসারণে অগ্রণী ভূমিকা পালন করেন।",
        bioEn: "Spearheaded the expansion of the modern science laboratory and library.",
      },
      {
        _id: "fpres-3",
        name: "প্রকৌশলী গোলাম মোস্তফা",
        board: "former_president",
        designation: "সাবেক সভাপতি, পরিচালনা পর্ষদ (২০২০ - ২০২৩)",
        photoUrl: "/media/portrait-2.webp",
        bioBn: "মাল্টিমিডিয়া ক্লাসরুম ও আধুনিক আইসিটি ল্যাব প্রতিষ্ঠায় আর্থিক ও কারিগরি সহায়তা দেন।",
        bioEn: "Provided extensive financial and technical sponsorship for modern multimedia ICT facilities.",
      },
      {
        _id: "fpres-4",
        name: "ব্যারিস্টার এনামুল করিম",
        board: "former_president",
        designation: "সাবেক সভাপতি, এডহক কমিটি (২০২৩ - ২০২৪)",
        photoUrl: "/media/portrait-0.webp",
        bioBn: "প্রতিষ্ঠানের প্রশাসনিক স্বচ্ছতা, আর্থিক শৃঙ্খলা ও সুশাসন প্রতিষ্ঠায় দিকনির্দেশনা প্রদান করেন।",
        bioEn: "Provided steering guidance on administrative transparency, financial discipline, and governance.",
      },
    ],
    donors: [
      {
        _id: "d1",
        donorName: "হাজী মোহাম্মদ ইউনুস",
        donorAddress: "ফটিকছড়ি, চট্টগ্রাম",
        donorPhone: "01819-102030",
        amount: 500000,
        purpose: "নতুন চারতলা একাডেমিক ভবন নির্মাণ তহবিল",
        academicYear: "2025",
        date: "2025-03-10T00:00:00.000Z",
      },
      {
        _id: "d2",
        donorName: "ইঞ্জিনিয়ার মোজাম্মেল হক",
        donorAddress: "ধানমন্ডি, ঢাকা",
        donorPhone: "01711-203040",
        amount: 350000,
        purpose: "ডিজিটাল কম্পিউটার ল্যাব ও আইসিটি সরঞ্জাম অনুদান",
        academicYear: "2025",
        date: "2025-06-15T00:00:00.000Z",
      },
      {
        _id: "d3",
        donorName: "ডা. সৈয়দা তাসমিন জাহান",
        donorAddress: "পাঁচলাইশ, চট্টগ্রাম",
        donorPhone: "01912-304050",
        amount: 250000,
        purpose: "মেধাবী ও অসচ্ছল ছাত্রবৃত্তি তহবিল",
        academicYear: "2025",
        date: "2025-08-20T00:00:00.000Z",
      },
      {
        _id: "d4",
        donorName: "আলহাজ্ব আবুল কাশেম চৌধুরী",
        donorAddress: "মিরসরাই, চট্টগ্রাম",
        donorPhone: "01815-405060",
        amount: 180000,
        purpose: "বিজ্ঞানাগারের অত্যাধুনিক যন্ত্রপাতি ও উপকরণ",
        academicYear: "2025",
        date: "2025-11-05T00:00:00.000Z",
      },
      {
        _id: "d5",
        donorName: "ব্যারিস্টার তারেক মাহমুদ",
        donorAddress: "গুলশান-২, ঢাকা",
        donorPhone: "01715-506070",
        amount: 150000,
        purpose: "কেন্দ্রীয় পাঠাগারের বই ও বুকশেলফ অনুদান",
        academicYear: "2026",
        date: "2026-01-12T00:00:00.000Z",
      },
      {
        _id: "d6",
        donorName: "ফারুক আহমেদ",
        donorAddress: "নাজিরহাট, চট্টগ্রাম",
        donorPhone: "01822-607080",
        amount: 100000,
        purpose: "বার্ষিক ক্রীড়া ও সাংস্কৃতিক তহবিল",
        academicYear: "2026",
        date: "2026-02-18T00:00:00.000Z",
      },
    ],
    pages: Object.entries(PAGES).map(([slug, item]) => ({
      _id: slug,
      slug,
      menuKey: item.menuKey,
      titleBn: item.titleBn,
      titleEn: item.titleEn,
      summaryBn: item.summaryBn,
      summaryEn: item.summaryEn,
      seoDescriptionBn: item.seoDescriptionBn,
      seoDescriptionEn: item.seoDescriptionEn,
      blocks: [{ type: "paragraph", textBn: item.textBn, textEn: item.textEn }],
    })),
    albums: [
      { _id: "album-campus", titleBn: "ক্যাম্পাস ও পরিবেশ", titleEn: "Campus and Environment", kind: "campus", coverUrl: "/media/campus.webp", imageCount: 4, videoCount: 0 },
      { _id: "album-science", titleBn: "বিজ্ঞান ও কম্পিউটার ল্যাব", titleEn: "Science and Computer Lab", kind: "science", coverUrl: "/media/science.webp", imageCount: 3, videoCount: 0 },
      { _id: "album-sports", titleBn: "খেলাধুলা ও সংস্কৃতি", titleEn: "Sports and Culture", kind: "sports", coverUrl: "/media/sports.webp", imageCount: 4, videoCount: 0 },
    ],
    videos: [],
    files: [],
  };
}

export function legacyPage(slug: string): PageDetail | null {
  const item = PAGES[slug];
  if (!item) return null;
  return {
    _id: slug,
    slug,
    menuKey: item.menuKey,
    titleBn: item.titleBn,
    titleEn: item.titleEn,
    summaryBn: item.summaryBn,
    summaryEn: item.summaryEn,
    seoDescriptionBn: item.seoDescriptionBn,
    seoDescriptionEn: item.seoDescriptionEn,
    blocks: [{ type: "paragraph", textBn: item.textBn, textEn: item.textEn }],
  };
}
