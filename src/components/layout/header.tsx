"use client";

import * as React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  Menu,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { SearchBar } from "@/components/search-bar";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/components/user-menu";
import { CartButton, WishlistButton } from "@/components/cart/cart-buttons";
import { mainNavLinks, categoryIcons } from "@/lib/constants";

interface HeaderProps {
  categories: { name: string; slug: string }[];
}

export function Header({ categories }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Announcement bar */}
      <div className="bg-primary py-2 text-center text-xs font-medium text-primary-foreground">
        <p className="flex items-center justify-center gap-2 px-4">
          <Truck className="h-3.5 w-3.5" />
          Free shipping on orders over $75 · 30-day returns
        </p>
      </div>

      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        {/* Mobile menu */}
        <div className="md:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle>
                  <Link
                    href="/"
                    className="text-lg font-bold tracking-tight"
                    onClick={() => setMobileOpen(false)}
                  >
                    NOVA
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-1">
                {mainNavLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="mt-4 border-t pt-4">
                  <p className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Categories
                  </p>
                  {categories.map((category) => {
                    const Icon = categoryIcons[category.slug] ?? ShoppingBag;
                    return (
                      <Link
                        key={category.slug}
                        href={`/category/${category.slug}`}
                        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                        onClick={() => setMobileOpen(false)}
                      >
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        {category.name}
                      </Link>
                    );
                  })}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo */}
        <Link href="/" className="shrink-0 text-xl font-bold tracking-tight">
          NOVA
        </Link>

        {/* Desktop nav */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {mainNavLinks.map((link) => (
              <NavigationMenuItem key={link.href}>
                <Link
                  href={link.href}
                  className="group inline-flex h-9 w-max items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              </NavigationMenuItem>
            ))}
            <NavigationMenuItem>
              <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[420px] gap-1 p-3 md:grid-cols-2">
                  {categories.map((category) => {
                    const Icon = categoryIcons[category.slug] ?? ShoppingBag;
                    return (
                      <li key={category.slug}>
                        <Link
                          href={`/category/${category.slug}`}
                          className="flex items-center gap-3 rounded-md p-3 text-sm hover:bg-accent"
                        >
                          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                            <Icon className="h-4 w-4" />
                          </span>
                          <span className="font-medium">{category.name}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <SearchBar className="ml-auto hidden max-w-sm flex-1 md:block" />

        <div className="flex items-center gap-1">
          <SearchBar className="md:hidden" />
          <ThemeToggle />
          <WishlistButton />
          <CartButton />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}