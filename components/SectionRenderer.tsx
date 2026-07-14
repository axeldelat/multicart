import type { Block, SiteData } from "@/lib/types";
import Hero from "@/components/blocks/Hero";
import ServicesGrid from "@/components/blocks/ServicesGrid";
import BrandStrip from "@/components/blocks/BrandStrip";
import RichText from "@/components/blocks/RichText";
import FeatureList from "@/components/blocks/FeatureList";
import ImageText from "@/components/blocks/ImageText";
import Testimonials from "@/components/blocks/Testimonials";
import VideoGallery from "@/components/blocks/VideoGallery";
import CTA from "@/components/blocks/CTA";
import ContactBlock from "@/components/blocks/ContactBlock";
import Stats from "@/components/blocks/Stats";

export default function SectionRenderer({
  sections,
  site,
}: {
  sections: Block[];
  site: SiteData;
}) {
  function renderBlock(block: Block) {
    switch (block.type) {
      case "hero":
        return <Hero {...block} />;
      case "servicesGrid":
        return <ServicesGrid {...block} />;
      case "brandStrip":
        return <BrandStrip {...block} />;
      case "richText":
        return <RichText {...block} />;
      case "featureList":
        return <FeatureList {...block} />;
      case "imageText":
        return <ImageText {...block} />;
      case "testimonials":
        return <Testimonials {...block} />;
      case "videoGallery":
        return <VideoGallery {...block} />;
      case "cta":
        return <CTA {...block} site={site} />;
      case "contact":
        return <ContactBlock {...block} site={site} />;
      case "stats":
        return <Stats {...block} />;
      default: {
        const _exhaustiveCheck: never = block;
        return _exhaustiveCheck;
      }
    }
  }

  return (
    <>
      {sections.map((block, i) => (
        // El hero no lleva reveal (está sobre el pliegue); el resto anima al entrar.
        <div key={i} className={block.type === "hero" ? undefined : "reveal"}>
          {renderBlock(block)}
        </div>
      ))}
    </>
  );
}
