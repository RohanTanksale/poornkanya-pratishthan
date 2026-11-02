import { ApplicationForm } from "@/components/applications/application-form";
import { PageIntro } from "@/components/ui/page-intro";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata(
  "Apply to join",
  "Submit an application to join Poornakanya Pratishthan. Applications are reviewed privately by the organisation.",
  "/apply",
);

export default function ApplyPage() {
  return (
    <main id="main-content" lang="en">
      <PageIntro
        description="Share a little about yourself and why you would like to join."
        eyebrow="Membership application"
        title="Take part in our community."
        tone="sage"
      />
      <section className="application-section section-pad">
        <div className="application-intro">
          <p className="eyebrow">Apply to join</p>
          <h2>Start with a conversation.</h2>
          <p>
            Send us your details and the organisation will review your
            application. Submitting this form does not automatically make you a
            member.
          </p>
        </div>
        <div className="contact-form-panel">
          <div className="form-panel-heading">
            <p className="eyebrow">Your application</p>
            <h2>Tell us about yourself.</h2>
          </div>
          <ApplicationForm />
        </div>
      </section>
    </main>
  );
}
