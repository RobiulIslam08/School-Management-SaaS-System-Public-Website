import Link from "next/link";
import { notFound } from "next/navigation";
import { ProfileFrame } from "@/components/people-board";
import { Shell } from "@/components/shell";
import { getSite } from "@/lib/api";
import { getLang } from "@/lib/locale";
import { pick } from "@/lib/text";

/** Rendered on first visit, then served from the ISR cache. */
export function generateStaticParams() {
  return [];
}

export default async function Page({ params }: { params: Promise<{ lang: string; id: string }> }) {
  const { id } = await params;
  const [site, lang] = await Promise.all([getSite(), getLang(params)]);
  if (!site) return <p className="p-8">The school site could not be loaded.</p>;
  const teacher = site.teachers.find((item) => item._id === id);
  if (!teacher) notFound();
  const bn = lang === "bn";
  return (
    <Shell site={site} lang={lang}>
      <p className="mx-auto max-w-7xl px-4 pt-8">
        <Link href="/academic/teachers" className="text-sm font-medium text-brand underline underline-offset-4">
          {bn ? "শিক্ষক তালিকায় ফিরুন" : "Back to teachers"}
        </Link>
      </p>
      <ProfileFrame
        name={teacher.name}
        designation={teacher.designation}
        photoUrl={teacher.photoUrl}
        phone={teacher.phone}
        message={pick(lang, teacher.bioBn, teacher.bioEn)}
      />
    </Shell>
  );
}
