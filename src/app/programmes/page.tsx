import { PageIntro } from "@/components/ui/page-intro";
import { PhotoGallery } from "@/components/ui/photo-gallery";
import { SectionHeading } from "@/components/ui/section-heading";
import { englishProgrammePhotos } from "@/data/photo-galleries";
import { programmeThemes, upcomingInitiatives } from "@/data/programmes";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata(
  "Programmes",
  "Explore Poornakanya Pratishthan's study camps, cultural programmes, expert guidance and planned initiatives.",
  "/programmes",
);

export default function ProgrammesPage() {
  return (
    <main id="main-content" lang="en">
      <PageIntro
        description="Learning, culture and conversation create room for girls and young women to discover and develop their abilities."
        eyebrow="Programmes & activities"
        title="Learning that reaches beyond the classroom."
        tone="rose"
      />
      <section className="programmes-intro section-pad">
        <SectionHeading
          description="Activities conducted by the organisation include study camps, singing competitions, cultural programmes, discussions, seminars, symposia, expert guidance and interactions with distinguished personalities."
          eyebrow="Areas of activity"
          title="A place to learn, express and connect."
        />
        <div className="theme-grid">
          {programmeThemes.map((programme) => (
            <article className={`theme-card theme-${programme.tone}`} key={programme.number}>
              <span className="theme-number">{programme.number}</span>
              <div className="theme-card-copy">
                <h3>{programme.title}</h3>
                <p>{programme.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <PhotoGallery
        description="Add authentic photographs from study camps, cultural programmes, competitions and guidance sessions."
        eyebrow="Programme photographs"
        photos={englishProgrammePhotos}
        title="The work, in pictures."
      />
      <section className="initiatives-section section-pad">
        <SectionHeading
          description="The following activities are planned initiatives, not claims that these programmes have already taken place."
          eyebrow="Upcoming activities & initiatives"
          title="Ideas taking shape."
        />
        <div className="initiative-grid">
          {upcomingInitiatives.map((initiative, index) => (
            <article className="initiative-card" key={initiative.title}>
              <span className="value-number">{String(index + 1).padStart(2, "0")}</span>
              <h2>{initiative.title}</h2>
              <p>{initiative.description}</p>
              <span className="content-status">Planned initiative</span>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
