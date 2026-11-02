import Link from "next/link";
import { PageIntro } from "@/components/ui/page-intro";
import { PhotoGallery } from "@/components/ui/photo-gallery";
import { PhilosophyProfileCard } from "@/components/ui/philosophy-profile-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { organisation } from "@/data/organisation";
import { englishHistoryPhotos } from "@/data/photo-galleries";
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
        description="An organisation dedicated to the holistic development of girls and young women."
        eyebrow="About Poornakanya Pratishthan"
        title="Helping potential find its direction."
      />
      <section className="story-section section-pad">
        <div className="story-marker">
          <span className="eyebrow">01 / Our beginning</span>
          <span aria-hidden="true" className="story-rule" />
        </div>
        <div className="story-copy">
          <h2>
            Formative years.
            <br />
            <em>Meaningful futures.</em>
          </h2>
          <p className="story-lead">{organisation.purpose}</p>
          <p>
            Poornakanya Pratishthan was established on{" "}
            <strong>{organisation.established}</strong> by{" "}
            <strong>{organisation.founder}</strong>, daughter of{" "}
            {organisation.founderRelation}. Girls and young women aged{" "}
            <strong>{organisation.eligibleAge}</strong> are currently eligible
            to join. The earlier eligibility age was{" "}
            {organisation.previousEligibleAge}.
          </p>
        </div>
      </section>
      <PhotoGallery
        description="Authentic archival photographs can help tell the organisation's story across the years."
        eyebrow="The organisation's journey"
        photos={englishHistoryPhotos}
        title="A history in pictures."
      />
      <section className="history-section section-pad">
        <SectionHeading
          description="The organisation's purpose is to help girls recognise their strengths and build confidence during their formative years."
          eyebrow="Purpose"
          title="Guidance that strengthens the whole person."
        />
        <div className="values-grid">
          {organisation.aims.map((aim, index) => (
            <article className="value-item" key={aim}>
              <span className="value-number">{String(index + 1).padStart(2, "0")}</span>
              <h3>{aim}</h3>
            </article>
          ))}
        </div>
      </section>
      <section className="philosophy-section section-pad">
        <SectionHeading
          description={organisation.philosophy}
          eyebrow="Poornawadi philosophy"
          title="From self to a wider world."
        />
        <div className="growth-sequence" aria-label="Individual, family, society, nation, world">
          {["Individual", "Family", "Society", "Nation", "World"].map((stage, index) => (
            <span key={stage}>
              {stage}
              {index < 4 ? <span aria-hidden="true"> → </span> : null}
            </span>
          ))}
        </div>
        <div className="philosophy-profile-grid">
          {organisation.philosophyProfiles.map((profile) => (
            <PhilosophyProfileCard key={profile.name} {...profile} />
          ))}
        </div>
        <div className="dimensions-grid">
          {organisation.dimensions.map((dimension) => (
            <article key={dimension.term}>
              <h3>{dimension.term}</h3>
              <p>{dimension.description}</p>
            </article>
          ))}
        </div>
        <ul className="objective-list">
          {organisation.objectives
            .filter((objective) => !objective.startsWith("Encourage progress"))
            .map((objective) => (
              <li key={objective}>{objective}</li>
            ))}
        </ul>
      </section>
      <section className="branches-history section-pad">
        <SectionHeading
          description="The organisation's geographical presence has included states across India and Mauritius. The figures below describe only its initial phase."
          eyebrow="A widening circle"
          title="Across regions and communities."
        />
        <div className="region-list">
          {organisation.regions.map((region) => (
            <span key={region}>{region}</span>
          ))}
        </div>
        <p className="historical-stat-note">
          Historical initial-phase figures: {organisation.initialBranches} branches
          and {organisation.initialMembers} members. These are not current counts;
          updated branch and membership information is being collected.
        </p>
      </section>
      <section className="about-cta">
        <p className="eyebrow">Continue exploring</p>
        <h2>See the programmes and future priorities.</h2>
        <Link className="button" href="/programmes">
          Explore programmes <span aria-hidden="true">↗</span>
        </Link>
      </section>
    </main>
  );
}
