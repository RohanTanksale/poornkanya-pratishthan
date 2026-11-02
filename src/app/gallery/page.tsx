import Link from "next/link";
import { PageIntro } from "@/components/ui/page-intro";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata(
  "Gallery",
  "View photographs from Poornakanya Pratishthan when approved organisational images are available.",
  "/gallery",
);

export default function GalleryPage() {
  return (
    <main id="main-content" lang="en">
      <PageIntro
        description="A place for approved photographs from the organisation's programmes, events and community."
        eyebrow="Photo gallery"
        title="Moments from our community."
        tone="sage"
      />
      <section aria-labelledby="gallery-empty-title" className="gallery-empty-section section-pad">
        <div className="gallery-empty-state">
          <p className="eyebrow">Gallery</p>
          <h2 id="gallery-empty-title">Photographs are not available yet.</h2>
          <p>
            No approved organisational photographs have been published here.
            This page will show images when verified, authorised photographs
            are available.
          </p>
          <Link className="text-link" href="/contact">
            Contact the organisation <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
