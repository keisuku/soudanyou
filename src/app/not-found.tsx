import Link from "next/link";
import { Wine } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <Wine className="h-16 w-16 text-muted-foreground/30" />
      <h1 className="mt-4 text-2xl font-bold text-foreground">
        このワインは見つかりませんでした
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        お探しのページは存在しないか、移動した可能性があります。
      </p>
      <Link
        href="/"
        className="mt-6 rounded-full bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        トップページに戻る
      </Link>
    </div>
  );
}
