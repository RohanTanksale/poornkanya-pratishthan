import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

type PageIntroProps = {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
  tone?: "default" | "rose" | "sage";
};

export function PageIntro({
  eyebrow,
  title,
  description,
  children,
  tone = "default",
}: PageIntroProps) {
  return (
    <section className={`page-intro tone-${tone}`}>
      <div className="page-intro-inner">
        <Breadcrumbs />
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="page-intro-description">{description}</p>
        {children}
      </div>
      <span aria-hidden="true" className="intro-ornament">
        <span />
        <span />
        <span />
      </span>
    </section>
  );
}
