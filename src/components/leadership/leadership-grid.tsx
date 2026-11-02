const mentors = [
  {
    name: "Rev. Master Dr. R. P. Parnerkar",
    title: "Founder & Spiritual Mentor",
    initials: "RP",
  },
  {
    name: "Dr. V. R. Parnerkar",
    title: "Guide & Executive Trustee",
    initials: "VR",
  },
];

export default function LeadershipGrid() {
  return (
    <section className="leadership-grid-section">
      <div className="leadership-grid-heading">
        <p className="leadership-eyebrow">Our Mentors</p>
        <h2>Guided by Vision & Commitment</h2>
        <p className="leadership-intro">
          Inspired by wisdom, strengthened by dedication, and united by purpose.
        </p>
      </div>

      <div className="leadership-grid">
        {mentors.map((person) => (
          <article
            key={person.initials}
            className="leadership-card leadership-card-featured"
          >
            <div className="leadership-avatar leadership-avatar-featured"
              aria-label={`Initials ${person.initials}`}
            >
              <span>{person.initials}</span>
            </div>

            <div className="leadership-card-content">
              <h3>{person.name}</h3>
              <p>{person.title}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
