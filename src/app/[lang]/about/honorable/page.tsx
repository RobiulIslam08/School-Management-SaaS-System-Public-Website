import Link from "next/link";
import { PageIntro, Shell } from "@/components/shell";
import { getSite } from "@/lib/api";
import { getLang, type LangProps } from "@/lib/locale";
import { resolvePhoto } from "@/lib/media";
import { RoyalFrame } from "@/components/royal-frame";
import { pick } from "@/lib/text";
import type { DonorItem, Lang, PersonItem } from "@/lib/types";

function toBnDigits(str: string | number): string {
  return String(str).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[Number(d)] ?? d);
}

function formatTaka(amount: number, lang: Lang = "bn"): string {
  const formatted = amount.toLocaleString("en-IN");
  return lang === "bn" ? `৳ ${toBnDigits(formatted)}` : `৳ ${formatted}`;
}

const MONTHS_BN = [
  "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
  "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"
];

function formatDateDisplay(dateStr?: string, lang: Lang = "bn"): string {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  if (lang === "bn") {
    return `${toBnDigits(day)} ${MONTHS_BN[month]} ${toBnDigits(year)}`;
  }
  const monthsEn = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${day} ${monthsEn[month]} ${year}`;
}

export default async function HonorablePage({ params }: LangProps) {
  const [site, lang] = await Promise.all([getSite(), getLang(params)]);
  if (!site) return <p className="p-8">The school site could not be loaded.</p>;

  const bn = lang === "bn";

  // Former Principals and Former Presidents
  const formerPrincipals = site.people.filter((p) => p.board === "former_principal");
  const formerPresidents = site.people.filter((p) => p.board === "former_president");

  // Donors sorted descending by amount: "যে বেশি দিবে তার টা আগে দেখাবে"
  const rawDonors = site.donors ?? [];
  const sortedDonors: DonorItem[] = [...rawDonors].sort((a, b) => b.amount - a.amount);

  const totalDonations = sortedDonors.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  return (
    <Shell site={site} lang={lang}>
      <PageIntro
        kicker={bn ? "শ্রদ্ধেয় ও স্মরণীয় ব্যক্তিত্ব" : "Honorable & Benefactors"}
        title={bn ? "সাবেক অধ্যক্ষ, সভাপতি ও দাতা সদস্যবৃন্দ" : "Former Leadership & Distinguished Donors"}
        summary={
          bn
            ? "প্রতিষ্ঠানের ভিত্তিপ্রস্তর স্থাপনকারী সাবেক অধ্যক্ষ মহোদয়, সাবেক সভাপতি মণ্ডলী এবং প্রতিষ্ঠানের উন্নয়নে অর্থ ও সহায়তাদানকারী শ্রদ্ধেয় দাতা সদস্যবৃন্দের গৌরবময় তালিকা।"
            : "Honoring our past institutional leadership and the generous benefactors whose contributions built and advance this school."
        }
        image={site.config.heroImageUrl}
        alt={site.school.name}
      />

      <div className="fact-row">
        <p>
          <span>{bn ? "সাবেক অধ্যক্ষ" : "Former Principals"}</span>
          {bn ? `${toBnDigits(formerPrincipals.length)} জন` : `${formerPrincipals.length}`}
        </p>
        <p>
          <span>{bn ? "সাবেক সভাপতি" : "Former Presidents"}</span>
          {bn ? `${toBnDigits(formerPresidents.length)} জন` : `${formerPresidents.length}`}
        </p>
        <p>
          <span>{bn ? "মোট দাতা সদস্য" : "Total Donors"}</span>
          {bn ? `${toBnDigits(sortedDonors.length)} জন` : `${sortedDonors.length}`}
        </p>
        <p>
          <span>{bn ? "মোট অনুদান সংগ্রহ" : "Total Donated"}</span>
          {formatTaka(totalDonations, lang)}
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 space-y-16">
        {/* SECTION 1: Former Principals */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-border/80 pb-4 gap-2">
            <div>
              <span className="text-xs font-bold tracking-widest text-brand uppercase">
                {bn ? "ঐতিহ্য ও অবদান" : "Heritage & Legacy"}
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-foreground">
                🏛️ {bn ? "সাবেক অধ্যক্ষ মহোদয়গণের তালিকা" : "Former Principals & Headmasters"}
              </h2>
            </div>
            <p className="text-sm text-muted">
              {bn ? "প্রতিষ্ঠানের সার্বিক শিক্ষা ও শৃঙ্খলায় নেতৃত্ব দানকারী" : "Guiding pedagogical leadership across the eras"}
            </p>
          </div>

          {formerPrincipals.length === 0 ? (
            <p className="text-sm text-muted italic p-4 bg-paper rounded-xl">
              {bn ? "সাবেক অধ্যক্ষ মহোদয়ের তালিকা শীঘ্রই হালনাগাদ করা হবে।" : "Former principals list will be updated soon."}
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {formerPrincipals.map((person) => (
                <article
                  key={person._id}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-brand/40"
                >
                  <div className="flex items-start gap-4">
                    <RoyalFrame
                      photoUrl={person.photoUrl}
                      name={person.name}
                      designation={person.designation}
                      size="sm"
                      showPlate={false}
                      className="shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="inline-block rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-semibold text-brand">
                        {bn ? "সাবেক অধ্যক্ষ" : "Former Principal"}
                      </span>
                      <h3 className="mt-1.5 text-lg font-bold text-foreground truncate">{person.name}</h3>
                      <p className="text-xs font-medium text-amber-700 dark:text-amber-400 mt-0.5">
                        {person.designation}
                      </p>
                    </div>
                  </div>
                  {person.bioBn || person.bioEn ? (
                    <p className="mt-4 text-xs leading-relaxed text-muted line-clamp-4">
                      {bn ? person.bioBn || person.bioEn : person.bioEn || person.bioBn}
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          )}
        </section>

        {/* SECTION 2: Former Presidents */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-border/80 pb-4 gap-2">
            <div>
              <span className="text-xs font-bold tracking-widest text-brand uppercase">
                {bn ? "পরিচালনা পর্ষদ" : "Governing Body"}
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-foreground">
                👥 {bn ? "সাবেক সভাপতি মণ্ডলী (পরিচালনা পর্ষদ)" : "Former Presidents of Governing Body"}
              </h2>
            </div>
            <p className="text-sm text-muted">
              {bn ? "স্কুল পরিচালনা ও নীতিনির্ধারণে দিকনির্দেশনা প্রদানকারী" : "Steering policy and community guardianship"}
            </p>
          </div>

          {formerPresidents.length === 0 ? (
            <p className="text-sm text-muted italic p-4 bg-paper rounded-xl">
              {bn ? "সাবেক সভাপতি মহোদয়গণের তালিকা শীঘ্রই হালনাগাদ করা হবে।" : "Former presidents list will be updated soon."}
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {formerPresidents.map((person) => (
                <article
                  key={person._id}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-brand/40"
                >
                  <div className="flex items-start gap-4">
                    <RoyalFrame
                      photoUrl={person.photoUrl}
                      name={person.name}
                      designation={person.designation}
                      size="sm"
                      showPlate={false}
                      className="shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="inline-block rounded-full bg-emerald-100 dark:bg-emerald-950/50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                        {bn ? "সাবেক সভাপতি" : "Former President"}
                      </span>
                      <h3 className="mt-1.5 text-lg font-bold text-foreground truncate">{person.name}</h3>
                      <p className="text-xs font-medium text-amber-700 dark:text-amber-400 mt-0.5">
                        {person.designation}
                      </p>
                    </div>
                  </div>
                  {person.bioBn || person.bioEn ? (
                    <p className="mt-4 text-xs leading-relaxed text-muted line-clamp-4">
                      {bn ? person.bioBn || person.bioEn : person.bioEn || person.bioBn}
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          )}
        </section>

        {/* SECTION 3: Distinguished Donors */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-border/80 pb-4 gap-2">
            <div>
              <span className="text-xs font-bold tracking-widest text-amber-600 dark:text-amber-400 uppercase">
                {bn ? "মহতী অনুদান ও কৃতজ্ঞতা" : "Philanthropy & Gratitude"}
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-foreground flex items-center gap-2">
                🏆 {bn ? "দাতা সদস্য ও আজীবন পৃষ্ঠপোষক তালিকা" : "Distinguished Donors & Life Benefactors"}
              </h2>
            </div>
            <p className="text-xs md:text-sm font-semibold text-amber-600 dark:text-amber-400">
              ⚡ {bn ? "অনুদানের সর্বোচ্চ পরিমাণ অনুযায়ী ক্রমানুসারে সাজানো" : "Sorted by highest contribution amount"}
            </p>
          </div>

          {/* Top 3 Honor Podium / Medal Showcase */}
          {sortedDonors.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-3">
              {sortedDonors.slice(0, 3).map((donor, idx) => {
                const medal = idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉";
                const medalTitle =
                  idx === 0
                    ? bn
                      ? "স্বর্ণ পদক দাতা (শীর্ষ দাতা)"
                      : "Gold Benefactor (Top Donor)"
                    : idx === 1
                    ? bn
                      ? "রৌপ্য পদক দাতা"
                      : "Silver Benefactor"
                    : bn
                    ? "ব্রোঞ্জ পদক দাতা"
                    : "Bronze Benefactor";

                const borderCls =
                  idx === 0
                    ? "border-amber-400/80 bg-gradient-to-b from-amber-50/80 to-card dark:from-amber-950/20"
                    : idx === 1
                    ? "border-slate-300 dark:border-slate-700 bg-gradient-to-b from-slate-50/80 to-card dark:from-slate-900/20"
                    : "border-amber-700/40 bg-gradient-to-b from-amber-100/40 to-card dark:from-amber-950/10";

                return (
                  <div
                    key={donor._id}
                    className={`relative overflow-hidden rounded-2xl border-2 p-5 shadow-sm transition-all hover:scale-[1.01] ${borderCls}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-3xl">{medal}</span>
                      <span className="rounded-full bg-black/5 dark:bg-white/10 px-2.5 py-0.5 text-xs font-bold text-foreground">
                        {medalTitle}
                      </span>
                    </div>
                    <div className="mt-3">
                      <h4 className="text-lg font-extrabold text-foreground">{donor.donorName}</h4>
                      {donor.donorAddress ? (
                        <p className="text-xs text-muted flex items-center gap-1 mt-0.5">
                          📍 {donor.donorAddress}
                        </p>
                      ) : null}
                    </div>
                    <div className="mt-4 pt-3 border-t border-border/60 flex items-baseline justify-between">
                      <span className="text-xs text-muted font-medium">{bn ? "অনুদানের পরিমাণ:" : "Amount:"}</span>
                      <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                        {formatTaka(donor.amount, lang)}
                      </span>
                    </div>
                    {donor.purpose ? (
                      <p className="mt-2 text-xs text-muted/90 italic">
                        🎯 {donor.purpose}
                      </p>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ) : null}

          {/* Full Donors Table */}
          {sortedDonors.length === 0 ? (
            <p className="text-sm text-muted italic p-4 bg-paper rounded-xl">
              {bn ? "দাতা সদস্যদের তথ্য শীঘ্রই হালনাগাদ করা হবে।" : "Donors list will be published soon."}
            </p>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-border bg-muted/50 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="w-16 px-4 py-4 text-center">{bn ? "ক্রম" : "Rank"}</th>
                      <th className="px-5 py-4">{bn ? "দাতা সদস্যের নাম" : "Donor Name"}</th>
                      <th className="px-5 py-4">{bn ? "ঠিকানা ও অবস্থান" : "Address / Location"}</th>
                      <th className="px-5 py-4">{bn ? "অনুদানের খাত / উদ্দেশ্য" : "Purpose"}</th>
                      <th className="px-5 py-4 text-right">{bn ? "অনুদানের পরিমাণ" : "Amount"}</th>
                      <th className="px-5 py-4 text-right">{bn ? "তারিখ" : "Date"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {sortedDonors.map((donor, idx) => {
                      const isTop3 = idx < 3;
                      const badgeLabel =
                        idx === 0 ? "১ম" : idx === 1 ? "২য়" : idx === 2 ? "৩য়" : `${idx + 1}`;
                      return (
                        <tr
                          key={donor._id}
                          className={`transition-colors hover:bg-muted/40 ${
                            isTop3 ? "bg-amber-50/30 dark:bg-amber-950/10" : ""
                          }`}
                        >
                          <td className="px-4 py-4 text-center whitespace-nowrap">
                            <span
                              className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                                idx === 0
                                  ? "bg-amber-400 text-amber-950 shadow-sm"
                                  : idx === 1
                                  ? "bg-slate-300 text-slate-900"
                                  : idx === 2
                                  ? "bg-amber-700/80 text-white"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {bn ? toBnDigits(idx + 1) : idx + 1}
                            </span>
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap">
                            <div className="font-bold text-foreground text-base">{donor.donorName}</div>
                            {idx === 0 ? (
                              <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                                ⭐ {bn ? "সর্বোচ্চ দাতা সদস্য" : "Chief Donor"}
                              </span>
                            ) : null}
                          </td>
                          <td className="px-5 py-4">
                            <div className="text-foreground">{donor.donorAddress || "—"}</div>
                          </td>
                          <td className="px-5 py-4">
                            <div className="text-muted line-clamp-2 max-w-xs">{donor.purpose || "—"}</div>
                          </td>
                          <td className="px-5 py-4 text-right whitespace-nowrap">
                            <span className="inline-block rounded-lg bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 text-base font-extrabold text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                              {formatTaka(donor.amount, lang)}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right whitespace-nowrap text-xs text-muted">
                            {formatDateDisplay(donor.date, lang)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </div>
    </Shell>
  );
}
