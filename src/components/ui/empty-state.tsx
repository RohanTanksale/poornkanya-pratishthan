import type { ReactNode } from "react";

type EmptyStateProps = {
  description: string;
  headingId: string;
  title: string;
  eyebrow?: string;
  headingLevel?: "h2" | "h3" | "h4";
  children?: ReactNode;
};

export function EmptyState({
  description,
  headingId,
  title,
  eyebrow = "No content available",
  headingLevel = "h3",
  children,
}: EmptyStateProps) {
  const Heading = headingLevel;

  return (
    <div className="gallery-empty-state">
      <p className="eyebrow">{eyebrow}</p>
      <Heading id={headingId}>{title}</Heading>
      <p>{description}</p>
      {children}
    </div>
  );
}
