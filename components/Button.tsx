import Link from "next/link";
import type { CTAButton as CTAButtonData, SiteData } from "@/lib/types";

const VARIANT_CLASSES: Record<NonNullable<CTAButtonData["style"]>, string> = {
  primary:
    "bg-accent text-white shadow-[0_8px_22px_-10px_rgb(255_127_42/0.55)] hover:bg-accent-soft hover:shadow-[0_14px_30px_-10px_rgb(255_127_42/0.6)] focus-visible:outline-navy",
  secondary:
    "border-2 border-navy text-navy hover:bg-navy hover:text-white focus-visible:outline-accent",
  ghost:
    "text-navy underline decoration-transparent underline-offset-4 hover:text-accent hover:decoration-accent focus-visible:outline-accent",
};

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-[background-color,color,transform,box-shadow] duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:text-base";

/**
 * Sentinel hrefs a content author can use in JSON instead of hardcoding
 * contact details: "whatsapp" / "tel" / "mailto" resolve from SiteData so
 * the phone number / WhatsApp link only lives in one place (content/site.json).
 * Anything else passes through unchanged.
 */
export function resolveSiteHref(href: string, site: SiteData): string {
  switch (href) {
    case "whatsapp":
      return site.whatsapp;
    case "tel":
      return site.phoneHref;
    case "mailto":
      return `mailto:${site.email}`;
    default:
      return href;
  }
}

export default function CTAButton({ label, href, style = "primary" }: CTAButtonData) {
  const className = `${BASE} ${VARIANT_CLASSES[style]}`;

  // Internal routes always start with "/" — use next/link for prefetch/SPA nav.
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={className}>
        {label}
      </Link>
    );
  }

  // External http(s) links (incl. wa.me) open in a new tab; tel:/mailto: do not.
  const isHttp = href.startsWith("http://") || href.startsWith("https://");
  if (isHttp) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {label}
      </a>
    );
  }

  return (
    <a href={href} className={className}>
      {label}
    </a>
  );
}
