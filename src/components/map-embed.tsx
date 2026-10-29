"use client";

import { useState } from "react";

/** Google Maps pulls ~1MB of script; load it only when the visitor asks for the map. */
export function MapEmbed({ src, title, label, className }: { src: string; title: string; label: string; className?: string }) {
  const [open, setOpen] = useState(false);
  if (open) return <iframe title={title} className={className} src={src} loading="lazy" />;
  return (
    <button type="button" className={`map-facade ${className ?? ""}`} onClick={() => setOpen(true)} aria-label={`${label}: ${title}`}>
      <svg aria-hidden="true" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" />
        <circle cx="12" cy="9.5" r="2.5" />
      </svg>
      <span>{label}</span>
    </button>
  );
}
