"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductImage from "./ProductImage";

export default function ProductGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [index, setIndex] = useState(0);
  const touchStart = useRef<number | null>(null);
  const count = images.length;

  const go = (next: number) => setIndex((next + count) % count);

  return (
    <div className="flex flex-col gap-3">
      <div
        className="relative aspect-square touch-pan-y overflow-hidden rounded-2xl border border-line bg-surface-sunken"
        onTouchStart={(event) => {
          touchStart.current = event.touches[0].clientX;
        }}
        onTouchEnd={(event) => {
          if (touchStart.current === null || count < 2) return;
          const delta = event.changedTouches[0].clientX - touchStart.current;
          touchStart.current = null;
          if (Math.abs(delta) > 40) go(index + (delta < 0 ? 1 : -1));
        }}
      >
        <ProductImage
          key={images[index]}
          src={images[index]}
          alt={`${name} — image ${index + 1} of ${count}`}
          loading="eager"
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="animate-swap"
        />
        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-surface/90 text-fg shadow hover:bg-surface"
            >
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="Next image"
              className="absolute right-2 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-surface/90 text-fg shadow hover:bg-surface"
            >
              <ChevronRight className="size-5" aria-hidden="true" />
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <ul className="flex gap-2 overflow-x-auto pb-1" aria-label="Product images">
          {images.map((src, thumbIndex) => (
            <li key={src} className="shrink-0">
              <button
                type="button"
                onClick={() => setIndex(thumbIndex)}
                aria-label={`Show image ${thumbIndex + 1}`}
                aria-current={thumbIndex === index}
                className={`relative block size-16 overflow-hidden rounded-xl border-2 sm:size-20 ${
                  thumbIndex === index
                    ? "border-accent"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <ProductImage src={src} alt="" sizes="80px" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
