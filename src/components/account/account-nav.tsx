import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  LogOut,
} from "lucide-react";
import { SignOutButton } from "@/components/account/sign-out-button";

const links = [
  { href: "/account", label: "Overview", icon: LayoutDashboard },
  { href: "/account/orders", label: "Orders", icon: Package },
];

export function AccountNav() {
  return (
    <nav className="space-y-1">
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Icon className="h-4 w-4" />
            {link.label}
          </Link>
        );
      })}
      <SignOutButton />
    </nav>
  );
}

export function AccountSidebar() {
  return (
    <div className="rounded-xl border p-4 lg:sticky lg:top-24">
      <p className="px-3 pb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        My account
      </p>
      <AccountNav />
    </div>
  );
}