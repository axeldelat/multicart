import type { RichTextBlock } from "@/lib/types";
import { sanitizeHtml } from "@/lib/sanitize";

const BG_CLASSES: Record<NonNullable<RichTextBlock["background"]>, string> = {
  navy: "bg-navy text-white",
  light: "bg-surface text-navy",
  white: "bg-white text-navy",
};

export default function RichText({ heading, html, background = "white" }: RichTextBlock) {
  const safeHtml = sanitizeHtml(html);

  return (
    <section className={`${BG_CLASSES[background]} py-16`}>
      <div className="mx-auto max-w-3xl px-4 lg:px-8">
        {heading ? (
          <h2 className="mb-6 font-display text-2xl font-semibold sm:text-3xl">{heading}</h2>
        ) : null}
        <div
          className="max-w-none text-base leading-relaxed [&_a]:font-medium [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-2 [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:mt-6 [&_h3]:font-display [&_h3]:text-lg [&_h3]:font-semibold [&_h4]:mt-4 [&_h4]:font-semibold [&_li]:mt-1 [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mt-4 [&_p:first-child]:mt-0 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6"
          dangerouslySetInnerHTML={{ __html: safeHtml }}
        />
      </div>
    </section>
  );
}
