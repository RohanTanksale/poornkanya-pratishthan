"use client";

import Link from "next/link";
import { navigation, footerNote, socialLinks, contactEmail } from "@/data/site";
import { BrandMark } from "@/components/ui/brand-mark";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-identity">
          <Link aria-label="Poornakanya Pratishthan home" className="brand brand-footer" href="/en">
            <BrandMark />
            <span className="brand-copy">
              <span className="brand-name">Poornakanya</span>
              <span className="brand-subtitle">Pratishthan</span>
            </span>
          </Link>
          {contactEmail ? (
            <a className="footer-email" href={`mailto:${contactEmail}`}>
              {contactEmail}
            </a>
          ) : null}
        </div>
        <div className="footer-navigation">
          <nav aria-label="Explore the website" className="footer-link-group">
            <h2>Explore</h2>
            <div className="footer-link-list">
              {navigation
                .filter((item) => item.href !== "/apply")
                .map((item) => (
                  <Link href={item.href} key={item.href}>{item.label}</Link>
                ))}
          </div>
          </nav>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Poornakanya Pratishthan</span>
        <nav aria-label="Social media" className="footer-social-list">
          {socialLinks.filter((social) => social.url).map((social) => (
            <SocialLink key={social.platform} platform={social.platform} url={social.url} />
          ))}
        </nav>
        {footerNote ? <span className="footer-note">{footerNote}</span> : null}
      </div>
    </footer>
  );
}

type SocialPlatform = (typeof socialLinks)[number]["platform"];

function SocialLink({ platform, url }: { platform: SocialPlatform; url: string }) {
  const icon = <SocialIcon platform={platform} />;

  return (
    <a aria-label={platform} className="footer-social" href={url} rel="noreferrer" target="_blank">
      {icon}
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
