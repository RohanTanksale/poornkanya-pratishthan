
import Image from "next/image";
import Link from "next/link";
import { CommitteeMemberCard } from "@/components/ui/committee-member-card";
import { EmptyState } from "@/components/ui/empty-state";
import { EventCard } from "@/components/ui/event-card";
import { PhotoGallery } from "@/components/ui/photo-gallery";
import { ProgrammeCard } from "@/components/ui/programme-card";
import { SectionHeading } from "@/components/ui/section-heading";
import InitiativeInterestCards from "@/components/initiatives/initiative-interest-cards";
import { saraswatiMahotsav } from "@/data/events";
import { organisation } from "@/data/organisation";
import { englishHomePhotos } from "@/data/photo-galleries";
import { programmeThemes, upcomingInitiatives } from "@/data/programmes";
import { fiveYearVision } from "@/data/vision";
import { createPageMetadata } from "@/lib/metadata";
import { getLeadership } from "@/lib/leadership";

export const dynamic = "force-dynamic";

export const metadata = createPageMetadata(
  "Home",
  "Learn how Poornakanya Pratishthan supports the development of girls and young women through education, values, guidance and community.",
  "/en",
);

export default async function EnglishHome() {
  const leadership = await getLeadership();

  return (
    <main id="main-content" lang="en">
      {/* HERO SECTION */}
      <section aria-labelledby="home-title" className="home-hero">
        <div className="hero-copy">
          <p className="eyebrow">Poornakanya Pratishthan · Since 2006</p>

          <h1 id="home-title">
            Supporting girls to shape
            <br />
            <em>their own futures.</em>
          </h1>

          <p className="hero-description">
            Education, values and guidance can help girls and young women
            recognise their potential and grow with confidence.
          </p>

          <div className="hero-actions">
            <Link className="button" href="/apply">
              Apply to join <span aria-hidden="true">↗</span>
            </Link>

            <Link className="button button-outline" href="/about">
              About the organisation <span aria-hidden="true">→</span>
            </Link>
          </div>

          <p className="hero-note">
            Learning <span aria-hidden="true">·</span> Values{" "}
            <span aria-hidden="true">·</span> Development
          </p>
        </div>

        <div className="hero-art">
          <Image
            alt="Abstract illustration representing growth and connection"
            className="hero-illustration"
            fill
            priority
            sizes="(max-width: 760px) 100vw, 52vw"
            src="/images/community-illustration.svg"
          />

          <span className="art-caption">
            An illustration of shared possibility
          </span>
        </div>
      </section>

      {/* INTRODUCTION SECTION */}
      <section
        aria-labelledby="introduction-title"
        className="intro-section section-pad"
      >
        <div className="intro-content">
          <p className="eyebrow">About the organisation</p>

          <h2 id="introduction-title">
            Potential nurtured.
            <br />
            <em>Confidence strengthened.</em>
          </h2>

          <div className="intro-bottom">
            <p>{organisation.purpose}</p>

            <Link className="text-link" href="/about">
              Read more about us <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>

        <span aria-hidden="true" className="intro-decoration">
          P
        </span>
      </section>

      {/* MISSION AND VISION */}
      <section
        aria-labelledby="mission-vision-title"
        className="home-beliefs section-pad"
      >
        <SectionHeading
          description="The organisation's purpose and Poornawadi philosophy guide its work."
          eyebrow="Purpose & direction"
          title="Growth that reaches beyond the individual."
          id="mission-vision-title"
        />

        <div className="home-beliefs-grid">
          <article>
            <p className="eyebrow">Our mission</p>
            <h3>Support girls during their formative years.</h3>
            <p>{organisation.purpose}</p>
          </article>

          <article>
            <p className="eyebrow">Our vision</p>
            <h3>From individual development to a wider community.</h3>
            <p>{organisation.philosophy}</p>

            <Link className="text-link" href="/vision">
              Explore the five-year vision <span aria-hidden="true">↗</span>
            </Link>
          </article>
        </div>
      </section>

      {/* FIVE-YEAR VISION */}
      <section
        aria-labelledby="home-vision-title"
        className="home-vision section-pad"
      >
        <div className="section-topline">
          <SectionHeading
            description="Priorities shared by the organisation for its next five years."
            eyebrow="Five-year vision"
            title="A shared path forward."
            id="home-vision-title"
          />

          <Link className="text-link" href="/vision">
            Read the full vision <span aria-hidden="true">↗</span>
          </Link>
        </div>

        <div className="vision-preview-grid">
          {fiveYearVision.slice(0, 3).map((priority) => (
            <article key={priority.title}>
              <h3>{priority.title}</h3>
              <p>{priority.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ACTIVITIES */}
      <section
        aria-labelledby="activities-title"
        className="focus-section section-pad"
      >
        <div className="section-topline">
          <SectionHeading
            description="Activities documented by the organisation create opportunities to learn, express ideas and connect."
            eyebrow="Activities"
            title="A place to learn and grow."
            id="activities-title"
          />

          <Link className="text-link" href="/programmes">
            Explore all activities <span aria-hidden="true">↗</span>
          </Link>
        </div>

        <div className="theme-grid">
          {programmeThemes.map((programme) => (
            <ProgrammeCard
              key={programme.number}
              programme={programme}
            />
          ))}
        </div>
      </section>
      {/* INTERACTIVE PROGRAMME HIGHLIGHTS */}
      <InitiativeInterestCards initiatives={upcomingInitiatives.slice(0, 4)} />
{/* EVENTS */}
      <section
        aria-labelledby="home-events-title"
        className="home-events-section section-pad"
      >
        <div className="section-topline">
          <SectionHeading
            description="Event information is shown only when supported by the organisation's source material."
            eyebrow="Events & gatherings"
            title="Together in learning and celebration."
            id="home-events-title"
          />

          <Link className="text-link" href="/events">
            All events <span aria-hidden="true">↗</span>
          </Link>
        </div>

        <div className="home-events-grid">
          <section aria-labelledby="home-upcoming-title">
            <h3
              id="home-upcoming-title"
              className="home-event-section-title"
            >
              Upcoming events
            </h3>

            <EmptyState
              description="No confirmed upcoming event dates are available to share at this time."
              headingId="home-upcoming-empty"
              headingLevel="h4"
              title="No upcoming events announced."
            >
              <Link className="text-link" href="/contact">
                Contact us for information <span aria-hidden="true">↗</span>
              </Link>
            </EmptyState>
          </section>

          <section aria-labelledby="home-past-title">
            <h3
              id="home-past-title"
              className="home-event-section-title"
            >
              Past event
            </h3>

            <EventCard
              date={`${saraswatiMahotsav.dates} · year not supplied`}
              description={saraswatiMahotsav.summary}
              href="/events/saraswati-mahotsav"
              location={saraswatiMahotsav.location}
              title={saraswatiMahotsav.title}
            />
          </section>
        </div>
      </section>

      {/* LEADERSHIP */}
      <section
        aria-labelledby="home-leadership-title"
        className="home-leadership section-pad"
      >
        <div className="updates-heading">
          <SectionHeading
            description="Committee members are presented with their supplied names and official designations."
            eyebrow="Central executive committee"
            title="The people guiding the work."
            id="home-leadership-title"
          />

          <Link className="text-link" href="/leadership">
            Meet the committee <span aria-hidden="true">↗</span>
          </Link>
        </div>

        <div className="committee-grid committee-grid-compact">
          {leadership.slice(0, 3).map((member, index) => (
            <CommitteeMemberCard
              index={index}
              key={member.name}
              member={member}
            />
          ))}
        </div>
      </section>

      {/* GALLERY */}
      <PhotoGallery
        description="Only approved organisational photographs are shown here. No such photographs are currently available."
        eyebrow="Gallery preview"
        photos={englishHomePhotos}
        title="Moments from our community."
      >
        <Link className="text-link" href="/gallery">
          Visit the gallery <span aria-hidden="true">↗</span>
        </Link>
      </PhotoGallery>

      {/* MEMBERSHIP CTA */}
      <section
        aria-labelledby="membership-title"
        className="home-membership-cta"
      >
        <div>
          <p className="eyebrow">Membership</p>

          <h2 id="membership-title">
            Bring your curiosity and your voice.
          </h2>

          <p>
            The organisation currently lists an eligibility age of{" "}
            {organisation.eligibleAge}. Applications are reviewed by the
            organisation and do not guarantee membership.
          </p>
        </div>

        <Link className="button button-light" href="/apply">
          Read the instructions and apply <span aria-hidden="true">↗</span>
        </Link>
      </section>
</main>
  );
}






