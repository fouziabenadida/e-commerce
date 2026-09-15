import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { categoryIcons } from "@/lib/constants";

interface CategoryCardProps {
  category: {
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    _count: { products: number };
  };
}

export function CategoryCard({ category }: CategoryCardProps) {
  const Icon = categoryIcons[category.slug];
  const isWide = ["electronics", "home-living"].includes(category.slug);

  return (
    <Link
      href={`/category/${category.slug}`}
      className={`group relative overflow-hidden rounded-xl border bg-muted ${
        isWide ? "lg:col-span-2 lg:row-span-2" : ""
      }`}
    >
      <div className="relative h-full min-h-[180px]">
        {category.image && (
          <Image
            src={category.image}
            alt={category.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
          <div>
            {Icon && <Icon className="mb-2 h-6 w-6 text-white/80" />}
            <h3 className="text-lg font-semibold text-white">{category.name}</h3>
            <p className="mt-0.5 text-xs text-white/70">
              {category._count.products} products
            </p>
          </div>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur transition-transform group-hover:translate-x-1">
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}