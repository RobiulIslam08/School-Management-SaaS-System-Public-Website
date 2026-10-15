export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16" aria-live="polite" aria-busy="true">
      <div className="relative flex flex-col items-center justify-center">
        {/* Animated outer ring */}
        <div className="relative h-16 w-16">
          <div
            className="absolute inset-0 rounded-full border-4 border-t-transparent animate-spin"
            style={{
              borderColor: "rgba(var(--brand-rgb, 20, 83, 45), 0.15)",
              borderTopColor: "var(--brand, #14532d)",
            }}
          />
          <div
            className="absolute inset-2 rounded-full border-2 border-b-transparent animate-spin"
            style={{
              animationDirection: "reverse",
              animationDuration: "0.8s",
              borderColor: "rgba(var(--accent-rgb, 138, 106, 50), 0.2)",
              borderBottomColor: "var(--accent, #8a6a32)",
            }}
          />
        </div>

        {/* Text feedback */}
        <p className="mt-4 text-sm font-semibold tracking-wide text-brand animate-pulse">
          লোড হচ্ছে...
        </p>
      </div>

      {/* Subtle skeleton cards layout */}
      <div className="mx-auto mt-12 grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 opacity-40">
        <div className="h-28 rounded-2xl border border-line bg-card p-4 animate-pulse" />
        <div className="h-28 rounded-2xl border border-line bg-card p-4 animate-pulse" />
        <div className="h-28 rounded-2xl border border-line bg-card p-4 animate-pulse" />
      </div>
    </div>
  );
}
