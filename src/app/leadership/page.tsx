import { PageIntro } from "@/components/ui/page-intro";
import { CommitteeMemberCard } from "@/components/ui/committee-member-card";
import { createPageMetadata } from "@/lib/metadata";
import { getLeadership } from "@/lib/leadership";

export const dynamic = "force-dynamic";

export const metadata = createPageMetadata(
  "Leadership",
  "Meet the central executive committee of Poornakanya Pratishthan by name and official designation.",
  "/leadership",
);

export default async function LeadershipPage() {
  const leadership = await getLeadership();

  return (
    <main id="main-content" lang="en">
      <PageIntro
        description="The central executive committee of Poornakanya Pratishthan."
        eyebrow="Leadership"
        title="The people guiding the work."
      />
      <section className="leadership-section section-pad">
        <div className="committee-grid">
          {leadership.map((member, index) => (
            <CommitteeMemberCard
              index={index}
              key={member.name}
              member={member}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
