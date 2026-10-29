import React from "react";
import { photoProps, resolvePhoto } from "@/lib/media";

export interface FramedBaniBoardProps {
  kicker?: string;
  name: string;
  designation?: string;
  photoUrl?: string;
  quote?: string;
  message?: string;
  institutionName?: string;
  className?: string;
  variant?: "gold" | "royal";
  wide?: boolean;
}

export function FramedBaniBoard({
  kicker = "বাণী ও অনুপ্রেরণা",
  name,
  designation,
  photoUrl,
  quote,
  message,
  institutionName,
  className = "",
  variant = "gold",
  wide = false,
}: FramedBaniBoardProps) {
  const resolvedPhoto = photoUrl ? resolvePhoto(photoUrl) : "";
  const displayQuote = quote || message || "";
  const paragraphs = displayQuote.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

  return (
    <div className={`wall-quote-frame-wrapper ${wide ? "wall-quote-frame-wide" : ""} ${className}`}>
      {/* Wall Hanging Mount Bracket / Hook Accent */}
      <div className="wall-frame-hanger" aria-hidden="true">
        <div className="wall-frame-nail" />
        <div className="wall-frame-wire-left" />
        <div className="wall-frame-wire-right" />
      </div>

      {/* The Master Antique Carved 3D Wall Frame */}
      <article className={`wall-quote-frame ${variant === "royal" ? "wall-quote-frame-royal" : ""}`}>
        {/* Ornate Baroque Gilded Corner Accents on the outer wooden frame */}
        <div className="frame-corner frame-corner-tl" aria-hidden="true" />
        <div className="frame-corner frame-corner-tr" aria-hidden="true" />
        <div className="frame-corner frame-corner-bl" aria-hidden="true" />
        <div className="frame-corner frame-corner-br" aria-hidden="true" />

        {/* Top Center Ornate Crown Crest */}
        <div className="frame-top-crest" aria-hidden="true">
          <svg viewBox="0 0 120 28" fill="none" className="h-6 w-28 text-amber-300 drop-shadow">
            <path
              d="M60 2 L66 12 L78 12 L68 18 L72 28 L60 21 L48 28 L52 18 L42 12 L54 12 Z"
              fill="url(#gold-crest-grad)"
            />
            <path
              d="M20 18 Q40 8 58 14 Q40 22 20 18 Z M100 18 Q80 8 62 14 Q80 22 100 18 Z"
              fill="url(#gold-crest-grad)"
              opacity="0.9"
            />
            <defs>
              <linearGradient id="gold-crest-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffe699" />
                <stop offset="50%" stopColor="#d4af37" />
                <stop offset="100%" stopColor="#8c6218" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Inner Parchment Canvas / Mat Board */}
        <div className="wall-quote-mat">
          {/* Decorative Gold Filigree Inner Border */}
          <div className="mat-inner-border">
            {/* Corner Filigree Flourishes */}
            <span className="mat-corner-ornament mat-corner-tl" aria-hidden="true">⚜</span>
            <span className="mat-corner-ornament mat-corner-tr" aria-hidden="true">⚜</span>
            <span className="mat-corner-ornament mat-corner-bl" aria-hidden="true">⚜</span>
            <span className="mat-corner-ornament mat-corner-br" aria-hidden="true">⚜</span>

            {/* Header: Commemorative Ribbon / Banner */}
            <div className="wall-quote-header">
              <div className="wall-quote-ribbon">
                <span className="ribbon-tail ribbon-tail-left" />
                <h3 className="wall-quote-kicker">{kicker}</h3>
                <span className="ribbon-tail ribbon-tail-right" />
              </div>
              {institutionName ? (
                <p className="mt-1 text-[11px] sm:text-xs font-semibold tracking-wider text-amber-900/80 uppercase">
                  {institutionName}
                </p>
              ) : null}
            </div>

            {/* Leader Portrait: Gilded Medallion Oval / Beveled Frame */}
            <div className="wall-quote-portrait-row">
              <div className="wall-quote-portrait-wrap">
                <div className="wall-quote-portrait-oval">
                  {resolvedPhoto ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      {...photoProps(resolvedPhoto, "240px")}
                      alt={name}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover object-top"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-100 to-amber-200 text-3xl font-extrabold text-amber-900">
                      {name.slice(0, 1)}
                    </div>
                  )}
                </div>
                {/* 3D Gilded Ring Frame around the photo */}
                <div className="portrait-gold-rim" aria-hidden="true" />
              </div>

              {/* Leader Identity Plaque */}
              <div className="wall-quote-identity">
                <h4 className="wall-quote-name">{name}</h4>
                {designation ? <p className="wall-quote-desig">{designation}</p> : null}
              </div>
            </div>

            {/* Decorative Golden Divider */}
            <div className="wall-quote-divider" aria-hidden="true">
              <span className="divider-line" />
              <span className="divider-icon">✦ 🏛️ ✦</span>
              <span className="divider-line" />
            </div>

            {/* The Main Bani / Quote */}
            <div className="wall-quote-body">
              <span className="quote-mark quote-open" aria-hidden="true">“</span>
              <div className="wall-quote-paragraphs">
                {paragraphs.length > 0 ? (
                  paragraphs.map((para, idx) => (
                    <p key={idx} className="wall-quote-text">
                      {para}
                    </p>
                  ))
                ) : (
                  <p className="wall-quote-text">{displayQuote}</p>
                )}
              </div>
              <span className="quote-mark quote-close" aria-hidden="true">”</span>
            </div>

            {/* Bottom Plaque Seal Ornament */}
            <div className="wall-quote-bottom-seal" aria-hidden="true">
              <span className="seal-line" />
              <span className="seal-emblem">✦ ⚜ ✦</span>
              <span className="seal-line" />
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
