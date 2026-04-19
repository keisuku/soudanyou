"use client";

import { useEffect } from "react";
import { trackRecent } from "@/lib/recent";

export function RecentTracker({ wineId }: { wineId: string }) {
  useEffect(() => {
    trackRecent(wineId);
  }, [wineId]);
  return null;
}
