export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-6 animate-pulse" aria-live="polite" aria-busy="true">
      {/* Banner skeleton */}
      <div className="h-44 sm:h-60 w-full rounded-2xl border border-line/60 bg-card/80 p-6 flex flex-col justify-end space-y-3">
        <div className="h-3 w-28 rounded-full bg-brand/15" />
        <div className="h-8 w-2/3 sm:w-1/2 rounded-lg bg-brand/20" />
        <div className="h-4 w-3/4 sm:w-2/3 rounded-md bg-ink/10" />
      </div>

      {/* Content cards skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="h-36 rounded-2xl border border-line/60 bg-card p-5 space-y-3">
          <div className="h-4 w-16 rounded bg-brand/15" />
          <div className="h-5 w-3/4 rounded bg-ink/15" />
          <div className="h-3 w-full rounded bg-ink/10" />
          <div className="h-3 w-2/3 rounded bg-ink/10" />
        </div>
        <div className="h-36 rounded-2xl border border-line/60 bg-card p-5 space-y-3">
          <div className="h-4 w-16 rounded bg-brand/15" />
          <div className="h-5 w-3/4 rounded bg-ink/15" />
          <div className="h-3 w-full rounded bg-ink/10" />
          <div className="h-3 w-2/3 rounded bg-ink/10" />
        </div>
        <div className="h-36 rounded-2xl border border-line/60 bg-card p-5 space-y-3 hidden lg:block">
          <div className="h-4 w-16 rounded bg-brand/15" />
          <div className="h-5 w-3/4 rounded bg-ink/15" />
          <div className="h-3 w-full rounded bg-ink/10" />
          <div className="h-3 w-2/3 rounded bg-ink/10" />
        </div>
      </div>
    </div>
  );
}
