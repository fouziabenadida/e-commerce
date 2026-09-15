import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Verified Buyer",
    initials: "SM",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
    quote:
      "The quality is incredible for the price. My order arrived in two days and the packaging was beautiful. Easily the best shopping experience I've had online.",
  },
  {
    name: "James Rodriguez",
    role: "Verified Buyer",
    initials: "JR",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    quote:
      "NOVA's product selection is carefully curated — everything I've ordered has exceeded expectations. The wireless headphones are my new daily driver.",
  },
  {
    name: "Emily Chen",
    role: "Verified Buyer",
    initials: "EC",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    quote:
      "Beautiful site, fast delivery, and their support team resolved a sizing question in minutes. Will definitely be a returning customer.",
  },
];

export function Testimonials() {
  return (
    <section className="border-y bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Loved by thousands of shoppers
          </h2>
          <p className="mt-4 text-muted-foreground">
            Don't just take our word for it — here's what our customers say.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col rounded-xl border bg-background p-6 shadow-sm"
            >
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={t.image} alt={t.name} />
                  <AvatarFallback>{t.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}