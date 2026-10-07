import type { MetadataRoute } from "next";
import { getSite } from "@/lib/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001";
  const site = await getSite();
  const paths = ["", "/about", "/admission", "/admission/apply", "/academic", "/academic/classes", "/academic/teachers", "/academic/routine", "/academic/syllabus", "/results", "/authorities", "/office", "/students", "/contact", "/notices", "/news", "/gallery"];
  const pages = (site?.pages ?? []).map((page) => {
    const section = page.menuKey === "about" || page.menuKey === "admission" || page.menuKey === "academic" || page.menuKey === "students" ? page.menuKey : "about";
    return `/${section}/${page.slug}`;
  });
  return [...paths, ...pages].map((path) => ({ url: `${siteUrl}${path}`, changeFrequency: "weekly" as const }));
}
