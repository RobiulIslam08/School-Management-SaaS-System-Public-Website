import React from "react";
import { photoProps, resolvePhoto } from "@/lib/media";

export interface RoyalFrameProps {
  photoUrl?: string;
  name: string;
  designation?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showPlate?: boolean;
  className?: string;
  priority?: boolean;
}

const SIZE_CLASSES = {
  sm: "w-32 sm:w-36 max-w-[9rem]",
  md: "w-48 sm:w-56 max-w-[14rem]",
  lg: "w-56 sm:w-64 md:w-72 max-w-[18rem]",
  xl: "w-64 sm:w-72 md:w-80 max-w-[20rem]",
};

export function RoyalFrame({
  photoUrl,
  name,
  designation,
  size = "md",
  showPlate = false,
  className = "",
  priority = false,
}: RoyalFrameProps) {
  const resolved = photoUrl ? resolvePhoto(photoUrl) : "";
  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;

  return (
    <div className={`royal-frame-wrapper ${sizeClass} flex flex-col items-center ${className}`}>
      <div className="royal-frame-container w-full">
        {/* Inner portrait cutout */}
        <div className="royal-frame-inner">
          {resolved ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              {...photoProps(resolved, "240px")}
              alt={name}
              loading={priority ? "eager" : "lazy"}
              decoding="async"
              className="royal-frame-photo"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-100 to-amber-200 text-3xl sm:text-4xl font-extrabold text-amber-900 shadow-inner">
              {name ? name.slice(0, 1) : "🏛️"}
            </div>
          )}
        </div>

        {/* 3D Ornate Baroque Carved Frame Overlay */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          {...photoProps("/media/baroque-gold-frame.webp", "320px")}
          alt=""
          aria-hidden="true"
          className="royal-frame-overlay"
          loading={priority ? "eager" : "lazy"}
          decoding="async"
        />
      </div>

      {/* Institutional Brass Plaque */}
      {showPlate && (name || designation) && (
        <div className="royal-brass-plate w-full">
          {name && <strong title={name}>{name}</strong>}
          {designation && <span title={designation}>{designation}</span>}
        </div>
      )}
    </div>
  );
}
