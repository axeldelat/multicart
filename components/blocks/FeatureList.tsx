import Image from "next/image";
import type { FeatureListBlock } from "@/lib/types";

type FeatureItem = FeatureListBlock["items"][number];

function FeatureCard({ item }: { item: FeatureItem }) {
  return (
    <div className="flex flex-col items-center rounded-xl bg-surface p-6 text-center">
      {item.icon ? (
        <div className="relative mb-4 h-12 w-12">
          <Image src={item.icon} alt="" fill sizes="48px" className="object-contain" />
        </div>
      ) : null}
      <h3 className="font-display text-base font-semibold text-navy">{item.title}</h3>
      {item.description ? (
        <p className="mt-2 text-sm leading-relaxed text-navy-soft">{item.description}</p>
      ) : null}
    </div>
  );
}

function VideoEmbed({ youtubeId, title }: NonNullable<FeatureListBlock["video"]>) {
  return (
    <div className="overflow-hidden rounded-xl bg-navy shadow-sm">
      <div className="relative aspect-video w-full">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
    </div>
  );
}

export default function FeatureList({ heading, video, items }: FeatureListBlock) {
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
            <VideoEmbed {...video} />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item, i) => (
              <FeatureCard key={i} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
