import "server-only";
import { PageContent, SiteData } from "./types";
import site from "@/content/site.json";

export function getSite(): SiteData {
  return site as SiteData;
}

export async function getPage(relPath: string): Promise<PageContent> {
  // relPath ej: "home", "servicios/venta-de-consumibles"
  const mod = await import(`@/content/${relPath}.json`);
  return mod.default as PageContent;
}
