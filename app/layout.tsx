import type { Metadata } from "next";
import Script from "next/script";
import { Poppins, Archivo } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppFloat from "@/components/layout/WhatsAppFloat";
import AnalyticsEvents from "@/components/AnalyticsEvents";
import { getSite } from "@/lib/content";
import "./globals.css";

const GA_ID = "G-Y53X9HSQ1E";
const isProd = process.env.VERCEL_ENV === "production";

// No se precarga: libera el camino crítico (mejor LCP simulado). El texto
// renderiza en fallback y cambia con swap sin provocar layout shift (CLS 0).
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
  preload: false,
});

// Archivo (display, solo encabezados): no se precarga para no competir en la
// carga inicial; el swap muestra fallback y cambia sin bloquear.
const archivo = Archivo({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-archivo",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "Multicart",
  description: "Multicart",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const site = getSite();

  return (
    <html lang="es" className={`${poppins.variable} ${archivo.variable}`}>
      <body className="font-sans text-ink antialiased">
        <Header site={site} />
        {children}
        <Footer site={site} />
        <WhatsAppFloat href={site.whatsapp} />
        <AnalyticsEvents />
      </body>

      {/* GA solo en producción. El stub define gtag temprano (los eventos se
          encolan en dataLayer), pero el script pesado (~180KB) carga en idle
          (lazyOnload) para no competir con el LCP. */}
      {isProd ? (
        <>
          <Script id="ga-stub" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
          </Script>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="lazyOnload"
          />
        </>
      ) : null}
    </html>
  );
}
