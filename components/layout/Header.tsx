"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { SiteData, NavItem } from "@/lib/types";

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className={`h-4 w-4 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    >
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-6 w-6">
      {open ? (
        <path
          d="M6 6L18 18M18 6L6 18"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M4 7H20M4 12H20M4 17H20"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4 shrink-0">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.39a9.93 9.93 0 0 0 4.75 1.21h.01c5.46 0 9.9-4.45 9.9-9.91C21.96 6.45 17.51 2 12.04 2Zm0 18.03h-.01a8.1 8.1 0 0 1-4.14-1.13l-.3-.18-3.14.82.84-3.06-.19-.31a8.13 8.13 0 0 1-1.25-4.35c0-4.49 3.66-8.15 8.16-8.15 2.18 0 4.22.85 5.76 2.39a8.09 8.09 0 0 1 2.39 5.77c0 4.49-3.66 8.2-8.12 8.2Zm4.47-6.13c-.24-.12-1.44-.71-1.66-.79-.22-.08-.39-.12-.55.12-.16.24-.63.79-.78.95-.14.16-.29.18-.53.06-.24-.12-1.03-.38-1.96-1.21-.72-.65-1.21-1.44-1.35-1.68-.14-.24-.02-.37.11-.49.11-.11.24-.29.36-.43.12-.14.16-.24.24-.41.08-.16.04-.31-.02-.43-.06-.12-.55-1.32-.75-1.81-.2-.48-.4-.41-.55-.42-.14-.01-.31-.01-.47-.01-.16 0-.43.06-.66.31-.22.24-.86.85-.86 2.06 0 1.22.89 2.4 1.01 2.56.12.16 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.55.1.47-.07 1.44-.59 1.65-1.16.2-.57.2-1.06.14-1.16-.06-.11-.22-.17-.46-.29Z" />
    </svg>
  );
}

function ServicesDropdown({
  item,
  open,
  onOpen,
  onClose,
}: {
  item: NavItem;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  return (
    <li
      className="relative"
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <button
        type="button"
        className="flex items-center gap-1 rounded py-2 font-medium text-navy transition-colors hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={onOpen}
        onFocus={onOpen}
      >
        {item.label}
        <ChevronIcon open={open} />
      </button>
      <ul
        role="menu"
        aria-label={item.label}
        className={`absolute left-0 top-full z-10 min-w-72 rounded-lg border border-navy/10 bg-white py-2 shadow-lg transition-all duration-150 ${
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"
        }`}
      >
        {item.children?.map((child) => (
          <li key={child.href} role="none">
            <Link
              href={child.href}
              role="menuitem"
              className="block px-4 py-2 text-sm text-navy transition-colors hover:bg-surface hover:text-accent focus-visible:bg-surface focus-visible:text-accent focus-visible:outline-none"
              onClick={onClose}
            >
              {child.label}
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
}

export default function Header({ site }: { site: SiteData }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false);
  const [mobileServiciosOpen, setMobileServiciosOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-navy/5 bg-white text-navy">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 lg:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          aria-label={`${site.name} - Inicio`}
          onClick={() => {
            setMobileOpen(false);
            setDesktopDropdownOpen(false);
          }}
        >
          <Image
            src="/images/logo.png"
            alt={site.name}
            width={168}
            height={48}
            className="h-10 w-auto"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Navegación principal" className="hidden lg:flex lg:items-center lg:gap-8">
          <ul className="flex items-center gap-6">
            {site.nav.map((item) =>
              item.children && item.children.length > 0 ? (
                <ServicesDropdown
                  key={item.href}
                  item={item}
                  open={desktopDropdownOpen}
                  onOpen={() => setDesktopDropdownOpen(true)}
                  onClose={() => setDesktopDropdownOpen(false)}
                />
              ) : (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="rounded py-2 font-medium text-navy transition-colors hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    {item.label}
                  </Link>
                </li>
              )
            )}
          </ul>

          <a
            href={site.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 font-semibold text-white shadow-sm transition-colors hover:bg-accent-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
          >
            <WhatsAppIcon />
            Cotizar
          </a>
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded p-2 text-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent lg:hidden"
          aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          onClick={() => setMobileOpen((o) => !o)}
        >
          <HamburgerIcon open={mobileOpen} />
        </button>
      </div>

      {/* Mobile menu */}
      <nav
        id="mobile-menu"
        aria-label="Navegación móvil"
        hidden={!mobileOpen}
        className="border-t border-navy/10 bg-white px-4 pb-4 lg:hidden"
      >
        <ul className="flex flex-col gap-1 pt-2">
          {site.nav.map((item) =>
            item.children && item.children.length > 0 ? (
              <li key={item.href}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded py-2.5 font-medium text-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  aria-expanded={mobileServiciosOpen}
                  aria-controls="mobile-submenu-servicios"
                  onClick={() => setMobileServiciosOpen((o) => !o)}
                >
                  {item.label}
                  <ChevronIcon open={mobileServiciosOpen} />
                </button>
                <ul
                  id="mobile-submenu-servicios"
                  hidden={!mobileServiciosOpen}
                  className="ml-3 flex flex-col gap-1 border-l border-navy/10 pb-2 pl-4"
                >
                  {item.children.map((child) => (
                    <li key={child.href}>
                      <Link
                        href={child.href}
                        className="block rounded py-2 text-sm text-navy/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                        onClick={() => setMobileOpen(false)}
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ) : (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded py-2.5 font-medium text-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            )
          )}
        </ul>
        <a
          href={site.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
          onClick={() => setMobileOpen(false)}
        >
          <WhatsAppIcon />
          Cotizar por WhatsApp
        </a>
      </nav>
    </header>
  );
}
