"use client";

import Image from "next/image";
import { useState } from "react";
import { ImageOff } from "lucide-react";

interface ProductImageProps {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}

/** Square product image with a graceful fallback when the file fails to load. */
export default function ProductImage({
  src,
  alt,
  sizes,
  priority,
  className = "",
}: ProductImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (failedSrc === src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex size-full flex-col items-center justify-center gap-2 bg-surface-sunken text-fg-subtle ${className}`}
      >
        <ImageOff className="size-8" aria-hidden="true" />
        <span className="text-xs">Image unavailable</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized={src.endsWith(".svg")}
      onError={() => setFailedSrc(src)}
      className={`object-cover ${className}`}
    />
  );
}
