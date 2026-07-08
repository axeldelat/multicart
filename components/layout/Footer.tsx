import Link from "next/link";
import Image from "next/image";
import type { SiteData } from "@/lib/types";

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-5 w-5">
      <path d="M13.5 21v-7.6h2.55l.38-2.96h-2.93V8.56c0-.86.24-1.44 1.47-1.44h1.57V4.48A21 21 0 0 0 14.62 4c-2.2 0-3.71 1.34-3.71 3.8v2.64H8.36v2.96h2.55V21h2.59Z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-5 w-5">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.39a9.93 9.93 0 0 0 4.75 1.21h.01c5.46 0 9.9-4.45 9.9-9.91C21.96 6.45 17.51 2 12.04 2Zm0 18.03h-.01a8.1 8.1 0 0 1-4.14-1.13l-.3-.18-3.14.82.84-3.06-.19-.31a8.13 8.13 0 0 1-1.25-4.35c0-4.49 3.66-8.15 8.16-8.15 2.18 0 4.22.85 5.76 2.39a8.09 8.09 0 0 1 2.39 5.77c0 4.49-3.66 8.2-8.12 8.2Zm4.47-6.13c-.24-.12-1.44-.71-1.66-.79-.22-.08-.39-.12-.55.12-.16.24-.63.79-.78.95-.14.16-.29.18-.53.06-.24-.12-1.03-.38-1.96-1.21-.72-.65-1.21-1.44-1.35-1.68-.14-.24-.02-.37.11-.49.11-.11.24-.29.36-.43.12-.14.16-.24.24-.41.08-.16.04-.31-.02-.43-.06-.12-.55-1.32-.75-1.81-.2-.48-.4-.41-.55-.42-.14-.01-.31-.01-.47-.01-.16 0-.43.06-.66.31-.22.24-.86.85-.86 2.06 0 1.22.89 2.4 1.01 2.56.12.16 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.55.1.47-.07 1.44-.59 1.65-1.16.2-.57.2-1.06.14-1.16-.06-.11-.22-.17-.46-.29Z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-5 w-5">
      <path d="M21.58 7.2a2.75 2.75 0 0 0-1.94-1.95C17.9 4.75 12 4.75 12 4.75s-5.9 0-7.64.5A2.75 2.75 0 0 0 2.42 7.2 28.7 28.7 0 0 0 1.92 12a28.7 28.7 0 0 0 .5 4.8 2.75 2.75 0 0 0 1.94 1.95c1.74.5 7.64.5 7.64.5s5.9 0 7.64-.5a2.75 2.75 0 0 0 1.94-1.95c.34-1.58.5-3.19.5-4.8a28.7 28.7 0 0 0-.5-4.8ZM9.9 15.02V8.98L15.5 12l-5.6 3.02Z" />
    </svg>
  );
}

const SOCIAL_ICONS: Record<string, () => React.JSX.Element> = {
  facebook: FacebookIcon,
  whatsapp: WhatsAppIcon,
  youtube: YouTubeIcon,
};

const SOCIAL_LABELS: Record<string, string> = {
  facebook: "Facebook",
  whatsapp: "WhatsApp",
  youtube: "YouTube",
};

export default function Footer({ site }: { site: SiteData }) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy text-white/80">
      <div className="mx-auto max-w-6xl px-4 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand + tagline */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex" aria-label={`${site.name} - Inicio`}>
              <Image
                src="/images/logo.png"
                alt={site.name}
                width={300}
                height={124}
                className="h-10 w-auto brightness-0 invert"
              />
            </Link>
            {site.footer.tagline ? (
              <p className="mt-4 text-sm leading-relaxed text-white/70">{site.footer.tagline}</p>
            ) : null}
            {site.social.length > 0 ? (
              <ul className="mt-5 flex items-center gap-3">
                {site.social.map((s) => {
                  const Icon = SOCIAL_ICONS[s.platform];
                  const label = SOCIAL_LABELS[s.platform] ?? s.platform;
                  return (
                    <li key={s.platform}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                      >
                        {Icon ? <Icon /> : null}
                      </a>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>

          {/* Footer link columns */}
          {site.footer.columns.map((col) => (
            <div key={col.heading}>
              <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-white">
                {col.heading}
              </h2>
              <ul className="mt-4 flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 transition-colors hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact block */}
          <div>
            <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-white">
              Contacto
            </h2>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm text-white/70">
              <li>{site.address}</li>
              <li>
                <a
                  href={site.phoneHref}
                  className="transition-colors hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {site.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="transition-colors hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {site.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal + copyright */}
        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/60">
            © {year} MULTICART. TODOS LOS DERECHOS RESERVADOS.
          </p>
          {site.footer.legalLinks.length > 0 ? (
            <ul className="flex flex-wrap items-center gap-4">
              {site.footer.legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs text-white/60 transition-colors hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
