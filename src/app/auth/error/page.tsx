import Link from "next/link";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Authentication Error",
};

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-7 w-7 text-destructive" />
        </div>
        <h1 className="mt-4 text-2xl font-bold tracking-tight">
          Authentication error
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong while signing you in. Please try again.
        </p>
        <div className="mt-6">
          <Button asChild className="w-full">
            <Link href="/auth/login">
              Back to sign in
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}