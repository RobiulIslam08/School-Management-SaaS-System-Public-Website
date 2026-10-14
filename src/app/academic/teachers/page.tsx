import Link from "next/link";
import { ProfileFrame } from "@/components/people-board";
import { PageIntro, Shell } from "@/components/shell";
import { getSite } from "@/lib/api";
import { getLang } from "@/lib/locale";
import { resolvePhoto } from "@/lib/media";
import { pick } from "@/lib/text";
import type { TeacherItem } from "@/lib/types";

export default async function Page() {
  const [site, lang] = await Promise.all([getSite(), getLang()]);
  if (!site) return <p className="p-8">The school site could not be loaded.</p>;
  const bn = lang === "bn";
  const leaders = ["principal", "vice"].flatMap((board) => site.people.filter((person) => person.board === board));
  return (
    <Shell site={site} lang={lang}>
      <PageIntro
        kicker="Academic"
        title={bn ? "শিক্ষক" : "Teachers"}
        summary={bn
          ? `${site.teachers.length} জন শিক্ষক। অধ্যক্ষ ও সহকারি অধ্যক্ষ অফিস পাতার সেই একই মানুষ। কার্ডে বেতন বা বাড়ির ঠিকানা নেই।`
          : `${site.teachers.length} teachers. The principal and assistant principal are the same people as on the office pages. Cards do not show pay or a home address.`}
        image={site.config.heroImageUrl}
        alt={site.school.name}
      />
      <div className="fact-row">
        <p><span>{bn ? "সংখ্যা" : "Count"}</span>{site.teachers.length}</p>
        {site.config.officeHours ? <p><span>{bn ? "অফিস সময়" : "Hours"}</span>{site.config.officeHours}</p> : null}
        {site.config.phone ? <p><span>{bn ? "ফোন" : "Phone"}</span>{site.config.phone}</p> : null}
        {site.school.address ? <p><span>{bn ? "ঠিকানা" : "Address"}</span>{site.school.address}</p> : null}
      </div>
      {leaders.map((person) => (
        <ProfileFrame
          key={person._id}
          name={person.name}
          designation={person.designation}
          photoUrl={person.photoUrl}
          message={pick(lang, person.bioBn, person.bioEn)}
          href={`/office/${person.board}/${person._id}`}
        />
      ))}
      {site.teachers.length ? (
        <section>
          <h2 className="mx-auto max-w-7xl px-4 pt-8 text-xl font-semibold">{bn ? "শিক্ষক" : "Teachers"}</h2>
          <TeacherRow people={site.teachers} />
        </section>
      ) : (
        <p className="mx-auto max-w-7xl px-4 py-12 text-sm text-muted">{bn ? "এই তালিকায় এখনো কেউ যোগ হয়নি।" : "No one is published on this list yet."}</p>
      )}
    </Shell>
  );
}

function TeacherRow({ people }: { people: TeacherItem[] }) {
  const single = people.length === 1;
  return (
    <div className={single ? "card-center mx-auto max-w-7xl px-4 py-6" : "mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:grid-cols-2 lg:grid-cols-4"}>
      {people.map((teacher) => (
        <Link key={teacher._id} href={`/academic/teachers/${teacher._id}`} className="staff-card block">
          <div className="portrait">
            {teacher.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={resolvePhoto(teacher.photoUrl)} alt={teacher.name} />
            ) : (
              <div className="grid aspect-[3/4] place-items-center text-3xl text-brand">{teacher.name.slice(0, 1)}</div>
            )}
          </div>
          <div className="staff-rule" />
          <div className="space-y-1 px-4 py-4">
            <h3 className="font-semibold">{teacher.name}</h3>
            <p className="text-sm text-muted">{teacher.designation}</p>
            {teacher.phone ? <p className="text-sm font-medium text-brand">{teacher.phone}</p> : null}
          </div>
        </Link>
      ))}
    </div>
  );
}
