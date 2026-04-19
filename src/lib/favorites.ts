"use client";

import { useCallback, useSyncExternalStore } from "react";

const KEY = "soudanyou:favorites";
const EVENT = "soudanyou:favorites:changed";

function read(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? arr.filter((x) => typeof x === "string") : []);
  } catch {
    return new Set();
  }
}

function write(s: Set<string>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify([...s]));
    window.dispatchEvent(new Event(EVENT));
  } catch {
    // ignore quota errors
  }
}

function subscribe(callback: () => void): () => void {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

// cached snapshot so useSyncExternalStore sees stable reference until change
let cachedRaw: string | null = null;
let cachedSnapshot: Set<string> = new Set();

function getSnapshot(): Set<string> {
  if (typeof window === "undefined") return cachedSnapshot;
  const raw = localStorage.getItem(KEY);
  if (raw === cachedRaw) return cachedSnapshot;
  cachedRaw = raw;
  cachedSnapshot = read();
  return cachedSnapshot;
}

function getServerSnapshot(): Set<string> {
  return cachedSnapshot;
}

export function useFavorites() {
  const ids = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = useCallback((id: string) => {
    const next = new Set(read());
    if (next.has(id)) next.delete(id);
    else next.add(id);
    write(next);
  }, []);

  const has = useCallback((id: string) => ids.has(id), [ids]);

  const clear = useCallback(() => {
    write(new Set());
  }, []);

  return { ids, toggle, has, clear, count: ids.size };
}
