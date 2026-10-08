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
      { key: "eligibility", href: "/admission/eligibility", labelBn: "যোগ্যতা ও আসন", labelEn: "Eligibility and seats", visible: true },
      { key: "documents", href: "/admission/documents", labelBn: "প্রয়োজনীয় কাগজ", labelEn: "Required documents", visible: true },
      { key: "fees-info", href: "/admission/fees-info", labelBn: "ফি তথ্য", labelEn: "Fee information", visible: true },
      { key: "apply", href: "/admission/apply", labelBn: "অনলাইন আবেদন", labelEn: "Online application", visible: true },
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
      { key: "calendar", href: "/academic/calendar", labelBn: "একাডেমিক ক্যালেন্ডার", labelEn: "Academic calendar", visible: true },
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
      { key: "governing", href: "/authorities/governing", labelBn: "পরিচালনা পর্ষদ", labelEn: "Governing body", visible: true },
      { key: "council", href: "/authorities/council", labelBn: "একাডেমিক কাউন্সিল", labelEn: "Academic council", visible: true },
      { key: "syndicate", href: "/authorities/syndicate", labelBn: "সিন্ডিকেট", labelEn: "Syndicate", visible: true },
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
      { key: "vice", href: "/office/vice", labelBn: "সহকারী প্রধান শিক্ষক", labelEn: "Vice principal", visible: true },
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

export function siteFromLegacy(branding: LegacyBranding, notices: NoticeItem[], classes: LegacyClass[]): PublicSite | null {
  const name = (branding.name ?? "").trim();
  if (!name) return null;
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
      heroImageUrl: "",
      heroVideoUrl: "",
      whyChooseUs: [
        { titleBn: "নিয়মিত ক্লাস", titleEn: "Steady classes", bodyBn: "রুটিন অনুযায়ী ক্লাস ও বিষয়ভিত্তিক শিক্ষক।", bodyEn: "Classes follow the routine, with a teacher for each subject." },
        { titleBn: "প্রকাশিত ফলাফল", titleEn: "Published results", bodyBn: "পরীক্ষা প্রকাশের পর শিক্ষার্থী আইডি দিয়ে দেখা যায়।", bodyEn: "After an exam is published, families look it up with a student ID." },
        { titleBn: "স্পষ্ট ভর্তি", titleEn: "Clear admission", bodyBn: "যোগ্যতা, কাগজ ও ফি আগে থেকে লেখা থাকে।", bodyEn: "Eligibility, papers, and fees are written down before you apply." },
      ],
      stats: [],
      principalName: "",
      principalDesignation: "প্রধান শিক্ষক",
      principalPhotoUrl: "",
      principalQuoteBn: "আমাদের কাজ শিক্ষার্থীকে নিরাপদে শেখানো।",
      principalQuoteEn: "Our work is to teach students in a safe school.",
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
    teachers: [],
    classes: classes.map((item) => ({
      _id: item._id,
      name: item.name,
      code: item.code ?? "",
      group: item.group,
      level: classLevel(item.name),
      sections: item.sections ?? [],
      subjects: item.subjects ?? [],
    })),
    people: [],
    pages: Object.entries(PAGES).map(([slug, item]) => ({
      _id: slug,
      slug,
      menuKey: item.menuKey,
      titleBn: item.titleBn,
      titleEn: item.titleEn,
      summaryBn: item.summaryBn,
      summaryEn: item.summaryEn,
    })),
    albums: [],
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
