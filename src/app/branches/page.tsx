import { PageIntro } from "@/components/ui/page-intro";
import { PhotoGallery } from "@/components/ui/photo-gallery";
import { SectionHeading } from "@/components/ui/section-heading";
import { historicalRegions, initialPhaseFigures } from "@/data/branches";
import { englishBranchPhotos } from "@/data/photo-galleries";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata(
  "Branches",
  "Learn about the historical geographical presence of Poornakanya Pratishthan and its evolving branch network.",
  "/branches",
);

export default function BranchesPage() {
  return (
    <main id="main-content" lang="en">
      <PageIntro
        description="A growing circle of connection across regions and communities."
        eyebrow="Our reach"
        title="A network shaped by shared purpose."
        tone="rose"
      />
      <section className="branches-history section-pad">
        <SectionHeading
          description="The organisation's geographical presence has included the following regions."
          eyebrow="Geographical expansion"
          title="Across India and beyond."
        />
        <div className="region-list">
          {historicalRegions.map((region) => (
            <span key={region}>{region}</span>
          ))}
        </div>
      </section>
      <section className="historical-figures section-pad">
        <p className="eyebrow">{initialPhaseFigures.label}</p>
        <div className="historical-figure-grid">
          <article>
            <strong>{initialPhaseFigures.branches}</strong>
            <span>Branches established during the initial phase</span>
          </article>
          <article>
            <strong>{initialPhaseFigures.members}</strong>
            <span>Members associated during the initial phase</span>
          </article>
        </div>
        <p className="historical-stat-note">
          These are historical figures, not current statistics. Updated branch
          and membership information is being collected. Current branch
          addresses and contacts will be listed once verified.
        </p>
      </section>
      <PhotoGallery
        description="Add verified photographs of branch activities and community gatherings when available."
        eyebrow="Across the network"
        photos={englishBranchPhotos}
        title="Branches and communities."
      />
    </main>
  );
}
