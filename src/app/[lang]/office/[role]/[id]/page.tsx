import Link from "next/link";
import { notFound } from "next/navigation";
import { ProfileFrame, SimplePersonProfile } from "@/components/people-board";
import { Shell } from "@/components/shell";
import { getSite } from "@/lib/api";
import { getLang } from "@/lib/locale";
import { pick } from "@/lib/text";

const ROLES = new Set(["principal", "vice", "admission", "accounts", "librarian", "exam", "clerk"]);
const FRAMED_BANI_ROLES = new Set(["principal"]);

/** Rendered on first visit, then served from the ISR cache. */
export function generateStaticParams() {
  return [];
}

export default async function Page({ params }: { params: Promise<{ lang: string; role: string; id: string }> }) {
  const { role, id } = await params;
  if (!ROLES.has(role)) notFound();
  const [site, lang] = await Promise.all([getSite(), getLang(params)]);
  if (!site) return <p className="p-8">The school site could not be loaded.</p>;
  const person = site.people.find((item) => item._id === id && item.board === role);
  if (!person) notFound();
  const message = pick(lang, person.bioBn, person.bioEn);
  const useFrame = FRAMED_BANI_ROLES.has(role);

  return (
    <Shell site={site} lang={lang}>
      <p className="mx-auto max-w-7xl px-4 pt-8">
        <Link href={`/office/${role}`} className="text-sm font-medium text-brand underline underline-offset-4">
          {lang === "bn" ? "তালিকায় ফিরুন" : "Back to the list"}
        </Link>
      </p>
      {useFrame ? (
        <ProfileFrame
          name={person.name}
          designation={person.designation}
          photoUrl={person.photoUrl}
          message={message}
          phone={person.phone}
          slogan={
            pick(lang, site.config.principalQuoteBn, site.config.principalQuoteEn) ||
            (lang === "bn" ? "আমাদের কাজ শিক্ষার্থীকে নিরাপদে শেখানো।" : "Our work is to teach students in a safe school.")
          }
        />
      ) : (
        <SimplePersonProfile
          name={person.name}
          designation={person.designation}
          photoUrl={person.photoUrl}
          message={message}
          phone={person.phone}
        />
      )}
    </Shell>
  );
}
