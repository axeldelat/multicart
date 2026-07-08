# Porteo Multicart WordPress → Next.js — Diseño

**Fecha:** 2026-07-08
**Objetivo:** Portear el sitio https://multicart.mx/ (WordPress + Elementor) a Next.js para deploy en Vercel, como réplica fiel del diseño actual con limpieza técnica (responsive, performance, código mantenible).

---

## 1. Contexto

Multicart es una empresa de renta y venta de multifuncionales, consumibles y servicio técnico en Guadalajara, México. El sitio actual:

- WordPress + Elementor + tema con Yoast SEO.
- En español. Sitio de servicios (**no** e-commerce, sin carrito ni precios).
- 12 páginas, incluyendo landings SEO por ciudad.
- CTAs a WhatsApp, teléfono y formulario de contacto.

## 2. Alcance — Inventario de páginas

| Ruta | Tipo | Notas |
|------|------|-------|
| `/` | Home | hero, servicios, marcas, testimonios, videos, CTA |
| `/nosotros` | Institucional | |
| `/servicios` | Hub | tarjetas de servicios |
| `/servicios/renta-y-venta-de-multifuncionales` | Servicio | template base de ciudad |
| `/servicios/venta-de-consumibles` | Servicio | |
| `/servicios/servicio-tecnico` | Servicio | |
| `/servicios/renta-y-venta-de-multifuncionales-manzanillo` | Landing ciudad | variación SEO |
| `/servicios/renta-y-venta-de-multifuncionales-tepatitlan` | Landing ciudad | variación SEO |
| `/servicios/renta-y-venta-de-multifuncionales-mazatlan` | Landing ciudad | variación SEO |
| `/fortinet-para-pymes` | Landing | producto Fortinet |
| `/contacto` | Contacto | formulario + datos |
| `/politica-de-privacidad` | Legal | |

**Crítico:** preservar exactamente las 12 URLs, títulos, meta descriptions y Open Graph para no perder posicionamiento (especialmente las landings por ciudad).

## 3. Enfoque

**Reconstrucción por componentes.** Se extrae contenido + assets + estilos visuales del sitio actual y se rearma cada sección como componentes React limpios que reproducen el diseño sin el bloat de Elementor.

Alternativa descartada: copiar HTML/CSS de Elementor literal — idéntico más rápido pero arrastra peso y contradice la "limpieza".

## 4. Stack técnico

- **Next.js 15 (App Router) + TypeScript + Tailwind CSS v4**.
- **100% estático (SSG)** — sin base de datos.
- **Contenido en `/content/*.json`** tipado con TypeScript (el "JSON CMS").
- **Imágenes**: descargadas del zip `uploads`, optimizadas con `next/image`, servidas desde `/public/images`.
- **Fuentes**: las que usa el sitio (Archivo, Open Sans, Poppins, Roboto, Montserrat — confirmar cuáles se usan realmente) vía `next/font`.
- **Formulario de contacto**: Server Action → API de **Plunk** (email transaccional a contacto@multicart.mx). API key en variable de entorno `PLUNK_API_KEY`.
- **WhatsApp / teléfono**: ligas `wa.me` y `tel:` directas (sin backend).
- **SEO**: `metadata` de Next por página (title, description, canonical, OG), `sitemap.xml` y `robots.txt` generados.
- **Deploy**: Vercel.

## 5. Modelo de contenido (JSON)

```
/content
  site.json            → nav, footer, teléfono, WhatsApp, dirección, email,
                         redes sociales, textos legales globales
  home.json
  nosotros.json
  servicios.json
  servicio-multifuncionales.json
  servicio-consumibles.json
  servicio-tecnico.json
  fortinet.json
  contacto.json
  politica-privacidad.json
  /ciudades
    manzanillo.json     → overrides sobre el template base
    tepatitlan.json
    mazatlan.json
```

- Cada JSON incluye un bloque `seo` (`title`, `description`, `canonical`, `og`).
- Las 3 landings de ciudad comparten un **template** y solo cambian datos vía su JSON.
- Todos los JSON tipados con interfaces TS en `/lib/types.ts` para que un error falle en build.

## 6. Estructura del proyecto

```
/app
  layout.tsx                      → Header + Footer + fuentes globales
  page.tsx                        → Home
  nosotros/page.tsx
  servicios/page.tsx
  servicios/[slug]/page.tsx       → servicios + landings de ciudad (generateStaticParams)
  fortinet-para-pymes/page.tsx
  contacto/page.tsx
  politica-de-privacidad/page.tsx
  sitemap.ts
  robots.ts
/components                       → Header, Footer, Hero, ServiceCard, BrandStrip,
                                    Testimonials, VideoSection, WhatsAppFloat,
                                    ContactForm, CTA, ...
/content                          → JSON (sección 5)
/lib
  types.ts                        → interfaces del contenido
  plunk.ts                        → cliente de envío de email
  seo.ts                          → helper para construir metadata
/actions
  send-contact.ts                 → Server Action del formulario → Plunk
/public/images                    → assets optimizados del zip uploads
```

## 7. Flujo de extracción (Fase 0)

Fuentes disponibles:
- Zip `uploads (1).zip` ya provisto → media library, CSS de Elementor por página (`elementor/css/post-XX.css`), fuentes.
- Crawl de las 12 URLs públicas para: estructura de secciones, copy exacto, orden de bloques, metadatos SEO.

Pasos:
1. Crawl de las 12 páginas: capturar copy, jerarquía de secciones, metadatos (title/description/OG) y qué imágenes usa cada bloque.
2. Cruzar con el zip: mapear cada imagen usada a su archivo en `uploads/` y extraer estilos (colores, tipografía, spacing) de los `post-XX.css`.
3. Generar en `/scratchpad` un **mapa de contenido** (por página: secciones, textos, imágenes, meta) que alimenta los JSON.
4. Copiar y optimizar las imágenes necesarias a `/public/images`.

## 8. Formulario de contacto

- Componente `ContactForm` (client) con validación básica.
- Envío vía **Server Action** `send-contact.ts` que llama a la API de Plunk.
- Campos: nombre, email, teléfono, mensaje (confirmar contra el formulario actual durante el crawl).
- Sin almacenamiento propio; Plunk entrega el correo a contacto@multicart.mx.
- WhatsApp y teléfono son ligas directas, no pasan por el form.

## 9. SEO y paridad

- Replicar por página: `<title>`, meta description, canonical, OG tags (extraídos del crawl / Yoast).
- Mantener las 12 rutas idénticas (sin cambios de slug).
- `sitemap.ts` genera las 12 URLs; `robots.ts` permite indexación.
- Favicons y datos estructurados básicos (LocalBusiness) si existen en el actual.

## 10. Verificación

- Comparación visual página por página contra el sitio live (desktop y mobile).
- `next build` sin errores de tipos (valida los JSON).
- Lighthouse: performance, accesibilidad y SEO en verde.
- Prueba real del formulario: envío llega vía Plunk.
- Revisión de que las 12 rutas resuelven y sus metadatos coinciden.

## 11. Fuera de alcance

- Rediseño visual (es réplica + limpieza).
- Migración de dominio / DNS (paso posterior, se coordina aparte).
- Panel de administración / CMS headless (el contenido vive en JSON).
- Cualquier funcionalidad e-commerce.

## 12. Pendientes del usuario

- `PLUNK_API_KEY` (puede esperar hasta la fase del formulario).
- Confirmar campos exactos del formulario actual (se valida en el crawl).
- Cuenta de Vercel para el deploy.
