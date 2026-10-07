import { NextRequest, NextResponse } from "next/server";

export function GET(request: NextRequest) {
  const lang = request.nextUrl.searchParams.get("lang") === "en" ? "en" : "bn";
  const next = request.nextUrl.searchParams.get("next") || request.headers.get("referer") || "/";
  const target = next.startsWith("/") ? next : "/";
  const response = NextResponse.redirect(new URL(target, request.url));
  response.cookies.set("lang", lang, { path: "/", sameSite: "lax" });
  return response;
}
