"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductCarouselProps {
  title?: React.ReactNode;
  children: React.ReactNode;
}

export function ProductCarousel({ title, children }: ProductCarouselProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <div>
      {title && (
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>{title}</div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scrollBy(-1)}
              aria-label="Previous items"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scrollBy(1)}
              aria-label="Next items"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      <div
        ref={ref}
        className="-mx-1 flex gap-4 overflow-x-auto scroll-smooth px-1 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
    </div>
  );
}