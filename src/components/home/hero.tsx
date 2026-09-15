import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2400&auto=format&fit=crop"
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/20" />
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col items-start justify-center px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        <Badge variant="secondary" className="mb-6 gap-1.5 rounded-full px-4 py-1.5">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          Summer Collection 2026 is here
        </Badge>
        <h1 className="max-w-2xl text-4xl font-bold leading-[1.1] tracking-tight sm:text-6xl">
          Discover products that{" "}
          <span className="text-primary">elevate</span> your everyday
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
          From cutting-edge electronics to timeless fashion — explore a
          thoughtfully curated catalog designed around quality, performance,
          and style.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="/shop">
              Shop the Collection
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/shop?featured=true">Featured Products</Link>
          </Button>
        </div>

        <div className="mt-12 flex flex-wrap gap-8">
          {[
            { value: "4.9/5", label: "Average rating" },
            { value: "50k+", label: "Happy customers" },
            { value: "36", label: "Curated products" },
            { value: "24h", label: "Fast dispatch" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}