import { PageIntro } from "@/components/ui/page-intro";
import { CommitteeMemberCard } from "@/components/ui/committee-member-card";
import LeadershipGrid from "@/components/leadership/leadership-grid";
import { createPageMetadata } from "@/lib/metadata";
import { getLeadership } from "@/lib/leadership";

export const dynamic = "force-dynamic";

export const metadata = createPageMetadata(
  "Leadership",
  "Meet the mentors and central executive committee of Poornakanya Pratishthan.",
  "/leadership",
);

export default async function LeadershipPage() {
  const leadership = await getLeadership();

  return (
    <main id="main-content" lang="en">
      <PageIntro
        description="Meet the mentors and central executive committee of Poornakanya Pratishthan."
        eyebrow="Leadership"
        title="The people guiding the worka."
      />

      <LeadershipGrid />

      <section className="leadership-section section-pad">
        <div className="leadership-grid-heading">
          <p className="leadership-eyebrow">Executive Committee</p>
          <h2>Committed to Our Mission</h2>
          <p className="leadership-intro">
            The team working together to advance the vision of Poornakanya Pratishthan.
          </p>
        </div>

        <div className="committee-grid">
          {leadership.map((member, index) => (
            <CommitteeMemberCard
              index={index}
              key={member.id ?? member.name}
              member={member}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
