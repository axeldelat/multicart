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

function MapPinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4">
      <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
    </svg>
  );
}

export default function Testimonials({ heading, items, cta }: TestimonialsBlock) {
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
            <figure
              key={i}
              className="flex flex-col rounded-xl border border-navy/5 bg-white p-6 shadow-card transition-transform duration-300 hover:-translate-y-1"
            >
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
        {cta ? (
          <div className="mt-8 flex justify-center">
            <a
              href={cta.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-navy/20 bg-white px-4 py-2 text-sm font-medium text-navy transition-colors hover:border-accent hover:bg-accent hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <MapPinIcon />
              {cta.label}
            </a>
          </div>
        ) : null}
      </div>
    </section>
  );
}
