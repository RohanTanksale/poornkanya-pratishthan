import Link from "next/link";
import { PageIntro } from "@/components/ui/page-intro";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata(
  "Privacy Policy",
  "Learn what information Poornakanya Pratishthan collects through this website and how it is used.",
  "/privacy",
);

export default function PrivacyPage() {
  return (
    <main id="main-content" lang="en">
      <PageIntro
        description="Here is how we handle information you share with Poornakanya Pratishthan through this website."
        eyebrow="Legal"
        title="Privacy Policy"
        tone="sage"
      />
      <section className="legal-section section-pad">
        <div className="legal-content">
          <p className="legal-updated">Last updated: November 2, 2026</p>

          <section>
            <h2>Information you provide</h2>
            <p>
              If you send a message through the contact form, we receive your
              name, email address, subject and message. When online delivery is
              configured, the message is sent to the organisation through its
              email service provider so that we can respond.
            </p>
            <p>
              If you apply to join, we collect the details you enter in the
              application form: name, email address, phone number, city, age,
              education or occupation, interests, relevant experience,
              availability and your reason for applying. We use these details
              to review and respond to your application. Application records
              are stored in the organisation&apos;s database and are available
              to authorised administrators for review.
            </p>
          </section>

          <section>
            <h2>How we use and share information</h2>
            <p>
              We use submitted information to respond to enquiries, assess
              membership applications, administer the organisation&apos;s
              activities and protect the website from misuse. We do not sell
              personal information.
            </p>
            <p>
              We use service providers to operate the website and deliver
              submissions, including Supabase for application data and, when
              configured, Resend for contact messages. Those providers process
              information as needed to provide their services and may have
              their own privacy terms. We do not publish application details on
              this website. We may also disclose information when required by
              law or to protect people, the organisation or the website.
            </p>
          </section>

          <section>
            <h2>Cookies and technical information</h2>
            <p>
              Essential authentication cookies may be used to protect
              administrator sign-in. The website does not currently use
              advertising or analytics tools. The hosting provider may process
              basic technical information, such as connection data, to deliver
              and secure the website.
            </p>
          </section>

          <section>
            <h2>Retention and security</h2>
            <p>
              We keep personal information only for as long as it is needed for
              the purposes described above, to manage the related enquiry or
              application, or to meet applicable legal requirements. Retention
              periods may therefore depend on the nature of the information
              and the outcome of an application.
            </p>
            <p>
              We use reasonable measures to protect information, but no method
              of storage or transmission can be guaranteed completely secure.
            </p>
          </section>

          <section>
            <h2>Your choices and requests</h2>
            <p>
              You may contact us to ask about, correct or request deletion of
              personal information you have submitted. We may need to retain
              some information where required by law or for legitimate
              organisational purposes.
            </p>
          </section>

          <section>
            <h2>Children&apos;s privacy</h2>
            <p>
              Membership applications may be submitted by people aged 15 to 25.
              If an applicant is under 18, a parent or guardian should review
              this policy and the application with them before they submit
              personal information.
            </p>
          </section>

          <section>
            <h2>Changes and contact</h2>
            <p>
              We may update this policy as our practices or requirements
              change. The date above shows when it was last updated.
            </p>
            <p>
              For privacy questions or requests, please use our{" "}
              <Link href="/contact">contact page</Link>.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
