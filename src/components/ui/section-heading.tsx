type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  alignment?: "left" | "center";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  alignment = "left",
}: SectionHeadingProps) {
  return (
    <div className={`section-heading align-${alignment}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {description ? <p className="section-description">{description}</p> : null}
    </div>
  );
}
