import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24">
      <p className="text-sm font-semibold text-accent">404</p>
      <h1 className="display mt-2 text-3xl font-semibold">এই পাতা নেই</h1>
      <p className="mt-3 text-muted">লিংকটি বদলে গেছে, অথবা পাতাটি এখনো প্রকাশিত হয়নি।</p>
      <Link className="mt-6 inline-flex h-11 items-center rounded-full bg-brand px-5 font-semibold text-on-brand" href="/">হোমে ফিরুন</Link>
    </div>
  );
}
