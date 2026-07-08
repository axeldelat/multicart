import { getPage, getSite } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import SectionRenderer from "@/components/SectionRenderer";

export async function generateMetadata() {
  const { seo } = await getPage("home");
  return buildMetadata(seo);
}

export default async function Home() {
  const { sections } = await getPage("home");
  return <SectionRenderer sections={sections} site={getSite()} />;
}
