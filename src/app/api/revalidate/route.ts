import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const secret = request.headers.get("x-revalidate-secret");
  const expected = process.env.REVALIDATE_SECRET;
  if (!expected || secret !== expected) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }
  // Next.js 16 requires a cacheLife profile; expire:0 for immediate bust from CMS webhook
  revalidateTag("public-site", { expire: 0 });
  return NextResponse.json({ ok: true, revalidated: true });
}
