import type { Metadata } from "next";
import { Poppins, Archivo } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppFloat from "@/components/layout/WhatsAppFloat";
import { getSite } from "@/lib/content";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-archivo",
  display: "swap",
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
      </body>
    </html>
  );
}
