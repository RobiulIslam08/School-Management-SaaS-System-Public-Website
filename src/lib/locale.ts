import { cookies } from "next/headers";
import type { Lang } from "./types";

export async function getLang(): Promise<Lang> {
  const jar = await cookies();
  return jar.get("lang")?.value === "en" ? "en" : "bn";
}
