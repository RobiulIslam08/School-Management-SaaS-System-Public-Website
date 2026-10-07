import type { Metadata } from "next";
import { Fraunces, Noto_Sans_Bengali } from "next/font/google";
import { getSite, safeColor } from "@/lib/api";
import { getLang } from "@/lib/locale";
import { pick } from "@/lib/text";
import "./globals.css";

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
  const lang = await getLang();
  const name = site?.school.name ?? "School";
  const description = pick(lang, site?.config.seoDescriptionBn, site?.config.seoDescriptionEn) || name;
  return {
    title: { default: name, template: `%s · ${name}` },
    description,
    openGraph: { title: name, description, locale: lang === "bn" ? "bn_BD" : "en_US" },
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
  const lang = await getLang();
  return (
    <html lang={lang} className={`${noto.variable} ${display.variable}`}>
      <body className="min-h-screen antialiased">
        <style>{`:root{--brand:${brand};--on-brand:${onBrand};--paper:${paper};--ink:${ink};--accent:${accent};--card:#fffdf8}`}</style>
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
