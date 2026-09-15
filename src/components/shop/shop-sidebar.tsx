"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Check, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export interface SidebarCategory {
  name: string;
  slug: string;
  _count: { products: number };
}

interface ShopSidebarProps {
  categories: SidebarCategory[];
}

function buildUrl(
  pathname: string,
  params: URLSearchParams,
  key: string | null,
  value: string | null
) {
  const next = new URLSearchParams(params.toString());
  if (key === null) {
    return pathname;
  }
  if (value === null) {
    next.delete(key);
  } else {
    next.set(key, value);
  }
  next.delete("page");
  const qs = next.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

function setRange(
  pathname: string,
  params: URLSearchParams,
  min: string | null,
  max: string | null
) {
  const next = new URLSearchParams(params.toString());
  if (min === null) {
    next.delete("min");
  } else {
    next.set("min", min);
  }
  if (max === null) {
    next.delete("max");
  } else {
    next.set("max", max);
  }
  next.delete("page");
  const qs = next.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

function SidebarContent({ categories }: { categories: SidebarCategory[] }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get("category");
  const featured = searchParams.get("featured") === "true";
  const min = searchParams.get("min");
  const max = searchParams.get("max");

  const isRange = (lo: string | null, hi: string | null) =>
    min === lo && max === hi;

  const priceRanges = [
    {
      label: "All prices",
      active: min === null && max === null,
      href: () => setRange(pathname, searchParams, null, null),
    },
    {
      label: "Under $25",
      active: min === null && max === "2499",
      href: () => setRange(pathname, searchParams, null, max === "2499" ? null : "2499"),
    },
    {
      label: "$25 – $75",
      active: isRange("2500", "7499"),
      href: () =>
        isRange("2500", "7499")
          ? setRange(pathname, searchParams, null, null)
          : setRange(pathname, searchParams, "2500", "7499"),
    },
    {
      label: "$75 – $150",
      active: isRange("7500", "14999"),
      href: () =>
        isRange("7500", "14999")
          ? setRange(pathname, searchParams, null, null)
          : setRange(pathname, searchParams, "7500", "14999"),
    },
    {
      label: "$150+",
      active: min === "15000" && max === null,
      href: () =>
        setRange(pathname, searchParams, min === "15000" ? null : "15000", null),
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Categories
        </h3>
        <div className="space-y-1">
          <Link
            href={buildUrl(pathname, searchParams, "category", null)}
            className={cn(
              "flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-accent",
              !activeCategory && "bg-accent font-medium"
            )}
          >
            All Products
          </Link>
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={buildUrl(pathname, searchParams, "category", category.slug)}
              className={cn(
                "flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-accent",
                activeCategory === category.slug && "bg-accent font-medium"
              )}
            >
              <span>{category.name}</span>
              <span className="text-xs text-muted-foreground">
                {category._count.products}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Price
        </h3>
        <div className="space-y-1">
          {priceRanges.map((range) => (
            <Link
              key={range.label}
              href={range.href()}
              className={cn(
                "flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-accent",
                range.active && "bg-accent font-medium"
              )}
            >
              <span>{range.label}</span>
              {range.active && <Check className="h-4 w-4 text-primary" />}
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Availability
        </h3>
        <Link
          href={buildUrl(pathname, searchParams, "featured", featured ? null : "true")}
          className="flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-accent"
        >
          <span>Featured only</span>
          {featured && <Check className="h-4 w-4 text-primary" />}
        </Link>
      </div>
    </div>
  );
}

export function ShopSidebar({ categories }: ShopSidebarProps) {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24">
        <SidebarContent categories={categories} />
      </div>
    </aside>
  );
}

export function ShopMobileFilters({ categories }: ShopSidebarProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="lg:hidden">
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full max-w-xs">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <div className="px-4 py-4">
          <SidebarContent categories={categories} />
        </div>
      </SheetContent>
    </Sheet>
  );
}