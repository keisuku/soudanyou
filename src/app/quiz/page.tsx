"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Check,
  RefreshCw,
} from "lucide-react";
import { wines as allWines } from "@/lib/wines";
import { homeTypeMap, countryJa } from "@/lib/home-data";
import type { Wine, WineType } from "@/types/wine";
import { FavoriteButton } from "@/components/wine/favorite-button";

type Budget = "under1500" | "under2500" | "any";
type Dish = "meat" | "fish" | "salad" | "cheese" | "asian" | "dessert";
type Scene = "daily" | "gift" | "party" | "date";
type Taste = "light" | "rich" | "sweet" | "surprise";
type Style = "red" | "white" | "sparkling" | "any";

interface Answers {
  budget?: Budget;
  dish?: Dish;
  scene?: Scene;
  taste?: Taste;
  style?: Style;
}

const BUDGET_LIMITS: Record<Budget, number> = {
  under1500: 1500,
  under2500: 2500,
  any: Infinity,
};

const DISH_KEYWORDS: Record<Dish, string[]> = {
  meat: ["ステーキ", "焼肉", "肉料理", "ラム", "BBQ", "ローストビーフ", "グリル肉", "鴨"],
  fish: ["牡蠣", "寿司", "刺身", "魚", "シーフード", "海鮮", "カルパッチョ", "白身魚"],
  salad: ["サラダ", "前菜", "生ハム"],
  cheese: ["チーズ", "モッツァレラ"],
  asian: ["唐揚げ", "チキン", "スパイシー", "カレー", "焼き鳥", "エスニック"],
  dessert: ["フルーツ", "パンナコッタ", "タルト", "チーズケーキ", "甘"],
};

const scoreWine = (w: Wine, a: Answers): number => {
  let score = 0;
  // Budget hard filter
  if (a.budget && w.price > BUDGET_LIMITS[a.budget]) return -1;

  // Style preference
  if (a.style && a.style !== "any" && w.type === a.style) score += 40;
  if (a.style === "any") score += 10;

  // Dish pairing
  if (a.dish) {
    const kws = DISH_KEYWORDS[a.dish];
    const matches = w.pairings.filter((p) => kws.some((k) => p.includes(k))).length;
    score += matches * 18;
  }

  // Scene
  if (a.scene === "daily") score += (w.price < 1500 ? 15 : 0);
  if (a.scene === "gift") score += (w.price >= 2000 ? 15 : 0) + (w.vivinoScore && w.vivinoScore >= 3.6 ? 10 : 0);
  if (a.scene === "party") score += (w.type === "sparkling" ? 15 : 5);
  if (a.scene === "date") score += (w.type === "sparkling" || w.type === "rose" ? 12 : 5) + (w.vivinoScore && w.vivinoScore >= 3.6 ? 8 : 0);

  // Taste
  if (a.taste === "light") {
    if (w.type === "white" || w.type === "rose" || w.type === "sparkling") score += 10;
  }
  if (a.taste === "rich") {
    if (w.type === "red" && w.abv >= 13) score += 12;
  }
  if (a.taste === "sweet") {
    if (w.type === "sparkling" || w.type === "white") score += 8;
  }
  if (a.taste === "surprise") {
    score += w.buzzScore * 0.2;
  }

  // cospa boost
  score += w.costPerformance * 0.3;
  // vivino boost
  if (w.vivinoScore) score += w.vivinoScore * 3;

  return score;
};

function pickWines(answers: Answers, n = 3): Wine[] {
  const scored = allWines
    .map((w) => ({ w, s: scoreWine(w, answers) }))
    .filter((x) => x.s >= 0)
    .sort((a, b) => b.s - a.s);
  const picks: Wine[] = [];
  const seenTypes = new Set<WineType>();
  for (const { w } of scored) {
    if (picks.length >= n) break;
    // promote type diversity when style=any
    if (answers.style === "any" && seenTypes.has(w.type) && picks.length < n - 1) {
      continue;
    }
    picks.push(w);
    seenTypes.add(w.type);
  }
  return picks.slice(0, n);
}

interface Step<T extends string> {
  key: keyof Answers;
  question: string;
  hint?: string;
  options: { value: T; label: string; icon?: string; desc?: string }[];
}

const STEPS: Step<string>[] = [
  {
    key: "budget",
    question: "予算はどのくらい？",
    hint: "手頃な一本から特別な一本まで",
    options: [
      { value: "under1500", label: "〜¥1,500", icon: "💰", desc: "デイリー価格帯" },
      { value: "under2500", label: "〜¥2,500", icon: "💴", desc: "ちょっと良い1本" },
      { value: "any", label: "こだわらない", icon: "✨" },
    ],
  },
  {
    key: "dish",
    question: "今日の料理は？",
    options: [
      { value: "meat", label: "肉料理", icon: "🥩" },
      { value: "fish", label: "魚介・寿司", icon: "🐟" },
      { value: "salad", label: "サラダ・前菜", icon: "🥗" },
      { value: "cheese", label: "チーズ", icon: "🧀" },
      { value: "asian", label: "鶏肉・エスニック", icon: "🍗" },
      { value: "dessert", label: "デザート", icon: "🍰" },
    ],
  },
  {
    key: "scene",
    question: "どんなシーン？",
    options: [
      { value: "daily", label: "ふだん飲み", icon: "🏠" },
      { value: "gift", label: "手土産・プレゼント", icon: "🎁" },
      { value: "party", label: "パーティー・集まり", icon: "🎉" },
      { value: "date", label: "デート・記念日", icon: "💝" },
    ],
  },
  {
    key: "taste",
    question: "好みの味わいは？",
    options: [
      { value: "light", label: "軽やかでフルーティー", icon: "🌸" },
      { value: "rich", label: "濃厚で力強い", icon: "🔥" },
      { value: "sweet", label: "少し甘めが好き", icon: "🍯" },
      { value: "surprise", label: "今話題のもの", icon: "🚀" },
    ],
  },
  {
    key: "style",
    question: "タイプの希望は？",
    options: [
      { value: "red", label: "赤", icon: "🍷" },
      { value: "white", label: "白", icon: "🥂" },
      { value: "sparkling", label: "泡", icon: "🍾" },
      { value: "any", label: "任せる", icon: "✨" },
    ],
  },
];

export default function QuizPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const done = step >= STEPS.length;
  const results = useMemo(() => (done ? pickWines(answers) : []), [answers, done]);

  const progress = Math.min(100, Math.round(((done ? STEPS.length : step) / STEPS.length) * 100));

  const pick = (value: string) => {
    const current = STEPS[step];
    setAnswers((prev) => ({ ...prev, [current.key]: value }));
    setStep((s) => s + 1);
  };

  const reset = () => {
    setAnswers({});
    setStep(0);
  };

  const back = () => setStep((s) => Math.max(0, s - 1));

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> ホーム
      </Link>

      <div className="mt-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-gold" />
          <h1 className="text-2xl font-black">ワイン診断</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          {done ? "診断完了！あなたにぴったりの1本はこちら" : "5問に答えるだけ。AIなしでロジカルにマッチ"}
        </p>
      </div>

      {/* Progress */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, #8B1A2B, #C4627A, #D4A853)",
            }}
          />
        </div>
        <span className="text-xs font-bold text-muted-foreground tabular-nums">
          {done ? "完了" : `${step + 1} / ${STEPS.length}`}
        </span>
      </div>

      {!done ? (
        <>
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-1">{STEPS[step].question}</h2>
            {STEPS[step].hint && (
              <p className="text-sm text-muted-foreground mb-4">{STEPS[step].hint}</p>
            )}
            <div className="mt-4 grid grid-cols-2 gap-3">
              {STEPS[step].options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => pick(opt.value)}
                  className="group relative flex flex-col items-center gap-1 p-5 rounded-2xl border-2 border-border bg-card hover:border-primary hover:bg-primary/5 transition-all min-h-[96px] active:scale-[0.98]"
                >
                  {opt.icon && <span className="text-3xl">{opt.icon}</span>}
                  <span className="text-sm font-bold">{opt.label}</span>
                  {opt.desc && (
                    <span className="text-[10px] text-muted-foreground">{opt.desc}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
          {step > 0 && (
            <button
              type="button"
              onClick={back}
              className="mt-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" /> ひとつ戻る
            </button>
          )}
        </>
      ) : (
        <div className="space-y-4">
          {results.length === 0 ? (
            <div className="rounded-3xl border border-border bg-card p-6 text-center">
              <p className="text-lg font-bold">条件に合うワインが見つかりませんでした</p>
              <button
                type="button"
                onClick={reset}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-bold min-h-[44px]"
              >
                <RefreshCw className="w-4 h-4" /> もう一度診断する
              </button>
            </div>
          ) : (
            <>
              {results.map((w, i) => {
                const ti = homeTypeMap[w.type];
                return (
                  <div
                    key={w.id}
                    className="relative rounded-3xl overflow-hidden border-2 border-border bg-card shadow-lg"
                  >
                    <div
                      className="absolute left-0 top-0 bottom-0 w-1.5"
                      style={{ backgroundColor: ti.color }}
                    />
                    {i === 0 && (
                      <div className="absolute top-3 left-6 z-10">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black text-white shadow-lg" style={{ background: "linear-gradient(135deg, #D4A853, #B8860B)" }}>
                          <Check className="w-3 h-3" /> ベストマッチ
                        </span>
                      </div>
                    )}
                    <div className="absolute top-3 right-3 z-10">
                      <FavoriteButton wineId={w.id} size="sm" />
                    </div>
                    <Link href={`/wines/${w.id}`} className="block p-6 pl-8">
                      <div className="flex items-start gap-4">
                        <div
                          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                          style={{ backgroundColor: ti.bg }}
                        >
                          {ti.icon}
                        </div>
                        <div className="flex-1 min-w-0 pr-8">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ color: ti.color, backgroundColor: ti.bg }}>
                              {ti.label}
                            </span>
                            <span className="text-xs text-muted-foreground">{countryJa(w.country)}</span>
                            <span className="text-lg font-black" style={{ color: "#8B1A2B" }}>
                              ¥{w.price.toLocaleString()}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold leading-tight mb-1">{w.nameJa}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{w.whyBuyNow}</p>
                          <div className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-primary">
                            詳細を見る <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
              <div className="pt-2 flex flex-wrap gap-3 justify-center">
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-bold hover:bg-muted min-h-[44px]"
                >
                  <RefreshCw className="w-4 h-4" /> もう一度診断する
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
