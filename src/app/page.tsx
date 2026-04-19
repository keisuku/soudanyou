"use client";
import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { Search, Wine, Star, ShoppingBag, ChevronDown, ChevronUp, X, Sparkles, ArrowRight, Filter, Globe, Store, Utensils, TrendingUp, Gift, Mail, ExternalLink, Shuffle, Clock, Award, DollarSign, BarChart3 } from "lucide-react";
import { AiSommelier } from "@/components/sommelier/ai-sommelier";
import { FavoriteButton } from "@/components/wine/favorite-button";
import { FavoritesIndicator } from "@/components/wine/favorites-indicator";
import { WineOfTheDay } from "@/components/wine/wine-of-the-day";
import { RecentWines } from "@/components/wine/recent-wines";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import {
  homeWines,
  homeAllStores,
  homeAllCountries,
  homeTypeMap,
  rakutenSearchUrl,
  type HomeWine,
} from "@/lib/home-data";
import type { WineType } from "@/types/wine";

const fmt = (p: number) => "¥" + p.toLocaleString();

const Badge = ({ children, color = "#8B1A2B", bg = "#FDF2F4", className = "" }: { children: React.ReactNode; color?: string; bg?: string; className?: string }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`} style={{ color, backgroundColor: bg }}>{children}</span>
);
const StarRating = ({ score }: { score?: number | null }) => {
  if (!score) return null;
  return (
    <div className="flex items-center gap-1">
      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
      <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">{score}</span>
    </div>
  );
};
const CospaBar = ({ score }: { score: number }) => {
  const clampedScore = Math.min(100, Math.max(0, score));
  const color = clampedScore > 80 ? "#16a34a" : clampedScore > 60 ? "#ca8a04" : "#dc2626";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${clampedScore}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-bold" style={{ color }}>{clampedScore}</span>
    </div>
  );
};

const WineCard = ({ wine, index, onClick, isFeatured }: { wine: HomeWine; index?: number; onClick: (w: HomeWine) => void; isFeatured?: boolean }) => {
  const ti = homeTypeMap[wine.type];
  return (
    <button
      type="button"
      onClick={() => onClick(wine)}
      aria-label={`${wine.name} の詳細を見る`}
      className={`group relative bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden cursor-pointer text-left w-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-rose-400 border border-[#f0ece8] dark:border-white/10 ${isFeatured ? "md:col-span-2 md:row-span-2" : ""}`}
    >
      {isFeatured && (
        <div className="absolute top-3 left-3 z-10">
          <Badge color="#fff" bg="#8B1A2B" className="shadow-lg"><Sparkles className="w-3 h-3 mr-1" />今週のイチオシ</Badge>
        </div>
      )}
      {index !== undefined && (
        <div className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-sm" style={{ backgroundColor: ti.bg, color: ti.color }}>
          {index + 1}
        </div>
      )}
      <div className="absolute top-3 right-12 z-10">
        <FavoriteButton wineId={wine.id} size="sm" />
      </div>
      <div className={`relative ${isFeatured ? "p-8" : "p-5"}`}>
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ backgroundColor: ti.bg }}>
            {ti.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge color={ti.color} bg={ti.bg}>{ti.label}</Badge>
              <span className="text-xs text-gray-400 dark:text-gray-500">{wine.abv}%</span>
            </div>
            <h3 className={`font-bold text-gray-900 dark:text-gray-100 leading-snug group-hover:text-rose-800 dark:group-hover:text-rose-300 transition-colors ${isFeatured ? "text-xl" : "text-sm"}`}>
              {wine.name}
            </h3>
          </div>
        </div>
        <p className={`text-gray-500 dark:text-gray-400 leading-relaxed mb-4 ${isFeatured ? "text-sm" : "text-xs line-clamp-2"}`}>{wine.catch}</p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {wine.pairings.slice(0, 3).map((food, i) => (
            <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-300 rounded-md text-xs">
              <Utensils className="w-2.5 h-2.5" />{food}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-1 mb-4">
          {wine.storeLabels.slice(0, 3).map((store, i) => (
            <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-300 rounded-md text-xs">
              <Store className="w-2.5 h-2.5" />{store}
            </span>
          ))}
        </div>
        <div className="flex items-end justify-between pt-3 border-t border-[#f5f0eb] dark:border-white/10">
          <div className="flex-1 mr-3">
            <div className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">コスパ指標</div>
            <CospaBar score={wine.cospa} />
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 justify-end mb-1">
              {wine.vivino != null && <StarRating score={wine.vivino} />}
              <Globe className="w-3 h-3 text-gray-300 dark:text-gray-600" />
              <span className="text-xs text-gray-400 dark:text-gray-500">{wine.country}</span>
            </div>
            <div className={`font-black ${isFeatured ? "text-2xl" : "text-lg"}`} style={{ color: "#8B1A2B" }}>{fmt(wine.price)}</div>
          </div>
        </div>
      </div>
    </button>
  );
};

const WineModal = ({ wine, onClose }: { wine: HomeWine | null; onClose: () => void }) => {
  if (!wine) return null;
  const ti = homeTypeMap[wine.type];
  const buyUrl = wine.buyUrl ?? rakutenSearchUrl(wine.name);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose} role="dialog" aria-modal="true" aria-label={`${wine.name} の詳細`}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative bg-white dark:bg-neutral-900 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} aria-label="閉じる" className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-white/20 transition-colors">
          <X className="w-5 h-5 text-gray-500 dark:text-gray-300" />
        </button>
        <div className="p-4 rounded-t-3xl" style={{ background: `linear-gradient(135deg, ${ti.color}15, ${ti.color}05)` }}>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-3xl">{ti.icon}</span>
            <Badge color={ti.color} bg={ti.bg}>{ti.label}ワイン</Badge>
            <Badge color="#666" bg="#f5f5f5">{wine.abv}%</Badge>
            {wine.grape && <Badge color="#6d28d9" bg="#f5f3ff">{wine.grape}</Badge>}
          </div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 mb-1">{wine.name}</h2>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <span className="text-sm text-gray-500 dark:text-gray-400">{wine.country}</span>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{wine.catch}</p>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-3 text-center">
              <div className="text-2xl font-black" style={{ color: "#8B1A2B" }}>{fmt(wine.price)}</div>
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">価格</div>
            </div>
            <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-3 text-center">
              <div className="text-2xl font-black text-amber-600 dark:text-amber-400">{wine.vivino ?? "—"}</div>
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">Vivino</div>
            </div>
            <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-3 text-center">
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{wine.cospa}</div>
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">コスパ</div>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2"><Utensils className="w-4 h-4" />おすすめペアリング</h4>
            <div className="flex flex-wrap gap-2">
              {wine.pairings.map((food, i) => (
                <span key={i} className="px-3 py-1.5 bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-300 rounded-lg text-sm font-medium">{food}</span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2"><ShoppingBag className="w-4 h-4" />購入できるお店</h4>
            <div className="flex flex-wrap gap-2">
              {wine.storeLabels.map((store, i) => (
                <span key={i} className="px-3 py-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-300 rounded-lg text-sm font-medium">{store}</span>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Link
              href={`/wines/${wine.id}`}
              className="w-full py-3 rounded-xl font-bold text-white transition-all hover:opacity-90 flex items-center justify-center gap-2 text-center"
              style={{ background: "linear-gradient(135deg, #8B1A2B, #6B1525)" }}
            >
              <Wine className="w-4 h-4" />詳細ページを見る
            </Link>
            <a
              href={buyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl font-bold transition-all hover:bg-gray-100 dark:hover:bg-white/10 flex items-center justify-center gap-2 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200"
            >
              <ExternalLink className="w-4 h-4" />楽天で探す
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const dinnerOptions = [
  { label: "ステーキ / 焼肉", icon: "🥩", keywords: ["ステーキ","肉料理","グリル肉","ローストビーフ","ラム","BBQ","焼肉"] },
  { label: "パスタ / ピザ", icon: "🍝", keywords: ["パスタ","ピザ","トマトパスタ","ナポリタン","トマト煮込み"] },
  { label: "魚介 / 寿司", icon: "🐟", keywords: ["魚介","寿司","牡蠣","刺身","シーフード","魚料理","海鮮","白身魚","天ぷら","カルパッチョ"] },
  { label: "サラダ / 軽食", icon: "🥗", keywords: ["サラダ","生ハム","前菜","カルパッチョ","フルーツ"] },
  { label: "鶏肉料理", icon: "🍗", keywords: ["鶏肉","チキン","唐揚げ","ローストチキン","焼き鳥"] },
  { label: "チーズ", icon: "🧀", keywords: ["チーズ","モッツァレラ"] },
];
const DinnerMatcher = ({ onSelectWine }: { onSelectWine: (w: HomeWine) => void }) => {
  const [selected, setSelected] = useState<number | null>(null);
  const matches = useMemo(() => {
    if (selected === null) return [];
    const kw = dinnerOptions[selected].keywords;
    return homeWines
      .filter(w => w.pairings.some(food => kw.some(k => food.includes(k))))
      .sort((a, b) => b.cospa - a.cospa)
      .slice(0, 6);
  }, [selected]);
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 md:p-8 shadow-sm border border-[#f0ece8] dark:border-white/10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #8B1A2B, #C4627A)" }}>
          <Utensils className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-black text-gray-900 dark:text-gray-100">今夜の献立からワインを探す</h3>
          <p className="text-xs text-gray-400 dark:text-gray-500">料理を選ぶだけで最適なワインをご提案</p>
        </div>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-6">
        {dinnerOptions.map((opt, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setSelected(selected === i ? null : i)}
            aria-pressed={selected === i}
            className={`p-3 rounded-xl text-center transition-all min-h-[64px] ${selected === i ? "shadow-md scale-105 bg-rose-50 dark:bg-rose-500/15 border-2 border-rose-800" : "hover:bg-gray-50 dark:hover:bg-white/5 border-2 border-transparent"}`}
          >
            <div className="text-2xl mb-1">{opt.icon}</div>
            <div className="text-xs font-medium text-gray-700 dark:text-gray-200">{opt.label}</div>
          </button>
        ))}
      </div>
      {matches.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 animate-fadeIn">
          {matches.map((w) => (
            <button
              type="button"
              key={w.id}
              onClick={() => onSelectWine(w)}
              className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 cursor-pointer transition-colors text-left"
            >
              <span className="text-xl">{homeTypeMap[w.type].icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">{w.name}</div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold" style={{ color: "#8B1A2B" }}>{fmt(w.price)}</span>
                  {w.vivino != null && <StarRating score={w.vivino} />}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const PromoBanner = ({ type }: { type: string }) => {
  if (type === "store") {
    return (
      <Link
        href="/wines?store=seijoishii"
        className="relative overflow-hidden rounded-2xl p-6 md:p-8 block"
        style={{ background: "linear-gradient(135deg, #1a365d, #2d3748)" }}
      >
        <div className="absolute top-2 right-3 text-xs text-white/40">PR</div>
        <div className="relative z-10">
          <Badge color="#93c5fd" bg="#1e3a5f" className="mb-3">STORE SPOTLIGHT</Badge>
          <h3 className="text-xl font-black text-white mb-2">成城石井のワインセレクション</h3>
          <p className="text-blue-200 text-sm mb-4">厳選されたワインを日常に。今月のおすすめワインをチェック</p>
          <span className="px-5 py-2 bg-white text-gray-900 rounded-lg font-bold text-sm hover:bg-gray-100 transition-colors inline-flex items-center gap-2">
            おすすめを見る <ArrowRight className="w-4 h-4" />
          </span>
        </div>
        <div className="absolute -right-4 -bottom-4 text-8xl opacity-10">🏪</div>
      </Link>
    );
  }
  return (
    <Link
      href="/wines?country=South%20Africa"
      className="relative overflow-hidden rounded-2xl p-6 md:p-8 block"
      style={{ background: "linear-gradient(135deg, #7B2D3B, #4A0E1B)" }}
    >
      <div className="absolute top-2 right-3 text-xs text-white/40">PR</div>
      <div className="relative z-10">
        <Badge color="#fbbf24" bg="#7B2D3B" className="mb-3">PARTNER WINERY</Badge>
        <h3 className="text-xl font-black text-white mb-2">南アフリカワインの魅力を発見</h3>
        <p className="text-rose-200 text-sm mb-4">世界が注目するコスパ最強のワイン産地。この春おすすめの3本</p>
        <span className="px-5 py-2 bg-white/20 text-white rounded-lg font-bold text-sm hover:bg-white/30 transition-colors backdrop-blur-sm inline-flex items-center gap-2">
          特集を読む <ArrowRight className="w-4 h-4" />
        </span>
      </div>
      <div className="absolute -right-4 -bottom-4 text-8xl opacity-10">🍇</div>
    </Link>
  );
};

const guideItems = [
  { q: "Vivinoスコアって何？", a: "世界最大のワインアプリVivino（利用者6,300万人）のユーザー評価。5点満点で3.5以上あれば十分美味しいワインです。当サイトではVivinoスコアを基にコスパ指標を算出しています。", icon: <Star className="w-5 h-5" /> },
  { q: "コンビニワインって美味しいの？", a: "最近のコンビニワインは品質が大幅に向上しています。特にチリ産カベルネやスペイン産カヴァは、専門店と遜色ない味わいが1,000円台で楽しめます。セブンのアマヤやファミマのジストは特におすすめです。", icon: <ShoppingBag className="w-5 h-5" /> },
  { q: "赤と白、どっちを選ぶ？", a: "肉料理やトマト系なら赤、魚・和食・サラダなら白がおすすめ。迷ったらスパークリングが万能です。当サイトの「今夜の献立から探す」機能で、料理に合ったワインを簡単に見つけられます。", icon: <Wine className="w-5 h-5" /> },
  { q: "コスパ指標って何？", a: "Vivinoスコアと価格のバランスを100点満点で表した独自指標。高いほど「評価の割にお得」なワインです。80以上なら文句なしのコスパ優良ワインと言えます。", icon: <TrendingUp className="w-5 h-5" /> },
  { q: "初心者にはどれがおすすめ？", a: "まずはスパークリングの「アマヤ カヴァ」（¥1,098）がおすすめ。どんな料理にも合い、失敗しません。赤なら「イル・プーモ プリミティーヴォ」（¥1,100）、白なら「ピーツ・ピュア ソーヴィニヨン・ブラン」（¥1,430）が鉄板です。", icon: <Sparkles className="w-5 h-5" /> },
  { q: "ワインの保存方法は？", a: "未開封は冷暗所で横向きに。開封後は冷蔵庫で3日以内に飲みきるのが理想です。スクリューキャップのワインは立てて保存でもOK。泡は当日中がベストです。", icon: <Clock className="w-5 h-5" /> },
];
const GuideSection = () => {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="space-y-3">
      {guideItems.map((item, i) => (
        <div key={i} className="bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden transition-all border border-[#f0ece8] dark:border-white/10">
          <button
            type="button"
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
            className="w-full flex items-center gap-4 p-5 text-left hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#FDF2F4", color: "#8B1A2B" }}>
              {item.icon}
            </div>
            <span className="flex-1 font-bold text-gray-900 dark:text-gray-100">{item.q}</span>
            {open === i ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </button>
          {open === i && (
            <div className="px-5 pb-5 ml-14">
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{item.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

type TabId = "all" | WineType;

export default function App() {
  const [tab, setTab] = useState<TabId>("all");
  const [sort, setSort] = useState("cospa");
  const [priceRange, setPriceRange] = useState("all");
  const [store, setStore] = useState("all");
  const [country, setCountry] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedWine, setSelectedWine] = useState<HomeWine | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);

  const filtered = useMemo(() => {
    let list = [...homeWines];
    if (tab !== "all") list = list.filter(w => w.type === tab);
    if (priceRange === "under1500") list = list.filter(w => w.price < 1500);
    else if (priceRange === "1500to2000") list = list.filter(w => w.price >= 1500 && w.price <= 2000);
    else if (priceRange === "over2000") list = list.filter(w => w.price > 2000);
    if (store !== "all") list = list.filter(w => w.storeLabels.includes(store));
    if (country !== "all") list = list.filter(w => w.country === country);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(w =>
        w.name.toLowerCase().includes(q) ||
        w.catch.toLowerCase().includes(q) ||
        w.description.toLowerCase().includes(q) ||
        w.grape.toLowerCase().includes(q) ||
        w.pairings.some(f => f.includes(q))
      );
    }
    if (sort === "cospa") list.sort((a, b) => b.cospa - a.cospa);
    else if (sort === "price_asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price_desc") list.sort((a, b) => b.price - a.price);
    else if (sort === "rating") list.sort((a, b) => (b.vivino ?? 0) - (a.vivino ?? 0));
    return list;
  }, [tab, sort, priceRange, store, country, search]);

  const stats = useMemo(() => ({
    total: homeWines.length,
    avgPrice: Math.round(homeWines.reduce((s, w) => s + w.price, 0) / homeWines.length),
    countries: homeAllCountries.length,
    stores: homeAllStores.length,
  }), []);

  const randomWine = useCallback(() => {
    const pool = filtered.length > 0 ? filtered : homeWines;
    setSelectedWine(pool[Math.floor(Math.random() * pool.length)]);
  }, [filtered]);

  const tabItems: { id: TabId; label: string; icon?: string; count: number }[] = [
    { id: "all", label: "すべて", count: homeWines.length },
    { id: "red", label: "赤", icon: "🍷", count: homeWines.filter(w => w.type === "red").length },
    { id: "white", label: "白", icon: "🥂", count: homeWines.filter(w => w.type === "white").length },
    { id: "sparkling", label: "泡", icon: "🍾", count: homeWines.filter(w => w.type === "sparkling").length },
    { id: "rose", label: "ロゼ", icon: "🌸", count: homeWines.filter(w => w.type === "rose").length },
  ];

  return (
    <div className="min-h-screen bg-[#FDFAF6] dark:bg-neutral-950">
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        .animate-float { animation: float 3s ease-in-out infinite; }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .shimmer-text { background: linear-gradient(90deg, #8B1A2B, #C4627A, #D4A853, #8B1A2B); background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: shimmer 3s linear infinite; }
        * { scrollbar-width: thin; scrollbar-color: #d4c5b9 transparent; }
      `}</style>
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-neutral-950/80 shadow-sm border-b border-[#f0ece8] dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #8B1A2B, #C4627A)" }}>
              <Wine className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black" style={{ color: "#8B1A2B" }}>ご近所ワイン</h1>
              <p className="text-xs text-gray-400 dark:text-gray-500 -mt-0.5 hidden md:block">近所で買うべき最高のワイン</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            {tabItems.map(t => (
              <button key={t.id} type="button" onClick={() => { setTab(t.id); setVisibleCount(12); }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${tab === t.id ? "text-white shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"}`}
                style={tab === t.id ? { background: "linear-gradient(135deg, #8B1A2B, #6B1525)" } : {}}>
                {t.icon && <span className="mr-1">{t.icon}</span>}{t.label}
              </button>
            ))}
            <Link href="/wines" className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-all">
              全ワイン
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <FavoritesIndicator className="min-h-[44px] min-w-[44px] text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10" />
            <button type="button" onClick={randomWine} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:shadow-md min-h-[44px] active:scale-95" style={{ backgroundColor: "#FDF2F4", color: "#8B1A2B" }} aria-label="ランダムにワインを選ぶ">
              <Shuffle className="w-4 h-4" /> 運命の1本
            </button>
          </div>
        </div>
      </header>
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1A0A10, #3D1225, #1A0A10)" }}>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #8B1A2B 0%, transparent 50%), radial-gradient(circle at 70% 50%, #C4627A 0%, transparent 50%)" }} />
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="max-w-2xl">
            <Badge color="#D4A853" bg="#3D1225" className="mb-4 text-sm">厳選 {stats.total} 本 ・ {stats.countries} カ国 ・ {stats.stores} 店舗</Badge>
            <h2 className="text-4xl md:text-6xl font-black text-white leading-tight mb-4">
              近所で買うべき<br />
              <span className="shimmer-text">最高のワイン</span>
            </h2>
            <p className="text-lg text-rose-200/80 mb-8 leading-relaxed">
              コンビニ・スーパーで手に入る厳選ワインを<br className="hidden md:block" />
              コスパと話題度でランキング。今夜の1本がすぐ見つかる。
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#wines" className="px-6 py-3 rounded-xl font-bold text-white flex items-center gap-2 transition-all hover:shadow-lg hover:scale-105" style={{ background: "linear-gradient(135deg, #8B1A2B, #C4627A)" }}>
                ワインを探す <ArrowRight className="w-4 h-4" />
              </a>
              <a href="#guide" className="px-6 py-3 rounded-xl font-bold text-white/80 border border-white/20 flex items-center gap-2 hover:bg-white/10 transition-all backdrop-blur-sm">
                初心者ガイド
              </a>
            </div>
          </div>
          <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden lg:block">
            <div className="text-9xl animate-float opacity-30">🍷</div>
          </div>
        </div>
      </section>
      {/* Stats Bar */}
      <section className="bg-white dark:bg-neutral-900 shadow-sm border-b border-[#f0ece8] dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: <Wine className="w-5 h-5" />, label: "厳選ワイン", value: `${stats.total}本`, color: "#8B1A2B" },
            { icon: <DollarSign className="w-5 h-5" />, label: "平均価格", value: fmt(stats.avgPrice), color: "#ca8a04" },
            { icon: <Globe className="w-5 h-5" />, label: "対象国", value: `${stats.countries}カ国`, color: "#2E7D6B" },
            { icon: <Store className="w-5 h-5" />, label: "取扱店", value: `${stats.stores}店舗`, color: "#4338ca" },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: s.color + "20", color: s.color }}>{s.icon}</div>
              <div>
                <div className="text-lg font-black text-gray-900 dark:text-gray-100">{s.value}</div>
                <div className="text-xs text-gray-400 dark:text-gray-500">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-10">
        <WineOfTheDay />
        <RecentWines />
        <DinnerMatcher onSelectWine={setSelectedWine} />
        <PromoBanner type="winery" />
        <section id="wines">
          {/* Mobile tabs */}
          <div className="md:hidden flex gap-2 overflow-x-auto pb-3 mb-4 -mx-1 px-1">
            {tabItems.map(t => (
              <button key={t.id} type="button" onClick={() => { setTab(t.id); setVisibleCount(12); }}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-bold transition-all ${tab === t.id ? "text-white shadow-sm" : "text-gray-500 dark:text-gray-300 bg-white dark:bg-neutral-900 border border-[#f0ece8] dark:border-white/10"}`}
                style={tab === t.id ? { background: "linear-gradient(135deg, #8B1A2B, #6B1525)" } : {}}>
                {t.icon && <span className="mr-1">{t.icon}</span>}{t.label}<span className="ml-1 text-xs opacity-70">{t.count}</span>
              </button>
            ))}
          </div>
          {/* Search + Filters */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl p-4 mb-6 shadow-sm border border-[#f0ece8] dark:border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="search" inputMode="search" value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="ワイン名・品種・料理名で検索..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 text-base md:text-sm outline-none focus:ring-2 focus:ring-rose-200 transition-all min-h-[44px] text-gray-900 dark:text-gray-100"
                  aria-label="ワインを検索"
                />
              </div>
              <button type="button" onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors min-h-[44px]" aria-expanded={showFilters} aria-label="絞り込みパネルを開閉">
                <Filter className="w-4 h-4" /> 絞り込み {showFilters ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>
            {showFilters && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-fadeIn">
                <div>
                  <label className="text-xs text-gray-400 dark:text-gray-500 mb-1 block">予算</label>
                  <select value={priceRange} onChange={e => setPriceRange(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-white/5 text-sm outline-none text-gray-900 dark:text-gray-100">
                    <option value="all">すべて</option>
                    <option value="under1500">〜¥1,500</option>
                    <option value="1500to2000">¥1,500〜2,000</option>
                    <option value="over2000">¥2,000〜</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 dark:text-gray-500 mb-1 block">お店</label>
                  <select value={store} onChange={e => setStore(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-white/5 text-sm outline-none text-gray-900 dark:text-gray-100">
                    <option value="all">すべて</option>
                    {homeAllStores.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 dark:text-gray-500 mb-1 block">国</label>
                  <select value={country} onChange={e => setCountry(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-white/5 text-sm outline-none text-gray-900 dark:text-gray-100">
                    <option value="all">すべて</option>
                    {homeAllCountries.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 dark:text-gray-500 mb-1 block">並び替え</label>
                  <select value={sort} onChange={e => setSort(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-white/5 text-sm outline-none text-gray-900 dark:text-gray-100">
                    <option value="cospa">コスパ順</option>
                    <option value="price_asc">安い順</option>
                    <option value="price_desc">高い順</option>
                    <option value="rating">評価順</option>
                  </select>
                </div>
              </div>
            )}
          </div>
          {/* Results count */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400"><span className="font-bold text-gray-900 dark:text-gray-100">{filtered.length}</span> 本のワインが見つかりました</p>
          </div>
          {/* Wine Grid */}
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-gray-500 dark:text-gray-400">
              <p className="text-lg">条件に合うワインが見つかりませんでした</p>
              <p className="mt-2 text-sm">フィルタを変更してお試しください</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.slice(0, visibleCount).map((wine, i) => (
                <WineCard key={wine.id} wine={wine} index={i} onClick={setSelectedWine} isFeatured={i === 0 && tab === "all" && sort === "cospa"} />
              ))}
            </div>
          )}
          {/* Load more */}
          {filtered.length > visibleCount && (
            <div className="text-center mt-8">
              <button type="button" onClick={() => setVisibleCount(v => v + 12)} className="px-8 py-3 rounded-xl font-bold text-sm transition-all hover:shadow-md" style={{ backgroundColor: "#FDF2F4", color: "#8B1A2B" }}>
                もっと見る（残り {filtered.length - visibleCount} 本）
              </button>
            </div>
          )}
        </section>
        <PromoBanner type="store" />
        {/* Guide */}
        <section id="guide">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #D4A853, #B8860B)" }}>
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900 dark:text-gray-100">ワイン選びガイド</h3>
              <p className="text-xs text-gray-400 dark:text-gray-500">初心者から中級者まで、知っておきたい基礎知識</p>
            </div>
          </div>
          <GuideSection />
        </section>
        {/* Newsletter */}
        <section className="bg-white dark:bg-neutral-900 rounded-3xl p-8 md:p-12 text-center shadow-sm border border-[#f0ece8] dark:border-white/10">
          <div className="max-w-md mx-auto">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "linear-gradient(135deg, #8B1A2B, #C4627A)" }}>
              <Mail className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-gray-100 mb-2">毎週おすすめワインをお届け</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">新着ワイン・セール情報・季節のペアリングレシピを毎週金曜にお届けします</p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="メールアドレス" className="flex-1 px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 text-sm outline-none focus:ring-2 focus:ring-rose-200 text-gray-900 dark:text-gray-100" aria-label="メールアドレス" />
              <button type="submit" className="px-6 py-3 rounded-xl font-bold text-white text-sm transition-all hover:shadow-lg" style={{ background: "linear-gradient(135deg, #8B1A2B, #6B1525)" }}>登録</button>
            </form>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">いつでも解除できます。スパムは送りません。</p>
          </div>
        </section>
        {/* Partner Section */}
        <section className="bg-white dark:bg-neutral-900 rounded-3xl p-6 md:p-8 shadow-sm border border-[#f0ece8] dark:border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #059669, #34d399)" }}>
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-900 dark:text-gray-100">パートナー企業様へ</h3>
              <p className="text-xs text-gray-400 dark:text-gray-500">ユーザー無料・企業様からの広告で運営しています</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: <Store className="w-6 h-6" />, title: "ストアスポットライト", desc: "御社の店舗をフィーチャー。ワインと店舗を紐づけて認知向上", price: "月額 ¥30,000〜" },
              { icon: <Wine className="w-6 h-6" />, title: "ワイナリー特集", desc: "ワイナリー・インポーターの商品をネイティブ記事で紹介", price: "1記事 ¥50,000〜" },
              { icon: <Gift className="w-6 h-6" />, title: "タイアップ企画", desc: "季節キャンペーン・プレゼント企画で双方のファンを獲得", price: "企画ごとにご相談" },
            ].map((item, i) => (
              <div key={i} className="p-5 rounded-2xl bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: "#ecfdf5", color: "#059669" }}>{item.icon}</div>
                <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-1">{item.title}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{item.desc}</p>
                <span className="text-sm font-bold" style={{ color: "#059669" }}>{item.price}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
      {/* Footer */}
      <footer className="mt-16 bg-[#1A0A10]">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #8B1A2B, #C4627A)" }}>
                  <Wine className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-black text-white">ご近所ワイン</h3>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
                コンビニ・スーパーで買える手頃なワインを、コスパと話題度で厳選して紹介するサイトです。ユーザーの皆さまには無料でご利用いただけます。
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-3">カテゴリ</h4>
              <div className="space-y-2">
                {tabItems.slice(1).map(t => (
                  <button key={t.id} type="button" onClick={() => { setTab(t.id); setVisibleCount(12); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    className="block text-sm text-gray-400 hover:text-white transition-colors">{t.icon} {t.label}ワイン（{t.count}本）</button>
                ))}
                <Link href="/wines" className="block text-sm text-gray-400 hover:text-white transition-colors">全ワインを見る →</Link>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-white mb-3">リンク</h4>
              <div className="space-y-2">
                <a href="#guide" className="block text-sm text-gray-400 hover:text-white transition-colors">ワイン選びガイド</a>
                <a href="#" className="block text-sm text-gray-400 hover:text-white transition-colors">パートナー企業様へ</a>
                <a href="#" className="block text-sm text-gray-400 hover:text-white transition-colors">プライバシーポリシー</a>
                <a href="#" className="block text-sm text-gray-400 hover:text-white transition-colors">お問い合わせ</a>
              </div>
            </div>
          </div>
          <div className="pt-8 text-center border-t border-[#2D1520]">
            <p className="text-xs text-gray-500">
              &copy; 2026 ご近所ワイン. 価格は参考値です。最新の価格は各店舗でご確認ください。
            </p>
            <p className="text-xs text-gray-600 mt-1">Vivinoスコアは各ワインのVivino公式ページの値を参照しています。</p>
          </div>
        </div>
      </footer>
      <WineModal wine={selectedWine} onClose={() => setSelectedWine(null)} />
      <AiSommelier />
      <ScrollToTop />
    </div>
  );
}
