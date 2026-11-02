import Link from "next/link";
import { PageIntro } from "@/components/ui/page-intro";
import { ProgrammeCard } from "@/components/ui/programme-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { organisation } from "@/data/organisation";
import { programmeThemes, upcomingInitiatives } from "@/data/programmes";
import { fiveYearVision } from "@/data/vision";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata(
  "About",
  "Learn about Poornakanya Pratishthan, established in 2006 to support the holistic development of girls and young women.",
  "/about",
);

export default function AboutPage() {
  return (
    <main id="main-content" lang="en">
      <PageIntro
        description="Established to support the holistic development of girls and young women through education, values and guidance."
        eyebrow="About Poornakanya Pratishthan"
        title="Helping potential find its direction."
      />

      <section aria-labelledby="about-introduction-title" className="story-section section-pad">
        <div className="story-marker">
          <span className="eyebrow">01 / Our beginning</span>
          <span aria-hidden="true" className="story-rule" />
        </div>
        <div className="story-copy">
          <h2 id="about-introduction-title">
            Formative years.
            <br />
            <em>Meaningful futures.</em>
          </h2>
          <p className="story-lead">{organisation.purpose}</p>
          <p>
            Poornakanya Pratishthan was established on{" "}
            <strong>{organisation.established}</strong> by{" "}
            <strong>{organisation.founder}</strong>, daughter of{" "}
            {organisation.founderRelation}. The eligibility age currently
            listed by the organisation is{" "}
            <strong>{organisation.eligibleAge}</strong>.
          </p>
        </div>
      </section>

      <section aria-labelledby="about-direction-title" className="about-direction-section section-pad">
        <SectionHeading
          description="The organisation's purpose and stated five-year priorities are presented separately."
          eyebrow="Vision & mission"
          title="A clear purpose, a shared direction."
          id="about-direction-title"
        />
        <div className="about-direction-grid">
          <article>
            <p className="eyebrow">Mission · stated purpose</p>
            <h3>Support the development of girls and young women.</h3>
            <p>{organisation.purpose}</p>
          </article>
          <article>
            <p className="eyebrow">Vision · Poornawadi philosophy</p>
            <h3>From the individual to family, society, nation and world.</h3>
            <p>{organisation.philosophy}</p>
            <Link className="text-link" href="/vision">
              Explore the five-year vision <span aria-hidden="true">↗</span>
            </Link>
          </article>
        </div>
      </section>

      <section aria-labelledby="about-vision-title" className="vision-roadmap section-pad">
        <SectionHeading
          description="These priorities come from the organisation's stated five-year vision; no additional deadlines or targets have been assumed."
          eyebrow="Five-year vision"
          title="A shared path forward."
          id="about-vision-title"
        />
        <div className="roadmap-list">
          {fiveYearVision.map((priority, index) => (
            <article className="roadmap-item" key={priority.title}>
              <span className="roadmap-number">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3>{priority.title}</h3>
                <p>{priority.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="about-objectives-title" className="history-section section-pad">
        <SectionHeading
          description="The organisation's published objectives connect individual growth with learning, service and social development."
          eyebrow="Objectives"
          title="Growing with purpose."
          id="about-objectives-title"
        />
        <ul className="objective-list">
          {organisation.objectives.map((objective) => (
            <li key={objective}>{objective}</li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="about-activities-title" className="focus-section section-pad">
        <SectionHeading
          description="The activities below are drawn from existing organisation information."
          eyebrow="Activities"
          title="Learning, expression and connection."
          id="about-activities-title"
        />
        <div className="theme-grid">
          {programmeThemes.map((programme) => (
            <ProgrammeCard key={programme.number} programme={programme} />
          ))}
        </div>
      </section>

      <section aria-labelledby="about-programmes-title" className="initiatives-section section-pad">
        <SectionHeading
          description="These are planned initiatives, not claims that the activities have already taken place."
          eyebrow="Related programmes"
          title="Ideas taking shape."
          id="about-programmes-title"
        />
        <div className="initiative-grid">
          {upcomingInitiatives.slice(0, 3).map((initiative, index) => (
            <article className="initiative-card" key={initiative.title}>
              <span className="value-number">{String(index + 1).padStart(2, "0")}</span>
              <h3>{initiative.title}</h3>
              <p>{initiative.description}</p>
              <span className="content-status">Planned initiative</span>
            </article>
          ))}
        </div>
        <Link className="text-link about-programmes-link" href="/programmes">
          See all programmes and initiatives <span aria-hidden="true">↗</span>
        </Link>
      </section>

      <section aria-labelledby="about-membership-title" className="about-cta">
        <div>
          <p className="eyebrow">Membership</p>
          <h2 id="about-membership-title">Take part in our community.</h2>
        </div>
        <Link className="button" href="/apply">
          Read the instructions and apply <span aria-hidden="true">↗</span>
        </Link>
      </section>
    </main>
  );
}
