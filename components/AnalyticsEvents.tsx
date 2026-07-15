"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

// Detecta clicks en CUALQUIER link de WhatsApp (Header, Footer, botón flotante,
// CTAs, botones de producto) con un solo listener delegado — sin tocar cada componente.
const WHATSAPP_RE = /(wa\.me|api\.whatsapp\.com|whatsapp:\/\/)/i;

export default function AnalyticsEvents() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest?.("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href") ?? "";
      if (WHATSAPP_RE.test(href)) {
        // Evento recomendado GA4 para captación de lead; method distingue el canal.
        trackEvent("generate_lead", { method: "whatsapp", link_url: href });
      }
    };
    // capture: se dispara antes de la navegación; gtag usa sendBeacon, no se pierde.
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
