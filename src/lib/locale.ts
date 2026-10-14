import { cache } from "react";
import { cookies } from "next/headers";
import type { Lang } from "./types";

export const getLang = cache(async (): Promise<Lang> => {
  const jar = await cookies();
  return jar.get("lang")?.value === "en" ? "en" : "bn";
});
