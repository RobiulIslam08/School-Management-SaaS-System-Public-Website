import type { Lang } from "./types";

export const LANGS: readonly Lang[] = ["bn", "en"];
export const LANG_COOKIE = "lang";

export type LangParams = Promise<{ lang: string }>;
export type LangProps = { params: LangParams };

export function toLang(value?: string | null): Lang {
  return value === "en" ? "en" : "bn";
}

/** Language comes from the hidden `[lang]` segment (set by `src/proxy.ts`), never from cookies, so pages stay static. */
export async function getLang(params: Promise<{ lang?: string }>): Promise<Lang> {
  const { lang } = await params;
  return toLang(lang);
}
