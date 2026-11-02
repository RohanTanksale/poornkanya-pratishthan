type EditorialPlaceholderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function EditorialPlaceholder({
  eyebrow,
  title,
  description,
}: EditorialPlaceholderProps) {
  return (
    <div className="editorial-placeholder">
      <span aria-hidden="true" className="placeholder-symbol">
        <span />
        <span />
      </span>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  );
}
