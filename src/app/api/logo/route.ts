import { getSite } from "@/lib/api";

const MAX_BYTES = 2 * 1024 * 1024;

/** Serves the school logo from this origin so first paint never waits on a third-party image host. */
export async function GET() {
  const site = await getSite().catch(() => null);
  const source = site?.school.logoUrl?.trim() ?? "";
  if (!/^https?:\/\//i.test(source)) return new Response(null, { status: 404 });

  const upstream = await fetch(source, { next: { revalidate: 3600 } }).catch(() => null);
  const type = upstream?.headers.get("content-type") ?? "";
  if (!upstream?.ok || !type.startsWith("image/")) return Response.redirect(source, 302);

  const body = await upstream.arrayBuffer();
  if (body.byteLength > MAX_BYTES) return Response.redirect(source, 302);

  return new Response(body, {
    headers: {
      "Content-Type": type,
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; sandbox",
    },
  });
}
