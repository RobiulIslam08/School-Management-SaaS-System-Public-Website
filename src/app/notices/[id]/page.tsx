import Link from "next/link";
import { notFound } from "next/navigation";
import { Shell } from "@/components/shell";
import { noticeLabel } from "@/components/notice-stamp";
import { getNotice, getSite } from "@/lib/api";
import { getLang } from "@/lib/locale";
import { formatDay } from "@/lib/text";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [site, lang, notice] = await Promise.all([getSite(), getLang(), getNotice(id)]);
  if (!site) return <p className="p-8">The school site could not be loaded.</p>;
  if (!notice) notFound();
  const signs = (notice.signatories ?? []).filter((item) => item.name);
  return (
    <Shell site={site} lang={lang}>
      <article className="notice-letter">
        <p className="px-1 pt-6 text-sm">
          <Link className="font-semibold text-brand" href="/notices">{lang === "bn" ? "নোটিশ বোর্ড" : "Notice board"}</Link>
        </p>
        <div className="notice-letter-sheet mt-3">
          <p className="text-xs uppercase tracking-[0.16em] text-accent">{site.school.name}</p>
          <p className="mt-1 text-sm text-muted">
            {[site.school.eiin ? `EIIN ${site.school.eiin}` : "", site.school.address].filter(Boolean).join(" · ")}
          </p>
          <div className="notice-letter-meta">
            <span>{notice.refNo ? (lang === "bn" ? `স্মারক ${notice.refNo}` : `Ref ${notice.refNo}`) : noticeLabel(lang, notice.category)}</span>
            <span>{formatDay(lang, notice.issueDate)}</span>
          </div>
          <p className="mt-4"><span className="notice-pill">{noticeLabel(lang, notice.category)}</span></p>
          <h1 className="display mt-3 text-2xl font-semibold leading-snug text-brand md:text-3xl">{notice.title}</h1>
          <div className="notice-letter-body">{notice.body}</div>
          {signs.length ? (
            <div className="notice-sign">
              {signs.map((item, index) => (
                <p key={`${index}-${item.name}-${item.designation}`}>
                  <span className="block font-semibold">{item.name}</span>
                  <span className="text-sm text-muted">{item.designation}</span>
                </p>
              ))}
            </div>
          ) : null}
        </div>
      </article>
    </Shell>
  );
}
