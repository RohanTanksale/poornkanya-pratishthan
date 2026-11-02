import Link from "next/link";
import { PageIntro } from "@/components/ui/page-intro";
import { SectionHeading } from "@/components/ui/section-heading";
import { growthChallenges, fiveYearVision } from "@/data/vision";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata(
  "Five-year vision",
  "Explore Poornakanya Pratishthan's stated priorities for connection, study, inclusion and organisational growth.",
  "/vision",
);

export default function VisionPage() {
  return (
    <main id="main-content" lang="en">
      <PageIntro
        description="A direction for the next five years—grounded in learning, connection, inclusion and thoughtful organisational growth."
        eyebrow="Looking ahead"
        title="A vision that grows with every young woman."
        tone="sage"
      />
      <section className="vision-roadmap section-pad">
        <SectionHeading
          description="These are priorities shared by the organisation. No additional deadlines or numerical targets have been assumed."
          eyebrow="Our next five years"
          title="A shared path forward."
        />
        <div className="roadmap-list">
          {fiveYearVision.map((priority, index) => (
            <article className="roadmap-item" key={priority.title}>
              <span className="roadmap-number">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h2>{priority.title}</h2>
                <p>{priority.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="challenges-section section-pad">
        <SectionHeading
          description="These are opportunities to strengthen systems, communication and community participation—not shortcomings of the people doing the work."
          eyebrow="Growing thoughtfully"
          title="Challenges we can meet together."
        />
        <div className="challenge-grid">
          {growthChallenges.map((challenge) => (
            <article className="challenge-card" key={challenge.title}>
              <h2>{challenge.title}</h2>
              <p>{challenge.description}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="about-cta">
        <p className="eyebrow">Take the next step</p>
        <h2>Explore the work and ways to connect.</h2>
        <Link className="button" href="/programmes">
          Explore programmes <span aria-hidden="true">↗</span>
        </Link>
      </section>
    </main>
  );
}
