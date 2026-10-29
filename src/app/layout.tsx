import type { Metadata } from "next";
import { Fraunces, Noto_Sans_Bengali } from "next/font/google";
import { Suspense } from "react";
import { HtmlLang } from "@/components/html-lang";
import { RouteProgress } from "@/components/route-progress";
import { ThemeSync } from "@/components/theme-sync";
import { getSite, safeColor } from "@/lib/api";
import { pick } from "@/lib/text";
import "./globals.css";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function hexToRgb(hex: string): string {
  const clean = hex.replace("#", "");
  const normalized = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const num = parseInt(normalized, 16);
  if (isNaN(num)) return "20, 83, 45";
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `${r}, ${g}, ${b}`;
}

const noto = Noto_Sans_Bengali({
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto",
  display: "swap",
});

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  const name = site?.school.name ?? "School";
  const description = pick("bn", site?.config.seoDescriptionBn, site?.config.seoDescriptionEn) || name;
  return {
    title: { default: name, template: `%s · ${name}` },
    description,
    other: {
      "color-scheme": "light",
    },
    openGraph: { title: name, description, locale: "bn_BD" },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const site = await getSite();
  const theme = site?.config.theme;
  const brand = safeColor(theme?.primary, "#14532d");
  const onBrand = safeColor(theme?.onPrimary, "#ffffff");
  const paper = safeColor(theme?.surface, "#f6f3ec");
  const ink = safeColor(theme?.ink, "#1c1917");
  const accent = safeColor(theme?.accent, "#8a6a32");
  const brandRgb = hexToRgb(brand);
  const accentRgb = hexToRgb(accent);
  const paperRgb = hexToRgb(paper);
  const inkRgb = hexToRgb(ink);

  return (
    <html
      lang="bn"
      translate="no"
      className={`notranslate ${noto.variable} ${display.variable}`}
      style={
        {
          colorScheme: "light",
          "--brand": brand,
          "--brand-rgb": brandRgb,
          "--on-brand": onBrand,
          "--paper": paper,
          "--paper-rgb": paperRgb,
          "--ink": ink,
          "--ink-rgb": inkRgb,
          "--accent": accent,
          "--accent-rgb": accentRgb,
        } as React.CSSProperties
      }
    >
      <head>
        <meta name="color-scheme" content="light" />
        <link rel="preload" as="image" href="/media/campus.webp" fetchPriority="high" />
      </head>
      <body className="min-h-screen antialiased">
        <HtmlLang />
        <style id="school-theme-vars">{`:root{color-scheme:light;--brand:${brand};--brand-rgb:${brandRgb};--on-brand:${onBrand};--paper:${paper};--paper-rgb:${paperRgb};--ink:${ink};--ink-rgb:${inkRgb};--accent:${accent};--accent-rgb:${accentRgb};--card:#fffdf8;--card-rgb:255, 253, 248;}`}</style>
        <Suspense fallback={null}>
          <ThemeSync initialPrimary={brand} />
          <RouteProgress />
        </Suspense>
        {site ? (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "EducationalOrganization",
                name: site.school.name,
                address: site.school.address,
                telephone: site.config.phone,
                url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001",
              }).replace(/</g, "\\u003c"),
            }}
          />
        ) : null}
        {children}
      </body>
    </html>
  );
}
