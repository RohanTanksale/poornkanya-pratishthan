import Link from "next/link";
import { PageIntro } from "@/components/ui/page-intro";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata(
  "Terms and Conditions",
  "Read the terms that apply when using the Poornakanya Pratishthan website.",
  "/terms",
);

export default function TermsPage() {
  return (
    <main id="main-content" lang="en">
      <PageIntro
        description="Please read these terms before using this website or submitting information through it."
        eyebrow="Legal"
        title="Terms and Conditions"
        tone="sage"
      />
      <section className="legal-section section-pad">
        <div className="legal-content">
          <p className="legal-updated">Last updated: November 2, 2026</p>

          <section>
            <h2>Using this website</h2>
            <p>
              This website is provided by Poornakanya Pratishthan to share
              information about the organisation, its programmes, events and
              membership applications. By accessing or using the website, you
              agree to these terms. If you do not agree, please do not use the
              website.
            </p>
            <p>
              You agree to use the website lawfully and respectfully. Do not
              attempt to disrupt its operation, gain unauthorised access, or
              submit information that is false, unlawful, harmful or belongs to
              someone else without permission.
            </p>
          </section>

          <section>
            <h2>Website information</h2>
            <p>
              Website content is provided for general information. We take
              reasonable care when preparing it, but it may not always be
              complete, current or suitable for your particular circumstances.
              Programmes, events and other organisational information may
              change. Please contact us to confirm details before relying on
              them.
            </p>
          </section>

          <section>
            <h2>Applications and enquiries</h2>
            <p>
              Submitting a membership application or enquiry does not guarantee
              acceptance, membership, a response within a particular time, or
              participation in any programme. Applications are reviewed by the
              organisation, and membership is subject to its eligibility
              requirements and decisions.
            </p>
            <p>
              Please provide accurate information and only submit personal
              information that you are authorised to share. How we handle
              information submitted through the website is explained in our{" "}
              <Link href="/privacy">Privacy Policy</Link>.
            </p>
          </section>

          <section>
            <h2>Ownership and third-party links</h2>
            <p>
              Unless otherwise stated, website content and branding belong to
              Poornakanya Pratishthan or are used with permission. You may not
              reproduce or use them in a way that suggests endorsement or
              affiliation without prior permission, except where applicable law
              allows.
            </p>
            <p>
              This website may link to external websites for convenience. We do
              not control or endorse their content, services or privacy
              practices, and their own terms and policies apply.
            </p>
          </section>

          <section>
            <h2>Availability and responsibility</h2>
            <p>
              We aim to keep the website available and reliable, but do not
              guarantee uninterrupted access or that it will always be free
              from errors. To the extent permitted by applicable law, the
              organisation is not responsible for loss arising from reliance on
              website information or temporary unavailability. Nothing in these
              terms limits rights or responsibilities that cannot legally be
              excluded.
            </p>
          </section>

          <section>
            <h2>Changes and contact</h2>
            <p>
              We may update the website or these terms from time to time. The
              date above shows when these terms were last updated. Continued use
              of the website after a change means you accept the updated terms.
            </p>
            <p>
              For questions about these terms, please use our{" "}
              <Link href="/contact">contact page</Link>.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
