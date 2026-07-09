import Link from "next/link";
import Image from "next/image";
import type { SiteData } from "@/lib/types";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-5 w-5">
      <path d="M13.5 21v-7.6h2.55l.38-2.96h-2.93V8.56c0-.86.24-1.44 1.47-1.44h1.57V4.48A21 21 0 0 0 14.62 4c-2.2 0-3.71 1.34-3.71 3.8v2.64H8.36v2.96h2.55V21h2.59Z" />
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

function MapPinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-3.5 w-3.5">
      <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
    </svg>
  );
}

const SOCIAL_ICONS: Record<string, () => React.JSX.Element> = {
  facebook: FacebookIcon,
  whatsapp: () => <WhatsAppIcon className="h-5 w-5" />,
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

        {/* Ubicaciones destacadas */}
        {site.footer.locations && site.footer.locations.length > 0 ? (
          <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
            <span className="font-display text-xs font-semibold uppercase tracking-wide text-white/70">
              También estamos en
            </span>
            <ul className="flex flex-wrap items-center gap-2.5">
              {site.footer.locations.map((loc) => (
                <li key={loc.href}>
                  <Link
                    href={loc.href}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-sm text-white/90 transition-colors hover:bg-accent hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    <MapPinIcon />
                    {loc.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

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
