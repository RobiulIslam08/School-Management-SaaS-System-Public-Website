import { cache } from "react";
import { apiOrigin } from "./origin";
import { legacyPage, siteFromLegacy, type LegacyBranding } from "./site-fallback";
import type { NoticeItem, PageDetail, PostItem, PublicSite } from "./types";

const SITE_TTL_MS = 15_000;
let siteMemoryCache: { data: PublicSite; expiresAt: number } | null = null;
let siteInFlight: Promise<PublicSite> | null = null;

export function clearLocalSiteCache(): void {
  siteMemoryCache = null;
}

async function read<T>(path: string, revalidateSeconds = 30): Promise<T | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(`${apiOrigin()}/api/v1${path}`, {
      next: { revalidate: revalidateSeconds, tags: ["public-site"] },
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

async function fetchSiteBundle(): Promise<PublicSite> {
  const site = await read<PublicSite>("/public/website", 30);
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
  const branding = await read<LegacyBranding>("/public/branding", 30);
  return siteFromLegacy(branding ?? {}, [], []);
}

export const getSite = cache(async (): Promise<PublicSite> => {
  const now = Date.now();
  if (siteMemoryCache && siteMemoryCache.expiresAt > now) {
    return siteMemoryCache.data;
  }
  if (!siteInFlight) {
    siteInFlight = fetchSiteBundle()
      .then((data) => {
        siteMemoryCache = { data, expiresAt: Date.now() + SITE_TTL_MS };
        siteInFlight = null;
        return data;
      })
      .catch((err) => {
        siteInFlight = null;
        throw err;
      });
  }
  return siteInFlight;
});

export const getPage = cache(async (slug: string): Promise<PageDetail | null> => {
  const site = await getSite();
  const inBundle = site.pages?.find((p) => p.slug === slug);
  if (inBundle && Array.isArray(inBundle.blocks) && inBundle.blocks.length > 0) {
    return {
      ...inBundle,
      blocks: inBundle.blocks,
    };
  }
  const page = await read<PageDetail>(`/public/website/pages/${encodeURIComponent(slug)}`, 60);
  if (page) return page;
  return legacyPage(slug);
});

export const getPost = cache(async (id: string): Promise<PostItem | null> => {
  const site = await getSite();
  const inBundle = site.posts?.find((p) => p._id === id);
  if (inBundle) return inBundle;
  return read<PostItem>(`/public/website/posts/${encodeURIComponent(id)}`, 60);
});

export const getNotices = cache(async (): Promise<NoticeItem[] | null> => {
  const site = await getSite();
  if (site.notices?.length) return site.notices;
  return read<NoticeItem[]>("/public/notices", 30);
});

export const getNotice = cache(async (id: string): Promise<NoticeItem | null> => {
  const site = await getSite();
  const inBundle = site.notices?.find((item) => item._id === id);
  if (inBundle?._id) return inBundle;
  const notice = await read<NoticeItem>(`/public/notices/${encodeURIComponent(id)}`, 60);
  if (notice?._id) return notice;
  const list = await read<NoticeItem[]>("/public/notices", 30);
  return list?.find((item) => item._id === id) ?? null;
});

export function safeColor(value: string | undefined, fallback: string): string {
  return value && /^#[0-9a-fA-F]{6}$/.test(value) ? value : fallback;
}
