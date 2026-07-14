import Image from "next/image";
import type { BrandStripBlock } from "@/lib/types";

function LogoItem({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative mx-8 h-10 w-28 shrink-0 grayscale opacity-70 transition duration-200 hover:opacity-100 hover:grayscale-0 sm:h-12 sm:w-32">
      <Image src={src} alt={alt} fill sizes="160px" className="object-contain" />
    </div>
  );
}

export default function BrandStrip({ heading, logos }: BrandStripBlock) {
  // Duplicamos la lista para que el desplazamiento de -50% sea un loop perfecto.
  const track = [...logos, ...logos];

  return (
    <section className="bg-surface-2 py-12">
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        {heading ? (
          <h2 className="mb-8 text-center font-display text-sm font-semibold uppercase tracking-wider text-navy-soft">
            {heading}
          </h2>
        ) : null}
      </div>

      {/* Carrusel infinito: máscara de degradado en los bordes + pausa al hover */}
      <div
        className="group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
        aria-label={heading ?? "Marcas"}
      >
        <div className="flex w-max animate-marquee items-center group-hover:[animation-play-state:paused]">
          {track.map((logo, i) => (
            <LogoItem key={i} src={logo.src} alt={i < logos.length ? logo.alt : ""} />
          ))}
        </div>
      </div>
    </section>
  );
}
