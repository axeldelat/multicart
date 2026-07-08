import { getPage, getSite } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import SectionRenderer from "@/components/SectionRenderer";

export async function generateMetadata() {
  const { seo } = await getPage("contacto");
  return buildMetadata(seo);
}

export default async function Page() {
  const { sections } = await getPage("contacto");
  return <SectionRenderer sections={sections} site={getSite()} />;
}
