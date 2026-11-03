import { BranchDirectory } from "@/components/ui/branch-directory";
import { HistoricalFigures } from "@/components/ui/historical-figures";
import { PhotoGallery } from "@/components/ui/photo-gallery";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  branches,
  historicalRegions,
  initialPhaseFigures,
} from "@/data/branches";
import { englishBranchPhotos } from "@/data/photo-galleries";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata(
  "Branches",
  "Discover the branches of Poornakanya Pratishthan and our growing community network.",
  "/branches",
);

export default function BranchesPage() {
  return (
    <main id="main-content" lang="en">
      <section className="branches-hero">
        <div className="branches-hero-inner">
          <span className="branches-hero-eyebrow">
            POORNAKANYA PRATISHTHAN · OUR NETWORK
          </span>
          <h1>Connecting Communities, Spreading Values.</h1>
          <p>
            A shared vision that brings people together across locations,
            communities and generations.
          </p>
          <a href="#branch-directory" className="branches-hero-link">
            Explore our branches <span aria-hidden="true">↓</span>
          </a>
        </div>
        <div className="branches-hero-decoration" aria-hidden="true">✦</div>
      </section>

      <div id="branch-directory">
        <BranchDirectory branches={branches} />
      </div>

      <section className="branches-history section-pad">
        <SectionHeading
          description="The organisation's geographical presence has included the following regions."
          eyebrow="Our journey"
          title="Across India and beyond."
        />
        <div className="region-list">
          {historicalRegions.map((region) => (
            <span key={region}>{region}</span>
          ))}
        </div>
      </section>

      <HistoricalFigures
        branches={initialPhaseFigures.branches}
        members={initialPhaseFigures.members}
        label={initialPhaseFigures.label}
      />

      <PhotoGallery
        description="Explore photographs of branch activities and community gatherings."
        eyebrow="Across the network"
        photos={englishBranchPhotos}
        title="Branches and communities."
      />
    </main>
  );
}


