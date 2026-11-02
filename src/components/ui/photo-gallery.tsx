import type { ReactNode } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { PhotoGalleryViewer } from "@/components/ui/photo-gallery-viewer";
import type { PhotoSlot } from "@/types/photo";

type PhotoGalleryProps = {
  eyebrow: string;
  title: string;
  description: string;
  photos: PhotoSlot[];
  layout?: "grid" | "single";
  children?: ReactNode;
};

export function PhotoGallery({
  eyebrow,
  title,
  description,
  photos,
  layout = "grid",
  children,
}: PhotoGalleryProps) {
  const availablePhotos = photos.filter(
    (photo): photo is PhotoSlot & { src: string } =>
      typeof photo.src === "string" && photo.src.length > 0,
  );

  return (
    <section aria-labelledby="photo-gallery-title" className="photo-gallery-section section-pad">
      <div className="photo-gallery-heading">
        <p className="eyebrow">{eyebrow}</p>
        <h2 id="photo-gallery-title">{title}</h2>
        <p>{description}</p>
      </div>
      {availablePhotos.length > 0 ? (
        <PhotoGalleryViewer layout={layout} photos={availablePhotos} />
      ) : (
        <EmptyState
          description="No approved photographs have been published here. Images will appear when verified, authorised photographs are available."
          eyebrow="Gallery"
          headingId="photo-gallery-empty-title"
          title="No approved photographs yet."
        >
          {children}
        </EmptyState>
      )}
    </section>
  );
}
