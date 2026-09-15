"use client";

import * as React from "react";
import { AlertTriangle, RotateCcw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center text-foreground">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="mt-6 text-2xl font-bold">Something went wrong</h1>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            An unexpected error occurred. Try refreshing the page, or head
            back to the store.
          </p>
          <div className="mt-8 flex gap-3">
            <Button onClick={reset}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Try again
            </Button>
            <Button asChild variant="outline">
              <a href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back home
              </a>
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}