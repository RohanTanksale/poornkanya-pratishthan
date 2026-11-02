import Link from "next/link";
import { PageIntro } from "@/components/ui/page-intro";
import { PhotoGallery } from "@/components/ui/photo-gallery";
import { englishHomePhotos } from "@/data/photo-galleries";
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
      <PhotoGallery
        description="Only approved organisational photographs are shown in this gallery."
        eyebrow="Approved photographs"
        photos={englishHomePhotos}
        title="Moments from our community."
      >
          <Link className="text-link" href="/contact">
            Contact the organisation <span aria-hidden="true">↗</span>
          </Link>
      </PhotoGallery>
    </main>
  );
}
