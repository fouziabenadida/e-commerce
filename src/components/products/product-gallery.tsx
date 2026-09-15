"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = React.useState(0);
  const safeImages = images.length > 0 ? images : ["/placeholder.svg"];

  return (
    <div className="flex flex-col-reverse gap-4 lg:flex-row" data-testid="product-gallery">
      {/* Thumbnails */}
      {safeImages.length > 1 && (
        <div className="flex gap-3 lg:flex-col">
          {safeImages.map((image, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActive(idx)}
              className={cn(
                "relative h-20 w-20 overflow-hidden rounded-md border-2 bg-muted transition-colors",
                active === idx
                  ? "border-primary"
                  : "border-transparent hover:border-border"
              )}
              aria-label={`View image ${idx + 1}`}
              aria-pressed={active === idx}
            >
              <Image
                src={image}
                alt={`${alt} thumbnail ${idx + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main image */}
      <div className="relative aspect-square flex-1 overflow-hidden rounded-xl border bg-muted">
        <Image
          src={safeImages[active]}
          alt={alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}