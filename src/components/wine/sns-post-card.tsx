import type { SnsPost } from "@/types/wine";
import { Heart } from "lucide-react";

interface SnsPostCardProps {
  post: SnsPost;
}

export function SnsPostCard({ post }: SnsPostCardProps) {
  const platformIcon = post.platform === "x" ? "𝕏" : "📷";
  const platformColor =
    post.platform === "x"
      ? "bg-gray-900 text-white"
      : "bg-gradient-to-br from-purple-500 to-pink-500 text-white";

  return (
    <div className="rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-md">
      <div className="flex items-start gap-3">
        {/* Platform icon */}
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${platformColor}`}
        >
          {platformIcon}
        </span>

        <div className="min-w-0 flex-1">
          {/* Author */}
          <div className="flex items-center gap-1">
            <span className="text-sm font-semibold text-foreground">
              {post.authorName}
            </span>
            <span className="text-xs text-muted-foreground">
              {post.authorHandle}
            </span>
          </div>

          {/* Content */}
          <p className="mt-1 text-sm leading-relaxed text-foreground/90">
            {post.content}
          </p>

          {/* Footer */}
          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Heart className="h-3 w-3" />
              {post.likes.toLocaleString()}
            </span>
            <span>{post.postedAt}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
