import type { LucideIcon } from "lucide-react";
import {
  Monitor,
  Shirt,
  Home,
  Sparkles,
  Mountain,
  Puzzle,
} from "lucide-react";

export const siteConfig = {
  name: "NOVA",
  description:
    "A premium e-commerce demo — discover thoughtfully curated products across fashion, electronics, home, and more.",
  url: "http://localhost:3000",
  links: {
    github: "https://github.com",
  },
};

export const categoryIcons: Record<string, LucideIcon> = {
  "home-living": Home,
  fashion: Shirt,
  electronics: Monitor,
  beauty: Sparkles,
  "sports-outdoors": Mountain,
  "toys-games": Puzzle,
};

export interface NavLink {
  label: string;
  href: string;
}

export const mainNavLinks: NavLink[] = [
  { label: "Shop", href: "/shop" },
  { label: "New Arrivals", href: "/shop?sort=newest" },
  { label: "Featured", href: "/shop?featured=true" },
];

export const storeConfig = {
  shipping: 999,
  freeShippingThreshold: 7500,
};