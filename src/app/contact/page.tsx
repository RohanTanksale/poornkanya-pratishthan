import { ContactForm } from "@/components/contact/contact-form";
import { PageIntro } from "@/components/ui/page-intro";
import { contactEmail } from "@/data/site";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata(
  "Contact",
  "Contact Poornakanya Pratishthan with a question, partnership enquiry or message.",
  "/contact",
);

export const dynamic = "force-dynamic";

const deliveryConfigured = Boolean(
  process.env.CONTACT_EMAIL &&
    process.env.RESEND_API_KEY &&
    process.env.RESEND_FROM_EMAIL,
);

export default function ContactPage() {
  return (
    <main id="main-content" lang="en">
      <PageIntro
        description="Questions, ideas, partnerships or simply a hello—we'd be glad to hear from you."
        eyebrow="Contact"
        title="Let’s start a conversation."
        tone="sage"
      />
      <section className="contact-section section-pad">
        <div className="contact-aside">
          <p className="eyebrow">Reach out</p>
          <h2>
            Every conversation
            <br />
            begins <em>somewhere.</em>
          </h2>
          <p>
            Use the form to share a message. We&apos;ll make sure it&apos;s
            clear when online delivery is not yet available.
          </p>
          <div className="contact-detail">
            <span className="eyebrow">Email</span>
            {contactEmail ? (
              <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
            ) : (
              <p>Official email address to be confirmed</p>
            )}
          </div>
          <div className="contact-detail">
            <span className="eyebrow">Address & phone</span>
            <p>Details to be added when verified.</p>
          </div>
        </div>
        <div className="contact-form-panel">
          <div className="form-panel-heading">
            <p className="eyebrow">Write to us</p>
            <h2>We&apos;re listening.</h2>
          </div>
          {!deliveryConfigured ? (
            <p className="form-setup-note" role="note">
              Online message delivery is not configured yet. Add the email
              delivery settings in the server environment before enabling
              submissions.
            </p>
          ) : null}
          <ContactForm serviceReady={deliveryConfigured} />
        </div>
      </section>
    </main>
  );
}
