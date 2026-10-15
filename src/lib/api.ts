import { cache } from "react";
import { apiOrigin } from "./origin";
import { legacyPage, siteFromLegacy } from "./site-fallback";
import type { NoticeItem, PageDetail, PostItem, PublicSite } from "./types";

async function read<T>(path: string): Promise<T | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 2000);
  try {
    const response = await fetch(`${apiOrigin()}/api/v1${path}`, {
      next: { revalidate: 60 },
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!response.ok) return null;
    const json = (await response.json()) as { data?: T };
    return json.data ?? null;
  } catch {
    clearTimeout(timer);
    return null;
  }
}

export const getSite = cache(async (): Promise<PublicSite> => {
  const site = await read<PublicSite>("/public/website");
  if (site?.school?.name) {
    if (!site.config.heroImageUrl) {
      site.config.heroImageUrl = site.albums?.[0]?.coverUrl || "/media/campus.webp";
    }
    if (!site.config.principalPhotoUrl) {
      const principal = site.people?.find((p) => p.board === "principal");
      site.config.principalPhotoUrl = principal?.photoUrl || "/media/portrait-0.webp";
    }
    return site;
  }
  return siteFromLegacy({}, [], []);
});

export const getPage = cache(async (slug: string): Promise<PageDetail | null> => {
  const page = await read<PageDetail>(`/public/website/pages/${encodeURIComponent(slug)}`);
  if (page) return page;
  return legacyPage(slug);
});

export const getPost = cache((id: string): Promise<PostItem | null> => {
  return read<PostItem>(`/public/website/posts/${encodeURIComponent(id)}`);
});

export const getNotices = cache((): Promise<NoticeItem[] | null> => {
  return read<NoticeItem[]>("/public/notices");
});

export const getNotice = cache(async (id: string): Promise<NoticeItem | null> => {
  const notice = await read<NoticeItem>(`/public/notices/${encodeURIComponent(id)}`);
  if (notice?._id) return notice;
  const list = await read<NoticeItem[]>("/public/notices");
  return list?.find((item) => item._id === id) ?? null;
});

export function safeColor(value: string | undefined, fallback: string): string {
  return value && /^#[0-9a-fA-F]{6}$/.test(value) ? value : fallback;
}
