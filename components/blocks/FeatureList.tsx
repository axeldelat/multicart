import Image from "next/image";
import type { FeatureListBlock } from "@/lib/types";
import YouTubeFacade from "@/components/YouTubeFacade";

type FeatureItem = FeatureListBlock["items"][number];

function FeatureCard({ item }: { item: FeatureItem }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-navy/10 bg-surface p-6 text-center shadow-card transition-transform duration-300 hover:-translate-y-1">
      {item.icon ? (
        // Los íconos son línea blanca: van en un chip navy para que contrasten.
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-navy">
          <div className="relative h-8 w-8">
            <Image src={item.icon} alt="" fill sizes="32px" className="object-contain" />
          </div>
        </div>
      ) : null}
      <h3 className="font-display text-base font-semibold text-navy">{item.title}</h3>
      {item.description ? (
        <p className="mt-2 text-sm leading-relaxed text-navy-soft">{item.description}</p>
      ) : null}
    </div>
  );
}

export default function FeatureList({ heading, video, items }: FeatureListBlock) {
  // Columnas según la cantidad de tarjetas (3 -> 3 cols, 2 -> 2 cols, resto -> 4).
  const gridCols =
    items.length === 3
      ? "sm:grid-cols-3"
      : items.length === 2
        ? "sm:grid-cols-2"
        : "sm:grid-cols-2 lg:grid-cols-4";

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        {heading ? (
          <h2 className="mb-12 text-center font-display text-2xl font-bold text-navy sm:text-3xl">
            {heading}
          </h2>
        ) : null}

        {video ? (
          // Cuatro cards en 2x2 a la izquierda, video a la derecha.
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {items.map((item, i) => (
                <FeatureCard key={i} item={item} />
              ))}
            </div>
            <YouTubeFacade youtubeId={video.youtubeId} title={video.title} />
          </div>
        ) : (
          <div className={`grid grid-cols-1 gap-8 ${gridCols}`}>
            {items.map((item, i) => (
              <FeatureCard key={i} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
