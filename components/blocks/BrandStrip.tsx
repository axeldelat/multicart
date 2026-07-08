import Image from "next/image";
import type { BrandStripBlock } from "@/lib/types";

export default function BrandStrip({ heading, logos }: BrandStripBlock) {
  return (
    <section className="bg-surface-2 py-12">
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        {heading ? (
          <h2 className="mb-8 text-center font-display text-sm font-semibold uppercase tracking-wider text-navy-soft">
            {heading}
          </h2>
        ) : null}
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {logos.map((logo, i) => (
            <div
              key={i}
              className="relative h-10 w-28 grayscale opacity-70 transition duration-200 hover:opacity-100 hover:grayscale-0 sm:h-12 sm:w-32"
            >
              <Image src={logo.src} alt={logo.alt} fill sizes="160px" className="object-contain" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
