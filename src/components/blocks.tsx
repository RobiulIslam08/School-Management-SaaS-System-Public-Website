import type { Lang, PageBlock } from "@/lib/types";
import { resolvePhoto } from "@/lib/media";
import { pick } from "@/lib/text";

interface Section {
  heading?: PageBlock;
  body: PageBlock[];
}

function sectionsOf(blocks: PageBlock[]): Section[] {
  const sections: Section[] = [];
  let current: Section = { body: [] };
  for (const block of blocks) {
    if (block.type === "heading") {
      if (current.heading || current.body.length) sections.push(current);
      current = { heading: block, body: [] };
    } else {
      current.body.push(block);
    }
  }
  if (current.heading || current.body.length) sections.push(current);
  return sections;
}

function indexLabel(index: number, lang: Lang): string {
  const value = String(index).padStart(2, "0");
  if (lang !== "bn") return value;
  const digits = "০১২৩৪৫৬৭৮৯";
  return value.replace(/\d/g, (digit) => digits[Number(digit)] ?? digit);
}

function itemsOf(block: PageBlock, lang: Lang): string[] {
  const items = lang === "en" && block.itemsEn?.length ? block.itemsEn : block.itemsBn ?? block.itemsEn ?? [];
  return items.filter(Boolean);
}

export function Blocks({ blocks, lang }: { blocks: PageBlock[]; lang: Lang }) {
  const sections = sectionsOf(blocks.filter((block) => block.type !== "image"));
  const images = blocks.filter((block) => block.type === "image" && block.imageUrl);
  const lead = sections.find((section) => !section.heading);
  const cards = sections.filter((section) => section.heading);
  return (
    <div className="article">
      {lead ? <Lead section={lead} lang={lang} /> : null}
      {cards.map((section, index) => (
        <SectionCard key={index} section={section} index={index + 1} lang={lang} />
      ))}
      {images.map((block, index) => (
        <figure key={index} className="article-figure">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={resolvePhoto(block.imageUrl)} alt={block.alt || ""} />
        </figure>
      ))}
    </div>
  );
}

function Lead({ section, lang }: { section: Section; lang: Lang }) {
  return (
    <div className="story-lead">
      {section.body.map((block, index) => {
        const text = pick(lang, block.textBn, block.textEn);
        return text ? <p key={index}>{text}</p> : null;
      })}
    </div>
  );
}

function SectionCard({ section, index, lang }: { section: Section; index: number; lang: Lang }) {
  const title = section.heading ? pick(lang, section.heading.textBn, section.heading.textEn) : "";
  const paragraphs = section.body.filter((block) => block.type === "paragraph");
  const lists = section.body.filter((block) => block.type === "list");
  return (
    <section className="story-card">
      <span className="story-num">{indexLabel(index, lang)}</span>
      <div>
        {title ? <h2>{title}</h2> : null}
        {paragraphs.map((block, paragraphIndex) => {
          const text = pick(lang, block.textBn, block.textEn);
          return text ? <p key={paragraphIndex}>{text}</p> : null;
        })}
        {lists.map((block, listIndex) => (
          <ul key={listIndex} className="story-ticks">
            {itemsOf(block, lang).map((item, itemIndex) => <li key={`${listIndex}-${itemIndex}`}>{item}</li>)}
          </ul>
        ))}
      </div>
    </section>
  );
}
