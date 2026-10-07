"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { NOTICE_LABEL, NoticeStamp, noticeLabel } from "@/components/notice-stamp";
import type { Lang, NoticeItem } from "@/lib/types";

const CATS = ["all", "exam", "holiday", "fee", "admission", "general", "other"] as const;

function Card({ notice, lang, featured }: { notice: NoticeItem; lang: Lang; featured?: boolean }) {
  return (
    <Link href={`/notices/${notice._id}`} className={featured ? "notice-feature" : "notice-row"}>
      <NoticeStamp lang={lang} value={notice.issueDate} />
      <span>
        <span className="notice-meta">
          <span className="notice-pill">{noticeLabel(lang, notice.category)}</span>
          {notice.pinned ? <span className="notice-pill notice-pill-pin">{lang === "bn" ? "আটকানো" : "Pinned"}</span> : null}
          {notice.refNo ? <span className="notice-ref">{notice.refNo}</span> : null}
        </span>
        <strong>{notice.title}</strong>
        {notice.body ? <p>{notice.body}</p> : null}
      </span>
    </Link>
  );
}

export function NoticeBoard({ notices, lang }: { notices: NoticeItem[]; lang: Lang }) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<(typeof CATS)[number]>("all");
  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    return notices.filter((notice) => {
      if (cat !== "all" && notice.category !== cat) return false;
      if (!q) return true;
      return `${notice.title} ${notice.body ?? ""} ${notice.refNo ?? ""}`.toLowerCase().includes(q);
    });
  }, [notices, query, cat]);
  const pinned = items.filter((notice) => notice.pinned);
  const rest = items.filter((notice) => !notice.pinned);

  return (
    <section className="notice-board" aria-label={lang === "bn" ? "নোটিশ বোর্ড" : "Notice board"}>
      <div className="notice-frame">
        <div className="notice-frame-head">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-accent">{lang === "bn" ? "প্রকাশিত নোটিশ" : "Published"}</p>
            <p className="mt-1 text-sm font-semibold text-brand">
              {lang === "bn" ? `${items.length}টি` : `${items.length}`}
            </p>
          </div>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={lang === "bn" ? "শিরোনাম বা নম্বর খুঁজুন" : "Search title or number"}
            aria-label={lang === "bn" ? "নোটিশ খুঁজুন" : "Search notices"}
          />
        </div>
        <div className="notice-filters" role="toolbar" aria-label={lang === "bn" ? "বিভাগ" : "Category"}>
          {CATS.map((key) => (
            <button key={key} type="button" aria-pressed={cat === key} onClick={() => setCat(key)}>
              {lang === "bn" ? NOTICE_LABEL[key].bn : NOTICE_LABEL[key].en}
            </button>
          ))}
        </div>
        {items.length ? (
          <div className="notice-frame-body">
            {pinned.length ? (
              <div className="notice-features">
                {pinned.map((notice) => <Card key={notice._id} notice={notice} lang={lang} featured />)}
              </div>
            ) : null}
            {rest.length ? (
              <div className="notice-rows">
                {rest.map((notice) => <Card key={notice._id} notice={notice} lang={lang} />)}
              </div>
            ) : null}
          </div>
        ) : (
          <p className="px-5 py-10 text-sm text-muted">{lang === "bn" ? "এই খোঁজে নোটিশ নেই।" : "No notice matches that search."}</p>
        )}
      </div>
    </section>
  );
}
