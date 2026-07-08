import type { VideoGalleryBlock } from "@/lib/types";

export default function VideoGallery({ heading, videos }: VideoGalleryBlock) {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        {heading ? (
          <h2 className="mb-12 text-center font-display text-2xl font-bold text-navy sm:text-3xl">
            {heading}
          </h2>
        ) : null}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video, i) => (
            <div key={i} className="overflow-hidden rounded-xl bg-navy shadow-sm">
              <div className="relative aspect-video w-full">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}`}
                  title={video.title}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
