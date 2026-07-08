import { getPage, getSite } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import SectionRenderer from "@/components/SectionRenderer";

export async function generateMetadata() {
  const { seo } = await getPage("servicios");
  return buildMetadata(seo);
}

export default async function Page() {
  const { sections } = await getPage("servicios");
  return <SectionRenderer sections={sections} site={getSite()} />;
}
