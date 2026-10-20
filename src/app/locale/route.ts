import { NextRequest, NextResponse } from "next/server";

/** Fallback for bookmarks / non-JS. UI uses client LangSwitcher + soft refresh. */
export function GET(request: NextRequest) {
  const lang = request.nextUrl.searchParams.get("lang") === "en" ? "en" : "bn";
  const raw = request.nextUrl.searchParams.get("next") || request.headers.get("referer") || "/";
  let path = "/";
  try {
    path = raw.startsWith("/") ? raw : new URL(raw).pathname + new URL(raw).search;
  } catch {
    path = "/";
  }
  if (path.startsWith("/locale")) path = "/";
  const response = NextResponse.redirect(new URL(path || "/", request.url));
  response.cookies.set("lang", lang, {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });
  return response;
}
