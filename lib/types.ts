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
  hours?: string;
  mapEmbedUrl?: string;
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
