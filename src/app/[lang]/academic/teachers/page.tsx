import Link from "next/link";
import { ProfileFrame } from "@/components/people-board";
import { PageIntro, Shell } from "@/components/shell";
import { getSite } from "@/lib/api";
import { getLang, type LangProps } from "@/lib/locale";
import { resolvePhoto } from "@/lib/media";
import { pick } from "@/lib/text";
import type { Lang, TeacherItem } from "@/lib/types";

function toBnDigits(str: string): string {
  return str.replace(/\d/g, (digit) => "০১২৩৪৫৬৭৮৯"[Number(digit)] ?? digit);
}

const MONTHS_BN = [
  "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
  "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"
];

function formatDateDisplay(dateStr?: string, lang: Lang = "bn"): string {
  if (!dateStr) return lang === "bn" ? "বর্তমান" : "Current";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  if (lang === "bn") {
    return `${toBnDigits(String(day))} ${MONTHS_BN[month]} ${toBnDigits(String(year))}`;
  }
  const monthsEn = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${day} ${monthsEn[month]} ${year}`;
}

export default async function Page({ params }: LangProps) {
  const [site, lang] = await Promise.all([getSite(), getLang(params)]);
  if (!site) return <p className="p-8">The school site could not be loaded.</p>;
  const bn = lang === "bn";

  // Only Principal message in grand frame (Vice-principal is merged into teachers table)
  const principal = site.people.find((person) => person.board === "principal");

  const vice = site.people.find((person) => person.board === "vice");
  const viceAsTeacher: TeacherItem | null =
    vice && !site.teachers.some((t) => t.name === vice.name)
      ? {
          _id: vice._id,
          name: vice.name,
          designation: vice.designation || (bn ? "সহকারি অধ্যক্ষ" : "Assistant Principal"),
          photoUrl: vice.photoUrl || "/media/portrait-1.webp",
          phone: vice.phone,
          bioBn: vice.bioBn,
          bioEn: vice.bioEn,
        }
      : null;

  const allTeachers: TeacherItem[] = viceAsTeacher ? [viceAsTeacher, ...site.teachers] : site.teachers;

  return (
    <Shell site={site} lang={lang}>
      <PageIntro
        kicker="Academic"
        title={bn ? "সম্মানিত শিক্ষকবৃন্দ" : "Teachers & Faculty"}
        summary={
          bn
            ? `আমাদের সুযোগ্য ও নিবেদিতপ্রাণ শিক্ষক মণ্ডলী। মোট শিক্ষক সংখ্যা: ${allTeachers.length} জন।`
            : `Our dedicated teaching faculty. Total teachers: ${allTeachers.length}.`
        }
        image={site.config.heroImageUrl || "/media/campus.webp"}
        alt={site.school.name}
      />

      <div className="fact-row">
        <p>
          <span>{bn ? "মোট শিক্ষক" : "Teachers"}</span>
          {allTeachers.length}
        </p>
        {site.config.officeHours ? (
          <p>
            <span>{bn ? "অফিস সময়" : "Hours"}</span>
            {site.config.officeHours}
          </p>
        ) : null}
        {site.config.phone ? (
          <p>
            <span>{bn ? "যোগাযোগ" : "Contact"}</span>
            {site.config.phone}
          </p>
        ) : null}
        {site.school.address ? (
          <p>
            <span>{bn ? "ঠিকানা" : "Address"}</span>
            {site.school.address}
          </p>
        ) : null}
      </div>

      {/* Only Principal's Full Message in Regal Leadership Frame */}
      {principal ? (
        <section className="mb-8">
          <ProfileFrame
            name={principal.name}
            designation={principal.designation || (bn ? "অধ্যক্ষ" : "Principal")}
            photoUrl={principal.photoUrl || "/media/portrait-0.webp"}
            message={pick(lang, principal.bioBn, principal.bioEn)}
            href={`/office/principal/${principal._id}`}
          />
        </section>
      ) : null}

      {/* Modern Faculty Roster Table with Passport Size Photos, Joining & Ending Dates */}
      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-2 border-b border-line">
          <div>
            <h2 className="text-2xl font-bold text-brand">
              {bn ? "শিক্ষক মণ্ডলীর পূর্ণাঙ্গ তালিকা" : "Faculty Roster"}
            </h2>
            <p className="text-xs text-muted mt-0.5">
              {bn
                ? "সহকারি অধ্যক্ষ ও সহকারি শিক্ষকবৃন্দের পাসপোর্ট সাইজ ছবি, যোগদানের তারিখ ও তথ্যাদি"
                : "Passport portraits, joining dates, and designations of faculty members"}
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-brand/10 text-brand rounded-full self-start sm:self-auto">
            {bn ? `মোট ${allTeachers.length} জন` : `Total ${allTeachers.length}`}
          </span>
        </div>

        {allTeachers.length ? (
          <TeacherTable teachers={allTeachers} lang={lang} officeViceId={viceAsTeacher?._id} />
        ) : (
          <p className="py-12 text-center text-sm text-muted">
            {bn ? "এই তালিকায় এখনো কোনো শিক্ষক যোগ করা হয়নি।" : "No teachers have been added to the roster yet."}
          </p>
        )}
      </section>
    </Shell>
  );
}

function TeacherTable({
  teachers,
  lang,
  officeViceId,
}: {
  teachers: TeacherItem[];
  lang: Lang;
  officeViceId?: string;
}) {
  const bn = lang === "bn";
  return (
    <div className="data-table-wrap !px-0 !mx-0">
      <table className="data-table">
        <thead>
          <tr>
            <th className="w-24 text-center">{bn ? "ছবি" : "Photo"}</th>
            <th>{bn ? "শিক্ষকের নাম" : "Teacher Name"}</th>
            <th>{bn ? "পদবী" : "Designation"}</th>
            <th>{bn ? "যোগদানের তারিখ" : "Joining Date"}</th>
            <th>{bn ? "সমাপ্তির তারিখ" : "Ending Date"}</th>
            <th>{bn ? "যোগাযোগ / ফোন" : "Contact"}</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map((teacher, index) => {
            const isOfficeVice = Boolean(officeViceId && teacher._id === officeViceId);
            const isVice =
              isOfficeVice ||
              (teacher.designation ?? "").includes("সহকারি অধ্যক্ষ") ||
              (teacher.designation ?? "").toLowerCase().includes("vice principal");
            const profileHref = isOfficeVice ? "/office/vice" : `/academic/teachers/${teacher._id}`;
            return (
              <tr key={teacher._id || index} className={isVice ? "bg-amber-500/5 font-medium" : ""}>
                <td className="p-3 text-center">
                  <div className="flex justify-center">
                    {teacher.photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={resolvePhoto(teacher.photoUrl)}
                        alt={teacher.name}
                        className="passport-photo"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="passport-photo-fallback">
                        {teacher.name.slice(0, 1)}
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  <Link
                    href={profileHref}
                    className="font-bold text-base text-brand hover:underline block"
                  >
                    {teacher.name}
                  </Link>
                  {isVice ? (
                    <span className="inline-block mt-0.5 text-[11px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                      {bn ? "প্রশাসনিক নেতৃত্ব" : "Administrative Leader"}
                    </span>
                  ) : null}
                  {(teacher.bioBn || teacher.bioEn) ? (
                    <p className="text-xs text-muted mt-1 max-w-sm line-clamp-2">
                      {pick(lang, teacher.bioBn, teacher.bioEn)}
                    </p>
                  ) : null}
                </td>
                <td>
                  <span className="inline-block px-2.5 py-1 rounded-md text-xs font-semibold bg-brand/10 text-brand border border-brand/20">
                    {teacher.designation || (bn ? "শিক্ষক" : "Teacher")}
                  </span>
                </td>
                <td className="text-xs font-mono font-medium text-foreground whitespace-nowrap">
                  {teacher.joiningDate ? (
                    <span>📅 {formatDateDisplay(teacher.joiningDate, lang)}</span>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
                <td className="text-xs font-mono font-medium whitespace-nowrap">
                  {teacher.retirementDate ? (
                    <span className="text-rose-700">🏁 {formatDateDisplay(teacher.retirementDate, lang)}</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full text-[11px] font-bold">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                      {bn ? "বর্তমান" : "Active"}
                    </span>
                  )}
                </td>
                <td className="text-sm font-medium">
                  {teacher.phone ? (
                    <a
                      href={`tel:${teacher.phone.replace(/\s/g, "")}`}
                      className="text-brand hover:underline inline-flex items-center gap-1 font-mono text-xs"
                    >
                      <span>📞</span>
                      <span>{teacher.phone}</span>
                    </a>
                  ) : (
                    <span className="text-muted text-xs">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
