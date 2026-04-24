"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Wine, Menu, X, ChevronDown, Store, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { storeCategories, countryCategories } from "@/lib/wines";

const navItems = [
  { href: "/wines", label: "全ワイン" },
  { href: "/#red", label: "🍷 赤" },
  { href: "/#white", label: "🥂 白" },
  { href: "/#sparkling", label: "🍾 泡" },
  { href: "/#guide", label: "📖 ガイド" },
];

function useOutsideClick(refs: React.RefObject<HTMLElement | null>[], callback: () => void) {
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (refs.every((ref) => ref.current && !ref.current.contains(e.target as Node))) {
        callback();
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [refs, callback]);
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [storeMenuOpen, setStoreMenuOpen] = useState(false);
  const [countryMenuOpen, setCountryMenuOpen] = useState(false);
  const [mobileStoreOpen, setMobileStoreOpen] = useState(false);
  const [mobileCountryOpen, setMobileCountryOpen] = useState(false);
  const storeRef = useRef<HTMLDivElement>(null);
  const countryRef = useRef<HTMLDivElement>(null);

  useOutsideClick([storeRef], () => setStoreMenuOpen(false));
  useOutsideClick([countryRef], () => setCountryMenuOpen(false));

  const closeMobile = () => {
    setMobileOpen(false);
    setMobileStoreOpen(false);
    setMobileCountryOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Wine className="h-6 w-6 text-gold" />
          <span className="text-xl font-bold text-primary">ご近所バズワイン</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex md:items-center md:gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}

          {/* Store dropdown */}
          <div className="relative" ref={storeRef}>
            <button
              type="button"
              className={cn(
                "inline-flex items-center gap-1 text-sm font-medium transition-colors hover:text-foreground",
                storeMenuOpen ? "text-foreground" : "text-muted-foreground"
              )}
              onClick={() => { setStoreMenuOpen(!storeMenuOpen); setCountryMenuOpen(false); }}
            >
              <Store className="h-4 w-4" />
              お店で探す
              <ChevronDown className={cn("h-3 w-3 transition-transform", storeMenuOpen && "rotate-180")} />
            </button>

            {storeMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-[520px] rounded-xl border border-border bg-card p-4 shadow-xl">
                <div className="grid grid-cols-2 gap-4">
                  {storeCategories.map((cat) => (
                    <div key={cat.category}>
                      <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-primary">
                        {cat.label}
                      </h3>
                      <ul className="space-y-1">
                        {cat.stores.map((store) => (
                          <li key={store.type}>
                            <Link
                              href={`/wines?store=${store.type}`}
                              className="block rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                              onClick={() => setStoreMenuOpen(false)}
                            >
                              {store.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Country dropdown */}
          <div className="relative" ref={countryRef}>
            <button
              type="button"
              className={cn(
                "inline-flex items-center gap-1 text-sm font-medium transition-colors hover:text-foreground",
                countryMenuOpen ? "text-foreground" : "text-muted-foreground"
              )}
              onClick={() => { setCountryMenuOpen(!countryMenuOpen); setStoreMenuOpen(false); }}
            >
              <Globe className="h-4 w-4" />
              国で探す
              <ChevronDown className={cn("h-3 w-3 transition-transform", countryMenuOpen && "rotate-180")} />
            </button>

            {countryMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-[400px] rounded-xl border border-border bg-card p-4 shadow-xl">
                <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                  {countryCategories.map((cat) => (
                    <div key={cat.country}>
                      {cat.subRegions ? (
                        <>
                          <h3 className="mb-1 mt-2 text-xs font-bold uppercase tracking-wider text-primary">
                            {cat.label}
                          </h3>
                          <ul className="space-y-0.5">
                            <li>
                              <Link
                                href={`/wines?country=${cat.country}`}
                                className="block rounded-md px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                                onClick={() => setCountryMenuOpen(false)}
                              >
                                すべて
                              </Link>
                            </li>
                            {cat.subRegions.map((r) => (
                              <li key={r.key}>
                                <Link
                                  href={`/wines?country=${cat.country}&region=${r.key}`}
                                  className="block rounded-md px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                                  onClick={() => setCountryMenuOpen(false)}
                                >
                                  {r.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </>
                      ) : (
                        <Link
                          href={`/wines?country=${cat.country}`}
                          className="block rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                          onClick={() => setCountryMenuOpen(false)}
                        >
                          {cat.label}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:text-foreground md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="メニューを開く"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="border-t border-border bg-card md:hidden">
          <div className="space-y-1 px-4 py-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                onClick={closeMobile}
              >
                {item.label}
              </Link>
            ))}

            {/* Mobile store accordion */}
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-md px-3 py-2 text-base font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              onClick={() => setMobileStoreOpen(!mobileStoreOpen)}
            >
              <span className="flex items-center gap-2">
                <Store className="h-4 w-4" />
                お店で探す
              </span>
              <ChevronDown className={cn("h-4 w-4 transition-transform", mobileStoreOpen && "rotate-180")} />
            </button>

            {mobileStoreOpen && (
              <div className="space-y-3 px-3 pb-2">
                {storeCategories.map((cat) => (
                  <div key={cat.category}>
                    <h4 className="mb-1 text-xs font-bold uppercase tracking-wider text-primary">
                      {cat.label}
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.stores.map((store) => (
                        <Link
                          key={store.type}
                          href={`/wines?store=${store.type}`}
                          className="rounded-full bg-secondary px-3 py-1 text-sm text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                          onClick={closeMobile}
                        >
                          {store.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Mobile country accordion */}
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-md px-3 py-2 text-base font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              onClick={() => setMobileCountryOpen(!mobileCountryOpen)}
            >
              <span className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                国で探す
              </span>
              <ChevronDown className={cn("h-4 w-4 transition-transform", mobileCountryOpen && "rotate-180")} />
            </button>

            {mobileCountryOpen && (
              <div className="space-y-3 px-3 pb-2">
                {countryCategories.map((cat) => (
                  <div key={cat.country}>
                    {cat.subRegions ? (
                      <>
                        <h4 className="mb-1 text-xs font-bold uppercase tracking-wider text-primary">
                          {cat.label}
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          <Link
                            href={`/wines?country=${cat.country}`}
                            className="rounded-full bg-secondary px-3 py-1 text-sm text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                            onClick={closeMobile}
                          >
                            すべて
                          </Link>
                          {cat.subRegions.map((r) => (
                            <Link
                              key={r.key}
                              href={`/wines?country=${cat.country}&region=${r.key}`}
                              className="rounded-full bg-secondary px-3 py-1 text-sm text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                              onClick={closeMobile}
                            >
                              {r.label}
                            </Link>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        <Link
                          href={`/wines?country=${cat.country}`}
                          className="rounded-full bg-secondary px-3 py-1 text-sm text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                          onClick={closeMobile}
                        >
                          {cat.label}
                        </Link>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
