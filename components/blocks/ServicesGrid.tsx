import Image from "next/image";
import Link from "next/link";
import type { ServicesGridBlock } from "@/lib/types";

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="h-4 w-4 shrink-0">
      <path
        d="M4 10h12M11 5l5 5-5 5"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ServicesGrid({ heading, intro, cards }: ServicesGridBlock) {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        {heading || intro ? (
          <div className="mx-auto mb-12 max-w-2xl text-center">
            {heading ? (
              <h2 className="font-display text-2xl font-bold text-navy sm:text-3xl">{heading}</h2>
            ) : null}
            {intro ? <p className="mt-4 text-navy-soft">{intro}</p> : null}
          </div>
        ) : null}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, i) => {
            const cardBody = (
              <>
                {card.image ? (
                  <div className="relative h-48 w-full overflow-hidden rounded-t-xl bg-surface">
                    <Image
                      src={card.image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                ) : null}
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-lg font-semibold text-navy">{card.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-navy-soft">
                    {card.description}
                  </p>
                  {card.href ? (
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent">
                      Conocer más
                      <ArrowIcon />
                    </span>
                  ) : null}
                </div>
              </>
            );

            if (card.href) {
              return (
                <Link
                  key={i}
                  href={card.href}
                  className="group flex h-full flex-col overflow-hidden rounded-xl border border-navy/10 bg-white shadow-sm transition-shadow hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {cardBody}
                </Link>
              );
            }

            return (
              <div
                key={i}
                className="group flex h-full flex-col overflow-hidden rounded-xl border border-navy/10 bg-white shadow-sm"
              >
                {cardBody}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
