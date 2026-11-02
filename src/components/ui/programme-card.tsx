type ProgrammeTheme = {
  number: string;
  title: string;
  description: string;
  tone: string;
};

export function ProgrammeCard({ programme }: { programme: ProgrammeTheme }) {
  return (
    <article
      className={`theme-card theme-${programme.tone}`}
      id={`programme-${programme.number}`}
    >
      <span className="theme-number">{programme.number}</span>
      <div className="theme-card-copy">
        <h3>{programme.title}</h3>
        <p>{programme.description}</p>
      </div>
    </article>
  );
}
