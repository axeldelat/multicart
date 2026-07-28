// Ciudades con página local de servicio. Alimenta el JSON-LD (areaServed) para
// diferenciar cada landing ante Google y reforzar la señal de SEO local.
// La base operativa es Guadalajara; en cada ciudad hay técnico especializado asignado.

export interface CityPage {
  slug: string;
  city: string;
  state: string;
  geo: { lat: number; lng: number };
}

export const CITY_PAGES: Record<string, CityPage> = {
  "renta-y-venta-de-multifuncionales-manzanillo": {
    slug: "renta-y-venta-de-multifuncionales-manzanillo",
    city: "Manzanillo",
    state: "Colima",
    geo: { lat: 19.1138, lng: -104.3383 },
  },
  "renta-y-venta-de-multifuncionales-mazatlan": {
    slug: "renta-y-venta-de-multifuncionales-mazatlan",
    city: "Mazatlán",
    state: "Sinaloa",
    geo: { lat: 23.2494, lng: -106.4111 },
  },
  "renta-y-venta-de-multifuncionales-tepatitlan": {
    slug: "renta-y-venta-de-multifuncionales-tepatitlan",
    city: "Tepatitlán de Morelos",
    state: "Jalisco",
    geo: { lat: 20.8176, lng: -102.7635 },
  },
  "renta-y-venta-de-multifuncionales-playa-del-carmen": {
    slug: "renta-y-venta-de-multifuncionales-playa-del-carmen",
    city: "Playa del Carmen",
    state: "Quintana Roo",
    geo: { lat: 20.6296, lng: -87.0739 },
  },
};

export function getCityPage(slug: string): CityPage | undefined {
  return CITY_PAGES[slug];
}
