import type { NoticeItem, PageDetail, PostItem, PublicSite } from "./types";

function origin(): string {
  return (process.env.API_PROXY_URL ?? "http://localhost:4000").replace(/\/$/, "");
}

async function read<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${origin()}/api/v1${path}`, { next: { revalidate: 60 } });
    if (!response.ok) return null;
    const json = (await response.json()) as { data?: T };
    return json.data ?? null;
  } catch {
    return null;
  }
}

export function getSite(): Promise<PublicSite | null> {
  return read<PublicSite>("/public/website");
}

export function getPage(slug: string): Promise<PageDetail | null> {
  return read<PageDetail>(`/public/website/pages/${encodeURIComponent(slug)}`);
}

export function getPost(id: string): Promise<PostItem | null> {
  return read<PostItem>(`/public/website/posts/${encodeURIComponent(id)}`);
}

export function getNotices(): Promise<NoticeItem[] | null> {
  return read<NoticeItem[]>("/public/notices");
}

export function getNotice(id: string): Promise<NoticeItem | null> {
  return read<NoticeItem>(`/public/notices/${encodeURIComponent(id)}`);
}

export function safeColor(value: string | undefined, fallback: string): string {
  return value && /^#[0-9a-fA-F]{6}$/.test(value) ? value : fallback;
}
