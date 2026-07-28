import type { Metadata } from "next";
import { SEO } from "./types";
import type { CityPage } from "./cities";

const BASE = "https://multicart.mx";

const PROVIDER = {
  "@type": "LocalBusiness",
  name: "Multicart",
  url: BASE,
  telephone: "+523321910090",
  email: "contacto@multicart.mx",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Francisco Zarco 2324, Col. Ladrón de Guevara",
    addressLocality: "Guadalajara",
    addressRegion: "Jalisco",
    postalCode: "44600",
    addressCountry: "MX",
  },
};

// Schema Service con provider en Guadalajara y areaServed en la ciudad local.
// Refuerza que cada landing por ciudad es una página distinta y con alcance propio.
export function buildServiceSchema(city: CityPage, seo: SEO) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: seo.title,
    description: seo.description,
    serviceType: "Renta y venta de multifuncionales",
    url: `${BASE}${seo.canonical}`,
    provider: PROVIDER,
    areaServed: {
      "@type": "City",
      name: city.city,
      containedInPlace: { "@type": "State", name: city.state },
      geo: { "@type": "GeoCoordinates", latitude: city.geo.lat, longitude: city.geo.lng },
    },
  };
}

export function buildFaqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
}

export function buildMetadata(seo: SEO): Metadata {
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: `${BASE}${seo.canonical}` },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `${BASE}${seo.canonical}`,
      siteName: "Multicart",
      locale: "es_MX",
      type: "website",
      images: seo.ogImage ? [{ url: `${BASE}${seo.ogImage}` }] : undefined,
    },
  };
}
