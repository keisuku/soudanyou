"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Store, Trophy, Sparkles } from "lucide-react";

const items = [
  { href: "/", label: "ホーム", Icon: Home, matches: (p: string) => p === "/" },
  { href: "/#search", label: "店舗", Icon: Store, matches: (p: string) => p === "/wines" },
  { href: "/#ranking", label: "殿堂入り", Icon: Trophy, matches: (p: string) => p === "/compare" },
  { href: "/quiz", label: "特集", Icon: Sparkles, matches: (p: string) => p === "/quiz" },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="モバイルナビゲーション"
      className="fixed bottom-0 left-0 right-0 z-30 md:hidden border-t border-border bg-card/95 backdrop-blur-xl shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="grid grid-cols-4">
        {items.map(({ href, label, Icon, matches }) => {
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
