import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/section-heading";
import { CommitteeMemberCard } from "@/components/ui/committee-member-card";
import { PhotoGallery } from "@/components/ui/photo-gallery";
import { PhilosophyProfileCard } from "@/components/ui/philosophy-profile-card";
import { historicalRegions, initialPhaseFigures } from "@/data/branches";
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
  "Discover Poornakanya Pratishthan, established in 2006 to support the holistic development of girls and young women.",
  "/en",
);

export default async function EnglishHome() {
  const leadership = await getLeadership();

  return (
    <main id="main-content" lang="en">
      <section className="home-hero">
        <div className="hero-copy">
          <p className="eyebrow">Poornakanya Pratishthan · Since 2006</p>
          <h1>
            A future shaped
            <br />
            by <em>young women.</em>
          </h1>
          <p className="hero-description">
            Nurturing the potential, confidence and holistic development of
            girls and young women.
          </p>
          <div className="hero-actions">
            <Link className="button" href="/about">
              Discover our purpose <span aria-hidden="true">↗</span>
            </Link>
            <Link className="text-link" href="/programmes">
              Explore programmes <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="hero-note">
            <span className="hero-note-line" />
            <span>Learning · Values · Development</span>
          </div>
        </div>
        <div className="hero-art">
          <Image
            alt="Original illustration representing connection, growth and possibility"
            className="hero-illustration"
            fill
            priority
            sizes="(max-width: 760px) 100vw, 52vw"
            src="/images/community-illustration.svg"
          />
          <span className="art-caption">An illustration of shared possibility</span>
          <span aria-hidden="true" className="art-seal">
            <span>Every voice</span>
            <span>can shape</span>
            <span>what comes next</span>
          </span>
        </div>
        <span aria-hidden="true" className="hero-index">01 / 07</span>
      </section>

      <section className="intro-section section-pad">
        <div className="intro-aside">
          <span className="vertical-label">A shared direction</span>
          <span aria-hidden="true" className="aside-line" />
        </div>
        <div className="intro-content">
          <p className="eyebrow">Our purpose</p>
          <h2>
            Potential nurtured.
            <br />
            <em>Confidence strengthened.</em>
          </h2>
          <div className="intro-bottom">
            <p>{organisation.purpose}</p>
            <Link className="text-link" href="/about">
              About the organisation <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
        <span aria-hidden="true" className="intro-decoration">P</span>
      </section>

      <section className="philosophy-section section-pad">
        <SectionHeading
          description={organisation.philosophy}
          eyebrow="Poornawadi philosophy"
          title="From the individual to the world."
        />
        <div className="growth-sequence" aria-label="Individual, family, society, nation, world">
          {["Individual", "Family", "Society", "Nation", "World"].map((stage, index) => (
            <span key={stage}>
              {stage}{index < 4 ? <span aria-hidden="true"> → </span> : null}
            </span>
          ))}
        </div>
        <div className="philosophy-profile-grid">
          {organisation.philosophyProfiles.map((profile) => (
            <PhilosophyProfileCard key={profile.name} {...profile} />
          ))}
        </div>
        <div className="dimensions-grid">
          {organisation.dimensions.map((dimension) => (
            <article key={dimension.term}>
              <h3>{dimension.term}</h3>
              <p>{dimension.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="focus-section section-pad">
        <div className="section-topline">
          <SectionHeading
            description="Study camps, singing competitions, cultural programmes, discussions, seminars and expert guidance create opportunities to learn and connect."
            eyebrow="Programmes & activities"
            title="A place to learn and grow."
          />
          <Link className="text-link" href="/programmes">
            All programmes <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <div className="theme-grid">
          {programmeThemes.map((programme) => (
            <article className={`theme-card theme-${programme.tone}`} key={programme.number}>
              <span className="theme-number">{programme.number}</span>
              <div className="theme-card-copy">
                <h3>{programme.title}</h3>
                <p>{programme.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="home-initiatives section-pad">
        <SectionHeading
          description="Ideas being planned for future participation. These are initiatives in planning, not completed programmes."
          eyebrow="Upcoming activities & initiatives"
          title="What we hope to build together."
        />
        <div className="home-initiative-grid">
          {upcomingInitiatives.slice(0, 4).map((initiative) => (
            <article key={initiative.title}>
              <p className="eyebrow">Planned initiative</p>
              <h3>{initiative.title}</h3>
              <p>{initiative.description}</p>
            </article>
          ))}
        </div>
        <Link className="text-link" href="/programmes">
          See all planned initiatives <span aria-hidden="true">↗</span>
        </Link>
      </section>

      <PhotoGallery
        description="A place for authentic photographs from Poornakanya Pratishthan's community and activities."
        eyebrow="A visual record"
        photos={englishHomePhotos}
        title="Moments from our community."
      />

      <section className="featured-event section-pad">
        <div className="featured-event-heading">
          <p className="eyebrow">The first major celebration</p>
          <h2>{saraswatiMahotsav.title}</h2>
          <p>{saraswatiMahotsav.summary}</p>
          <Link className="text-link" href="/events">
            Event details <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <div className="event-facts">
          <p><strong>Dates</strong><span>{saraswatiMahotsav.dates}; year not supplied</span></p>
          <p><strong>Location</strong><span>{saraswatiMahotsav.location}</span></p>
          <p><strong>Upcoming activities</strong><span>{upcomingInitiatives.slice(0, 3).map((item) => item.title).join(" · ")}</span></p>
        </div>
      </section>

      <section className="home-leadership section-pad">
        <div className="updates-heading">
          <SectionHeading
            eyebrow="Central executive committee"
            title="Leadership by name and role."
            description="Committee members are presented only with their full name and official designation."
          />
          <Link className="text-link" href="/leadership">
            View committee <span aria-hidden="true">↗</span>
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

      <section className="home-vision section-pad">
        <SectionHeading
          description="A five-year direction shaped around learning, inclusion, connection and organisational growth."
          eyebrow="Looking ahead"
          title="A vision for the next five years."
        />
        <div className="vision-preview-grid">
          {fiveYearVision.slice(0, 3).map((priority) => (
            <article key={priority.title}>
              <h3>{priority.title}</h3>
              <p>{priority.description}</p>
            </article>
          ))}
        </div>
        <Link className="text-link" href="/vision">
          Explore the vision <span aria-hidden="true">↗</span>
        </Link>
      </section>

      <section className="branches-history section-pad">
        <SectionHeading
          description={`Historical initial-phase figures: ${initialPhaseFigures.branches} branches and ${initialPhaseFigures.members} members. They are not current statistics.`}
          eyebrow="A widening circle"
          title="A presence across regions."
        />
        <div className="region-list">
          {historicalRegions.map((region) => <span key={region}>{region}</span>)}
        </div>
        <Link className="text-link" href="/branches">
          About the branch network <span aria-hidden="true">↗</span>
        </Link>
      </section>

      <section className="home-cta">
        <div>
          <p className="eyebrow">Start a conversation</p>
          <h2>
            Every meaningful change
            <br />
            begins with <em>a connection.</em>
          </h2>
        </div>
        <Link className="button button-light" href="/contact">
          Contact us <span aria-hidden="true">↗</span>
        </Link>
      </section>
    </main>
  );
}
