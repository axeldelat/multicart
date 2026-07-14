import Image from "next/image";
import type { HeroBlock } from "@/lib/types";
import CTAButton from "@/components/Button";

export default function Hero({
  eyebrow,
  title,
  subtitle,
  image,
  buttons,
  background = "light",
}: HeroBlock) {
  if (background === "image") {
    return (
      <section className="relative isolate overflow-hidden bg-navy text-white">
        {image ? (
          <Image
            src={image}
            alt=""
            fill
            priority
            sizes="100vw"
            className="absolute inset-0 -z-20 object-cover"
          />
        ) : null}
        <div className="absolute inset-0 -z-10 bg-navy/80" />
        <div className="mx-auto max-w-6xl px-4 py-20 text-center lg:px-8 lg:py-28">
          {eyebrow ? (
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-accent-soft">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/85">
              {subtitle}
            </p>
          ) : null}
          {buttons && buttons.length > 0 ? (
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              {buttons.map((button, i) => (
                <CTAButton key={i} {...button} />
              ))}
            </div>
          ) : null}
        </div>
      </section>
    );
  }

  const isDark = background === "navy";

  return (
    <section
      className={`relative isolate overflow-hidden ${
        isDark ? "bg-navy text-white" : "bg-surface text-navy"
      }`}
    >
      {/* Glow ambiental para dar profundidad (evita el look plano). */}
      <div
        aria-hidden
        className={`pointer-events-none absolute -top-24 right-[-10%] -z-10 h-[28rem] w-[28rem] rounded-full blur-3xl ${
          isDark ? "bg-brand-blue/20" : "bg-accent/10"
        }`}
      />
      <div
        aria-hidden
        className={`pointer-events-none absolute bottom-[-30%] left-[-10%] -z-10 h-[24rem] w-[24rem] rounded-full blur-3xl ${
          isDark ? "bg-accent/10" : "bg-brand-blue/10"
        }`}
      />
      <div
        className={`mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 py-16 lg:px-8 lg:py-24 ${
          image ? "lg:flex-row" : ""
        }`}
      >
        <div className={`flex-1 text-center ${image ? "lg:text-left" : ""}`}>
          {eyebrow ? (
            <p
              className={`mb-3 text-sm font-semibold uppercase tracking-wider ${
                isDark ? "text-accent-soft" : "text-accent"
              }`}
            >
              {eyebrow}
            </p>
          ) : null}
          <h1 className="font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          {subtitle ? (
            <p
              className={`mt-5 text-lg leading-relaxed ${
                isDark ? "text-white/80" : "text-navy-soft"
              }`}
            >
              {subtitle}
            </p>
          ) : null}
          {buttons && buttons.length > 0 ? (
            <div className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start">
              {buttons.map((button, i) => (
                <CTAButton key={i} {...button} />
              ))}
            </div>
          ) : null}
        </div>
        {image ? (
          <div className="relative h-64 w-full max-w-lg flex-1 sm:h-80 lg:h-96">
            <Image
              src={image}
              alt=""
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="rounded-2xl object-cover shadow-card-lg ring-1 ring-navy/5"
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
