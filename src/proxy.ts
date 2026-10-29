import { NextResponse, type NextRequest } from "next/server";
import { LANG_COOKIE, toLang } from "@/lib/locale";

/**
 * Visitor URLs stay unprefixed (`/notices`); the `lang` cookie picks the prebuilt
 * `/[lang]/...` tree so every page can be served from the static/ISR cache.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (/^\/(bn|en)(\/|$)/.test(pathname)) return NextResponse.next();
  const lang = toLang(request.cookies.get(LANG_COOKIE)?.value);
  const url = request.nextUrl.clone();
  url.pathname = `/${lang}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!api|_next|media|locale|.*\\..*).*)"],
};
