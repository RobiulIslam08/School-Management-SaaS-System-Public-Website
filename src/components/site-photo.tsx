"use client";

import { useState } from "react";
import { mediaSrcSet, resolvePhoto } from "@/lib/media";

export function SitePhoto({
  src,
  alt,
  label,
  className,
  quiet,
  priority = false,
  sizes = "(min-width: 1024px) 50vw, 100vw",
}: {
  src?: string;
  alt: string;
  label?: string;
  className?: string;
  quiet?: boolean;
  priority?: boolean;
  /** Rendered width hint for `srcset`; pass a small value (e.g. "96px") for thumbnails. */
  sizes?: string;
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
  const srcSet = mediaSrcSet(resolved);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={resolved}
      srcSet={srcSet || undefined}
      sizes={srcSet ? sizes : undefined}
      alt={alt}
      className={className}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      onError={() => setFailed(true)}
    />
  );
}
