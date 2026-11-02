import { programmeThemes } from "@/data/programmes";

export function ProgrammeThemeGrid() {
  return (
    <div className="theme-grid">
      {programmeThemes.map((theme) => (
        <article className={`theme-card theme-${theme.tone}`} key={theme.number}>
          <span className="theme-number">{theme.number}</span>
          <div className="theme-card-copy">
            <h3>{theme.title}</h3>
            <p>{theme.description}</p>
          </div>
          <span aria-hidden="true" className="theme-arrow">
            ↗
          </span>
        </article>
      ))}
    </div>
  );
}
