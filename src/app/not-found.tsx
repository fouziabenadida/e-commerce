import Link from "next/link";
import { SearchX, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <SearchX className="h-8 w-8 text-muted-foreground" />
      </div>
      <h1 className="mt-6 text-4xl font-bold tracking-tight">404</h1>
      <p className="mt-3 max-w-sm text-muted-foreground">
        Sorry, we couldn&apos;t find the page you&apos;re looking for. It may
        have been moved or no longer exists.
      </p>
      <div className="mt-8 flex gap-3">
        <Button asChild variant="outline">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back home
          </Link>
        </Button>
        <Button asChild>
          <Link href="/shop">Browse products</Link>
        </Button>
      </div>
    </div>
  );
}