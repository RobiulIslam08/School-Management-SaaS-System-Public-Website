import Link from "next/link";
import { PageIntro, Shell } from "@/components/shell";
import { getSite } from "@/lib/api";
import type { Lang, PersonItem, PublicSite } from "@/lib/types";
import { getLang } from "@/lib/locale";
import { resolvePhoto } from "@/lib/media";
import { pick } from "@/lib/text";

const OFFICE_BOARDS = new Set(["principal", "vice", "admission", "accounts", "librarian", "exam", "clerk"]);

export function personHref(person: Pick<PersonItem, "_id" | "board">): string {
  const base = OFFICE_BOARDS.has(person.board) ? `/office/${person.board}` : `/authorities/${person.board}`;
  return `${base}/${person._id}`;
}

export async function PeopleDirectory({
  title,
  summary,
  note,
  duties,
  visit,
  links,
  people,
  leaders = [],
}: {
  title: string;
  summary?: string;
  note?: string;
  duties?: string[];
  visit?: string[];
  links?: Array<{ href: string; label: string }>;
  people: PersonItem[];
  leaders?: PersonItem[];
}) {
  const [site, lang] = await Promise.all([getSite(), getLang()]);
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
            <a key={item.href} className="hub-card" href={item.href}>
              <strong>{String(index + 1).padStart(2, "0")}</strong>
              <span className="text-xl font-semibold text-brand">{item.label}</span>
            </a>
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
          href={personHref(person)}
        />
      ))}
      {people.length ? <PeopleGrid people={people} /> : leaders.length ? null : (
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
}: {
  name: string;
  designation?: string;
  photoUrl?: string;
  message?: string;
  phone?: string;
  href?: string;
}) {
  const frame = (
    <>
      <div className="leader-sheet">
        <div className="portrait">
          {photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={resolvePhoto(photoUrl)} alt={name} />
          ) : (
            <div className="grid aspect-[3/4] place-items-center text-4xl text-brand">{name.slice(0, 1)}</div>
          )}
        </div>
        <div>
          <h2 className="text-2xl font-semibold">{name}</h2>
          {designation ? <p className="mt-1 text-sm text-muted">{designation}</p> : null}
          {phone ? <p className="mt-2 text-sm font-medium text-brand">{phone}</p> : null}
          {message ? <p className="leader-message">{message}</p> : null}
        </div>
      </div>
    </>
  );
  if (href) {
    return (
      <Link href={href} className="leader-list block text-inherit no-underline">
        {frame}
      </Link>
    );
  }
  return <article className="leader-list">{frame}</article>;
}

function Portrait({ person }: { person: PersonItem }) {
  return (
    <div className="portrait">
      {person.photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={resolvePhoto(person.photoUrl)} alt={person.name} />
      ) : (
        <div className="grid aspect-[3/4] place-items-center text-4xl text-brand">{person.name.slice(0, 1)}</div>
      )}
    </div>
  );
}

function PeopleGrid({ people }: { people: PersonItem[] }) {
  const single = people.length === 1;
  return (
    <ul className={single ? "card-center mx-auto max-w-7xl px-4 py-6" : "mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:grid-cols-2 lg:grid-cols-4"}>
      {people.map((person) => (
        <li key={person._id}>
          <Link href={personHref(person)} className="staff-card block">
            <Portrait person={person} />
            <div className="staff-rule" />
            <div className="space-y-1 px-4 py-4">
              <h3 className="font-semibold">{person.name}</h3>
              <p className="text-sm text-muted">{person.designation}</p>
              {person.board !== "committee" && person.phone ? <p className="text-sm font-medium text-brand">{person.phone}</p> : null}
            </div>
          </Link>
        </li>
      ))}
    </ul>
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
  const vices: PersonItem[] = [];
  const rest: PersonItem[] = [];
  for (const person of people) {
    const seat = committeeSeat(person.designation);
    if (seat === "president") presidents.push(person);
    else if (seat === "vice") vices.push(person);
    else rest.push(person);
  }
  return { leaders: [...presidents, ...vices], rest };
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
