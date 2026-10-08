export type Lang = "bn" | "en";

export interface MenuChild {
  key: string;
  href: string;
  labelBn: string;
  labelEn: string;
  visible: boolean;
}

export interface MenuItem extends MenuChild {
  locked?: boolean;
  children: MenuChild[];
}

export interface ThemeTokens {
  preset: string;
  primary: string;
  onPrimary: string;
  accent: string;
  surface: string;
  ink: string;
  radius: string;
}

export interface WhyItem {
  titleBn?: string;
  titleEn?: string;
  bodyBn?: string;
  bodyEn?: string;
}

export interface StatItem {
  labelBn?: string;
  labelEn?: string;
  value?: string;
}

export interface TaskCopy {
  titleBn?: string;
  titleEn?: string;
  bodyBn?: string;
  bodyEn?: string;
}

export interface DeskCopy {
  key: string;
  noteBn?: string;
  noteEn?: string;
  dutiesBn?: string[];
  dutiesEn?: string[];
  visitBn?: string[];
  visitEn?: string[];
}

export interface NoticeItem {
  _id: string;
  title: string;
  body?: string;
  refNo?: string;
  issueDate?: string;
  category?: string;
  pinned?: boolean;
  signatories?: Array<{ name?: string; designation?: string }>;
}

export interface PostItem {
  _id: string;
  kind: "news" | "event" | "program";
  titleBn?: string;
  titleEn?: string;
  bodyBn?: string;
  bodyEn?: string;
  coverUrl?: string;
  coverAlt?: string;
  eventDate?: string;
  pinned?: boolean;
  seoDescriptionBn?: string;
  seoDescriptionEn?: string;
}

export interface ClassItem {
  _id: string;
  name: string;
  code: string;
  group?: string;
  level?: number;
  sections: string[];
  subjects: Array<{ name: string; nameBn: string; code: string; group: string }>;
}

export interface TeacherItem {
  _id: string;
  name: string;
  designation?: string;
  photoUrl?: string;
  phone?: string;
}

export interface PersonItem {
  _id: string;
  board: string;
  name: string;
  designation?: string;
  photoUrl?: string;
  bioBn?: string;
  bioEn?: string;
  phone?: string;
}

export interface PageSummary {
  _id: string;
  slug: string;
  menuKey: string;
  titleBn?: string;
  titleEn?: string;
  summaryBn?: string;
  summaryEn?: string;
}

export interface PageBlock {
  type: "paragraph" | "list" | "image" | "heading";
  textBn?: string;
  textEn?: string;
  itemsBn?: string[];
  itemsEn?: string[];
  imageUrl?: string;
  alt?: string;
}

export interface PageDetail extends PageSummary {
  blocks: PageBlock[];
  seoDescriptionBn?: string;
  seoDescriptionEn?: string;
}

export interface AlbumItem {
  _id: string;
  titleBn?: string;
  titleEn?: string;
  kind?: string;
  coverUrl?: string;
  imageCount?: number;
  videoCount?: number;
}

export interface VideoItem {
  _id: string;
  albumId?: string;
  videoUrl?: string;
  alt?: string;
  captionBn?: string;
  captionEn?: string;
  albumTitleBn?: string;
  albumTitleEn?: string;
}

export interface MediaItem {
  _id: string;
  kind: "image" | "video";
  url?: string;
  videoUrl?: string;
  alt?: string;
  captionBn?: string;
  captionEn?: string;
}

export interface FileItem {
  _id: string;
  kind: string;
  titleBn?: string;
  titleEn?: string;
  filename?: string;
  academicYear?: string;
}

export interface PublicSite {
  school: {
    name: string;
    logoUrl: string;
    motto: string;
    address: string;
    eiin: string;
    establishedYear: number | null;
    academicYear: string;
  };
  config: {
    phone: string;
    email: string;
    officeHours: string;
    mapEmbedUrl: string;
    facebook: string;
    youtube: string;
    theme: ThemeTokens;
    heroTitleBn: string;
    heroTitleEn: string;
    heroSubtitleBn: string;
    heroSubtitleEn: string;
    heroImageUrl: string;
    heroVideoUrl: string;
    whyChooseUs: WhyItem[];
    stats: StatItem[];
    principalName: string;
    principalDesignation: string;
    principalPhotoUrl: string;
    principalQuoteBn: string;
    principalQuoteEn: string;
    homeIntroBn: string;
    homeIntroEn: string;
    tasks: TaskCopy[];
    admitTitleBn: string;
    admitTitleEn: string;
    admitBodyBn: string;
    admitBodyEn: string;
    desks: DeskCopy[];
    resultLookupEnabled: boolean;
    receiptLookupEnabled: boolean;
    publicAdmission: boolean;
    meritListEnabled: boolean;
    seoDescriptionBn: string;
    seoDescriptionEn: string;
    menus: MenuItem[];
  };
  notices: NoticeItem[];
  posts: PostItem[];
  teachers: TeacherItem[];
  classes: ClassItem[];
  people: PersonItem[];
  pages: PageSummary[];
  albums: AlbumItem[];
  videos: VideoItem[];
  files: FileItem[];
}
