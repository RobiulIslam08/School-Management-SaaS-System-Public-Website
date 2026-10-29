import type { Metadata } from "next";
import { Fraunces, Noto_Sans_Bengali } from "next/font/google";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { RouteProgress } from "@/components/route-progress";
import { ThemeSync } from "@/components/theme-sync";
import { getSite } from "@/lib/api";
import { LANGS, type LangParams } from "@/lib/locale";
import { pick } from "@/lib/text";
import { resolveThemeVars, themeCss, themeStyle } from "@/lib/theme-vars";
import type { Lang } from "@/lib/types";
import "../globals.css";

export const revalidate = 60;
export const dynamicParams = true;

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
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

function langOf(value: string): Lang | null {
  return (LANGS as readonly string[]).includes(value) ? (value as Lang) : null;
}

export async function generateMetadata({ params }: { params: LangParams }): Promise<Metadata> {
  const lang = langOf((await params).lang) ?? "bn";
  const site = await getSite();
  const name = site?.school.name ?? "School";
  const description = pick(lang, site?.config.seoDescriptionBn, site?.config.seoDescriptionEn) || name;
  return {
    title: { default: name, template: `%s · ${name}` },
    description,
    other: {
      "color-scheme": "light",
    },
    openGraph: { title: name, description, locale: lang === "en" ? "en_US" : "bn_BD" },
  };
}

export default async function RootLayout({ children, params }: { children: React.ReactNode; params: LangParams }) {
  const lang = langOf((await params).lang);
  if (!lang) notFound();
  const site = await getSite();
  const vars = resolveThemeVars(site?.config.theme);

  return (
    <html
      lang={lang}
      translate="no"
      className={`notranslate ${noto.variable} ${display.variable}`}
      style={{ colorScheme: "light", ...themeStyle(vars) } as React.CSSProperties}
    >
      <head>
        <meta name="color-scheme" content="light" />
        <link rel="preload" as="image" href="/media/campus.webp" fetchPriority="high" />
      </head>
      <body className="min-h-screen antialiased">
        <style id="school-theme-vars">{themeCss(vars)}</style>
        <ThemeSync initialTheme={vars} />
        <Suspense fallback={null}>
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
