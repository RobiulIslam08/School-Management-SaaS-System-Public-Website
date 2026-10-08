import { ReceiptLookup } from "@/components/receipt-lookup";
import { PageIntro, Shell } from "@/components/shell";
import { getSite } from "@/lib/api";
import { getLang } from "@/lib/locale";

export default async function Page() {
  const [site, lang] = await Promise.all([getSite(), getLang()]);
  if (!site) return <p className="p-8">The school site could not be loaded.</p>;
  return (
    <Shell site={site} lang={lang}>
      <PageIntro
        kicker="Academic"
        title={lang === "bn" ? "জমার রসিদ" : "Payment receipts"}
        summary={
          lang === "bn"
            ? "জমা দেওয়া টাকার হিসাব দেখতে শিক্ষার্থী আইডি দিন। মিল না হলে একই বার্তা। রসিদ এই পাতা থেকে।"
            : "Enter the student ID to see payments already made. A miss uses one message. The receipt is printed from this page."
        }
        image={site.config.heroImageUrl}
        alt={site.school.name}
      />
      <div className="step-row step-pair">
        {(lang === "bn"
          ? [
              ["০১", "শিক্ষার্থী আইডি", "আইডি দিন। আইডি না মিললে, বা জমা না থাকলে, একই বার্তা।"],
              ["০২", "রসিদ", "মিললে জমার তালিকা। দেখুন বা রসিদ পিডিএফ এই পাতা থেকে। বকেয়া আসে না।"],
            ]
          : [
              ["01", "Student ID", "Enter the ID. A missing ID and a student with no payment use one message."],
              ["02", "Receipt", "A match lists the payments. View or save the receipt from this page. Dues do not appear."],
            ]
        ).map(([num, title, body]) => (
          <section key={num} className="story-card">
            <span className="story-num">{num}</span>
            <div>
              <h2>{title}</h2>
              <p>{body}</p>
            </div>
          </section>
        ))}
      </div>
      <ReceiptLookup lang={lang} enabled={site.config.receiptLookupEnabled} school={site.school} />
    </Shell>
  );
}
