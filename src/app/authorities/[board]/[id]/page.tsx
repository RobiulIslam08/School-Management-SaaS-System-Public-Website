import Link from "next/link";
import { notFound } from "next/navigation";
import { ProfileFrame } from "@/components/people-board";
import { Shell } from "@/components/shell";
import { getSite } from "@/lib/api";
import { getLang } from "@/lib/locale";
import { pick } from "@/lib/text";

const BOARDS = new Set(["committee", "governing", "council", "pta"]);

export default async function Page({ params }: { params: Promise<{ board: string; id: string }> }) {
  const { board, id } = await params;
  if (!BOARDS.has(board)) notFound();
  const [site, lang] = await Promise.all([getSite(), getLang()]);
  if (!site) return <p className="p-8">The school site could not be loaded.</p>;
  const person = site.people.find((item) => item._id === id && item.board === board);
  if (!person) notFound();
  return (
    <Shell site={site} lang={lang}>
      <p className="mx-auto max-w-7xl px-4 pt-8">
        <Link href={`/authorities/${board}`} className="text-sm font-medium text-brand underline underline-offset-4">
          {lang === "bn" ? "তালিকায় ফিরুন" : "Back to the list"}
        </Link>
      </p>
      <ProfileFrame
        name={person.name}
        designation={person.designation}
        photoUrl={person.photoUrl}
        message={pick(lang, person.bioBn, person.bioEn)}
        phone={board === "committee" ? undefined : person.phone}
      />
    </Shell>
  );
}
