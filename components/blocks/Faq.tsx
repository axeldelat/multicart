import type { FaqBlock } from "@/lib/types";

const BG_CLASSES: Record<NonNullable<FaqBlock["background"]>, string> = {
  navy: "bg-navy text-white",
  light: "bg-surface text-navy",
  white: "bg-white text-navy",
};

export default function Faq({ heading, items, background = "light" }: FaqBlock) {
  if (!items?.length) return null;

  return (
    <section className={`${BG_CLASSES[background]} py-16`}>
      <div className="mx-auto max-w-3xl px-4 lg:px-8">
        {heading ? (
          <h2 className="mb-6 font-display text-2xl font-semibold sm:text-3xl">{heading}</h2>
        ) : null}
        <dl className="divide-y divide-current/10">
          {items.map((item, i) => (
            <details key={i} className="group py-4" name="faq">
              <summary className="flex cursor-pointer items-center justify-between gap-4 font-display text-lg font-semibold [&::-webkit-details-marker]:hidden">
                <dt>{item.q}</dt>
                <span aria-hidden className="shrink-0 text-accent transition-transform group-open:rotate-45">+</span>
              </summary>
              <dd className="mt-3 text-base leading-relaxed opacity-90">{item.a}</dd>
            </details>
          ))}
        </dl>
      </div>
    </section>
  );
}
