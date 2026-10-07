"use client";

import { useState } from "react";
import { resolvePhoto } from "@/lib/media";

export function SitePhoto({
  src,
  alt,
  label,
  className,
  quiet,
}: {
  src?: string;
  alt: string;
  label?: string;
  className?: string;
  quiet?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const resolved = resolvePhoto(src);
  if (!resolved || failed) {
    if (quiet) return null;
    const mark = (label || alt).trim().slice(0, 1);
    return (
      <span className={["photo-fallback", className].filter(Boolean).join(" ")} role="img" aria-label={alt}>
        {mark}
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={resolved} alt={alt} className={className} onError={() => setFailed(true)} />
  );
}
