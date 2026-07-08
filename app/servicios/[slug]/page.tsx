import { getPage, getSite } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import SectionRenderer from "@/components/SectionRenderer";

const SLUGS = [
  "renta-y-venta-de-multifuncionales",
  "venta-de-consumibles",
  "servicio-tecnico",
  "renta-y-venta-de-multifuncionales-manzanillo",
  "renta-y-venta-de-multifuncionales-tepatitlan",
  "renta-y-venta-de-multifuncionales-mazatlan",
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
  const { sections } = await getPage(`servicios/${slug}`);
  return <SectionRenderer sections={sections} site={getSite()} />;
}
