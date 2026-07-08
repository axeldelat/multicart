import type { Metadata } from "next";
import { SEO } from "./types";

const BASE = "https://multicart.mx";

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
