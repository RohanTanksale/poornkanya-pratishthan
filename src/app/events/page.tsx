import { PageIntro } from "@/components/ui/page-intro";
import { PhotoGallery } from "@/components/ui/photo-gallery";
import { SectionHeading } from "@/components/ui/section-heading";
import { saraswatiMahotsav } from "@/data/events";
import { englishEventPhotos } from "@/data/photo-galleries";
import { upcomingInitiatives } from "@/data/programmes";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata(
  "Events",
  "Read about Saraswati Mahotsav, the first major celebration of Poornakanya Pratishthan, and explore planned upcoming initiatives.",
  "/events",
);

export default function EventsPage() {
  return (
    <main id="main-content" lang="en">
      <PageIntro
        description="A gathering of learning, devotion, culture and shared celebration."
        eyebrow="Events & gatherings"
        title="Saraswati Mahotsav."
        tone="sage"
      />
      <section className="featured-event section-pad">
        <div className="featured-event-heading">
          <p className="eyebrow">The first major celebration</p>
          <h2>{saraswatiMahotsav.title}</h2>
          <p>{saraswatiMahotsav.summary}</p>
          <div className="event-facts">
            <p><strong>Dates</strong><span>{saraswatiMahotsav.dates} (year not supplied)</span></p>
            <p><strong>Location</strong><span>{saraswatiMahotsav.location}</span></p>
            <p><strong>Occasion</strong><span>{saraswatiMahotsav.occasion}</span></p>
          </div>
        </div>
      </section>
      <section className="event-details-section section-pad">
        <div>
          <SectionHeading
            description="Guests and designations are shown as supplied. No year or attendance figures have been added."
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
            description="A sequence of moments that made the first celebration meaningful."
            eyebrow="Programme highlights"
            title="A celebration in five moments."
          />
          <ol className="event-activities">
            {saraswatiMahotsav.activities.map((activity) => (
              <li key={activity}>{activity}</li>
            ))}
          </ol>
        </div>
      </section>
      <PhotoGallery
        description="Photographs from Saraswati Mahotsav can be added here when authentic event images are available."
        eyebrow="Saraswati Mahotsav"
        photos={englishEventPhotos}
        title="Moments from the celebration."
      />
      <section className="future-events section-pad">
        <SectionHeading
          description="These activities are planned initiatives and are not listed as confirmed event dates."
          eyebrow="Looking ahead"
          title="Upcoming activities."
        />
        <div className="future-event-list">
          {upcomingInitiatives.map((initiative) => (
            <article key={initiative.title}>
              <h3>{initiative.title}</h3>
              <p>{initiative.description}</p>
              <span className="content-status">Planned</span>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
