"use client";

import * as React from "react";
import { useTransition } from "react";
import { Star, Loader2, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { addReview } from "@/app/actions/reviews";
import { useSession } from "next-auth/react";
import Link from "next/link";

export function ReviewForm({ productId }: { productId: string }) {
  const { status } = useSession();
  const [rating, setRating] = React.useState(5);
  const [hoverRating, setHoverRating] = React.useState(0);
  const [comment, setComment] = React.useState("");
  const [isPending, startTransition] = useTransition();

  if (status === "unauthenticated") {
    return (
      <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
        Want to share your experience?{" "}
        <Link href="/auth/login" className="font-medium text-primary underline">
          Sign in
        </Link>{" "}
        to leave a review.
      </div>
    );
  }

  if (status === "loading") {
    return <div className="h-40 rounded-lg border border-dashed" />;
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = await addReview(productId, rating, comment.trim() || "Great product!");
      if (result.success) {
        setComment("");
        toast.success("Review submitted! Thank you.");
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <form onSubmit={submit} className="rounded-lg border p-5">
      <p className="text-sm font-semibold">Write a review</p>

      <div className="mt-3 flex items-center gap-1" role="radiogroup" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={rating === value}
            aria-label={`${value} star${value > 1 ? "s" : ""}`}
            onMouseEnter={() => setHoverRating(value)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setRating(value)}
            className="p-0.5"
          >
            <Star
              className={cn(
                "h-6 w-6 transition-colors",
                (hoverRating || rating) >= value
                  ? "fill-amber-400 text-amber-400"
                  : "text-muted-foreground/30"
              )}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-muted-foreground">
          {rating}/5
        </span>
      </div>

      <div className="mt-4">
        <Label htmlFor="review-comment" className="sr-only">
          Review comment
        </Label>
        <Textarea
          id="review-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Tell others what you thought about this product…"
          rows={4}
          maxLength={500}
        />
        <p className="mt-1 text-right text-xs text-muted-foreground">
          {comment.length}/500
        </p>
      </div>

      <Button type="submit" className="mt-2" disabled={isPending || rating === 0}>
        {isPending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Send className="mr-2 h-4 w-4" />
        )}
        Submit Review
      </Button>
    </form>
  );
}