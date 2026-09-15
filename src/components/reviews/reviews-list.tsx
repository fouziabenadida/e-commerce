import { Star, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import { deleteReview } from "@/app/actions/reviews";
import { auth } from "@/lib/auth";

interface ReviewListProps {
  productId: string;
  reviews: {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: Date;
    user: { id: string; name: string | null; image: string | null };
  }[];
}

export async function ReviewsList({ productId, reviews }: ReviewListProps) {
  const session = await auth();

  if (reviews.length === 0) {
    return (
      <div className="rounded-lg border border-dashed py-10 text-center text-sm text-muted-foreground">
        No reviews yet. Be the first to share your experience!
      </div>
    );
  }

  return (
    <ul className="space-y-6">
      {reviews.map((review) => {
        const own = session?.user?.id === review.user.id;
        return (
          <li key={review.id} className="rounded-lg border p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={review.user.image ?? ""} alt={review.user.name ?? "User"} />
                  <AvatarFallback>
                    {review.user.name?.[0]?.toUpperCase() ?? "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold">
                    {review.user.name ?? "Anonymous"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(review.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-0.5" aria-label={`${review.rating} stars`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={
                        i < review.rating
                          ? "h-4 w-4 fill-amber-400 text-amber-400"
                          : "h-4 w-4 text-muted-foreground/30"
                      }
                    />
                  ))}
                </span>
                {own && (
                  <form
                    action={async () => {
                      "use server";
                      await deleteReview(review.id, productId);
                    }}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-red-500"
                      aria-label="Delete review"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </form>
                )}
              </div>
            </div>
            {review.comment && (
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {review.comment}
              </p>
            )}
          </li>
        );
      })}
    </ul>
  );
}