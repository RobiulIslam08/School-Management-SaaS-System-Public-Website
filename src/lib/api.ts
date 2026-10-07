import { apiOrigin } from "./origin";
import { legacyPage, siteFromLegacy, type LegacyBranding } from "./site-fallback";
import type { ClassItem, NoticeItem, PageDetail, PostItem, PublicSite } from "./types";

async function read<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${apiOrigin()}/api/v1${path}`, { next: { revalidate: 60 } });
    if (!response.ok) return null;
    const json = (await response.json()) as { data?: T };
    return json.data ?? null;
  } catch {
    return null;
  }
}

export async function getSite(): Promise<PublicSite | null> {
  const site = await read<PublicSite>("/public/website");
  if (site?.school?.name) return site;
  const [branding, notices, classes] = await Promise.all([
    read<LegacyBranding>("/public/branding"),
    read<NoticeItem[]>("/public/notices"),
    read<ClassItem[]>("/public/classes"),
  ]);
  if (!branding) return null;
  return siteFromLegacy(branding, notices ?? [], classes ?? []);
}

export async function getPage(slug: string): Promise<PageDetail | null> {
  const page = await read<PageDetail>(`/public/website/pages/${encodeURIComponent(slug)}`);
  if (page) return page;
  const site = await read<PublicSite>("/public/website");
  if (site?.school?.name) return null;
  return legacyPage(slug);
}

export function getPost(id: string): Promise<PostItem | null> {
  return read<PostItem>(`/public/website/posts/${encodeURIComponent(id)}`);
}

export function getNotices(): Promise<NoticeItem[] | null> {
  return read<NoticeItem[]>("/public/notices");
}

export async function getNotice(id: string): Promise<NoticeItem | null> {
  const notice = await read<NoticeItem>(`/public/notices/${encodeURIComponent(id)}`);
  if (notice?._id) return notice;
  const list = await read<NoticeItem[]>("/public/notices");
  return list?.find((item) => item._id === id) ?? null;
}

export function safeColor(value: string | undefined, fallback: string): string {
  return value && /^#[0-9a-fA-F]{6}$/.test(value) ? value : fallback;
}
