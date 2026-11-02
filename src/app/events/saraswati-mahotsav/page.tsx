import Link from "next/link";
import { PhotoGallery } from "@/components/ui/photo-gallery";
import { PageIntro } from "@/components/ui/page-intro";
import { SectionHeading } from "@/components/ui/section-heading";
import { saraswatiMahotsav } from "@/data/events";
import { englishEventPhotos } from "@/data/photo-galleries";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata(
  "Saraswati Mahotsav",
  "Read the available source information about Saraswati Mahotsav, the first major celebration of Poornakanya Pratishthan.",
  "/events/saraswati-mahotsav",
);

export default function SaraswatiMahotsavPage() {
  return (
    <main id="main-content" lang="en">
      <PageIntro
        description={saraswatiMahotsav.summary}
        eyebrow="Past event · event year not supplied"
        title="Saraswati Mahotsav."
        tone="sage"
      >
        <Link className="text-link" href="/events">
          All events <span aria-hidden="true">↗</span>
        </Link>
      </PageIntro>

      <section aria-labelledby="event-overview-title" className="event-overview-section section-pad">
        <SectionHeading
          description={saraswatiMahotsav.occasion}
          eyebrow="Event overview"
          title={saraswatiMahotsav.title}
          id="event-overview-title"
        />
        <dl className="event-detail-facts">
          <div>
            <dt>Dates</dt>
            <dd>{saraswatiMahotsav.dates} · year not supplied</dd>
          </div>
          <div>
            <dt>Location</dt>
            <dd>{saraswatiMahotsav.location}</dd>
          </div>
          <div>
            <dt>Occasion</dt>
            <dd>{saraswatiMahotsav.occasion}</dd>
          </div>
        </dl>
      </section>

      <section aria-labelledby="event-programme-title" className="event-details-section section-pad">
        <div>
          <SectionHeading
            description="Names and designations are shown as supplied in the source material."
            eyebrow="Distinguished guests"
            title="Guidance and shared knowledge."
          />
          <ul className="guest-list">
            {saraswatiMahotsav.guests.map((guest) => (
              <li key={guest.name}>
                <strong>{guest.name}</strong>
                <span>{guest.designation}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <SectionHeading
            description="The source material records these event activities."
            eyebrow="Programme"
            title="Moments from the celebration."
            id="event-programme-title"
          />
          <ol className="event-activities">
            {saraswatiMahotsav.activities.map((activity) => (
              <li key={activity}>{activity}</li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="event-report-title" className="event-report-section section-pad">
        <div>
          <p className="eyebrow">Event report</p>
          <h2 id="event-report-title">No report has been published.</h2>
          <p>
            A report or additional event information will be shared here when
            verified and approved.
          </p>
        </div>
      </section>

      <PhotoGallery
        description="No approved event photographs are available in the project."
        eyebrow="Event photographs"
        photos={englishEventPhotos}
        title="Saraswati Mahotsav in pictures."
      />
    </main>
  );
}
