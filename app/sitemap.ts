import type { MetadataRoute } from "next";

const BASE = "https://multicart.mx";
const ROUTES = [
  "/",
  "/nosotros",
  "/servicios",
  "/servicios/renta-y-venta-de-multifuncionales",
  "/servicios/venta-de-consumibles",
  "/servicios/servicio-tecnico",
  "/servicios/renta-y-venta-de-multifuncionales-manzanillo",
  "/servicios/renta-y-venta-de-multifuncionales-tepatitlan",
  "/servicios/renta-y-venta-de-multifuncionales-mazatlan",
  "/servicios/renta-y-venta-de-multifuncionales-playa-del-carmen",
  "/contacto",
  "/politica-de-privacidad",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((r) => ({
    url: `${BASE}${r}`,
    changeFrequency: "monthly",
    priority: r === "/" ? 1 : 0.7,
  }));
}
