import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const secret = request.headers.get("x-revalidate-secret");
  const expected = process.env.REVALIDATE_SECRET;
  if (expected && secret && secret !== expected) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }
  revalidateTag("public-site", { expire: 0 });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, revalidated: true });
}
