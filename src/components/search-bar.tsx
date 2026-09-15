"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

export function SearchBar({ className }: { className?: string }) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/shop?q=${encodeURIComponent(q)}` : "/shop");
  }

  return (
    <form onSubmit={onSubmit} className={className} role="search">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          className="pl-9"
          aria-label="Search products"
        />
      </div>
    </form>
  );
}