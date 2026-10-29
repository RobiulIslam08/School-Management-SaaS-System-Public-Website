import Link from "next/link";
import { PageIntro, Shell } from "@/components/shell";
import { getSite } from "@/lib/api";
import type { Lang, PersonItem, PublicSite } from "@/lib/types";
import { photoProps } from "@/lib/media";
import { pick } from "@/lib/text";
import { FramedBaniBoard } from "@/components/framed-bani-board";

const OFFICE_BOARDS = new Set(["principal", "vice", "admission", "accounts", "librarian", "exam", "clerk"]);

export function personHref(person: Pick<PersonItem, "_id" | "board">): string {
  const base = OFFICE_BOARDS.has(person.board) ? `/office/${person.board}` : `/authorities/${person.board}`;
  return `${base}/${person._id}`;
}

export async function PeopleDirectory({
  lang,
  title,
  summary,
  note,
  duties,
  visit,
  links,
  people,
  leaders = [],
  useTable = false,
}: {
  lang: Lang;
  title: string;
  summary?: string;
  note?: string;
  duties?: string[];
  visit?: string[];
  links?: Array<{ href: string; label: string }>;
  people: PersonItem[];
  leaders?: Array<PersonItem & { slogan?: string; noLink?: boolean }>;
  useTable?: boolean;
}) {
  const site = await getSite();
  if (!site) return <p className="p-8">The school site could not be loaded.</p>;
  const detail = (
    <>
      {duties?.length ? (
        <section className="story-card">
          <span className="story-num">{lang === "bn" ? "০১" : "01"}</span>
          <div>
            <h2>{lang === "bn" ? "দায়িত্ব" : "Duties"}</h2>
            <ul className="story-ticks">
              {duties.map((item, index) => <li key={`duty-${index}`}>{item}</li>)}
            </ul>
          </div>
        </section>
      ) : null}
      {visit?.length ? (
        <section className="story-card">
          <span className="story-num">{lang === "bn" ? "০২" : "02"}</span>
          <div>
            <h2>{lang === "bn" ? "কখন আসবেন" : "When to visit"}</h2>
            <ul className="story-ticks">
              {visit.map((item, index) => <li key={`visit-${index}`}>{item}</li>)}
            </ul>
          </div>
        </section>
      ) : null}
    </>
  );
  return (
    <Shell site={site} lang={lang}>
      <PageIntro kicker={site.school.name} title={title} summary={summary} image={site.config.heroImageUrl} alt={site.school.name} />
      <div className="fact-row">
        {site.config.officeHours ? <p><span>{lang === "bn" ? "অফিস সময়" : "Hours"}</span>{site.config.officeHours}</p> : null}
        {site.config.phone ? <p><span>{lang === "bn" ? "ফোন" : "Phone"}</span>{site.config.phone}</p> : null}
        {site.school.address ? <p><span>{lang === "bn" ? "ঠিকানা" : "Address"}</span>{site.school.address}</p> : null}
        <p><span>{lang === "bn" ? "তালিকায়" : "Listed"}</span>{people.length + leaders.length}</p>
      </div>
      {note ? (
        <div className="article">
          <p className="story-lead">{note}</p>
        </div>
      ) : null}
      {links?.length ? (
        <div className="hub-grid">
          {links.map((item, index) => (
            <Link key={item.href} className="hub-card" href={item.href} prefetch={true}>
              <strong>{String(index + 1).padStart(2, "0")}</strong>
              <span className="text-xl font-semibold text-brand">{item.label}</span>
            </Link>
          ))}
        </div>
      ) : null}
      {leaders.map((person) => (
        <ProfileFrame
          key={person._id}
          name={person.name}
          designation={person.designation}
          photoUrl={person.photoUrl}
          message={pick(lang, person.bioBn, person.bioEn)}
          phone={person.board === "committee" ? undefined : person.phone}
          href={person.noLink ? undefined : personHref(person)}
          slogan={person.slogan}
        />
      ))}
      {people.length ? (
        useTable ? (
          <MembersTable
            people={people}
            lang={lang}
            hidePhone={people.some((person) => person.board === "committee")}
          />
        ) : (
          <PeopleGrid
            people={people}
            hidePhone={people.some((person) => person.board === "committee")}
          />
        )
      ) : leaders.length ? null : (
        <p className="mx-auto max-w-7xl px-4 py-12 text-sm text-muted">{lang === "bn" ? "এই তালিকায় এখনো কেউ যোগ হয়নি।" : "No one is published on this list yet."}</p>
      )}
      {duties?.length || visit?.length ? <div className="article">{detail}</div> : null}
    </Shell>
  );
}

export function ProfileFrame({
  name,
  designation,
  photoUrl,
  message,
  phone,
  href,
  slogan,
}: {
  name: string;
  designation?: string;
  photoUrl?: string;
  message?: string;
  phone?: string;
  href?: string;
  slogan?: string;
}) {
  const displayQuote = message || slogan || "";

  return (
    <div className="mx-auto max-w-4xl lg:max-w-5xl my-10 px-2 sm:px-4">
      <FramedBaniBoard
        wide
        kicker={designation ? `${designation} মহোদয়ের বাণী` : "বাণী ও দিকনির্দেশনা"}
        name={name}
        designation={phone ? `${designation ? `${designation} · ` : ""}📞 ${phone}` : designation}
        photoUrl={photoUrl}
        quote={displayQuote}
      />
    </div>
  );
}

/** Plain staff profile (no framed বাণী) for office desks like vice, exam, clerk. */
export function SimplePersonProfile({
  name,
  designation,
  photoUrl,
  message,
  phone,
}: {
  name: string;
  designation?: string;
  photoUrl?: string;
  message?: string;
  phone?: string;
}) {
  return (
    <article className="simple-person mx-auto my-10 max-w-3xl px-4">
      <div className="simple-person-card">
        <div className="simple-person-photo">
          {photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img {...photoProps(photoUrl, "320px")} alt={name} loading="eager" decoding="async" />
          ) : (
            <div className="simple-person-fallback" aria-hidden>
              {name.slice(0, 1)}
            </div>
          )}
        </div>
        <div className="simple-person-body">
          <h1 className="display text-2xl font-semibold text-brand md:text-3xl">{name}</h1>
          {designation ? <p className="mt-1 text-sm font-semibold text-accent">{designation}</p> : null}
          {phone ? (
            <p className="mt-3 text-sm font-medium">
              <a href={`tel:${phone.replace(/\s/g, "")}`} className="text-brand hover:underline">
                {phone}
              </a>
            </p>
          ) : null}
          {message ? <p className="mt-4 text-sm leading-relaxed text-muted whitespace-pre-wrap">{message}</p> : null}
        </div>
      </div>
    </article>
  );
}

function Portrait({ person }: { person: PersonItem }) {
  return (
    <div className="portrait">
      {person.photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img {...photoProps(person.photoUrl, "240px")} alt={person.name} loading="lazy" decoding="async" />
      ) : (
        <div className="grid aspect-[3/4] place-items-center text-4xl text-brand">{person.name.slice(0, 1)}</div>
      )}
    </div>
  );
}

export function PeopleGrid({
  people,
  hidePhone = false,
}: {
  people: PersonItem[];
  hidePhone?: boolean;
}) {
  return (
    <div className="people-grid">
      {people.map((person) => (
        <Link key={person._id} href={personHref(person)} className="person-card">
          <Portrait person={person} />
          <div className="staff-rule" aria-hidden />
          <div className="person-body">
            <h3>{person.name}</h3>
            {person.designation ? <p className="person-role">{person.designation}</p> : null}
            {!hidePhone && person.phone ? <p className="person-phone">{person.phone}</p> : null}
          </div>
        </Link>
      ))}
    </div>
  );
}

export function MembersTable({
  people,
  lang,
  hidePhone = false,
}: {
  people: PersonItem[];
  lang: Lang;
  hidePhone?: boolean;
}) {
  const bn = lang === "bn";
  return (
    <div className="data-table-wrap">
      <h3 className="text-xl font-bold text-brand mb-4 px-1">{bn ? "সদস্যবৃন্দ" : "Members"}</h3>
      <table className="data-table">
        <thead>
          <tr>
            <th className="w-24 text-center">{bn ? "ছবি" : "Photo"}</th>
            <th>{bn ? "নাম" : "Name"}</th>
            <th>{bn ? "পদবী" : "Designation"}</th>
            {hidePhone ? null : <th>{bn ? "ফোন / যোগাযোগ" : "Contact"}</th>}
          </tr>
        </thead>
        <tbody>
          {people.map((person) => (
            <tr key={person._id}>
              <td className="p-3 text-center">
                {person.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    {...photoProps(person.photoUrl, "96px")}
                    alt={person.name}
                    className="passport-photo mx-auto"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className="passport-photo-fallback mx-auto">
                    {person.name.slice(0, 1)}
                  </div>
                )}
              </td>
              <td>
                <Link href={personHref(person)} className="font-bold text-base text-brand hover:underline block">
                  {person.name}
                </Link>
                {(person.bioBn || person.bioEn) ? (
                  <p className="text-xs text-muted mt-1 max-w-md line-clamp-2">
                    {pick(lang, person.bioBn, person.bioEn)}
                  </p>
                ) : null}
              </td>
              <td>
                <span className="inline-block px-2.5 py-1 rounded-md text-xs font-semibold bg-brand/10 text-brand border border-brand/20">
                  {person.designation || (bn ? "সদস্য" : "Member")}
                </span>
              </td>
              {hidePhone ? null : (
                <td className="text-sm font-medium">
                  {person.phone ? (
                    <a href={`tel:${person.phone}`} className="text-brand hover:underline inline-flex items-center gap-1">
                      <span>📞</span>
                      <span>{person.phone}</span>
                    </a>
                  ) : (
                    <span className="text-muted text-xs">—</span>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function filterPeople(site: PublicSite, boards: string[]): PersonItem[] {
  return site.people.filter((person) => boards.includes(person.board));
}

function compactRole(designation?: string): string {
  return (designation ?? "").replace(/[\s-]/g, "").toLowerCase();
}

export function committeeSeat(designation?: string): "president" | "vice" | null {
  const role = compactRole(designation);
  if (role.includes("সহসভাপতি") || role.includes("vicepresident") || role.includes("vicechair")) return "vice";
  if (role.includes("সভাপতি") || role === "president" || role === "chairperson" || role === "chairman") return "president";
  return null;
}

export function splitCommittee(people: PersonItem[]): { leaders: PersonItem[]; rest: PersonItem[] } {
  const presidents: PersonItem[] = [];
  const rest: PersonItem[] = [];
  for (const person of people) {
    const seat = committeeSeat(person.designation);
    if (seat === "president") presidents.push(person);
    else rest.push(person);
  }
  return { leaders: presidents, rest };
}

function lines(primary: string[] | undefined, secondary: string[] | undefined, fallback: string[]): string[] {
  const first = (primary ?? []).map((item) => item.trim()).filter(Boolean);
  if (first.length) return first;
  const second = (secondary ?? []).map((item) => item.trim()).filter(Boolean);
  return second.length ? second : fallback;
}

export function deskCopy(
  site: PublicSite,
  key: string,
  lang: Lang,
  fallback: { note: string; duties: string[]; visit: string[] },
): { note: string; duties: string[]; visit: string[] } {
  const desk = site.config.desks?.find((item) => item.key === key);
  if (!desk) return fallback;
  const bn = lang === "bn";
  return {
    note: pick(lang, desk.noteBn, desk.noteEn) || fallback.note,
    duties: lines(bn ? desk.dutiesBn : desk.dutiesEn, bn ? desk.dutiesEn : desk.dutiesBn, fallback.duties),
    visit: lines(bn ? desk.visitBn : desk.visitEn, bn ? desk.visitEn : desk.visitBn, fallback.visit),
  };
}
