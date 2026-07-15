// Helper mínimo para enviar eventos a GA4 (gtag). Client-only y seguro si gtag aún no cargó.
type GtagParams = Record<string, string | number | boolean | undefined>;

export function trackEvent(name: string, params?: GtagParams): void {
  if (typeof window === "undefined") return;
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  gtag?.("event", name, params ?? {});
}
