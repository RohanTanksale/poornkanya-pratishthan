
"use client";

import Link from "next/link";
import {
  navigation,
  footerNote,
  socialLinks,
  contactEmail,
} from "@/data/site";
import { BrandMark } from "@/components/ui/brand-mark";

export function SiteFooter() {
  const footerNavigation = navigation.filter(
    (item) => item.href !== "/apply"
  );

  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-identity">
          <Link
            aria-label="Poornakanya Pratishthan home"
            className="brand brand-footer"
            href="/en"
          >
            <BrandMark />
            <span className="brand-copy">
              <span className="brand-name">Poornakanya</span>
              <span className="brand-subtitle">Pratishthan</span>
            </span>
          </Link>

          <p className="footer-description">
            Supporting girls to shape their own futures.
          </p>

          {contactEmail && (
            <a className="footer-email" href={`mailto:${contactEmail}`}>
              {contactEmail}
            </a>
          )}
        </div>

        <nav aria-label="Explore the website" className="footer-navigation">
          <h2>Explore</h2>
          <div className="footer-link-list">
            {footerNavigation.map((item) => (
              <Link href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>

      <div className="footer-bottom">
        <span className="footer-copyright">
          © {new Date().getFullYear()} Poornakanya Pratishthan
        </span>

        {footerNote && (
          <span className="footer-note">{footerNote}</span>
        )}

        <nav aria-label="Social media" className="footer-social-list">
          {socialLinks
            .filter((social) => social.url)
            .map((social) => (
              <SocialLink
                key={social.platform}
                platform={social.platform}
                url={social.url}
              />
            ))}
        </nav>
      </div>

      <style jsx>{`
        .site-footer {
          padding: 64px clamp(20px, 6vw, 90px) 24px;
          background: #f5f0eb;
          border-top: 1px solid rgb(101 36 60 / 10%);
        }

        .footer-main {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 48px;
          max-width: 1240px;
          margin: 0 auto;
          padding-bottom: 48px;
        }

        .footer-description {
          max-width: 340px;
          margin: 20px 0 12px;
          color: #6f6264;
          line-height: 1.8;
        }

        .footer-email {
          color: var(--rose, #65243c);
          font-weight: 600;
          text-decoration: none;
        }

        .footer-email:hover {
          text-decoration: underline;
        }

        .footer-navigation h2 {
          margin: 0 0 20px;
          color: #65243c;
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .footer-link-list {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px 28px;
        }

        .footer-link-list :global(a) {
          color: #65585a;
          text-decoration: none;
          transition: color 200ms ease, transform 200ms ease;
        }

        .footer-link-list :global(a:hover) {
          color: #65243c;
          transform: translateX(3px);
        }

        .footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 18px;
          max-width: 1240px;
          margin: 0 auto;
          padding-top: 22px;
          border-top: 1px solid rgb(101 36 60 / 12%);
          color: #75696a;
          font-size: 0.85rem;
        }

        .footer-social-list {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .footer-social {
          display: grid;
          width: 38px;
          height: 38px;
          place-items: center;
          border: 1px solid rgb(101 36 60 / 18%);
          border-radius: 50%;
          color: #65243c;
          transition:
            background 200ms ease,
            color 200ms ease,
            transform 200ms ease;
        }

        .footer-social:hover {
          transform: translateY(-3px);
          background: #65243c;
          color: white;
        }

        .footer-social :global(svg) {
          width: 17px;
          height: 17px;
          fill: none;
          stroke: currentColor;
          stroke-width: 1.6;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .footer-social :global(svg path) {
          fill: currentColor;
          stroke: none;
        }

        .footer-social :global(.footer-social-dot) {
          fill: currentColor;
          stroke: none;
        }

        @media (max-width: 700px) {
          .site-footer {
            padding: 44px 22px 22px;
          }

          .footer-main {
            grid-template-columns: 1fr;
            gap: 36px;
            padding-bottom: 32px;
          }

          .footer-link-list {
            grid-template-columns: 1fr 1fr;
            gap: 14px 16px;
          }

          .footer-bottom {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .footer-link-list :global(a),
          .footer-social {
            transition: none;
          }
        }
      `}</style>
    </footer>
  );
}

type SocialPlatform = (typeof socialLinks)[number]["platform"];

function SocialLink({
  platform,
  url,
}: {
  platform: SocialPlatform;
  url: string;
}) {
  return (
    <a
      aria-label={platform}
      className="footer-social"
      href={url}
      rel="noreferrer"
      target="_blank"
    >
      <SocialIcon platform={platform} />
    </a>
  );
}

function SocialIcon({ platform }: { platform: SocialPlatform }) {
  if (platform === "Instagram") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle className="footer-social-dot" cx="17.5" cy="6.8" r="1" />
      </svg>
    );
  }

  if (platform === "Facebook") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M13.5 21v-8h2.8l.4-3h-3.2V8.1c0-.9.3-1.6 1.7-1.6h1.7V3.8c-.3 0-1.4-.1-2.7-.1-2.7 0-4.4 1.6-4.4 4.6V10H7v3h2.8v8" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M21 5.2a8 8 0 0 1-2.4.7 4.2 4.2 0 0 0 1.8-2.3 8.4 8.4 0 0 1-2.7 1 4.2 4.2 0 0 0-7.2 3.8 12 12 0 0 1-8.7-4.4 4.2 4.2 0 0 0 1.3 5.6 4.2 4.2 0 0 1-1.9-.5v.1a4.2 4.2 0 0 0 3.4 4.1 4.3 4.3 0 0 1-1.9.1 4.2 4.2 0 0 0 3.9 2.9A8.5 8.5 0 0 1 1.5 18a12 12 0 0 0 18.4-10.1v-.5A8.5 8.5 0 0 0 21 5.2Z" />
    </svg>
  );
}
