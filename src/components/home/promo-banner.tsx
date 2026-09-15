import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function PromoBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid overflow-hidden rounded-2xl border lg:grid-cols-2">
        <div className="relative min-h-[280px]">
          <Image
            src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1600&auto=format&fit=crop"
            alt="Limited time offer"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col items-start justify-center gap-4 bg-primary p-8 text-primary-foreground sm:p-12">
          <p className="text-sm font-semibold uppercase tracking-widest opacity-80">
            Limited Time
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Up to 25% off premium electronics
          </h2>
          <p className="max-w-md text-primary-foreground/80">
            Refresh your setup with our most-loved gadgets. Prices marked down
            for a short window — while stock lasts.
          </p>
          <Link
            href="/shop?category=electronics"
            className="group mt-2 inline-flex items-center gap-2 rounded-full bg-primary-foreground px-6 py-3 text-sm font-semibold text-primary transition-transform hover:scale-105"
          >
            Shop Electronics
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}