import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";
import { EventCard } from "@/components/ui/event-card";
import { PageIntro } from "@/components/ui/page-intro";
import { SectionHeading } from "@/components/ui/section-heading";
import { saraswatiMahotsav } from "@/data/events";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata(
  "Events",
  "Explore confirmed Poornakanya Pratishthan event information and its historical Saraswati Mahotsav celebration.",
  "/events",
);

export default function EventsPage() {
  return (
    <main id="main-content" lang="en">
      <PageIntro
        description="Confirmed event details are shown separately from undated or planned activities."
        eyebrow="Events & gatherings"
        title="Learning, celebration and community."
        tone="sage"
      />
      <section aria-labelledby="upcoming-events-title" className="events-section section-pad">
        <SectionHeading
          description="No future dates have been confirmed in the available organisation information."
          eyebrow="Upcoming events"
          title="What is coming up."
          id="upcoming-events-title"
        />
        <EmptyState
          description="There are no confirmed upcoming events to list right now. Planned initiatives are available separately on the Programmes page."
          headingId="upcoming-events-empty-title"
          title="No upcoming events announced."
        >
          <Link className="text-link" href="/programmes">
            View planned initiatives <span aria-hidden="true">↗</span>
          </Link>
        </EmptyState>
      </section>

      <section aria-labelledby="past-events-title" className="past-events-section section-pad">
        <SectionHeading
          description="This event is identified in the organisation's source material as its first major celebration. Its year was not supplied."
          eyebrow="Past event"
          title="A gathering remembered."
          id="past-events-title"
        />
        <div className="event-list">
          <EventCard
            date={`${saraswatiMahotsav.dates} · year not supplied`}
            description={saraswatiMahotsav.summary}
            href="/events/saraswati-mahotsav"
            location={saraswatiMahotsav.location}
            title={saraswatiMahotsav.title}
          />
        </div>
      </section>
    </main>
  );
}
