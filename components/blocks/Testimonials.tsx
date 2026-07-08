import type { TestimonialsBlock } from "@/lib/types";

function Stars({ rating }: { rating: number }) {
  const rounded = Math.max(0, Math.min(5, Math.round(rating)));

  return (
    <div className="flex items-center gap-0.5" aria-label={`${rounded} de 5 estrellas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          aria-hidden="true"
          className={`h-4 w-4 ${i < rounded ? "fill-accent" : "fill-navy/15"}`}
        >
          <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1 1 5.8L10 14.9l-5.21 2.74 1-5.8-4.21-4.1 5.82-.85L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials({ heading, items }: TestimonialsBlock) {
  return (
    <section className="bg-surface py-16">
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        {heading ? (
          <h2 className="mb-12 text-center font-display text-2xl font-bold text-navy sm:text-3xl">
            {heading}
          </h2>
        ) : null}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <figure key={i} className="flex flex-col rounded-xl bg-white p-6 shadow-sm">
              {typeof item.rating === "number" ? <Stars rating={item.rating} /> : null}
              <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-navy-soft">
                &ldquo;{item.text}&rdquo;
              </blockquote>
              <figcaption className="mt-4 text-sm font-semibold text-navy">
                {item.name}
                {item.source ? (
                  <span className="ml-2 font-normal text-navy-soft/70">· {item.source}</span>
                ) : null}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
