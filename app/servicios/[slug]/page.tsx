import { getPage, getSite } from "@/lib/content";
import { buildMetadata, buildServiceSchema, buildFaqSchema } from "@/lib/seo";
import { getCityPage } from "@/lib/cities";
import SectionRenderer from "@/components/SectionRenderer";
import type { FaqBlock } from "@/lib/types";

const SLUGS = [
  "renta-y-venta-de-multifuncionales",
  "venta-de-consumibles",
  "servicio-tecnico",
  "renta-y-venta-de-multifuncionales-manzanillo",
  "renta-y-venta-de-multifuncionales-tepatitlan",
  "renta-y-venta-de-multifuncionales-mazatlan",
  "renta-y-venta-de-multifuncionales-playa-del-carmen",
];

export function generateStaticParams() {
  return SLUGS.map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { seo } = await getPage(`servicios/${slug}`);
  return buildMetadata(seo);
}

export default async function ServicioPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { seo, sections } = await getPage(`servicios/${slug}`);

  const city = getCityPage(slug);
  const faq = sections.find((s): s is FaqBlock => s.type === "faq");
  const schemas = [
    city ? buildServiceSchema(city, seo) : null,
    faq && faq.items.length ? buildFaqSchema(faq.items) : null,
  ].filter(Boolean);

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <SectionRenderer sections={sections} site={getSite()} />
    </>
  );
}
