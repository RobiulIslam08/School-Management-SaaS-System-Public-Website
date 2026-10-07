import { PageIntro, Shell } from "@/components/shell";
import { getSite } from "@/lib/api";
import type { Lang, PersonItem, PublicSite } from "@/lib/types";
import { getLang } from "@/lib/locale";
import { resolvePhoto } from "@/lib/media";
import { pick } from "@/lib/text";

export async function PeopleDirectory({
  title,
  summary,
  note,
  duties,
  visit,
  links,
  people,
}: {
  title: string;
  summary?: string;
  note?: string;
  duties?: string[];
  visit?: string[];
  links?: Array<{ href: string; label: string }>;
  people: PersonItem[];
}) {
  const [site, lang] = await Promise.all([getSite(), getLang()]);
  if (!site) return <p className="p-8">The school site could not be loaded.</p>;
  return (
    <Shell site={site} lang={lang}>
      <PageIntro kicker={site.school.name} title={title} summary={summary} image={site.config.heroImageUrl} alt={site.school.name} />
      <div className="fact-row">
        {site.config.officeHours ? <p><span>{lang === "bn" ? "অফিস সময়" : "Hours"}</span>{site.config.officeHours}</p> : null}
        {site.config.phone ? <p><span>{lang === "bn" ? "ফোন" : "Phone"}</span>{site.config.phone}</p> : null}
        {site.school.address ? <p><span>{lang === "bn" ? "ঠিকানা" : "Address"}</span>{site.school.address}</p> : null}
        <p><span>{lang === "bn" ? "তালিকায়" : "Listed"}</span>{people.length}</p>
      </div>
      <div className="article">
        {note ? <p className="story-lead">{note}</p> : null}
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
      </div>
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
      <PeopleGrid people={people} lang={lang} />
    </Shell>
  );
}

function PeopleGrid({ people, lang }: { people: PersonItem[]; lang: Lang }) {
  if (!people.length) {
    return <p className="mx-auto max-w-7xl px-4 py-12 text-sm text-muted">{lang === "bn" ? "এই তালিকায় এখনো কেউ যোগ হয়নি।" : "No one is published on this list yet."}</p>;
  }
  const single = people.length === 1;
  return (
    <ul className={single ? "card-center mx-auto max-w-7xl px-4 py-12" : "mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:grid-cols-2 lg:grid-cols-3"}>
      {people.map((person) => (
        <li key={person._id} className="staff-card">
          <div className="portrait">
            {person.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={resolvePhoto(person.photoUrl)} alt={person.name} />
            ) : (
              <div className="grid aspect-[3/4] place-items-center text-4xl text-brand">{person.name.slice(0, 1)}</div>
            )}
          </div>
          <div className="staff-rule" />
          <div className="space-y-1 px-4 py-4">
            <p className="text-lg font-semibold">{person.name}</p>
            <p className="text-sm text-muted">{person.designation}</p>
            {person.phone ? <p className="text-sm font-medium text-brand">{person.phone}</p> : null}
            <p className="pt-1 text-sm leading-6">{pick(lang, person.bioBn, person.bioEn)}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function filterPeople(site: PublicSite, boards: string[]): PersonItem[] {
  return site.people.filter((person) => boards.includes(person.board));
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
