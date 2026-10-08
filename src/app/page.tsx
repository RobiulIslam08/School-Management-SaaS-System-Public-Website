import Link from "next/link";
import { Crest, Shell } from "@/components/shell";
import { HeroStage } from "@/components/hero-media";
import { SitePhoto } from "@/components/site-photo";
import { getSite } from "@/lib/api";
import { getLang } from "@/lib/locale";
import { NoticeStamp, noticeLabel } from "@/components/notice-stamp";
import { dateParts, formatDay, pick } from "@/lib/text";
import type { ClassItem, Lang, MenuItem } from "@/lib/types";

function band(level: number | undefined): string {
  if (level === undefined || level <= 0) return "early";
  if (level <= 5) return "primary";
  if (level <= 8) return "junior";
  return "secondary";
}

const BANDS: Record<string, { bn: string; en: string }> = {
  early: { bn: "প্রাক-প্রাথমিক", en: "Early years" },
  primary: { bn: "প্রাথমিক", en: "Primary" },
  junior: { bn: "নিম্ন মাধ্যমিক", en: "Junior" },
  secondary: { bn: "মাধ্যমিক", en: "Secondary" },
};

function excerpt(value: string | undefined, max = 160): string {
  const clean = (value ?? "").replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max).trim()}…`;
}

const EXPLORE = ["history", "facilities", "achievements", "clubs", "student-life", "cocurricular"];
const DESK_BOARDS = ["principal", "admission", "accounts", "librarian"];
const FILE_KIND: Record<string, { bn: string; en: string }> = {
  syllabus: { bn: "সিলেবাস", en: "Syllabus" },
  routine: { bn: "রুটিন", en: "Routine" },
  prospectus: { bn: "প্রসপেক্টাস", en: "Prospectus" },
};

function pageHref(menus: MenuItem[], menuKey: string, slug: string): string {
  const scoped = menus.find((menu) => menu.key === menuKey);
  const child = scoped?.children.find((item) => item.key === slug && item.visible !== false);
  if (child) return child.href;
  for (const menu of menus) {
    const match = menu.children.find((item) => item.key === slug && item.visible !== false);
    if (match) return match.href;
  }
  return "/about";
}

function youtubeId(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === "youtu.be") return parsed.pathname.slice(1).split("/")[0] || "";
    if (parsed.hostname.endsWith("youtube.com")) return parsed.searchParams.get("v") || "";
  } catch {
    return "";
  }
  return "";
}

export default async function HomePage() {
  const [site, lang] = await Promise.all([getSite(), getLang()]);
  if (!site) {
    return <p className="p-8">The school site could not be loaded. Start the API and refresh.</p>;
  }
  const { school, config, notices, posts, teachers, classes, albums, pages, people, files, videos } = site;
  const news = posts.filter((item) => item.kind === "news");
  const events = posts.filter((item) => item.kind !== "news");
  const lead = news[0];
  const restNews = news.slice(1);
  const groups = ["early", "primary", "junior", "secondary"].filter((key) => classes.some((item) => band(item.level) === key));
  const whyAlbum = albums[0];
  const whyImage = whyAlbum?.coverUrl || config.heroImageUrl;
  const whyCaption = whyAlbum ? pick(lang, whyAlbum.titleBn, whyAlbum.titleEn) : (lang === "bn" ? "ক্যাম্পাস" : "Campus");
  const heroTitle = pick(lang, config.heroTitleBn, config.heroTitleEn) || school.name;
  const heroSubtitle = pick(lang, config.heroSubtitleBn, config.heroSubtitleEn) || school.motto;
  const bn = lang === "bn";
  const facts = [
    school.eiin ? { label: "EIIN", value: school.eiin } : null,
    school.address ? { label: bn ? "ঠিকানা" : "Address", value: school.address } : null,
    config.officeHours ? { label: bn ? "অফিস" : "Office", value: config.officeHours } : null,
    config.phone ? { label: bn ? "ফোন" : "Phone", value: config.phone } : null,
  ].filter((item): item is { label: string; value: string } => Boolean(item));
  const admitMeta = [config.officeHours, config.phone].filter(Boolean).join(" · ");
  const stories = EXPLORE.flatMap((slug) => {
    const page = pages.find((item) => item.slug === slug);
    if (!page) return [];
    const title = pick(lang, page.titleBn, page.titleEn);
    if (!title) return [];
    return [{ href: pageHref(config.menus, page.menuKey, page.slug), title, summary: pick(lang, page.summaryBn, page.summaryEn) }];
  });
  const seenFilm = new Set<string>();
  const heroUrl = config.heroVideoUrl.trim();
  const heroFilm = heroUrl
    ? [{
        _id: "hero-film",
        videoUrl: heroUrl,
        captionBn: "ক্যাম্পাস ভিডিও",
        captionEn: "Campus film",
        albumId: "",
        albumTitleBn: "",
        albumTitleEn: "",
        alt: school.name,
      }]
    : [];
  if (heroUrl) seenFilm.add(heroUrl);
  const films = [...heroFilm, ...videos.filter((item) => {
    const url = item.videoUrl || "";
    if (!url || seenFilm.has(url)) return false;
    seenFilm.add(url);
    return true;
  })].slice(0, 3);
  const downloads = files.filter((file) => FILE_KIND[file.kind]);
  const desks = DESK_BOARDS.flatMap((board) => {
    const person = people.find((item) => item.board === board);
    return person ? [person] : [];
  });
  const map = config.mapEmbedUrl.startsWith("https://") ? config.mapEmbedUrl : "";

  return (
    <Shell site={site} lang={lang}>
      {notices.length ? (
        <div className="ticker-bar">
          <p className="ticker-label">{bn ? "নোটিশ" : "Notice"}</p>
          <div className="ticker-window">
            <div className="ticker-track">
              {[0, 1].map((copy) => (
                <p key={copy} className="flex gap-10 px-6 py-2.5 text-sm">
                  {notices.slice(0, 5).map((notice) => (
                    <Link key={`${copy}-${notice._id}`} href={`/notices/${notice._id}`}>
                      {noticeLabel(lang, notice.category)} · {notice.title}
                    </Link>
                  ))}
                </p>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <HeroStage
        image={config.heroImageUrl}
        alt={school.name}
        seal={[school.eiin ? `EIIN ${school.eiin}` : "", school.academicYear || ""].filter(Boolean).join(" · ")}
      >
        <Crest label={school.academicYear || school.name} />
        {heroTitle !== school.name ? <p className="hero-kicker">{school.name}</p> : null}
        <h1 className="display mt-2 max-w-xl text-3xl font-semibold leading-tight text-brand md:text-[2.7rem]">{heroTitle}</h1>
        {heroSubtitle ? <p className="mt-3 max-w-lg text-sm text-muted md:text-base">{heroSubtitle}</p> : null}
        <div className="mt-5 flex flex-wrap gap-3">
          <Link className="btn btn-solid" href="/admission/apply">{bn ? "ভর্তি আবেদন" : "Apply"}</Link>
          <Link className="btn btn-line" href="/results">{bn ? "ফলাফল দেখুন" : "Results"}</Link>
        </div>
      </HeroStage>

      {facts.length ? (
        <div className="home-wrap hero-facts">
          <section className="fact-strip" aria-label={bn ? "স্কুলের পরিচয়" : "School facts"}>
            {facts.map((item) => (
              <p key={item.label}><span>{item.label}</span>{item.value}</p>
            ))}
          </section>
        </div>
      ) : null}

      <section className="home-wrap home-block">
        <div className="intro-panel">
          <p className="section-kicker">{bn ? "পরিচিতি" : "The school"}</p>
          <h2 className="section-title">{school.name}</h2>
          <p className="intro-copy">
            {pick(lang, config.homeIntroBn, config.homeIntroEn) ||
              (bn
                ? `${school.name} ${school.address ? `${school.address}-এ` : "ক্যাম্পাসে"} পড়াশোনা, নোটিশ, রুটিন ও সিলেবাস এই সাইটে রাখে। ভর্তি এক ফর্মে আবেদন, স্কুল অনুমোদন না করা পর্যন্ত ভর্তি নয়। ফির অঙ্ক ও আসন সংখ্যা অফিস জানায়। প্রকাশিত ফল আইডি দিয়ে দেখা যায়।`
                : `${school.name}${school.address ? ` at ${school.address}` : ""} keeps study notes, notices, the routine, and the syllabus on this site. Admission is one form, and it stays pending until the school approves it. Fee amounts and seat counts come from the office. A published result is read with an ID.`)}
          </p>
        </div>
      </section>

      <section className="home-wrap pb-4">
        <div className="task-grid">
          {[
            { href: "/results", kickerBn: "ফলাফল", kickerEn: "Results", task: config.tasks[0], brand: false },
            { href: "/admission/apply", kickerBn: "ভর্তি", kickerEn: "Apply", task: config.tasks[1], brand: true },
            { href: "/notices", kickerBn: "নোটিশ", kickerEn: "Notices", task: config.tasks[2], brand: false },
          ].map((item) => (
            <Link key={item.href} href={item.href} className={item.brand ? "task-card task-card-brand" : "task-card"}>
              <p className="section-kicker">{bn ? item.kickerBn : item.kickerEn}</p>
              <h2>{pick(lang, item.task?.titleBn, item.task?.titleEn)}</h2>
              <p className="task-copy">{pick(lang, item.task?.bodyBn, item.task?.bodyEn)}</p>
              <span className="task-go">{bn ? "খুলুন" : "Open"}</span>
            </Link>
          ))}
        </div>
      </section>

      {lead ? (
        <section className="home-wrap home-block">
          <div className="section-head">
            <div>
              <p className="section-kicker">{bn ? "খবর" : "News"}</p>
              <h2 className="section-title">{bn ? "ক্যাম্পাস থেকে" : "From campus"}</h2>
            </div>
            <Link className="section-link" href="/news">{bn ? "সব খবর" : "All news"}</Link>
          </div>
          <div className={restNews.length ? "news-layout" : "mt-6"}>
            <Link href={`/news/${lead._id}`} className="news-lead">
              <SitePhoto src={lead.coverUrl} alt={lead.coverAlt || pick(lang, lead.titleBn, lead.titleEn)} label={pick(lang, lead.titleBn, lead.titleEn)} />
              <div className="news-copy">
                {lead.eventDate ? <p className="section-kicker">{formatDay(lang, lead.eventDate)}</p> : <p className="section-kicker">{bn ? "শীর্ষ খবর" : "Lead"}</p>}
                <h3 className="display mt-1 text-xl font-semibold md:text-2xl">{pick(lang, lead.titleBn, lead.titleEn)}</h3>
                <p className="mt-2 text-sm text-muted">{excerpt(pick(lang, lead.bodyBn, lead.bodyEn))}</p>
              </div>
            </Link>
            {restNews.length ? (
              <div>
                <h3 className="section-kicker">{bn ? "আরও খবর" : "More"}</h3>
                <ul className="mt-2">
                  {restNews.map((item) => (
                    <li key={item._id}>
                      <Link href={`/news/${item._id}`} className="news-item">
                        <SitePhoto src={item.coverUrl} alt={item.coverAlt || pick(lang, item.titleBn, item.titleEn)} label={pick(lang, item.titleBn, item.titleEn)} />
                        <span>
                          <p className="font-semibold">{pick(lang, item.titleBn, item.titleEn)}</p>
                          {item.eventDate ? <p className="text-xs text-muted">{formatDay(lang, item.eventDate)}</p> : null}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      <section className="band-soft">
        <div className="home-wrap home-block grid gap-8 lg:grid-cols-2">
          <div className="sheet p-5 md:p-6">
            <div className="section-head">
              <div>
                <p className="section-kicker">{bn ? "বোর্ড" : "Board"}</p>
                <h2 className="section-title">{bn ? "নোটিশ" : "Notices"}</h2>
              </div>
              <Link className="section-link" href="/notices">{bn ? "সব নোটিশ" : "All notices"}</Link>
            </div>
            <ul className="mt-4">
              {notices.length ? notices.slice(0, 5).map((notice) => (
                <li key={notice._id}>
                  <Link href={`/notices/${notice._id}`} className="notice-row">
                    <NoticeStamp lang={lang} value={notice.issueDate} />
                    <span>
                      <span className="notice-meta">
                        <span className="notice-pill">{noticeLabel(lang, notice.category)}</span>
                        {notice.pinned ? <span className="notice-pill notice-pill-pin">{bn ? "আটকানো" : "Pinned"}</span> : null}
                      </span>
                      <strong>{notice.title}</strong>
                    </span>
                  </Link>
                </li>
              )) : <li className="py-6 text-sm text-muted">{bn ? "এখন প্রকাশিত নোটিশ নেই।" : "No notices yet."}</li>}
            </ul>
          </div>
          <div>
            <p className="section-kicker">{bn ? "দিনপঞ্জি" : "Calendar"}</p>
            <h2 className="section-title">{bn ? "অনুষ্ঠান" : "Programmes"}</h2>
            <ul className="programme-list">
              {events.length ? events.map((item) => {
                const when = dateParts(lang, item.eventDate);
                const title = pick(lang, item.titleBn, item.titleEn);
                return (
                  <li key={item._id}>
                    <Link href={`/news/${item._id}`} className="programme-card">
                      <p className="programme-date">
                        <strong>{when?.day || "—"}</strong>
                        <span>{when?.month || (bn ? "দিন" : "Day")}</span>
                      </p>
                      <span>
                        <p className="font-semibold">{title}</p>
                        <p className="mt-1 text-sm text-muted">{excerpt(pick(lang, item.bodyBn, item.bodyEn), 120)}</p>
                      </span>
                    </Link>
                  </li>
                );
              }) : <li className="text-sm text-muted">{bn ? "আসন্ন অনুষ্ঠান যোগ হলে এখানে দেখা যাবে।" : "Upcoming programmes will appear here."}</li>}
            </ul>
          </div>
        </div>
      </section>

      {(config.principalQuoteBn || config.principalQuoteEn) ? (
        <section className="band-brand">
          <div className="home-wrap home-block principal-layout">
            <figure className="principal-frame">
              <SitePhoto
                src={config.principalPhotoUrl}
                alt={config.principalName || (bn ? "প্রধান শিক্ষক" : "Principal")}
                label={config.principalName || (bn ? "প্রধান শিক্ষক" : "Principal")}
                className="principal-photo"
              />
              <figcaption className="principal-plate">
                <strong>{config.principalName || (bn ? "প্রধান শিক্ষক" : "Principal")}</strong>
                {config.principalDesignation ? <span>{config.principalDesignation}</span> : null}
              </figcaption>
            </figure>
            <blockquote>
              <p className="section-kicker">{bn ? "প্রধান শিক্ষকের বাণী" : "From the principal"}</p>
              <p className="display mt-3 text-xl leading-snug md:text-3xl">“{pick(lang, config.principalQuoteBn, config.principalQuoteEn)}”</p>
            </blockquote>
          </div>
        </section>
      ) : null}

      {config.whyChooseUs.length ? (
        <section className="home-wrap home-block grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="section-kicker">{bn ? "কারণ" : "Reasons"}</p>
            <h2 className="section-title">{bn ? "কেন এই স্কুল" : "Why this school"}</h2>
            <div className="why-grid">
              {config.whyChooseUs.map((item, index) => (
                <article key={index} className="why-card">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{pick(lang, item.titleBn, item.titleEn)}</h3>
                  <p>{pick(lang, item.bodyBn, item.bodyEn)}</p>
                </article>
              ))}
            </div>
          </div>
          {whyImage ? (
            <figure className="why-photo">
              <SitePhoto src={whyImage} alt={whyCaption} label={whyCaption} />
              <figcaption className="why-caption">{whyCaption}</figcaption>
            </figure>
          ) : null}
        </section>
      ) : null}

      {config.stats.length ? (
        <section className="stat-band" aria-label={bn ? "সংখ্যায় স্কুল" : "School in numbers"}>
          <div className="home-wrap home-block">
            <p className="section-kicker">{bn ? "এক নজরে" : "At a glance"}</p>
            <h2 className="section-title">{bn ? "সংখ্যায় স্কুল" : "The school in numbers"}</h2>
            <div className="stat-grid mt-6">
              {config.stats.map((item, index) => (
                <p key={index}>
                  <strong>{item.value}</strong>
                  <span>{pick(lang, item.labelBn, item.labelEn)}</span>
                </p>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {stories.length ? (
        <section className="home-wrap home-block">
          <div className="section-head">
            <div>
              <p className="section-kicker">{bn ? "ঘুরে দেখুন" : "Look around"}</p>
              <h2 className="section-title">{bn ? "স্কুলের গল্প" : "Stories of the school"}</h2>
            </div>
            <Link className="section-link" href="/about">{bn ? "আমাদের সম্পর্কে" : "About"}</Link>
          </div>
          <div className="explore-grid">
            {stories.map((story, index) => (
              <Link key={story.href} href={story.href} className="explore-card">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{story.title}</h3>
                {story.summary ? <p>{story.summary}</p> : null}
                <strong>{bn ? "পড়ুন" : "Read"}</strong>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <ClassBands classes={classes} groups={groups} lang={lang} />

      <section className="band-soft">
        <div className="home-wrap home-block">
          <div className="section-head">
            <div>
              <p className="section-kicker">{bn ? "পড়ার ডেস্ক" : "Study desk"}</p>
              <h2 className="section-title">{bn ? "আজ যা লাগতে পারে" : "What you may need today"}</h2>
            </div>
          </div>
          <div className="path-grid">
            <Link href="/academic/routine" className="path-card">
              <span>01</span>
              <h3>{bn ? "রুটিন" : "Routine"}</h3>
              <p>{bn ? "রবি থেকে বৃহস্পতি, ক্লাস ও শাখা বেছে সাপ্তাহিক ছক।" : "Sunday to Thursday. Pick a class and section for the week."}</p>
            </Link>
            <Link href="/academic/syllabus" className="path-card">
              <span>02</span>
              <h3>{bn ? "সিলেবাস" : "Syllabus"}</h3>
              <p>{bn ? "প্রতিটি বিষয়ের অধ্যায়। পিডিএফ থাকলে নামানো যায়।" : "Chapters for each subject, and a PDF when one is published."}</p>
            </Link>
            <Link href="/academic/calendar" className="path-card">
              <span>03</span>
              <h3>{bn ? "ক্যালেন্ডার" : "Calendar"}</h3>
              <p>{bn ? "ছুটি, পরীক্ষা ও শিক্ষাবর্ষের দিনপঞ্জি।" : "Holidays, exams, and the shape of the academic year."}</p>
            </Link>
            <Link href="/results" className="path-card">
              <span>04</span>
              <h3>{bn ? "ফলাফল" : "Results"}</h3>
              <p>{bn ? "প্রকাশিত পরীক্ষা শিক্ষার্থী আইডি দিয়ে।" : "A published exam, with a student ID."}</p>
            </Link>
            {config.receiptLookupEnabled ? (
              <Link href="/receipts" className="path-card">
                <span>05</span>
                <h3>{bn ? "রসিদ" : "Receipts"}</h3>
                <p>{bn ? "জমার ইতিহাস শিক্ষার্থী আইডি দিয়ে। রসিদ এই পাতা থেকে।" : "Payment history with a student ID. The receipt prints from this page."}</p>
              </Link>
            ) : null}
          </div>
          {downloads.length ? (
            <ul className="download-row">
              {downloads.map((file) => (
                <li key={file._id}>
                  <a href={`/api/v1/public/website/files/${file._id}`}>
                    <span>{bn ? FILE_KIND[file.kind].bn : FILE_KIND[file.kind].en}</span>
                    <strong>{pick(lang, file.titleBn, file.titleEn) || file.filename}</strong>
                    {file.academicYear ? <em>{file.academicYear}</em> : null}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </section>

      {teachers.length ? (
        <section className="home-wrap home-block">
          <div className="section-head">
            <div>
              <p className="section-kicker">{bn ? "কর্মীবৃন্দ" : "Faculty"}</p>
              <h2 className="section-title">{bn ? "শিক্ষক" : "Teachers"}</h2>
            </div>
            <Link className="section-link" href="/academic/teachers">{bn ? "সবাই" : "All"}</Link>
          </div>
          <div className="teacher-row">
            {teachers.slice(0, 10).map((teacher) => (
              <article key={teacher._id}>
                <div className="portrait">
                  <SitePhoto src={teacher.photoUrl} alt={teacher.name} label={teacher.name} />
                </div>
                <p className="mt-3 font-semibold">{teacher.name}</p>
                {teacher.designation ? <p className="text-xs text-muted">{teacher.designation}</p> : null}
                {teacher.phone ? <p className="text-xs text-brand">{teacher.phone}</p> : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {albums.length ? (
        <section className="home-wrap home-block">
          <div className="section-head">
            <div>
              <p className="section-kicker">{bn ? "ছবি" : "Pictures"}</p>
              <h2 className="section-title">{bn ? "গ্যালারি" : "Gallery"}</h2>
            </div>
            <Link className="section-link" href="/gallery">{bn ? "সব অ্যালবাম" : "All albums"}</Link>
          </div>
          <div className="gallery-grid">
            {albums.map((album) => {
              const title = pick(lang, album.titleBn, album.titleEn);
              return (
                <Link key={album._id} href={`/gallery/${album._id}`} className="gallery-tile">
                  <SitePhoto src={album.coverUrl} alt={title} label={title} />
                  <span className="gallery-caption">{title}</span>
                </Link>
              );
            })}
          </div>
        </section>
      ) : null}

      {films.length ? (
        <section className="home-wrap home-block">
          <div className="section-head">
            <div>
              <p className="section-kicker">{bn ? "চলচ্চিত্র" : "Film"}</p>
              <h2 className="section-title">{bn ? "ক্যাম্পাস দেখুন" : "Watch the campus"}</h2>
            </div>
            <Link className="section-link" href="/gallery">{bn ? "সব ভিডিও" : "All films"}</Link>
          </div>
          <div className="film-grid">
            {films.map((film) => {
              const caption = pick(lang, film.captionBn, film.captionEn) || pick(lang, film.albumTitleBn, film.albumTitleEn);
              const id = youtubeId(film.videoUrl || "");
              const thumb = id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : "";
              return (
                <Link key={film._id} href={film.albumId ? `/gallery/${film.albumId}` : "/gallery"} className="film-card">
                  <SitePhoto src={thumb} alt={film.alt || caption || (bn ? "ক্যাম্পাস ভিডিও" : "Campus film")} label={caption} />
                  <span className="film-caption">
                    <strong>{caption || (bn ? "ভিডিও" : "Film")}</strong>
                    <em>{bn ? "চালান" : "Play"}</em>
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      ) : null}

      {desks.length ? (
        <section className="home-wrap home-block">
          <div className="section-head">
            <div>
              <p className="section-kicker">{bn ? "কাউকে খুঁজুন" : "Find a desk"}</p>
              <h2 className="section-title">{bn ? "অফিসের মুখ" : "People at the office"}</h2>
            </div>
            <Link className="section-link" href="/office">{bn ? "সব ডেস্ক" : "All desks"}</Link>
          </div>
          <div className="desk-grid">
            {desks.map((person) => (
              <Link key={person._id} href={`/office/${person.board}`} className="desk-card">
                <SitePhoto src={person.photoUrl} alt={person.name} label={person.name} />
                <span className="desk-copy">
                  <strong>{person.name}</strong>
                  {person.designation ? <em>{person.designation}</em> : null}
                </span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {map || school.address ? (
        <section className="home-wrap home-block">
          <div className="section-head">
            <div>
              <p className="section-kicker">{bn ? "আসুন" : "Visit"}</p>
              <h2 className="section-title">{bn ? "ক্যাম্পাসে আসার পথ" : "How to reach campus"}</h2>
            </div>
            <Link className="section-link" href="/contact">{bn ? "বার্তা পাঠান" : "Write to us"}</Link>
          </div>
          <div className={map ? "visit-grid" : ""}>
            <div className="visit-card">
              {school.address ? <p><span>{bn ? "ঠিকানা" : "Address"}</span>{school.address}</p> : null}
              {config.officeHours ? <p><span>{bn ? "সময়" : "Hours"}</span>{config.officeHours}</p> : null}
              {config.phone ? <p><span>{bn ? "ফোন" : "Phone"}</span><a href={`tel:${config.phone}`}>{config.phone}</a></p> : null}
              {config.email ? <p><span>Email</span><a href={`mailto:${config.email}`}>{config.email}</a></p> : null}
              {school.establishedYear ? <p><span>{bn ? "প্রতিষ্ঠা" : "Established"}</span>{school.establishedYear}</p> : null}
            </div>
            {map ? <iframe title={bn ? "ক্যাম্পাসের মানচিত্র" : "Campus map"} className="visit-map" src={map} loading="lazy" /> : null}
          </div>
        </section>
      ) : null}

      <section className="home-wrap home-block">
        <div className="band-brand admit-banner">
          <div>
            <p className="section-kicker">{bn ? "ভর্তি" : "Admission"}</p>
            <h2 className="section-title">{pick(lang, config.admitTitleBn, config.admitTitleEn)}</h2>
            <p className="mt-2 max-w-xl text-sm text-on-brand/80">{pick(lang, config.admitBodyBn, config.admitBodyEn)}</p>
            {admitMeta ? <p className="admit-meta">{admitMeta}</p> : null}
          </div>
          <Link className="btn btn-line" href="/admission">{bn ? "ভর্তি তথ্য" : "Admission"}</Link>
        </div>
      </section>
    </Shell>
  );
}

function ClassBands({ classes, groups, lang }: { classes: ClassItem[]; groups: string[]; lang: Lang }) {
  if (!classes.length) return null;
  const bn = lang === "bn";
  return (
    <section className="home-wrap home-block">
      <div className="section-head">
        <div>
          <p className="section-kicker">{bn ? "পাঠদান" : "Teaching"}</p>
          <h2 className="section-title">{bn ? "ক্লাস" : "Classes"}</h2>
        </div>
        <Link className="section-link" href="/academic/classes">{bn ? "বিষয়সহ" : "With subjects"}</Link>
      </div>
      <div className="class-grid">
        {groups.map((key) => (
          <article key={key} className="class-card">
            <p className="section-kicker">{bn ? BANDS[key].bn : BANDS[key].en}</p>
            <div>
              {classes.filter((item) => band(item.level) === key).map((item) => (
                <Link key={item._id} href="/academic/classes">{item.name}</Link>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
