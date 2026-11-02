"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";

type PhotoGalleryViewerProps = {
  photos: Array<{ src: string; alt: string; caption: string }>;
  layout: "grid" | "single";
};

export function PhotoGalleryViewer({
  photos,
  layout,
}: PhotoGalleryViewerProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const isOpen = activeIndex !== null;
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const closeGallery = useCallback(() => {
    setActiveIndex(null);
    requestAnimationFrame(() => returnFocusRef.current?.focus());
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeGallery();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        setActiveIndex((current) =>
          current === null ? 0 : (current + 1) % photos.length,
        );
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        setActiveIndex((current) =>
          current === null
            ? 0
            : (current - 1 + photos.length) % photos.length,
        );
      } else if (event.key === "Tab") {
        const focusable = dialogRef.current?.querySelectorAll<HTMLButtonElement>(
          "button:not(:disabled)",
        );
        if (!focusable?.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closeGallery, isOpen, photos.length]);

  function openGallery(index: number, event: MouseEvent<HTMLButtonElement>) {
    returnFocusRef.current = event.currentTarget;
    setActiveIndex(index);
  }

  return (
    <>
      <div
        className={`photo-gallery-grid${layout === "single" ? " photo-gallery-single" : ""}`}
      >
        {photos.map((photo, index) => (
          <figure className="photo-slot" key={`${photo.caption}-${index}`}>
            <button
              aria-label={`Open photo: ${photo.caption}`}
              className="photo-gallery-trigger"
              onClick={(event) => openGallery(index, event)}
              type="button"
            >
              <span className="photo-slot-frame">
                <Image
                  alt={photo.alt}
                  className="photo-slot-image"
                  fill
                  sizes="(max-width: 760px) 100vw, 33vw"
                  src={photo.src}
                />
              </span>
            </button>
            <figcaption>{photo.caption}</figcaption>
          </figure>
        ))}
      </div>
      {activeIndex !== null ? (
        <div
          className="photo-lightbox-backdrop"
          onClick={(event) => {
            if (event.target === event.currentTarget) closeGallery();
          }}
        >
          <div
            aria-labelledby="photo-lightbox-caption"
            aria-modal="true"
            className="photo-lightbox"
            ref={dialogRef}
            role="dialog"
            tabIndex={-1}
          >
            <button
              aria-label="Close photo viewer"
              className="photo-lightbox-close"
              onClick={closeGallery}
              ref={closeButtonRef}
              type="button"
            >
              <span aria-hidden="true">×</span>
            </button>
            <button
              aria-label="Previous photo"
              className="photo-lightbox-previous"
              onClick={() =>
                setActiveIndex((activeIndex - 1 + photos.length) % photos.length)
              }
              type="button"
            >
              <span aria-hidden="true">‹</span>
            </button>
            <figure className="photo-lightbox-figure">
              <div className="photo-lightbox-image">
                <Image
                  alt={photos[activeIndex].alt}
                  fill
                  priority
                  sizes="(max-width: 760px) 96vw, 86vw"
                  src={photos[activeIndex].src}
                />
              </div>
              <figcaption id="photo-lightbox-caption">
                {photos[activeIndex].caption}
              </figcaption>
            </figure>
            <button
              aria-label="Next photo"
              className="photo-lightbox-next"
              onClick={() => setActiveIndex((activeIndex + 1) % photos.length)}
              type="button"
            >
              <span aria-hidden="true">›</span>
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
