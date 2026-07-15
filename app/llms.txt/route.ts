import { getSite } from "@/lib/content";

// Se prerenderiza a un archivo estático servido en /llms.txt
export const dynamic = "force-static";

const BASE = "https://multicart.mx";

const PAGES: { path: string; title: string; desc: string }[] = [
  { path: "/", title: "Inicio", desc: "Renta y venta de multifuncionales en Guadalajara; marcas, consumibles y servicio técnico." },
  { path: "/nosotros", title: "Nosotros", desc: "Quiénes somos, experiencia y métricas de la empresa." },
  { path: "/servicios", title: "Servicios", desc: "Resumen de los servicios: multifuncionales, consumibles y servicio técnico." },
  { path: "/servicios/renta-y-venta-de-multifuncionales", title: "Renta y venta de multifuncionales", desc: "Catálogo de equipos Samsung, Brother y RICOH en renta y venta." },
  { path: "/servicios/venta-de-consumibles", title: "Venta de consumibles", desc: "Cartuchos de tóner genéricos y consumibles para equipos de impresión." },
  { path: "/servicios/servicio-tecnico", title: "Servicio técnico", desc: "Mantenimiento preventivo y correctivo de impresoras y multifuncionales." },
  { path: "/servicios/renta-y-venta-de-multifuncionales-manzanillo", title: "Multifuncionales en Manzanillo", desc: "Renta y venta de multifuncionales en Manzanillo, Colima." },
  { path: "/servicios/renta-y-venta-de-multifuncionales-tepatitlan", title: "Multifuncionales en Tepatitlán", desc: "Renta y venta de multifuncionales en Tepatitlán, Jalisco." },
  { path: "/servicios/renta-y-venta-de-multifuncionales-mazatlan", title: "Multifuncionales en Mazatlán", desc: "Renta y venta de multifuncionales en Mazatlán, Sinaloa." },
  { path: "/servicios/renta-y-venta-de-multifuncionales-playa-del-carmen", title: "Multifuncionales en Playa del Carmen", desc: "Renta y venta de multifuncionales en Playa del Carmen, Quintana Roo." },
  { path: "/contacto", title: "Contacto", desc: "Datos de contacto, horario, formulario y ubicación." },
  { path: "/politica-de-privacidad", title: "Política de privacidad", desc: "Aviso de privacidad y derechos ARCO." },
];

export function GET() {
  const site = getSite();
  const waNumber = site.whatsapp.replace(/^https?:\/\/wa\.me\//, "").replace(/\?.*$/, "");

  const content = `# ${site.name}

> Empresa de renta y venta de impresoras multifuncionales, venta de consumibles (tóner) y servicio técnico especializado en Guadalajara y otras ciudades de México.

Multicart ofrece soluciones integrales de impresión para negocios, oficinas y empresas: renta y venta de equipos multifuncionales de las principales marcas (Samsung, Brother, RICOH, HP, Lexmark, Xerox, Epson, Canon), mantenimiento preventivo y correctivo, y consumibles garantizados. Cobertura en la Zona Metropolitana de Guadalajara, Manzanillo, Tepatitlán, Mazatlán y Playa del Carmen.

## Páginas

${PAGES.map((p) => `- [${p.title}](${BASE}${p.path}): ${p.desc}`).join("\n")}

## Contacto

- Teléfono: ${site.phone}
- WhatsApp: https://wa.me/${waNumber}
- Email: ${site.email}
- Dirección: ${site.address}
- Horario: Lunes a Viernes, 9:00 a 17:00

## Recursos

- Sitemap: ${BASE}/sitemap.xml
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
