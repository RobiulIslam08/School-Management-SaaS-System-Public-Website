import { PageIntro, Shell } from "@/components/shell";
import { getSite } from "@/lib/api";
import { getLang } from "@/lib/locale";
import { resolvePhoto } from "@/lib/media";
import type { TeacherItem } from "@/lib/types";

function groupOf(designation: string): "head" | "vice" | "teacher" {
  const text = designation.toLowerCase();
  const assistant = text.includes("assistant") || text.includes("vice") || designation.includes("সহকারী");
  const head = text.includes("headmaster") || text.includes("principal") || designation.includes("প্রধান");
  if (assistant && head) return "vice";
  if (head) return "head";
  return "teacher";
}

const GROUPS: Array<{ key: "head" | "vice" | "teacher"; bn: string; en: string }> = [
  { key: "head", bn: "প্রধান শিক্ষক", en: "Principal" },
  { key: "vice", bn: "সহকারী প্রধান শিক্ষক", en: "Vice principal" },
  { key: "teacher", bn: "শিক্ষক", en: "Teachers" },
];

export default async function Page() {
  const [site, lang] = await Promise.all([getSite(), getLang()]);
  if (!site) return <p className="p-8">The school site could not be loaded.</p>;
  const bn = lang === "bn";
  const grouped = GROUPS.map((group) => ({
    ...group,
    people: site.teachers.filter((teacher) => groupOf(teacher.designation ?? "") === group.key),
  })).filter((group) => group.people.length);
  return (
    <Shell site={site} lang={lang}>
      <PageIntro
        kicker="Academic"
        title={bn ? "শিক্ষক" : "Teachers"}
        summary={bn
          ? `${site.teachers.length} জন শিক্ষক। কার্ডে নাম, পদবি, ছবি ও অফিস ফোন। বেতন, বাড়ির ঠিকানা বা অভিভাবকের নম্বর এখানে নেই।`
          : `${site.teachers.length} teachers. Each card shows the name, role, photo, and office phone. Pay, home address, and guardian numbers are not shown.`}
        image={site.config.heroImageUrl}
        alt={site.school.name}
      />
      <div className="fact-row">
        <p><span>{bn ? "সংখ্যা" : "Count"}</span>{site.teachers.length}</p>
        {site.config.officeHours ? <p><span>{bn ? "অফিস সময়" : "Hours"}</span>{site.config.officeHours}</p> : null}
        {site.config.phone ? <p><span>{bn ? "ফোন" : "Phone"}</span>{site.config.phone}</p> : null}
        {site.school.address ? <p><span>{bn ? "ঠিকানা" : "Address"}</span>{site.school.address}</p> : null}
      </div>
      <p className="mx-auto max-w-3xl px-4 pt-6 text-sm leading-6 text-muted">
        {bn
          ? "প্রধান, সহকারী ও শিক্ষক আলাদা দলে। শ্রেণিকক্ষের দায়িত্ব রুটিনে। প্রশ্ন থাকলে অফিস সময়ে ফোন করুন। একজন হলে কার্ড মাঝখানে।"
          : "The principal, the vice principal, and teachers sit in separate groups. Class duties are on the routine. Call during office hours if you have a question. A single card sits in the middle."}
      </p>
      {grouped.map((group) => (
        <section key={group.key}>
          <h2 className="mx-auto max-w-7xl px-4 pt-8 text-xl font-semibold">{bn ? group.bn : group.en}</h2>
          <TeacherRow people={group.people} />
        </section>
      ))}
    </Shell>
  );
}

function TeacherRow({ people }: { people: TeacherItem[] }) {
  const single = people.length === 1;
  return (
    <div className={single ? "card-center mx-auto max-w-7xl px-4 py-6" : "mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:grid-cols-2 lg:grid-cols-4"}>
      {people.map((teacher) => (
        <article key={teacher._id} className="staff-card">
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
        </article>
      ))}
    </div>
  );
}
