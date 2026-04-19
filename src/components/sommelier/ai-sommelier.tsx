"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Sparkles, Send, Loader2, Wine as WineIcon, X, Bot, ArrowRight, History } from "lucide-react";
import type { Wine, WineType } from "@/types/wine";

interface Suggestion {
  id: string;
  reason: string;
  wine: Wine;
}

interface SommelierResponse {
  answer: string;
  suggestions: Suggestion[];
  error?: string;
}

interface Props {
  /** 基底URL (basePath対応)。通常 "/soudanyou" */
  basePath?: string;
}

const PRESETS = [
  "今夜は焼肉。2000円以下でおすすめは？",
  "義実家に持っていく失敗しない1本は？",
  "コンビニで買える、爽やかな白ワインは？",
  "カレーに合う赤ワインを教えて",
  "寿司に合う、2000円以下の白は？",
  "チーズケーキに合うデザートワインは？",
];

const TYPE_OPTIONS: { value: WineType | ""; label: string; icon: string }[] = [
  { value: "", label: "指定なし", icon: "✨" },
  { value: "red", label: "赤", icon: "🍷" },
  { value: "white", label: "白", icon: "🥂" },
  { value: "sparkling", label: "泡", icon: "🍾" },
  { value: "rose", label: "ロゼ", icon: "🌸" },
];

const BUDGET_OPTIONS: { value: number | 0; label: string }[] = [
  { value: 0, label: "指定なし" },
  { value: 1500, label: "〜¥1,500" },
  { value: 2000, label: "〜¥2,000" },
  { value: 3000, label: "〜¥3,000" },
];

const HISTORY_KEY = "soudanyou:sommelier:history";
const HISTORY_MAX = 5;

function loadHistory(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.slice(0, HISTORY_MAX) : [];
  } catch {
    return [];
  }
}

function saveHistory(q: string) {
  if (typeof window === "undefined") return;
  try {
    const prev = loadHistory().filter((x) => x !== q);
    const next = [q, ...prev].slice(0, HISTORY_MAX);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
}

export function AiSommelier({ basePath = "/soudanyou" }: Props) {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SommelierResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [type, setType] = useState<WineType | "">("");
  const [budget, setBudget] = useState<number>(0);
  const [history, setHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    setTimeout(() => inputRef.current?.focus(), 100);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  async function ask(q: string) {
    const text = q.trim();
    if (!text || loading) return;
    setQuestion(text);
    setLoading(true);
    setError(null);
    setResult(null);
    saveHistory(text);
    setHistory(loadHistory());
    try {
      const res = await fetch(`${basePath}/api/sommelier`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: text,
          type: type || undefined,
          budget: budget || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "通信エラー");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="AIソムリエを開く"
        className="fixed bottom-20 md:bottom-5 right-4 md:right-5 z-40 flex items-center gap-2 px-4 py-3 rounded-full shadow-2xl text-white font-bold text-sm min-h-[48px] transition-transform active:scale-95"
        style={{ background: "linear-gradient(135deg, #8B1A2B, #C4627A)" }}
      >
        <Bot className="w-5 h-5" />
        <span className="hidden sm:inline">AIソムリエに相談</span>
        <span className="sm:hidden">相談</span>
        <Sparkles className="w-4 h-4 text-amber-200" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="AIソムリエ"
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative w-full sm:max-w-lg max-h-[92vh] overflow-y-auto bg-white dark:bg-neutral-900 rounded-t-3xl sm:rounded-3xl shadow-2xl animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="sticky top-0 z-10 px-5 py-4 flex items-center gap-3 rounded-t-3xl"
              style={{ background: "linear-gradient(135deg, #1A0A10, #3D1225)" }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #8B1A2B, #C4627A)" }}
              >
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-black">AIソムリエ</h3>
                <p className="text-xs text-rose-200/80">Grok があなたに合う1本を選びます</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="閉じる"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white min-h-[44px] min-w-[44px]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {!result && !loading && (
                <>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    料理・シーン・気分から、カタログ内のワインをAIが3本まで選んで理由つきで提案します。
                  </p>

                  {/* クイックフィルタ */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-gray-500 dark:text-gray-400">タイプ:</span>
                      {TYPE_OPTIONS.map((opt) => (
                        <button
                          key={opt.value || "any"}
                          type="button"
                          onClick={() => setType(opt.value)}
                          className={`text-xs px-2.5 py-1 rounded-full transition-colors ${
                            type === opt.value
                              ? "bg-rose-800 text-white"
                              : "bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-white/20"
                          }`}
                        >
                          {opt.icon} {opt.label}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-gray-500 dark:text-gray-400">予算:</span>
                      {BUDGET_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setBudget(opt.value)}
                          className={`text-xs px-2.5 py-1 rounded-full transition-colors ${
                            budget === opt.value
                              ? "bg-rose-800 text-white"
                              : "bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-white/20"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5">こんな質問はどう？</p>
                    <div className="flex flex-wrap gap-2">
                      {PRESETS.map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => ask(p)}
                          className="text-xs px-3 py-2 rounded-full bg-rose-50 dark:bg-rose-500/15 text-rose-800 dark:text-rose-200 hover:bg-rose-100 dark:hover:bg-rose-500/25 transition-colors min-h-[36px]"
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  {history.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 flex items-center gap-1">
                        <History className="w-3 h-3" /> 最近の質問
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {history.map((q) => (
                          <button
                            key={q}
                            type="button"
                            onClick={() => ask(q)}
                            className="text-xs px-3 py-1.5 rounded-full bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors max-w-full truncate"
                            title={q}
                          >
                            {q.length > 28 ? q.slice(0, 27) + "…" : q}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {loading && (
                <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 py-6 justify-center">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm">AIソムリエが考え中…</span>
                </div>
              )}

              {error && (
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-500/15 text-sm text-red-700 dark:text-red-300 border border-red-200 dark:border-red-500/30">
                  {error}
                </div>
              )}

              {result && !loading && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-50 to-amber-50 dark:from-rose-500/15 dark:to-amber-500/10 border border-rose-100 dark:border-rose-500/30">
                    <div className="text-[11px] uppercase tracking-wider text-rose-700 dark:text-rose-300 font-bold mb-1">
                      ご相談
                    </div>
                    <p className="text-sm text-gray-800 dark:text-gray-100 mb-3">{question}</p>
                    <div className="text-[11px] uppercase tracking-wider text-rose-700 dark:text-rose-300 font-bold mb-1">
                      AIソムリエの回答
                    </div>
                    <p className="text-sm text-gray-800 dark:text-gray-100 leading-relaxed whitespace-pre-wrap">
                      {result.answer}
                    </p>
                  </div>

                  {result.suggestions?.length > 0 && (
                    <div className="space-y-2">
                      {result.suggestions.map((s, i) => (
                        <Link
                          key={s.id}
                          href={`/wines/${s.id}`}
                          className="block w-full text-left p-4 rounded-2xl bg-white dark:bg-neutral-800 border border-gray-200 dark:border-white/10 hover:border-rose-300 dark:hover:border-rose-500/50 hover:shadow-md transition-all min-h-[64px] active:scale-[0.99]"
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-black flex-shrink-0"
                              style={{ background: "linear-gradient(135deg, #8B1A2B, #C4627A)" }}
                            >
                              {i + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <WineIcon className="w-4 h-4 text-rose-800 dark:text-rose-300 flex-shrink-0" />
                                <span className="font-bold text-gray-900 dark:text-gray-100 truncate">
                                  {s.wine.nameJa}
                                </span>
                                <span className="text-sm font-black" style={{ color: "#C4627A" }}>
                                  ¥{s.wine.price.toLocaleString()}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mb-2">{s.reason}</p>
                              <div className="flex items-center gap-1 text-[11px] text-rose-700 dark:text-rose-300 font-bold">
                                詳細を見る <ArrowRight className="w-3 h-3" />
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setResult(null);
                      setQuestion("");
                    }}
                    className="w-full py-3 rounded-xl text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 transition-colors min-h-[44px]"
                  >
                    もう一度質問する
                  </button>
                </div>
              )}

              {/* 入力欄 */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  ask(question);
                }}
                className="pt-2 border-t border-gray-100 dark:border-white/10"
              >
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="料理・気分・予算を書いてみて…"
                    className="flex-1 px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 text-base sm:text-sm outline-none focus:ring-2 focus:ring-rose-200 min-h-[44px] text-gray-900 dark:text-gray-100"
                    maxLength={400}
                    disabled={loading}
                    aria-label="質問"
                  />
                  <button
                    type="submit"
                    disabled={loading || !question.trim()}
                    aria-label="送信"
                    className="px-4 rounded-xl text-white flex items-center gap-1 disabled:opacity-40 min-h-[44px] min-w-[44px]"
                    style={{ background: "linear-gradient(135deg, #8B1A2B, #6B1525)" }}
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-2">
                  AIの提案は参考情報です。味覚には個人差があります。
                </p>
              </form>
            </div>
          </div>

          <style>{`
            @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            .animate-slideUp { animation: slideUp 0.3s ease-out; }
            @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            .animate-fadeIn { animation: fadeIn 0.4s ease-out; }
          `}</style>
        </div>
      )}
    </>
  );
}
