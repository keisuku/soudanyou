import wineData from "./__generated__/wines.json";
import type { Wine } from "@/types/wine";

export const wines: Wine[] = wineData as Wine[];

export function getWineById(id: string): Wine | undefined {
  return wines.find((w) => w.id === id);
}

export function getWinesByType(type: string): Wine[] {
  return wines.filter((w) => w.type === type);
}

export const storeLabels: Record<string, string> = {
  seven: "セブン",
  lawson: "ローソン",
  familymart: "ファミマ",
  aeon: "イオン",
  seijoishii: "成城石井",
  kaldi: "カルディ",
  donki: "ドンキ",
  costco: "コストコ",
  summit: "サミット",
  rakuten: "楽天",
  amazon: "Amazon",
  liquor_shop: "酒屋",
};
