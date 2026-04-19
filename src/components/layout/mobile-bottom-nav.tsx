"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Wine, Heart, Trophy } from "lucide-react";
import { useFavorites } from "@/lib/favorites";

const items = [
  { href: "/", label: "ホーム", Icon: Home, matches: (p: string) => p === "/" },
  { href: "/wines", label: "全ワイン", Icon: Wine, matches: (p: string) => p.startsWith("/wines") },
  { href: "/favorites", label: "お気に入り", Icon: Heart, matches: (p: string) => p === "/favorites", showBadge: true },
  { href: "/compare", label: "比較", Icon: Trophy, matches: (p: string) => p === "/compare" },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const { count } = useFavorites();

  return (
    <nav
      aria-label="モバイルナビゲーション"
      className="fixed bottom-0 left-0 right-0 z-30 md:hidden border-t border-border bg-card/95 backdrop-blur-xl shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="grid grid-cols-4">
        {items.map(({ href, label, Icon, matches, showBadge }) => {
          const active = matches(pathname ?? "/");
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`relative flex flex-col items-center justify-center gap-0.5 py-2 min-h-[56px] text-[10px] font-medium transition-colors ${
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${active ? "fill-primary/10" : ""}`} />
                  {showBadge && count > 0 && (
                    <span
                      className="absolute -top-1 -right-2 min-w-[16px] h-[16px] px-1 rounded-full bg-rose-600 text-white text-[9px] font-black flex items-center justify-center"
                      aria-hidden="true"
                    >
                      {count > 99 ? "99+" : count}
                    </span>
                  )}
                </div>
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
