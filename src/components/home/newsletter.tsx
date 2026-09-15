"use client";

import * as React from "react";
import { toast } from "sonner";
import { Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Newsletter() {
  const [email, setEmail] = React.useState("");
  const [subscribed, setSubscribed] = React.useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    toast.success("You're subscribed! Welcome to the NOVA family.");
    setEmail("");
  }

  if (subscribed) {
    return (
      <section className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-16 text-center sm:px-6 lg:px-8">
          <CheckCircle2 className="h-10 w-10 text-primary" />
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            You're on the list!
          </h2>
          <p className="max-w-md text-muted-foreground">
            Keep an eye on your inbox — exclusive deals and new arrivals are on
            their way.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="border-t">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-16 text-center sm:px-6 lg:px-8">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <Mail className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Get 10% off your first order
          </h2>
          <p className="mx-auto mt-2 max-w-md text-muted-foreground">
            Join our newsletter for exclusive offers, new product drops, and
            early access to sales. No spam, ever.
          </p>
        </div>
        <form
          onSubmit={onSubmit}
          className="flex w-full max-w-md gap-2"
          role="form"
          aria-label="Newsletter subscription"
        >
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1"
            aria-label="Email address"
          />
          <Button type="submit">Subscribe</Button>
        </form>
      </div>
    </section>
  );
}