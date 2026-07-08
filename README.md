# Multicart — Sitio web (Next.js)

Porteo del sitio [multicart.mx](https://multicart.mx) (antes WordPress + Elementor) a **Next.js 15** (App Router, 100% estático), listo para **Vercel**.

Multicart es una empresa de renta y venta de multifuncionales, consumibles y servicio técnico en Guadalajara.

## Stack

- **Next.js 15** (App Router) · **React 19** · **TypeScript** (strict)
- **Tailwind CSS v4** (tokens de color y tipografía en `app/globals.css`)
- **Generación estática (SSG)** — sin base de datos
- **Plunk** para el email del formulario de contacto
- Deploy en **Vercel**

## Desarrollo local

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de producción (genera las páginas estáticas)
npm run start    # sirve el build
```

## Estructura

```
app/                     Rutas (App Router). Cada página lee su JSON y lo renderiza.
  page.tsx                 Home (/)
  nosotros/                /nosotros
  servicios/               /servicios + [slug] (3 servicios + 3 landings de ciudad)
  fortinet-para-pymes/     /fortinet-para-pymes
  contacto/                /contacto
  politica-de-privacidad/  /politica-de-privacidad
  sitemap.ts, robots.ts    SEO
content/                 CONTENIDO DEL SITIO (aquí se edita el texto)
  site.json                Datos globales: nav, footer, teléfono, WhatsApp, dirección, redes
  home.json, nosotros.json, servicios.json, contacto.json, ...
  servicios/*.json         Páginas de servicio y landings de ciudad
components/              UI: layout (Header/Footer/WhatsAppFloat), bloques y SectionRenderer
lib/                    types.ts (esquema de contenido), content.ts, seo.ts, plunk.ts, sanitize.ts
actions/                send-contact.ts (Server Action → Plunk)
public/images/          Imágenes optimizadas
```

## Editar contenido

El contenido vive en archivos **JSON** en `content/`. Cada página es `{ seo, sections: [] }`, donde
cada `section` es un **bloque** (`hero`, `servicesGrid`, `imageText`, `featureList`, `testimonials`,
`videoGallery`, `brandStrip`, `cta`, `contact`, `richText`). Los tipos están en `lib/types.ts`.

- Cambiar textos/CTAs → editar el JSON de la página.
- Datos globales (teléfono, WhatsApp, dirección, redes, nav, footer) → `content/site.json`.
- Agregar una imagen → colócala en `public/images/` y referénciala como `/images/<archivo>` en el JSON.

Tras editar, `npm run build` valida y regenera. En Vercel basta con hacer push a `main`.

## Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `PLUNK_API_KEY` | API key de Plunk para enviar el email del formulario de contacto a `contacto@multicart.mx`. |

Local: crea `.env.local` con `PLUNK_API_KEY=sk_...` (ver `.env.example`). **Nunca** se commitea.

## Deploy en Vercel

El proyecto está pensado para Vercel (framework autodetectado: Next.js).

1. Conectar el repo de GitHub a Vercel (o `vercel` / `vercel --prod` con el CLI).
2. En **Settings → Environment Variables** agregar `PLUNK_API_KEY` (Production + Preview).
3. Cada push a `main` dispara un deploy.

> **DNS / dominio:** apuntar `multicart.mx` a Vercel es un paso posterior que se coordina aparte
> (fuera del alcance de este porteo). Mientras tanto el sitio vive en la URL `*.vercel.app`.

## Notas del porteo

Se corrigieron algunos errores del sitio origen ("limpieza"): email unificado a
`contacto@multicart.mx`, typo "Luenes"→"Lunes", badge de Tepatitlán "Colima"→"Jalisco",
y números de WhatsApp por ciudad en las landings. El diseño replica el sitio original.
