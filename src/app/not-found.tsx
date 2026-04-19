import Link from "next/link";
import { Wine, Search, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-4 py-12 text-center">
      <div className="relative">
        <div className="absolute inset-0 animate-ping rounded-full bg-primary/20 blur-xl" />
        <Wine className="relative h-20 w-20 text-primary" />
      </div>
      <h1 className="mt-6 text-3xl font-black text-foreground">
        このワインは見つかりませんでした
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        お探しのページは存在しないか、移動した可能性があります。
        <br />
        他のおすすめワインもチェックしてみてください。
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 min-h-[44px]"
        >
          <Sparkles className="h-4 w-4" />
          トップへ戻る
        </Link>
        <Link
          href="/wines"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-bold text-foreground transition-colors hover:bg-muted min-h-[44px]"
        >
          <Search className="h-4 w-4" />
          全ワインを見る
        </Link>
      </div>
    </div>
  );
}
