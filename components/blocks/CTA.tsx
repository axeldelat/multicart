import type { CTABlock, SiteData } from "@/lib/types";
import CTAButton, { resolveSiteHref } from "@/components/Button";

const BG_CLASSES: Record<NonNullable<CTABlock["background"]>, string> = {
  navy: "bg-navy text-white",
  accent: "bg-accent text-white",
  light: "bg-surface text-navy",
};

export default function CTA({
  title,
  subtitle,
  buttons,
  background = "navy",
  site,
}: CTABlock & { site: SiteData }) {
  const isDark = background !== "light";

  return (
    <section className={`${BG_CLASSES[background]} py-16`}>
      <div className="mx-auto max-w-4xl px-4 text-center lg:px-8">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">{title}</h2>
        {subtitle ? (
          <p className={`mt-4 text-lg leading-relaxed ${isDark ? "text-white/85" : "text-navy-soft"}`}>
            {subtitle}
          </p>
        ) : null}
        {buttons.length > 0 ? (
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {buttons.map((button, i) => (
              <CTAButton key={i} {...button} href={resolveSiteHref(button.href, site)} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
