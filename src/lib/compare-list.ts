"use client";

import { useCallback, useSyncExternalStore } from "react";

const KEY = "soudanyou:compare";
const EVENT = "soudanyou:compare:changed";
export const COMPARE_MAX = 3;

function readRaw(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter((x) => typeof x === "string").slice(0, COMPARE_MAX) : [];
  } catch {
    return [];
  }
}

function writeRaw(list: string[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, COMPARE_MAX)));
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

export function useCompareList() {
  const ids = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = useCallback((id: string) => {
    const prev = readRaw();
    if (prev.includes(id)) {
      writeRaw(prev.filter((x) => x !== id));
      return;
    }
    if (prev.length >= COMPARE_MAX) return; // already full
    writeRaw([...prev, id]);
  }, []);

  const has = useCallback((id: string) => ids.includes(id), [ids]);

  const clear = useCallback(() => writeRaw([]), []);

  return { ids, toggle, has, clear, count: ids.length, isFull: ids.length >= COMPARE_MAX };
}
