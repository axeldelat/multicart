import Image from "next/image";
import type { ImageTextBlock } from "@/lib/types";
import CTAButton from "@/components/Button";
import { sanitizeHtml } from "@/lib/sanitize";

export default function ImageText({
  heading,
  body,
  image,
  imageSide,
  buttons,
}: ImageTextBlock) {
  const safeBody = sanitizeHtml(body);

  return (
    <section className="bg-white py-16">
      <div
        className={`mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 lg:gap-16 lg:px-8 ${
          imageSide === "left" ? "lg:flex-row" : "lg:flex-row-reverse"
        }`}
      >
        <div className="relative h-64 w-full flex-1 overflow-hidden rounded-2xl shadow-lg sm:h-80 lg:h-96">
          <Image
            src={image}
            alt=""
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="flex-1">
          {heading ? (
            <h2 className="font-display text-2xl font-bold text-navy sm:text-3xl">{heading}</h2>
          ) : null}
          <div
            className="mt-4 max-w-none text-base leading-relaxed text-navy-soft [&_a]:font-medium [&_a]:text-accent [&_a]:underline [&_li]:mt-1 [&_ol]:mt-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mt-3 [&_p:first-child]:mt-0 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6"
            dangerouslySetInnerHTML={{ __html: safeBody }}
          />
          {buttons && buttons.length > 0 ? (
            <div className="mt-6 flex flex-wrap gap-4">
              {buttons.map((button, i) => (
                <CTAButton key={i} {...button} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
