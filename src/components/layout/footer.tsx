import Link from "next/link";
import { Globe, Mail, Send, CreditCard, ShieldCheck, Truck, RefreshCcw } from "lucide-react";

const shopLinks = [
  { label: "All Products", href: "/shop" },
  { label: "New Arrivals", href: "/shop?sort=newest" },
  { label: "Featured", href: "/shop?featured=true" },
];

const accountLinks = [
  { label: "My Account", href: "/account" },
  { label: "My Orders", href: "/account/orders" },
  { label: "Wishlist", href: "/wishlist" },
  { label: "Shopping Cart", href: "/cart" },
];

const helpLinks = [
  { label: "Shipping & Returns", href: "/#shipping" },
  { label: "Contact Us", href: "/#contact" },
  { label: "FAQ", href: "/#faq" },
];

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      {/* Trust badges */}
      <div className="border-b">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 sm:px-6 lg:grid-cols-4 lg:px-8">
          <div className="flex items-center gap-3">
            <Truck className="h-6 w-6 text-muted-foreground" />
            <div>
              <p className="text-sm font-semibold">Free Shipping</p>
              <p className="text-xs text-muted-foreground">On orders over $75</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <RefreshCcw className="h-6 w-6 text-muted-foreground" />
            <div>
              <p className="text-sm font-semibold">30-Day Returns</p>
              <p className="text-xs text-muted-foreground">No questions asked</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-muted-foreground" />
            <div>
              <p className="text-sm font-semibold">Secure Checkout</p>
              <p className="text-xs text-muted-foreground">Your data is protected</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CreditCard className="h-6 w-6 text-muted-foreground" />
            <div>
              <p className="text-sm font-semibold">Flexible Payment</p>
              <p className="text-xs text-muted-foreground">Pay the way you want</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="text-2xl font-bold tracking-tight">
              NOVA
            </Link>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              A premium e-commerce demo built with Next.js, offering carefully
              curated products across categories. Fast, responsive, and
              beautifully designed.
            </p>
            <div className="mt-4 flex gap-3">
              <Link
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-md border hover:bg-accent"
                aria-label="Website"
              >
                <Globe className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-md border hover:bg-accent"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-md border hover:bg-accent"
                aria-label="Newsletter"
              >
                <Send className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Shop</h3>
            <ul className="mt-4 space-y-3">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Account</h3>
            <ul className="mt-4 space-y-3">
              {accountLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Help</h3>
            <ul className="mt-4 space-y-3">
              {helpLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} NOVA Store. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built with Next.js, Prisma & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}