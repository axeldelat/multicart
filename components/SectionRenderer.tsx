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

export default function SectionRenderer({
  sections,
  site,
}: {
  sections: Block[];
  site: SiteData;
}) {
  return (
    <>
      {sections.map((block, i) => {
        switch (block.type) {
          case "hero":
            return <Hero key={i} {...block} />;
          case "servicesGrid":
            return <ServicesGrid key={i} {...block} />;
          case "brandStrip":
            return <BrandStrip key={i} {...block} />;
          case "richText":
            return <RichText key={i} {...block} />;
          case "featureList":
            return <FeatureList key={i} {...block} />;
          case "imageText":
            return <ImageText key={i} {...block} />;
          case "testimonials":
            return <Testimonials key={i} {...block} />;
          case "videoGallery":
            return <VideoGallery key={i} {...block} />;
          case "cta":
            return <CTA key={i} {...block} site={site} />;
          case "contact":
            return <ContactBlock key={i} {...block} site={site} />;
          default: {
            const _exhaustiveCheck: never = block;
            return _exhaustiveCheck;
          }
        }
      })}
    </>
  );
}
