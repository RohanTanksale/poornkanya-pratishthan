export const navigation = [
  { label: "Home", href: "/en" },
  { label: "About", href: "/about" },
  { label: "Vision", href: "/vision" },
  { label: "Programmes", href: "/programmes" },
  { label: "Events", href: "/events" },
  { label: "Leadership", href: "/leadership" },
  { label: "Branches", href: "/branches" },
  { label: "Apply to join", href: "/apply" },
] as const;

export const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() ?? "";

export const socialLinks = [
  { platform: "Instagram", handle: "", url: "" },
  { platform: "Facebook", handle: "", url: "" },
  { platform: "Twitter", handle: "", url: "" },
] as const;

export const siteDescription =
  "Poornakanya Pratishthan's official website: a space for women's empowerment, education, awareness and community welfare.";

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "");

export const footerNote =
  "Organisational information shared for public communication.";
