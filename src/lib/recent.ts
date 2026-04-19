"use client";

import { useCallback, useSyncExternalStore } from "react";

const KEY = "soudanyou:recent";
const EVENT = "soudanyou:recent:changed";
const MAX = 8;

function readRaw(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter((x) => typeof x === "string").slice(0, MAX) : [];
  } catch {
    return [];
  }
}

function writeRaw(list: string[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX)));
    window.dispatchEvent(new Event(EVENT));
  } catch {
    // ignore
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

let cachedKey: string | null = null;
let cachedSnapshot: readonly string[] = [];

function getSnapshot(): readonly string[] {
  if (typeof window === "undefined") return cachedSnapshot;
  const raw = localStorage.getItem(KEY);
  if (raw === cachedKey) return cachedSnapshot;
  cachedKey = raw;
  cachedSnapshot = readRaw();
  return cachedSnapshot;
}

function getServerSnapshot(): readonly string[] {
  return cachedSnapshot;
}

export function useRecent() {
  const ids = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const push = useCallback((id: string) => {
    const prev = readRaw().filter((x) => x !== id);
    writeRaw([id, ...prev]);
  }, []);

  const clear = useCallback(() => {
    writeRaw([]);
  }, []);

  return { ids, push, clear, count: ids.length };
}

export function trackRecent(id: string) {
  if (typeof window === "undefined") return;
  const prev = readRaw().filter((x) => x !== id);
  writeRaw([id, ...prev]);
}
