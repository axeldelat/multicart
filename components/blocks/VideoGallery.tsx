import type { VideoGalleryBlock } from "@/lib/types";
import CTAButton from "@/components/Button";

function VideoEmbed({ youtubeId, title }: { youtubeId: string; title: string }) {
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

export default function VideoGallery({ heading, body, cta, videos }: VideoGalleryBlock) {
  const [primary, ...rest] = videos;

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          {/* Columna de texto */}
          <div>
            {heading ? (
              <h2 className="font-display text-2xl font-bold text-navy sm:text-3xl">{heading}</h2>
            ) : null}
            {body ? (
              <p className="mt-4 text-base leading-relaxed text-navy-soft">{body}</p>
            ) : null}
            {cta ? (
              <div className="mt-6">
                <CTAButton {...cta} />
              </div>
            ) : null}
          </div>

          {/* Columna del video */}
          {primary ? <VideoEmbed {...primary} /> : null}
        </div>

        {/* Videos adicionales (si hubiera más de uno) */}
        {rest.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((video, i) => (
              <VideoEmbed key={i} {...video} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
