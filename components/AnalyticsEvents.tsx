"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/analytics";

// Detecta clicks en CUALQUIER link de WhatsApp (Header, Footer, botón flotante,
// CTAs, botones de producto) con un solo listener delegado — sin tocar cada componente.
const WHATSAPP_RE = /(wa\.me|api\.whatsapp\.com|whatsapp:\/\/)/i;

export default function AnalyticsEvents() {
  const pathname = usePathname();
  const isFirstView = useRef(true);

  // Pageviews en navegación SPA. El primer view ya lo cuenta el gtag('config')
  // inicial, así que se salta el primer render para no duplicarlo.
  useEffect(() => {
    if (isFirstView.current) {
      isFirstView.current = false;
      return;
    }
    trackEvent("page_view", {
      page_path: pathname,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest?.("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href") ?? "";
      if (WHATSAPP_RE.test(href)) {
        // Solo evento propio: generate_lead queda reservado al envío del formulario.
        trackEvent("whatsapp_contact", { method: "whatsapp", link_url: href });
      }
    };
    // capture: se dispara antes de la navegación; gtag usa sendBeacon, no se pierde.
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
