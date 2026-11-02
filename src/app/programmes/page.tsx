import { PageIntro } from "@/components/ui/page-intro";
import { PhotoGallery } from "@/components/ui/photo-gallery";
import { ProgrammeCard } from "@/components/ui/programme-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { englishProgrammePhotos } from "@/data/photo-galleries";
import { programmeThemes, upcomingInitiatives } from "@/data/programmes";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata(
  "Programmes",
  "Explore documented activities and clearly labelled planned initiatives from Poornakanya Pratishthan.",
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
      <section aria-labelledby="programme-overview-title" className="programmes-intro section-pad">
        <SectionHeading
          description="The descriptions below reflect information currently available from the organisation. No schedules or additional programme details have been inferred."
          eyebrow="Documented activities"
          title="A place to learn, express and connect."
          id="programme-overview-title"
        />
        <div className="programme-detail-grid">
          {programmeThemes.map((programme) => (
            <ProgrammeCard key={programme.number} programme={programme} />
          ))}
        </div>
      </section>

      <PhotoGallery
        description="Only approved photographs are shown. There are no programme photographs available in the project at this time."
        eyebrow="Programme photographs"
        photos={englishProgrammePhotos}
        title="The work, in pictures."
      />

      <section aria-labelledby="planned-initiatives-title" className="initiatives-section section-pad">
        <SectionHeading
          description="These activities are planned initiatives, not claims that these programmes have already taken place."
          eyebrow="Planned activities"
          title="Ideas taking shape."
          id="planned-initiatives-title"
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
