# Porteo Multicart WordPress → Next.js — Plan de Implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reconstruir multicart.mx (WordPress + Elementor) como un sitio Next.js estático, réplica fiel + limpieza técnica, deployado en Vercel.

**Architecture:** Next.js 15 App Router 100% estático (SSG). El contenido vive en `/content/*.json` con un modelo de **bloques** (discriminated union) que un `SectionRenderer` mapea a componentes React. Las imágenes salen del zip `uploads` ya provisto. El formulario de contacto usa un Server Action → API de Plunk. WhatsApp/tel son ligas directas.

**Tech Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS v4, `next/font`, `next/image`, Plunk (email), Vercel (deploy).

## Global Constraints

- **Idioma:** todo el contenido en español (con acentos correctos).
- **Rutas:** preservar EXACTAMENTE las 12 URLs del sitio actual (sección "Inventario"). Sin cambiar slugs.
- **Paleta:** navy `#1c244b`, azul secundario `#324a6d`, naranja acento `#ff7f2a`, azul brillante `#467ff7`, fondos claros `#f3f5f8` / `#f2f2f2`, blanco `#ffffff`, texto oscuro `#020101`.
- **Tipografía:** primaria **Poppins**; secundarias Archivo / Montserrat (usar solo donde el original las use). Cargar vía `next/font/google`.
- **Sin base de datos, sin CMS externo.** Contenido en JSON tipado.
- **SSG:** todas las páginas estáticas. Sin `dynamic = 'force-dynamic'`.
- **Node/Next:** Next 15, React 19, TypeScript strict, Tailwind v4.
- **Secreto:** `PLUNK_API_KEY` en variable de entorno (nunca hardcodear).
- **Email destino:** `contacto@multicart.mx`.
- **Assets de origen:** `_extraction/uploads/` (ya extraído; ignorado por git).

## Inventario de rutas (paridad obligatoria)

| Ruta | Fuente de contenido |
|------|---------------------|
| `/` | `content/home.json` |
| `/nosotros` | `content/nosotros.json` |
| `/servicios` | `content/servicios.json` |
| `/servicios/renta-y-venta-de-multifuncionales` | `content/servicios/renta-y-venta-de-multifuncionales.json` |
| `/servicios/venta-de-consumibles` | `content/servicios/venta-de-consumibles.json` |
| `/servicios/servicio-tecnico` | `content/servicios/servicio-tecnico.json` |
| `/servicios/renta-y-venta-de-multifuncionales-manzanillo` | `content/servicios/...-manzanillo.json` |
| `/servicios/renta-y-venta-de-multifuncionales-tepatitlan` | `content/servicios/...-tepatitlan.json` |
| `/servicios/renta-y-venta-de-multifuncionales-mazatlan` | `content/servicios/...-mazatlan.json` |
| `/fortinet-para-pymes` | `content/fortinet-para-pymes.json` |
| `/contacto` | `content/contacto.json` |
| `/politica-de-privacidad` | `content/politica-de-privacidad.json` |

---

## Mapa de archivos

```
/app
  layout.tsx              → html, fuentes, Header, Footer, WhatsAppFloat
  globals.css             → Tailwind + tokens de color/fuente
  page.tsx                → Home (lee home.json)
  nosotros/page.tsx
  servicios/page.tsx
  servicios/[slug]/page.tsx   → 6 páginas hijas de /servicios (SSG)
  fortinet-para-pymes/page.tsx
  contacto/page.tsx
  politica-de-privacidad/page.tsx
  sitemap.ts
  robots.ts
/lib
  types.ts                → Block union, PageContent, SiteData, SEO
  content.ts              → loaders tipados de JSON
  plunk.ts                → cliente de email
  seo.ts                  → buildMetadata(seo)
/actions
  send-contact.ts         → Server Action → Plunk
/components
  layout/Header.tsx
  layout/Footer.tsx
  layout/WhatsAppFloat.tsx
  SectionRenderer.tsx     → switch por block.type
  blocks/Hero.tsx
  blocks/ServicesGrid.tsx
  blocks/BrandStrip.tsx
  blocks/RichText.tsx
  blocks/FeatureList.tsx
  blocks/ImageText.tsx
  blocks/Testimonials.tsx
  blocks/VideoGallery.tsx
  blocks/CTA.tsx
  blocks/ContactBlock.tsx
  ContactForm.tsx         → client component
/content
  site.json
  *.json (una por página; ver inventario)
/public/images            → assets optimizados
/scratchpad-content       → mapas de extracción intermedios (git-ignored)
```

## Modelo de contenido (bloques)

Cada página = `{ seo: SEO, sections: Block[] }`. `Block` es una discriminated union por `type`. El `SectionRenderer` recorre `sections` y renderiza el componente correspondiente. Esto hace triviales las páginas y reutiliza bloques entre Home, servicios y landings de ciudad.

Tipos de bloque: `hero`, `servicesGrid`, `brandStrip`, `richText`, `featureList`, `imageText`, `testimonials`, `videoGallery`, `cta`, `contact`.

---

# FASE A — Scaffold e infraestructura

### Task A1: Crear proyecto Next.js + Tailwind + tokens

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `app/globals.css`, `app/layout.tsx`, `app/page.tsx` (temporal)
- Create: `.gitignore` (append)

**Interfaces:**
- Produces: proyecto que corre `npm run dev` y `npm run build`.

- [ ] **Step 1: Scaffold**

```bash
cd /Users/axeldelat/Projects/multicart
npx create-next-app@latest . --ts --app --tailwind --eslint --src-dir=false --import-alias "@/*" --no-turbopack --yes
```
Si `create-next-app` se queja de directorio no vacío, mover `docs/` y `_extraction/` temporalmente o usar `--yes` y confirmar. Conservar `docs/` y el `.gitignore` existente (mergear, no sobrescribir las líneas `_extraction/`, `*.zip`).

- [ ] **Step 2: Añadir a `.gitignore`**

Asegurar que contiene:
```
_extraction/
*.zip
/scratchpad-content
node_modules/
.next/
.env*.local
.DS_Store
```

- [ ] **Step 3: Definir tokens en `app/globals.css`**

Debajo del `@import "tailwindcss";`, añadir el theme (Tailwind v4 usa `@theme`):
```css
@theme {
  --color-navy: #1c244b;
  --color-navy-soft: #324a6d;
  --color-accent: #ff7f2a;
  --color-accent-soft: #ffbc7d;
  --color-brand-blue: #467ff7;
  --color-surface: #f3f5f8;
  --color-surface-2: #f2f2f2;
  --color-ink: #020101;
  --font-sans: var(--font-poppins);
  --font-display: var(--font-archivo);
}
```

- [ ] **Step 4: Configurar fuentes en `app/layout.tsx`**

```tsx
import { Poppins, Archivo } from "next/font/google";
const poppins = Poppins({ subsets: ["latin"], weight: ["300","400","500","600","700"], variable: "--font-poppins", display: "swap" });
const archivo = Archivo({ subsets: ["latin"], weight: ["400","600","700"], variable: "--font-archivo", display: "swap" });
// en <html lang="es" className={`${poppins.variable} ${archivo.variable}`}>
// en <body className="font-sans text-ink antialiased">
```
Dejar `app/page.tsx` con un `<h1>Multicart</h1>` temporal.

- [ ] **Step 5: Verificar build**

Run: `npm run build`
Expected: build OK, sin errores de tipos.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js app with Tailwind tokens and fonts"
```

---

### Task A2: Tipos del contenido (`lib/types.ts`)

**Files:**
- Create: `lib/types.ts`

**Interfaces:**
- Produces: `SEO`, `Block` (union), `PageContent`, `SiteData`, y tipos por bloque. Todo lo demás los consume.

- [ ] **Step 1: Escribir los tipos**

```ts
export interface SEO {
  title: string;
  description: string;
  canonical: string;       // ruta absoluta, ej "/nosotros"
  ogImage?: string;        // ruta en /images
}

export interface CTAButton {
  label: string;
  href: string;            // ruta interna, wa.me, tel:, o mailto:
  style?: "primary" | "secondary" | "ghost";
}

export interface HeroBlock {
  type: "hero";
  eyebrow?: string;
  title: string;
  subtitle?: string;
  image?: string;
  buttons?: CTAButton[];
  background?: "navy" | "light" | "image";
}

export interface ServiceCard {
  title: string;
  description: string;
  image?: string;
  icon?: string;
  href?: string;
}
export interface ServicesGridBlock {
  type: "servicesGrid";
  heading?: string;
  intro?: string;
  cards: ServiceCard[];
}

export interface BrandStripBlock {
  type: "brandStrip";
  heading?: string;
  logos: { src: string; alt: string }[];
}

export interface RichTextBlock {
  type: "richText";
  heading?: string;
  html: string;            // HTML saneado extraído del original
  background?: "navy" | "light" | "white";
}

export interface FeatureListBlock {
  type: "featureList";
  heading?: string;
  items: { title: string; description?: string; icon?: string }[];
}

export interface ImageTextBlock {
  type: "imageText";
  heading?: string;
  body: string;            // texto o HTML simple
  image: string;
  imageSide: "left" | "right";
  buttons?: CTAButton[];
}

export interface TestimonialsBlock {
  type: "testimonials";
  heading?: string;
  items: { name: string; text: string; rating?: number; source?: string }[];
}

export interface VideoGalleryBlock {
  type: "videoGallery";
  heading?: string;
  videos: { youtubeId: string; title: string }[];
}

export interface CTABlock {
  type: "cta";
  title: string;
  subtitle?: string;
  buttons: CTAButton[];
  background?: "navy" | "accent" | "light";
}

export interface ContactBlock {
  type: "contact";
  heading?: string;
  intro?: string;
  showForm: boolean;
}

export type Block =
  | HeroBlock | ServicesGridBlock | BrandStripBlock | RichTextBlock
  | FeatureListBlock | ImageTextBlock | TestimonialsBlock
  | VideoGalleryBlock | CTABlock | ContactBlock;

export interface PageContent {
  seo: SEO;
  sections: Block[];
}

export interface NavItem { label: string; href: string; children?: NavItem[]; }

export interface SiteData {
  name: string;
  phone: string;           // "33 2191 0090"
  phoneHref: string;       // "tel:+523321910090"
  whatsapp: string;        // "https://wa.me/523321910090?text=..."
  email: string;           // "contacto@multicart.mx"
  address: string;
  nav: NavItem[];
  footer: {
    tagline?: string;
    columns: { heading: string; links: NavItem[] }[];
    legalLinks: NavItem[];
  };
  social: { platform: string; href: string }[];
}
```

- [ ] **Step 2: Verificar que compila**

Run: `npx tsc --noEmit`
Expected: sin errores.

- [ ] **Step 3: Commit**

```bash
git add lib/types.ts && git commit -m "feat: content block type system"
```

---

### Task A3: Loaders de contenido (`lib/content.ts`) + `site.json` inicial

**Files:**
- Create: `lib/content.ts`, `content/site.json`

**Interfaces:**
- Consumes: tipos de `lib/types.ts`.
- Produces: `getSite(): SiteData`, `getPage(slug: string): PageContent`. Las páginas los consumen.

- [ ] **Step 1: Loaders**

```ts
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
```

- [ ] **Step 2: `content/site.json` con datos reales del sitio**

Rellenar con los datos confirmados del sitio actual:
```json
{
  "name": "Multicart",
  "phone": "33 2191 0090",
  "phoneHref": "tel:+523321910090",
  "whatsapp": "https://wa.me/523321910090?text=Hola%2C%20quiero%20informaci%C3%B3n",
  "email": "contacto@multicart.mx",
  "address": "Francisco Zarco 2324, Guadalajara, Jal. 44600",
  "nav": [
    { "label": "Inicio", "href": "/" },
    { "label": "Nosotros", "href": "/nosotros" },
    { "label": "Servicios", "href": "/servicios", "children": [
      { "label": "Renta y venta de multifuncionales", "href": "/servicios/renta-y-venta-de-multifuncionales" },
      { "label": "Venta de consumibles", "href": "/servicios/venta-de-consumibles" },
      { "label": "Servicio técnico", "href": "/servicios/servicio-tecnico" }
    ]},
    { "label": "Contacto", "href": "/contacto" }
  ],
  "footer": {
    "tagline": "Expertos en impresoras y multifuncionales en Guadalajara.",
    "columns": [
      { "heading": "Servicios", "links": [
        { "label": "Renta y venta de multifuncionales", "href": "/servicios/renta-y-venta-de-multifuncionales" },
        { "label": "Venta de consumibles", "href": "/servicios/venta-de-consumibles" },
        { "label": "Servicio técnico", "href": "/servicios/servicio-tecnico" }
      ]}
    ],
    "legalLinks": [ { "label": "Política de privacidad", "href": "/politica-de-privacidad" } ]
  },
  "social": []
}
```
> Confirmar teléfono/WhatsApp/dirección/redes exactos durante la extracción (Task B1) y corregir aquí si difieren.

- [ ] **Step 3: Verificar**

Run: `npx tsc --noEmit`
Expected: sin errores.

- [ ] **Step 4: Commit**

```bash
git add lib/content.ts content/site.json && git commit -m "feat: content loaders and site data"
```

---

# FASE B — Extracción de contenido y assets

### Task B1: Crawl de las 12 páginas → mapas de contenido

**Files:**
- Create: `scratchpad-content/<slug>.md` (uno por página, git-ignored)

**Interfaces:**
- Produces: para cada página, un documento con: metadatos SEO (title, meta description, canonical, OG image), lista ordenada de secciones con su copy exacto, y los nombres de archivo de las imágenes que usa.

- [ ] **Step 1: Extraer, por cada una de las 12 URLs**

Usar WebFetch (o herramientas de navegador) sobre cada URL del inventario. Para cada página capturar y guardar en `scratchpad-content/<slug>.md`:
- `<title>` y `<meta name="description">` (del `<head>`).
- `<link rel="canonical">` y `og:title`/`og:description`/`og:image`.
- Cada sección visible en orden: encabezados, párrafos, textos de botones y sus destinos (href), items de listas, testimonios (nombre + texto + estrellas), IDs de videos de YouTube.
- El `src` de cada imagen (nombre de archivo) para mapearla al zip.

- [ ] **Step 2: Confirmar datos globales**

Verificar teléfono, WhatsApp (número + texto pre-cargado), email, dirección y redes sociales reales. Anotar discrepancias con `content/site.json` para corregir.

- [ ] **Step 3: Commit (solo el mapa si se decide versionarlo; por defecto git-ignored)**

No hay commit de código en este task. Deliverable = los `.md` de mapeo listos para alimentar los JSON.

---

### Task B2: Selección y optimización de imágenes → `/public/images`

**Files:**
- Create: `public/images/*` (subset usado)
- Create: `scratchpad-content/image-map.md`

**Interfaces:**
- Consumes: nombres de imagen de Task B1.
- Produces: cada imagen usada copiada a `public/images/` con nombre kebab-case estable, y un mapa `nombre-original → /images/nombre-nuevo`.

- [ ] **Step 1: Copiar solo las imágenes referenciadas**

Por cada imagen listada en los mapas de B1, localizar el archivo de mayor resolución en `_extraction/uploads/` (evitar los sufijos `-768x432`, `-300x124` salvo que se necesite ese tamaño) y copiarlo a `public/images/` con nombre descriptivo. Ejemplo:
```bash
cp "_extraction/uploads/2024/09/Diseno-sin-titulo-11.png" public/images/hero-multifuncionales.png
```

- [ ] **Step 2: Convertir a formatos web donde convenga**

Para JPG/PNG grandes, generar `.webp` con calidad ~82 (si hay `cwebp`/`sharp` disponible) o dejar que `next/image` optimice en runtime. Registrar el mapeo en `image-map.md`.

- [ ] **Step 3: Copiar favicons e ícono**

```bash
cp "_extraction/uploads/2024/09/cropped-Diseno-sin-titulo-23-1-32x32.png" app/icon.png  # o el tamaño adecuado
```
Colocar `app/icon.png` (Next lo toma como favicon) y `app/apple-icon.png` si aplica.

- [ ] **Step 4: Commit**

```bash
git add public/images app/icon.png && git commit -m "assets: add optimized images and favicon"
```

---

# FASE C — Layout global y bloques reutilizables

### Task C1: Header con nav y menú de Servicios

**Files:**
- Create: `components/layout/Header.tsx`
- Modify: `app/layout.tsx` (montar Header)

**Interfaces:**
- Consumes: `getSite().nav`, `SiteData`.
- Produces: `<Header site={SiteData} />`.

- [ ] **Step 1: Implementar Header**

Header sticky con logo (`/images/logo.png`), nav desktop con dropdown para "Servicios" (usa `NavItem.children`), botón CTA de contacto/WhatsApp, y menú hamburguesa en mobile (client component con estado de apertura). Colores: fondo blanco, texto navy, CTA naranja.

- [ ] **Step 2: Montar en `app/layout.tsx`**

```tsx
import { getSite } from "@/lib/content";
import Header from "@/components/layout/Header";
// dentro de <body>: <Header site={getSite()} /> {children} <Footer .../>
```

- [ ] **Step 3: Verificar**

Run: `npm run build` → OK. `npm run dev` y revisar header en desktop y mobile.

- [ ] **Step 4: Commit**

```bash
git add components/layout/Header.tsx app/layout.tsx && git commit -m "feat: site header with responsive nav"
```

---

### Task C2: Footer y botón flotante de WhatsApp

**Files:**
- Create: `components/layout/Footer.tsx`, `components/layout/WhatsAppFloat.tsx`
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: `SiteData`.
- Produces: `<Footer site>`, `<WhatsAppFloat href>`.

- [ ] **Step 1: Footer**

Fondo navy `#1c244b`, texto claro. Columnas de `footer.columns`, datos de contacto (dirección, teléfono como `tel:`, email como `mailto:`), `legalLinks`, y línea de copyright con el año. El año se calcula en build (`new Date().getFullYear()`), no en cliente.

- [ ] **Step 2: WhatsAppFloat**

Botón fijo abajo-derecha con ícono de WhatsApp que abre `site.whatsapp` en `_blank`. `aria-label` descriptivo.

- [ ] **Step 3: Montar ambos en layout.**

- [ ] **Step 4: Verificar y commit**

Run: `npm run build` → OK.
```bash
git add components/layout/Footer.tsx components/layout/WhatsAppFloat.tsx app/layout.tsx && git commit -m "feat: footer and floating WhatsApp button"
```

---

### Task C3: SectionRenderer + bloques

**Files:**
- Create: `components/SectionRenderer.tsx` y todos los `components/blocks/*.tsx`

**Interfaces:**
- Consumes: tipos `Block` de `lib/types.ts`, `SiteData` (para CTAs que apunten a WhatsApp/tel).
- Produces: `<SectionRenderer sections={Block[]} site={SiteData} />`.

- [ ] **Step 1: SectionRenderer (switch exhaustivo)**

```tsx
import { Block, SiteData } from "@/lib/types";
import Hero from "./blocks/Hero";
import ServicesGrid from "./blocks/ServicesGrid";
// ...imports del resto
export default function SectionRenderer({ sections, site }: { sections: Block[]; site: SiteData }) {
  return <>{sections.map((b, i) => {
    switch (b.type) {
      case "hero": return <Hero key={i} {...b} />;
      case "servicesGrid": return <ServicesGrid key={i} {...b} />;
      case "brandStrip": return <BrandStrip key={i} {...b} />;
      case "richText": return <RichText key={i} {...b} />;
      case "featureList": return <FeatureList key={i} {...b} />;
      case "imageText": return <ImageText key={i} {...b} />;
      case "testimonials": return <Testimonials key={i} {...b} />;
      case "videoGallery": return <VideoGallery key={i} {...b} />;
      case "cta": return <CTA key={i} {...b} site={site} />;
      case "contact": return <ContactBlock key={i} {...b} site={site} />;
      default: { const _e: never = b; return null; }
    }
  })}</>;
}
```

- [ ] **Step 2: Implementar cada bloque**

Cada bloque en `components/blocks/` renderiza su tipo usando `next/image` para imágenes y Tailwind con los tokens. Reglas visuales (fieles al original):
- `Hero`: full-width, variante navy/light/image; título grande Poppins; botones (`CTAButton`) primary=naranja, secondary=outline.
- `ServicesGrid`: grid responsive de tarjetas con imagen, título, descripción, link "Ver más".
- `BrandStrip`: fila de logos en escala de grises → color en hover.
- `RichText`: prosa; sanear el `html` (permitir solo tags básicos).
- `FeatureList`: grid de "por qué elegirnos" con íconos.
- `ImageText`: dos columnas alternables (`imageSide`).
- `Testimonials`: tarjetas con estrellas y fuente (Google).
- `VideoGallery`: embeds de YouTube (usar `youtube-nocookie`, `loading="lazy"`).
- `CTA`: banda de llamado con botones; `href` de WhatsApp/tel resuelto desde `site` cuando el botón lo indique.
- `ContactBlock`: encabezado + datos + `<ContactForm />` si `showForm`.

Un `Button`/`CTAButton` helper compartido resuelve estilos y detecta si el href es interno (`next/link`) o externo (`<a target=_blank>`).

- [ ] **Step 3: Verificar tipos**

Run: `npx tsc --noEmit` y `npm run build`
Expected: sin errores; el `never` del default garantiza que no falte ningún tipo.

- [ ] **Step 4: Commit**

```bash
git add components/SectionRenderer.tsx components/blocks && git commit -m "feat: block renderer and section components"
```

---

### Task C4: Helper de SEO (`lib/seo.ts`)

**Files:**
- Create: `lib/seo.ts`

**Interfaces:**
- Consumes: `SEO`.
- Produces: `buildMetadata(seo: SEO): Metadata`.

- [ ] **Step 1: Implementar**

```ts
import type { Metadata } from "next";
import { SEO } from "./types";
const BASE = "https://multicart.mx";
export function buildMetadata(seo: SEO): Metadata {
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: `${BASE}${seo.canonical}` },
    openGraph: {
      title: seo.title, description: seo.description, url: `${BASE}${seo.canonical}`,
      siteName: "Multicart", locale: "es_MX", type: "website",
      images: seo.ogImage ? [{ url: `${BASE}${seo.ogImage}` }] : undefined,
    },
  };
}
```

- [ ] **Step 2: Verificar y commit**

Run: `npx tsc --noEmit` → OK.
```bash
git add lib/seo.ts && git commit -m "feat: SEO metadata helper"
```

---

# FASE D — Formulario de contacto (Plunk)

### Task D1: Cliente Plunk + Server Action

**Files:**
- Create: `lib/plunk.ts`, `actions/send-contact.ts`
- Create: `.env.local` (no commitear), `.env.example`

**Interfaces:**
- Produces: `sendContact(prev, formData): Promise<{ ok: boolean; error?: string }>` (Server Action).

- [ ] **Step 1: `.env.example`**

```
PLUNK_API_KEY=sk_xxx
```
Crear `.env.local` real con la key provista por el usuario. Verificar que `.env*.local` está en `.gitignore`.

- [ ] **Step 2: Cliente Plunk**

```ts
// lib/plunk.ts
import "server-only";
export async function sendTransactional(input: {
  to: string; subject: string; body: string;
}): Promise<void> {
  const res = await fetch("https://api.useplunk.com/v1/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.PLUNK_API_KEY}`,
    },
    body: JSON.stringify({ to: input.to, subject: input.subject, body: input.body }),
  });
  if (!res.ok) throw new Error(`Plunk error ${res.status}: ${await res.text()}`);
}
```

- [ ] **Step 3: Server Action con validación**

```ts
// actions/send-contact.ts
"use server";
import { sendTransactional } from "@/lib/plunk";

export type ContactState = { ok: boolean; error?: string };

export async function sendContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  if (formData.get("company")) return { ok: true }; // honeypot
  if (!name || !email || !message) return { ok: false, error: "Faltan campos obligatorios." };
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { ok: false, error: "Correo inválido." };
  try {
    await sendTransactional({
      to: "contacto@multicart.mx",
      subject: `Nuevo contacto web: ${name}`,
      body: `<p><b>Nombre:</b> ${name}</p><p><b>Email:</b> ${email}</p><p><b>Teléfono:</b> ${phone}</p><p><b>Mensaje:</b><br/>${message.replace(/\n/g, "<br/>")}</p>`,
    });
    return { ok: true };
  } catch {
    return { ok: false, error: "No se pudo enviar. Intenta por WhatsApp." };
  }
}
```

- [ ] **Step 4: Verificar tipos**

Run: `npx tsc --noEmit` → OK.

- [ ] **Step 5: Commit**

```bash
git add lib/plunk.ts actions/send-contact.ts .env.example && git commit -m "feat: Plunk contact email server action"
```

---

### Task D2: Componente `ContactForm`

**Files:**
- Create: `components/ContactForm.tsx`

**Interfaces:**
- Consumes: `sendContact` action.
- Produces: `<ContactForm />`.

- [ ] **Step 1: Implementar (client, `useActionState`)**

```tsx
"use client";
import { useActionState } from "react";
import { sendContact, ContactState } from "@/actions/send-contact";
const initial: ContactState = { ok: false };
export default function ContactForm() {
  const [state, action, pending] = useActionState(sendContact, initial);
  if (state.ok) return <p className="text-green-700">¡Gracias! Te contactaremos pronto.</p>;
  return (
    <form action={action} className="grid gap-4">
      <input type="text" name="company" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden />
      <input name="name" required placeholder="Nombre" className="..." />
      <input name="email" type="email" required placeholder="Correo" className="..." />
      <input name="phone" placeholder="Teléfono" className="..." />
      <textarea name="message" required placeholder="Mensaje" className="..." />
      {state.error && <p className="text-red-600">{state.error}</p>}
      <button disabled={pending} className="bg-accent text-white ...">{pending ? "Enviando…" : "Enviar"}</button>
    </form>
  );
}
```
Ajustar `className` a los estilos del sitio. Wirear en `ContactBlock` (Task C3) si aún no está.

- [ ] **Step 2: Verificar build y commit**

Run: `npm run build` → OK.
```bash
git add components/ContactForm.tsx && git commit -m "feat: contact form component"
```

---

# FASE E — Páginas (contenido + rutas)

> Cada task de página sigue el mismo ciclo: (1) escribir el JSON con el contenido extraído en Task B1 siguiendo el schema de bloques; (2) crear/confirmar la ruta que lo renderiza; (3) `npm run build`; (4) comparación visual contra la página live (desktop + mobile); (5) commit. El JSON es el deliverable revisable de cada task.

### Task E1: Home (`/`)

**Files:**
- Create: `content/home.json`, `app/page.tsx`

- [ ] **Step 1: `content/home.json`** — escribir `seo` + `sections` (hero, servicesGrid con Scanner/Impresora/Copiadora, richText "Expertos en impresoras", brandStrip Samsung/Brother/Ricoh, imageText tóner, featureList "por qué elegirnos" ×4, videoGallery YouTube, testimonials Google, cta final) con el copy exacto de `scratchpad-content/home.md`.

- [ ] **Step 2: `app/page.tsx`**

```tsx
import { getPage, getSite } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import SectionRenderer from "@/components/SectionRenderer";
export async function generateMetadata() { const { seo } = await getPage("home"); return buildMetadata(seo); }
export default async function Home() {
  const { sections } = await getPage("home");
  return <SectionRenderer sections={sections} site={getSite()} />;
}
```

- [ ] **Step 3: build + verificación visual vs https://multicart.mx/**
- [ ] **Step 4: Commit** `git commit -m "feat: home page"`

---

### Task E2: Nosotros (`/nosotros`)

**Files:** Create `content/nosotros.json`, `app/nosotros/page.tsx`

- [ ] **Step 1:** JSON con contenido de `scratchpad-content/nosotros.md`.
- [ ] **Step 2:** `app/nosotros/page.tsx` (mismo patrón que Home, `getPage("nosotros")`).
- [ ] **Step 3:** build + verificación visual vs `/nosotros`.
- [ ] **Step 4:** Commit `git commit -m "feat: nosotros page"`.

---

### Task E3: Hub de Servicios (`/servicios`)

**Files:** Create `content/servicios.json`, `app/servicios/page.tsx`

- [ ] **Step 1:** JSON (hero + servicesGrid con las 3 tarjetas de servicio + cta).
- [ ] **Step 2:** `app/servicios/page.tsx` con `getPage("servicios")`.
- [ ] **Step 3:** build + verificación visual vs `/servicios`.
- [ ] **Step 4:** Commit `git commit -m "feat: servicios hub page"`.

---

### Task E4: Ruta dinámica de servicios + 6 JSON hijos

**Files:**
- Create: `app/servicios/[slug]/page.tsx`
- Create: `content/servicios/renta-y-venta-de-multifuncionales.json`, `.../venta-de-consumibles.json`, `.../servicio-tecnico.json`, `.../renta-y-venta-de-multifuncionales-manzanillo.json`, `.../renta-y-venta-de-multifuncionales-tepatitlan.json`, `.../renta-y-venta-de-multifuncionales-mazatlan.json`

**Interfaces:**
- Produces: 6 rutas estáticas bajo `/servicios/`.

- [ ] **Step 1: Ruta dinámica con SSG**

```tsx
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
export function generateStaticParams() { return SLUGS.map((slug) => ({ slug })); }
export const dynamicParams = false;
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const { seo } = await getPage(`servicios/${slug}`); return buildMetadata(seo);
}
export default async function ServicioPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const { sections } = await getPage(`servicios/${slug}`);
  return <SectionRenderer sections={sections} site={getSite()} />;
}
```

- [ ] **Step 2: Escribir los 3 JSON de servicio** (multifuncionales, consumibles, servicio-técnico) con su copy de B1.

- [ ] **Step 3: Escribir los 3 JSON de landing por ciudad** — parten del template de multifuncionales, ajustando encabezados/copy/menciones a Manzanillo, Tepatitlán y Mazatlán, y su `seo` propio (title/description/canonical). Mantener paridad de secciones con el original de cada ciudad.

- [ ] **Step 4:** build → verificar que `generateStaticParams` emite las 6 rutas. Verificación visual de cada una vs su URL live.

- [ ] **Step 5: Commit** `git commit -m "feat: servicios detail and city landing pages"`.

---

### Task E5: Fortinet (`/fortinet-para-pymes`)

**Files:** Create `content/fortinet-para-pymes.json`, `app/fortinet-para-pymes/page.tsx`

- [ ] **Step 1:** JSON (usar logo Fortinet en `/images`).
- [ ] **Step 2:** page.tsx con `getPage("fortinet-para-pymes")`.
- [ ] **Step 3:** build + verificación visual vs `/fortinet-para-pymes`.
- [ ] **Step 4:** Commit `git commit -m "feat: fortinet landing page"`.

---

### Task E6: Contacto (`/contacto`)

**Files:** Create `content/contacto.json`, `app/contacto/page.tsx`

- [ ] **Step 1:** JSON con bloque `contact` (`showForm: true`), datos y quizá un mapa/embed si el original lo tiene.
- [ ] **Step 2:** page.tsx con `getPage("contacto")` (el `ContactBlock` monta `<ContactForm/>`).
- [ ] **Step 3:** build + verificación visual vs `/contacto`.
- [ ] **Step 4:** Commit `git commit -m "feat: contacto page"`.

---

### Task E7: Política de privacidad (`/politica-de-privacidad`)

**Files:** Create `content/politica-de-privacidad.json`, `app/politica-de-privacidad/page.tsx`

- [ ] **Step 1:** JSON con un bloque `richText` que contenga el texto legal íntegro extraído del original.
- [ ] **Step 2:** page.tsx con `getPage("politica-de-privacidad")`.
- [ ] **Step 3:** build + verificación visual vs `/politica-de-privacidad`.
- [ ] **Step 4:** Commit `git commit -m "feat: privacy policy page"`.

---

# FASE F — SEO técnico, verificación y deploy

### Task F1: `sitemap.ts`, `robots.ts`, redirecciones

**Files:** Create `app/sitemap.ts`, `app/robots.ts`

- [ ] **Step 1: sitemap**

```ts
import type { MetadataRoute } from "next";
const BASE = "https://multicart.mx";
const ROUTES = [
  "/", "/nosotros", "/servicios",
  "/servicios/renta-y-venta-de-multifuncionales",
  "/servicios/venta-de-consumibles",
  "/servicios/servicio-tecnico",
  "/servicios/renta-y-venta-de-multifuncionales-manzanillo",
  "/servicios/renta-y-venta-de-multifuncionales-tepatitlan",
  "/servicios/renta-y-venta-de-multifuncionales-mazatlan",
  "/fortinet-para-pymes", "/contacto", "/politica-de-privacidad",
];
export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((r) => ({ url: `${BASE}${r}`, changeFrequency: "monthly", priority: r === "/" ? 1 : 0.7 }));
}
```

- [ ] **Step 2: robots**

```ts
import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "*", allow: "/" }], sitemap: "https://multicart.mx/sitemap.xml" };
}
```

- [ ] **Step 3:** build → verificar `/sitemap.xml` y `/robots.txt` en dev. Commit `git commit -m "feat: sitemap and robots"`.

---

### Task F2: Verificación integral

**Files:** ninguno (verificación)

- [ ] **Step 1:** `npm run build` limpio, sin warnings de tipos ni de imágenes.
- [ ] **Step 2:** Recorrer las 12 rutas en `npm run start`; confirmar que cada una resuelve y su `<title>`/meta coincide con el original (comparar contra `scratchpad-content/*`).
- [ ] **Step 3:** Lighthouse (Performance, SEO, Accesibilidad) en Home, un servicio y contacto → apuntar a ≥90.
- [ ] **Step 4:** Enviar el formulario con la `PLUNK_API_KEY` real y confirmar que el correo llega a contacto@multicart.mx.
- [ ] **Step 5:** Revisión responsive (mobile/tablet/desktop) de las 12 páginas.
- [ ] **Step 6:** Commit de cualquier fix `git commit -m "fix: verification adjustments"`.

---

### Task F3: Deploy a Vercel

**Files:** Create `README.md` (instrucciones de deploy/env)

- [ ] **Step 1:** Conectar el repo a Vercel (framework detectado: Next.js). Configurar la env var `PLUNK_API_KEY` en el proyecto de Vercel (Production + Preview).
- [ ] **Step 2:** Deploy de preview; verificar las 12 rutas y el formulario en el dominio `*.vercel.app`.
- [ ] **Step 3:** `README.md` con: cómo correr local, dónde vive el contenido (JSON), cómo agregar imágenes, y la nota de que el cambio de DNS de multicart.mx → Vercel se coordina aparte (fuera de alcance).
- [ ] **Step 4:** Commit `git commit -m "docs: deploy readme"` y push.

---

## Self-Review (cobertura del spec)

- Réplica + limpieza → bloques limpios en vez de HTML de Elementor. ✅
- 12 rutas idénticas → inventario + `generateStaticParams` + sitemap. ✅
- Contenido en JSON tipado → Fase A/E + `lib/types.ts`. ✅
- Imágenes del zip → Task B2. ✅
- Plunk email + WhatsApp ligas → Fase D + `WhatsAppFloat`/CTAButton. ✅
- SEO (title/desc/OG/canonical/sitemap/robots) → C4 + F1. ✅
- Fuentes/paleta reales → Global Constraints + A1. ✅
- Deploy Vercel + env → F3. ✅
- Fuera de alcance (DNS, CMS, e-commerce) → respetado. ✅

**Notas:** el copy exacto de cada página es el output de la extracción (Task B1) y se materializa en los JSON de la Fase E; por eso los tasks de página describen el schema y el procedimiento en vez de incrustar texto aún no extraído.
