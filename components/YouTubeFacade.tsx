"use client";

import { useState } from "react";
import Image from "next/image";

// Facade "click-to-load": muestra una miniatura local (cero JS de YouTube) y
// solo carga el reproductor real cuando el usuario da click. Gran ahorro en
// performance mobile (el player de YouTube pesa ~1 MB).
export default function YouTubeFacade({
  youtubeId,
  title,
  thumbnail = "/images/video-thumb.jpg",
}: {
  youtubeId: string;
  title: string;
  thumbnail?: string;
}) {
  const [play, setPlay] = useState(false);

  if (play) {
    return (
      <div className="overflow-hidden rounded-xl bg-navy shadow-card">
        <div className="relative aspect-video w-full">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlay(true)}
      aria-label={`Reproducir video: ${title}`}
      className="group relative block w-full overflow-hidden rounded-xl bg-navy shadow-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <div className="relative aspect-video w-full">
        <Image
          src={thumbnail}
          alt=""
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover opacity-95 transition-opacity group-hover:opacity-100"
        />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent shadow-lg transition-transform duration-200 group-hover:scale-110">
            <svg viewBox="0 0 24 24" fill="white" aria-hidden="true" className="ml-1 h-7 w-7">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </span>
      </div>
    </button>
  );
}
