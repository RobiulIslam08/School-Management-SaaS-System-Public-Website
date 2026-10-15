import Link from "next/link";
import { notFound } from "next/navigation";
import { ProfileFrame } from "@/components/people-board";
import { Shell } from "@/components/shell";
import { getSite } from "@/lib/api";
import { getLang } from "@/lib/locale";
import { pick } from "@/lib/text";

const ROLES = new Set(["principal", "vice", "admission", "accounts", "librarian", "exam", "clerk"]);

export default async function Page({ params }: { params: Promise<{ role: string; id: string }> }) {
  const { role, id } = await params;
  if (!ROLES.has(role)) notFound();
  const [site, lang] = await Promise.all([getSite(), getLang()]);
  if (!site) return <p className="p-8">The school site could not be loaded.</p>;
  const person = site.people.find((item) => item._id === id && item.board === role);
  if (!person) notFound();
  return (
    <Shell site={site} lang={lang}>
      <p className="mx-auto max-w-7xl px-4 pt-8">
        <Link href={`/office/${role}`} className="text-sm font-medium text-brand underline underline-offset-4">
          {lang === "bn" ? "তালিকায় ফিরুন" : "Back to the list"}
        </Link>
      </p>
      <ProfileFrame
        name={person.name}
        designation={person.designation}
        photoUrl={person.photoUrl}
        message={pick(lang, person.bioBn, person.bioEn)}
        phone={person.phone}
        slogan={
          role === "principal"
            ? pick(lang, site.config.principalQuoteBn, site.config.principalQuoteEn) || (lang === "bn" ? "আমাদের কাজ শিক্ষার্থীকে নিরাপদে শেখানো।" : "Our work is to teach students in a safe school.")
            : role === "vice"
            ? (lang === "bn" ? "নিয়মানুবর্তিতা, সময়নিষ্ঠতা ও শিক্ষার সুষ্ঠু সমন্বয়।" : "Discipline, punctuality, and seamless academic coordination.")
            : role === "exam"
            ? (lang === "bn" ? "স্বচ্ছতা, নির্ভুল মূল্যায়ন ও সময়মতো ফলাফল।" : "Transparency, accurate assessment, and timely results.")
            : undefined
        }
      />
    </Shell>
  );
}
