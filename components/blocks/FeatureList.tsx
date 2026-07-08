import Image from "next/image";
import type { FeatureListBlock } from "@/lib/types";

export default function FeatureList({ heading, items }: FeatureListBlock) {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        {heading ? (
          <h2 className="mb-12 text-center font-display text-2xl font-bold text-navy sm:text-3xl">
            {heading}
          </h2>
        ) : null}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex flex-col items-center rounded-xl bg-surface p-6 text-center"
            >
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
          ))}
        </div>
      </div>
    </section>
  );
}
