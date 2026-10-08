import Link from "next/link";
import type { ReactNode } from "react";
import { MobileTasks } from "@/components/mobile-tasks";
import { SiteNav } from "@/components/site-nav";
import type { Lang, PublicSite } from "@/lib/types";
import { resolvePhoto } from "@/lib/media";
import { pick } from "@/lib/text";

const DASHBOARD = process.env.NEXT_PUBLIC_DASHBOARD_URL ?? "http://localhost:3000";

export function Shell({ site, lang, children }: { site: PublicSite; lang: Lang; children: ReactNode }) {
  const { school, config } = site;
  const login = `${DASHBOARD}/login`;
  return (
    <>
      <a className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-card focus:px-3 focus:py-2" href="#content">
        {lang === "bn" ? "মূল অংশে যান" : "Skip to content"}
      </a>
      <header className="site-header sticky top-0 z-40">
        <div className="utility-bar">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4">
            <div className="flex min-w-0 items-center gap-3">
              {school.eiin ? <span className="seal-chip">EIIN {school.eiin}</span> : <span className="truncate">{school.name}</span>}
              {school.academicYear ? <span className="hidden sm:inline">{school.academicYear}</span> : null}
              {config.phone ? (
                <a className="hidden truncate md:inline" href={`tel:${config.phone.replace(/\s/g, "")}`}>
                  {config.phone}
                </a>
              ) : null}
            </div>
            <div className="utility-actions">
              <Link href={`/locale?lang=${lang === "bn" ? "en" : "bn"}`}>{lang === "bn" ? "English" : "বাংলা"}</Link>
              <span className="utility-rule" aria-hidden="true" />
              <a href={login}>{lang === "bn" ? "লগইন" : "Login"}</a>
            </div>
          </div>
        </div>
        <div className="masthead">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4">
            <Link href="/" className="brand-lockup">
              <span className="brand-seal">
                {school.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={school.logoUrl} alt="" />
                ) : (
                  <span>{school.name.slice(0, 1)}</span>
                )}
              </span>
              <span className="min-w-0">
                <span className="display brand-name">{school.name}</span>
                {school.motto ? <span className="brand-motto">{school.motto}</span> : null}
              </span>
            </Link>
            <SiteNav menus={config.menus} lang={lang} schoolName={school.name} mark={school.name.slice(0, 1)} />
          </div>
        </div>
      </header>
      <main id="content" className="pb-24 lg:pb-0">
        {children}
      </main>
      <footer className="site-footer">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 md:grid-cols-[minmax(0,16rem)_1fr]">
          <div>
            <p className="display text-xl font-semibold text-brand">{school.name}</p>
            {school.address ? <p className="mt-2 text-sm text-muted">{school.address}</p> : null}
            {config.officeHours ? <p className="mt-2 text-sm">{config.officeHours}</p> : null}
            {config.phone ? <p className="mt-1 text-sm font-semibold text-brand">{config.phone}</p> : null}
            <div className="mt-3 flex gap-4 text-sm font-semibold text-brand">
              {config.facebook ? <a href={config.facebook}>Facebook</a> : null}
              {config.youtube ? <a href={config.youtube}>YouTube</a> : null}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-6 text-sm sm:grid-cols-3 lg:grid-cols-4">
            <div>
              <p className="font-semibold text-brand">{lang === "bn" ? "দ্রুত" : "Tasks"}</p>
              <ul className="mt-2 space-y-1 text-muted">
                <li><Link href="/">{lang === "bn" ? "হোম" : "Home"}</Link></li>
                <li><Link href="/results">{lang === "bn" ? "ফলাফল" : "Results"}</Link></li>
                <li><Link href="/admission/apply">{lang === "bn" ? "ভর্তি আবেদন" : "Apply"}</Link></li>
                <li><Link href="/notices">{lang === "bn" ? "নোটিশ" : "Notices"}</Link></li>
                <li><Link href="/contact">{lang === "bn" ? "যোগাযোগ" : "Contact"}</Link></li>
              </ul>
            </div>
            {config.menus
              .filter((item) => item.visible !== false && item.key !== "login" && item.children.some((child) => child.visible !== false))
              .map((item) => (
                <div key={item.key}>
                  <Link className="font-semibold text-brand" href={item.href}>
                    {pick(lang, item.labelBn, item.labelEn)}
                  </Link>
                  <ul className="mt-2 space-y-1 text-muted">
                    {item.children
                      .filter((child) => child.visible !== false)
                      .map((child) => (
                        <li key={child.key}>
                          <Link href={child.href}>{pick(lang, child.labelBn, child.labelEn)}</Link>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
          </div>
        </div>
      </footer>
      <MobileTasks lang={lang} />
    </>
  );
}

export function Crest({ label }: { label: string }) {
  return (
    <div className="crest text-xs font-semibold uppercase tracking-[0.2em] text-accent">
      <i />
      <span>{label}</span>
      <i />
    </div>
  );
}

export function PageIntro({
  kicker,
  title,
  summary,
  image,
  alt,
}: {
  kicker: string;
  title: string;
  summary?: string;
  image?: string;
  alt?: string;
}) {
  if (image) {
    return (
      <header>
        <div className="page-banner">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={resolvePhoto(image)} alt={alt || ""} />
        </div>
        <div className="page-banner-card">
          <Crest label={kicker} />
          <h1 className="display mt-2 max-w-3xl text-2xl font-semibold leading-tight text-brand md:text-4xl">{title}</h1>
          {summary ? <p className="mt-2 max-w-2xl text-sm text-muted md:text-base">{summary}</p> : null}
        </div>
      </header>
    );
  }
  return (
    <header className="mx-auto max-w-7xl px-4 py-8">
      <Crest label={kicker} />
      <h1 className="display mt-3 max-w-3xl text-2xl font-semibold leading-tight md:text-4xl">{title}</h1>
      {summary ? <p className="mt-2 max-w-2xl text-sm text-muted md:text-base">{summary}</p> : null}
    </header>
  );
}
