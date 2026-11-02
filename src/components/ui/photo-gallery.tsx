import Image from "next/image";
import type { PhotoSlot } from "@/types/photo";

type PhotoGalleryProps = {
  eyebrow: string;
  title: string;
  description: string;
  photos: PhotoSlot[];
  layout?: "grid" | "single";
};

export function PhotoGallery({
  eyebrow,
  title,
  description,
  photos,
  layout = "grid",
}: PhotoGalleryProps) {
  return (
    <section className="photo-gallery-section section-pad">
      <div className="photo-gallery-heading">
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <div
        className={`photo-gallery-grid${layout === "single" ? " photo-gallery-single" : ""}`}
      >
        {photos.map((photo, index) => (
          <figure className="photo-slot" key={`${photo.caption}-${index}`}>
            <div className="photo-slot-frame">
              {photo.src ? (
                <Image
                  alt={photo.alt}
                  className="photo-slot-image"
                  fill
                  sizes="(max-width: 760px) 100vw, 33vw"
                  src={photo.src}
                />
              ) : (
                <div
                  aria-label={`Photo space: ${photo.caption}`}
                  className="photo-slot-placeholder"
                  role="img"
                >
                  <span aria-hidden="true" className="photo-slot-mark">
                    <span />
                    <span />
                    <span />
                  </span>
                  <span className="photo-slot-label">Photo space</span>
                </div>
              )}
            </div>
            <figcaption>
              <span>{photo.caption}</span>
              {!photo.src ? (
                <span className="photo-slot-note">
                  An authentic organisational photo can be added here.
                </span>
              ) : null}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
