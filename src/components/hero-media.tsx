import type { ReactNode } from "react";
import { SitePhoto } from "@/components/site-photo";

export function HeroStage({
  image,
  alt,
  seal,
  children,
}: {
  image: string;
  alt: string;
  seal?: string;
  children: ReactNode;
}) {
  return (
    <section className="hero-stage">
      <SitePhoto src={image} alt={alt} quiet />
      {seal ? <p className="hero-seal">{seal}</p> : null}
      <div className="hero-shade">
        <div className="hero-plate">{children}</div>
      </div>
    </section>
  );
}
