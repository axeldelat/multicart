import Link from "next/link";
import type { Metadata } from "next";
import CTAButton from "@/components/Button";

export const metadata: Metadata = {
  title: "Página no encontrada - Multicart",
  robots: { index: false, follow: true },
};

const QUICK_LINKS = [
  { label: "Servicios", href: "/servicios" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Contacto", href: "/contacto" },
];

export default function NotFound() {
  return (
    <section className="relative isolate overflow-hidden bg-surface">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-[-10%] -z-10 h-96 w-96 rounded-full bg-accent/10 blur-3xl"
      />
      <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center lg:py-32">
        <p className="font-display text-7xl font-bold text-accent sm:text-8xl">404</p>
        <h1 className="mt-4 font-display text-2xl font-bold text-navy sm:text-3xl">
          No encontramos esta página
        </h1>
        <p className="mt-4 max-w-md text-navy-soft">
          Es posible que el enlace haya cambiado o que la página ya no exista. Desde aquí puedes
          volver al inicio o ir directo a lo que buscas.
        </p>
        <div className="mt-8">
          <CTAButton label="Volver al inicio" href="/" style="primary" />
        </div>
        <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
          {QUICK_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="font-medium text-navy transition-colors hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
