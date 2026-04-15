"use client";
import { useState, useMemo, useCallback } from "react";
import { Search, Wine, Star, ShoppingBag, ChevronDown, ChevronUp, X, Sparkles, ArrowRight, Filter, Globe, Store, Utensils, TrendingUp, Gift, Mail, ExternalLink, Shuffle, Clock, Award, DollarSign, BarChart3 } from "lucide-react";
import { AiSommelier } from "@/components/sommelier/ai-sommelier";

const W = [
  {n:"ジスト グランレゼルバ",p:1098,a:13.5,t:"red",d:"13年熟成グランレゼルバが1,098円。神の雫コラボで話題沸騰",f:["ファミチキ","ステーキ"],s:["ファミマ"],c:"スペイン",g:"テンプラニーリョ"},
  {n:"ハスケル カベルネ・ソーヴィニヨン",p:2000,a:14,t:"red",d:"2千円以下で超鉄板。南アのエレガント系カベルネの最高峰",f:["ステーキ","ローストビーフ"],s:["楽天"],c:"南アフリカ",g:"カベルネ・ソーヴィニヨン"},
  {n:"ドルニエ ピノタージュ",p:2000,a:14,t:"red",d:"ブルピノの代替に。開栓2日目に化ける南アの常備ワイン",f:["ラム肉","BBQ"],s:["楽天"],c:"南アフリカ",g:"ピノタージュ"},
  {n:"ピーツ・ピュア シラーズ",p:1430,a:13.5,t:"red",v:3.8,d:"1100円で3000円クオリティ。コンビニワイン部門で頭2〜3つ抜けの怪物",f:["BBQ","スパイスカレー"],s:["ローソン"],c:"オーストラリア",g:"シラーズ"},
  {n:"デスパーニュ ルージュ",p:1218,a:13.5,t:"red",d:"神の雫モンペラの造り手によるボルドー赤が1,218円。ファミマで買える本格派",f:["ビーフシチュー","チーズ"],s:["ファミマ"],c:"フランス",g:"メルロー/カベルネ"},
  {n:"イル・プーモ プリミティーヴォ",p:1100,a:13.5,t:"red",v:3.9,d:"Vivino世界TOP5%！1000円台で買える南イタリアの至宝",f:["グリルチキン","トマト煮込み"],s:["カルディ","成城石井","楽天"],c:"イタリア",g:"プリミティーヴォ"},
  {n:"カノンコップ カデット",p:1890,a:14,t:"red",v:3.8,d:"アフリカーで見つけた南アコスパブレンド！Xおすすめの力強い1本",f:["ステーキ","グリル肉"],s:["アフリカー"],c:"南アフリカ",g:"ピノタージュ/カベルネ"},
  {n:"カッシェロ・デル・ディアブロ カベルネ・ソーヴィニヨン",p:1100,a:13.5,t:"red",v:3.5,d:"悪魔が守った伝説の味！チリワインの実力を1000円台で体感",f:["ステーキ","ラム"],s:["ローソン","成城石井","楽天"],c:"チリ",g:"カベルネ・ソーヴィニヨン"},
  {n:"KWV カセドラルセラー ピノタージュ",p:2497,a:14,t:"red",v:3.8,d:"X衝撃の南アコスパピノ！毎日飲みたくなる完成度",f:["グリル肉","スパイシー料理"],s:["楽天"],c:"南アフリカ",g:"ピノタージュ"},
  {n:"ピッチーニ キャンティ",p:1053,a:13,t:"red",v:3.5,d:"有名ソムリエも大発見と唸った！ファミマで買える本格キャンティ",f:["トマトパスタ","ピザ"],s:["ファミマ"],c:"イタリア",g:"サンジョヴェーゼ"},
  {n:"カンポ ビエホ リオハ クリアンサ",p:1680,a:13.5,t:"red",v:3.6,d:"ワインおおはしコスパリオハの新定番！Xでバズる飲みやすさ",f:["肉料理","チーズ"],s:["ワインおおはし"],c:"スペイン",g:"テンプラニーリョ"},
  {n:"マックマニス カベルネソーヴィニヨン",p:2035,a:13.5,t:"red",v:3.8,d:"赤もコスパ最強！Xバズ日常赤ワイン",f:["ステーキ","肉料理"],s:["楽天"],c:"アメリカ",g:"カベルネ・ソーヴィニヨン"},
  {n:"トーレス サングレ デ トロ",p:1650,a:13.5,t:"red",v:3.6,d:"オオゼキで気軽に買えるスペインコスパ赤の王者！毎日飲みたい1本",f:["肉料理","チーズ"],s:["オオゼキ"],c:"スペイン",g:"ガルナッチャ/テンプラニーリョ"},
  {n:"シャトー・ド・ヴァルコンブ コスティエール・ド・ニーム",p:1580,a:13.5,t:"red",v:3.5,d:"オオゼキで気軽に買える南仏コスパ赤！力強さの極み",f:["グリル肉","スパイシー料理"],s:["オオゼキ"],c:"フランス",g:"シラー/グルナッシュ"},
  {n:"アンティノリ キャンティ クラシコ",p:2200,a:13,t:"red",v:3.8,d:"リカマンで手軽に！アンティノリコスパ赤の本格味わい",f:["パスタ","ピザ"],s:["リカマン"],c:"イタリア",g:"サンジョヴェーゼ"},
  {n:"フェウド・アランチョ ネロ・ダーヴォラ",p:1180,a:13,t:"red",v:3.6,d:"JWC金賞のシチリア赤！日常に取り入れたい実力派",f:["ナポリタン","ミートボール"],s:["カルディ","成城石井","楽天"],c:"イタリア",g:"ネロ・ダーヴォラ"},
  {n:"ジョルジュ デュブフ ボージョレ",p:1980,a:12.5,t:"red",v:3.5,d:"タカムラで手に入るボージョレコスパの極み！軽やか日常赤",f:["肉料理","チーズ"],s:["タカムラ"],c:"フランス",g:"ガメイ"},
  {n:"KWV クラシック ピノタージュ",p:1188,a:13.5,t:"red",v:3.5,d:"南アフリカ固有品種の新体験！コンビニで出会える世界最高峰ブランド",f:["BBQ","スペアリブ"],s:["ファミマ","カルディ","楽天"],c:"南アフリカ",g:"ピノタージュ"},
  {n:"トロウラ・ティント",p:1980,a:13.5,t:"red",v:3.5,d:"スペインコスパ赤！飲みやすさ抜群の日常ワイン",f:["肉料理","パエリア"],s:["楽天"],c:"スペイン",g:"テンプラニーリョ"},
  {n:"アレグリーニ ヴァルポリチェッラ クラシコ",p:2200,a:13,t:"red",v:3.7,d:"銀座グランマルシェで買えるイタリアコスパ赤の新定番！",f:["パスタ","ピザ"],s:["銀座グランマルシェ"],c:"イタリア",g:"コルヴィーナ"},
  {n:"ファウスティーノ リオハ クリアンサ",p:2480,a:13.5,t:"red",v:3.7,d:"ワインおおはしで買えるリオハコスパの隠れ逸品！本格熟成感",f:["ステーキ","チーズ"],s:["ワインおおはし"],c:"スペイン",g:"テンプラニーリョ"},
  {n:"アンリ・フェッシー ブルイ",p:2150,a:13,t:"red",v:3.6,d:"タカムラで買えるブルイコスパ！軽やか日常赤",f:["肉料理","チーズ"],s:["タカムラ"],c:"フランス",g:"ガメイ"},
  {n:"ポールクルーバー エステート ピノノワール",p:2500,a:13,t:"red",v:3.7,d:"南アピノコスパ王者！",f:["鴨肉","きのこ料理"],s:["楽天"],c:"南アフリカ",g:"ピノ・ノワール"},
  {n:"ボッシュクルーフ シラー",p:2500,a:14,t:"red",v:3.6,d:"シラーコスパの極み！",f:["グリル肉","スパイシー料理"],s:["楽天"],c:"南アフリカ",g:"シラー"},
  {n:"ボデガス ムガ リオハ レゼルバ",p:2980,a:14,t:"red",v:3.9,d:"銀座グランマルシェのリオハコスパ逸品！深みのある熟成感",f:["ステーキ","煮込み料理"],s:["銀座グランマルシェ"],c:"スペイン",g:"テンプラニーリョ"},
  {n:"ブシャール ブルゴーニュ ピノノワール",p:2650,a:13,t:"red",v:3.7,d:"リカマンで買える本格ブルゴーニュコスパ赤！村名超えの完成度",f:["鴨肉","きのこ料理"],s:["リカマン"],c:"フランス",g:"ピノ・ノワール"},
  {n:"ダリオ プリンチッチ ナチュラルワイン",p:2500,a:12.5,t:"red",v:3.7,d:"イタリアコスパナチュラル！軽やかバランス",f:["パスタ","肉料理"],s:["楽天"],c:"イタリア",g:"メルロー"},
  {n:"ルイ・ジャド ボージョレ・ヴィラージュ",p:2800,a:13,t:"red",v:3.6,d:"ブルゴーニュコスパ王道！ルイジャドのガメイで毎日飲める極み",f:["肉料理","チーズ"],s:["楽天"],c:"フランス",g:"ガメイ"},
  {n:"シャトー・モンペラ ルージュ",p:2200,a:13.5,t:"red",v:3.6,d:"神の雫が世界に知らしめた逸品。2000円台でボルドーの真髄",f:["ローストビーフ","鴨肉"],s:["成城石井","楽天"],c:"フランス",g:"メルロー/カベルネ"},
  {n:"シャトー・メルシャン 山梨マスカット・ベーリーA",p:2200,a:11.5,t:"red",v:3.4,d:"和食に寄り添う日本ワインの最高峰。日本人のための赤",f:["焼き鳥（タレ）","肉じゃが"],s:["成城石井","楽天"],c:"日本",g:"マスカット・ベーリーA"},
  {n:"ピーツ・ピュア ソーヴィニヨン・ブラン",p:1430,a:12.5,t:"white",v:3.8,d:"Vivino 2,300件超えの世界的人気白。グレフル系爽やかワインの決定版",f:["サラダ","カルパッチョ"],s:["ローソン"],c:"南アフリカ",g:"ソーヴィニヨン・ブラン"},
  {n:"クライン コンスタンティア ソーヴィニヨン ブラン",p:1780,a:13,t:"white",v:3.6,d:"アフリカーで入手できる南アコスパ白の頂点！トロピカル爽快感",f:["牡蠣","魚介料理"],s:["アフリカー"],c:"南アフリカ",g:"ソーヴィニヨン・ブラン"},
  {n:"ヴィーニャ マイポ シャルドネ",p:1350,a:13,t:"white",v:3.4,d:"オオゼキのチリコスパ白の王道！手軽爽快感",f:["サラダ","シーフード"],s:["オオゼキ"],c:"チリ",g:"シャルドネ"},
  {n:"フェウド・アランチョ グリッロ",p:1100,a:13,t:"white",v:3.7,d:"Berlin Wine Trophy金賞！シチリアの太陽が詰まった1本",f:["貝類のパスタ","カルパッチョ"],s:["カルディ","成城石井","楽天"],c:"イタリア",g:"グリッロ"},
  {n:"ミシェル・ガシエ コスティエール・ド・ニーム ブラン",p:1650,a:13,t:"white",v:3.5,d:"タカムラの南仏コスパ白！華やか日常ワイン",f:["魚介料理","サラダ"],s:["タカムラ"],c:"フランス",g:"ルーサンヌ/グルナッシュ・ブラン"},
  {n:"ネダーバーグ シャルドネ",p:1650,a:13.5,t:"white",v:3.5,d:"アフリカーコスパ白の新星！濃厚トロピカル感",f:["鶏肉料理","パスタ"],s:["アフリカー"],c:"南アフリカ",g:"シャルドネ"},
  {n:"サンタリタ ヒーローズ ソーヴィニヨン ブラン",p:1434,a:12.5,t:"white",v:3.5,d:"チリコスパ白の新星！1400円台でこの爽快感は反則",f:["シーフード","サラダ"],s:["楽天"],c:"チリ",g:"ソーヴィニヨン・ブラン"},
  {n:"シャトー・ド・スール ボルドー ブラン",p:1850,a:12.5,t:"white",v:3.5,d:"ワインおおはしで買えるボルドーコスパ白！爽快感の極み",f:["魚介料理","サラダ"],s:["ワインおおはし"],c:"フランス",g:"ソーヴィニヨン・ブラン/セミヨン"},
  {n:"ジョセフ・ドルーアン シャブリ",p:2480,a:12.5,t:"white",v:3.7,d:"リカマンで買える本格シャブリコスパ白！毎日飲みたくなる爽快感",f:["牡蠣","海鮮料理"],s:["リカマン"],c:"フランス",g:"シャルドネ"},
  {n:"シレーニ セラー・セレクション ソーヴィニヨン・ブラン",p:1650,a:12.5,t:"white",v:3.8,d:"ワイン屋大賞2025白ワイン1位！NZソーヴィニヨンの決定版",f:["生牡蠣","白身魚のグリル"],s:["成城石井","楽天"],c:"ニュージーランド",g:"ソーヴィニヨン・ブラン"},
  {n:"ステレンラスト シュナン・ブラン",p:2448,a:13.5,t:"white",v:3.7,d:"南アコスパ隠れ名品！話題の白ワイン",f:["魚介料理","チーズ"],s:["楽天"],c:"南アフリカ",g:"シュナン・ブラン"},
  {n:"プラネタ シャルドネ",p:2450,a:13.5,t:"white",v:3.8,d:"銀座グランマルシェで買えるイタリアコスパ白！濃厚エレガンス",f:["魚料理","鶏肉"],s:["銀座グランマルシェ"],c:"イタリア",g:"シャルドネ"},
  {n:"アナヨン シャルドネ",p:2900,a:13.5,t:"white",v:3.6,d:"スペインコスパ白の隠れ星！話題の濃厚1本",f:["パスタ","鶏肉"],s:["楽天"],c:"スペイン",g:"シャルドネ"},
  {n:"ラピウマ ペコリーノ",p:1580,a:12.5,t:"white",d:"Yahoo!評価4.59！成城石井ランキング1位のイタリア白",f:["白身魚のカルパッチョ","レモン料理"],s:["成城石井"],c:"イタリア",g:"ペコリーノ"},
  {n:"マックマニス ヴィオニエ",p:2420,a:13.5,t:"white",v:3.8,d:"コスパ白の王道！毎日飲みたい3千円未満の極み",f:["鶏肉料理","シーフード"],s:["楽天"],c:"アメリカ",g:"ヴィオニエ"},
  {n:"ツェラー・シュヴァルツェ・カッツ",p:1000,a:9.5,t:"white",v:3.3,d:"黒猫ラベルが目印！リピーター続出のドイツ甘口白",f:["エスニック料理","フルーツサラダ"],s:["カルディ"],c:"ドイツ",g:"リースリング"},
  {n:"アルノザン アントル・ドゥ・メール ブラン",p:2673,a:12,t:"white",v:3.5,d:"フランスボルドーコスパ白！爽快感",f:["牡蠣","魚料理"],s:["楽天"],c:"フランス",g:"ソーヴィニヨン・ブラン"},
  {n:"千歳ワイナリー 北ワイン ケルナー",p:2750,a:12,t:"white",d:"国産北海道コスパ白の新星！爽やかさ",f:["海鮮料理","寿司"],s:["楽天"],c:"日本",g:"ケルナー"},
  {n:"サントリー ジャパンプレミアム 甲州",p:1798,a:12,t:"white",v:3.5,d:"世界が注目する日本固有品種！和食との相性は唯一無二",f:["お寿司","白身魚の天ぷら"],s:["楽天"],c:"日本",g:"甲州"},
  {n:"アマヤ カヴァ ブリュット レゼルバ",p:1098,a:11.5,t:"sparkling",v:3.4,d:"シャンパン製法で18ヶ月熟成のカヴァが1,098円。セブンの奇跡",f:["唐揚げ","生ハム"],s:["セブンイレブン"],c:"スペイン",g:"マカベオ/パレリャーダ"},
  {n:"ジャンピエール ブリュット",p:1210,a:11,t:"sparkling",v:3.1,d:"アマヤと並ぶ「不動の2トップ」。スクリューキャップで再栓可能な日常スパークリング",f:["生ハム","サラダ"],s:["セブンイレブン","楽天"],c:"フランス",g:"ユニ・ブラン"},
  {n:"フレシネ コルドン ネグロ ブリュット",p:1050,a:11.5,t:"sparkling",v:3.6,d:"世界が認めた黒ボトル！1000円台でシャンパン級の乾杯",f:["寿司","天ぷら"],s:["イオン","カルディ"],c:"スペイン",g:"パレリャーダ/マカベオ"},
  {n:"セグラヴューダス ブルート レゼルバ",p:1408,a:12,t:"sparkling",d:"五輪公式・王室御用達カヴァが1400円台！世界が認めた実力派",f:["パエリア","魚介のフリット"],s:["楽天"],c:"スペイン",g:"マカベオ/パレリャーダ"},
  {n:"モンムソー クレマン・ド・ロワール",p:1870,a:12.5,t:"sparkling",d:"シャンパンの半額以下！ANAビジネスクラス採用の実力派クレマン",f:["白身魚のムニエル","ブリオッシュ"],s:["イオン","楽天"],c:"フランス",g:"シュナン・ブラン"},
  {n:"クレマン・ド・リムー",p:2600,a:12,t:"sparkling",d:"アマヤの上位互換。シャンパンとスパークリングの中間という唯一無二の存在",f:["魚介料理","前菜"],s:["楽天"],c:"フランス",g:"シャルドネ/シュナン・ブラン"},
  {n:"マンズワイン 酵母の泡 甲州 ブリュット",p:1155,a:12,t:"sparkling",d:"G7サミット採用！日本が世界に誇る甲州スパークリング",f:["刺身","天ぷら"],s:["楽天"],c:"日本",g:"甲州"},
  {n:"サンテロ 天使のアスティ",p:1500,a:7.5,t:"sparkling",d:"天使が描かれた甘い誘惑！ワイン初心者も安心の低アルコール",f:["フルーツタルト","パンナコッタ"],s:["カルディ","楽天"],c:"イタリア",g:"モスカート"},
  {n:"ロジャーグラート カヴァ ロゼ ブリュット",p:2442,a:12,t:"sparkling",d:"ドンペリロゼに勝った伝説のカヴァ！20分の1の価格で至福の泡",f:["ローストチキン","エビのアヒージョ"],s:["楽天"],c:"スペイン",g:"ガルナッチャ/モナストレル"},
  {n:"サン・マルツァーノ トラマーリ ロゼ",p:1500,a:12.5,t:"rose",d:"楽天ロゼ1位！南イタリアの太陽が詰まったルカマローニ96点",f:["トマトとモッツァレラ","グリル野菜"],s:["楽天"],c:"イタリア",g:"プリミティーヴォ"},
];

const typeMap: Record<string, { label: string; color: string; bg: string; icon: string }> = { red: { label: "赤", color: "#8B1A2B", bg: "#FDF2F4", icon: "🍷" }, white: { label: "白", color: "#9B8A3E", bg: "#FEFDF2", icon: "🥂" }, sparkling: { label: "泡", color: "#2E7D6B", bg: "#F0FAF7", icon: "🍾" }, rose: { label: "ロゼ", color: "#C4627A", bg: "#FFF0F5", icon: "🌸" }};
const allStores = [...new Set(W.flatMap(w => w.s))].sort();
const allCountries = [...new Set(W.map(w => w.c))].sort();
const cospaScore = (w: typeof W[number]) => w.v ? Math.round((w.v / 5) * 100 * (3000 / w.p)) : Math.round(60 * (3000 / w.p));
const fmt = (p: number) => "¥" + p.toLocaleString();

const Badge = ({ children, color = "#8B1A2B", bg = "#FDF2F4", className = "" }: { children: React.ReactNode; color?: string; bg?: string; className?: string }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`} style={{ color, backgroundColor: bg }}>{children}</span>
);
const StarRating = ({ score }: { score?: number }) => {
  if (!score) return null;
  return (
    <div className="flex items-center gap-1">
      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
      <span className="text-sm font-semibold text-amber-700">{score}</span>
    </div>
  );
};
const CospaBar = ({ score }: { score: number }) => {
  const clampedScore = Math.min(100, Math.max(0, score));
  const color = clampedScore > 80 ? "#16a34a" : clampedScore > 60 ? "#ca8a04" : "#dc2626";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${clampedScore}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-bold" style={{ color }}>{clampedScore}</span>
    </div>
  );
};

type WineItem = typeof W[number];
const WineCard = ({ wine, index, onClick, isFeatured }: { wine: WineItem; index?: number; onClick: (w: WineItem) => void; isFeatured?: boolean }) => {
  const ti = typeMap[wine.t];
  const cp = cospaScore(wine);
  return (
    <div
      onClick={() => onClick(wine)}
      className={`group relative bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${isFeatured ? "md:col-span-2 md:row-span-2" : ""}`}
      style={{ border: "1px solid #f0ece8" }}
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
      <div className={`relative ${isFeatured ? "p-8" : "p-5"}`}>
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ backgroundColor: ti.bg }}>
            {ti.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge color={ti.color} bg={ti.bg}>{ti.label}</Badge>
              <span className="text-xs text-gray-400">{wine.a}%</span>
            </div>
            <h3 className={`font-bold text-gray-900 leading-snug group-hover:text-rose-800 transition-colors ${isFeatured ? "text-xl" : "text-sm"}`}>
              {wine.n}
            </h3>
          </div>
        </div>
        <p className={`text-gray-500 leading-relaxed mb-4 ${isFeatured ? "text-sm" : "text-xs line-clamp-2"}`}>{wine.d}</p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {wine.f.map((food, i) => (
            <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-50 text-orange-700 rounded-md text-xs">
              <Utensils className="w-2.5 h-2.5" />{food}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-1 mb-4">
          {wine.s.map((store, i) => (
            <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md text-xs">
              <Store className="w-2.5 h-2.5" />{store}
            </span>
          ))}
        </div>
        <div className="flex items-end justify-between pt-3" style={{ borderTop: "1px solid #f5f0eb" }}>
          <div>
            <div className="text-xs text-gray-400 mb-0.5">コスパ指標</div>
            <CospaBar score={cp} />
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 justify-end mb-1">
              {wine.v && <StarRating score={wine.v} />}
              <Globe className="w-3 h-3 text-gray-300" />
              <span className="text-xs text-gray-400">{wine.c}</span>
            </div>
            <div className={`font-black ${isFeatured ? "text-2xl" : "text-lg"}`} style={{ color: "#8B1A2B" }}>{fmt(wine.p)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const WineModal = ({ wine, onClose }: { wine: WineItem | null; onClose: () => void }) => {
  if (!wine) return null;
  const ti = typeMap[wine.t];
  const cp = cospaScore(wine);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
          <X className="w-5 h-5 text-gray-500" />
        </button>
        <div className="p-4 rounded-t-3xl" style={{ background: `linear-gradient(135deg, ${ti.color}15, ${ti.color}05)` }}>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{ti.icon}</span>
            <Badge color={ti.color} bg={ti.bg}>{ti.label}ワイン</Badge>
            <Badge color="#666" bg="#f5f5f5">{wine.a}%</Badge>
            {wine.g && <Badge color="#6d28d9" bg="#f5f3ff">{wine.g}</Badge>}
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-1">{wine.n}</h2>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">{wine.c}</span>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <p className="text-gray-600 leading-relaxed">{wine.d}</p>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <div className="text-2xl font-black" style={{ color: "#8B1A2B" }}>{fmt(wine.p)}</div>
              <div className="text-xs text-gray-400 mt-1">価格</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <div className="text-2xl font-black text-amber-600">{wine.v || "—"}</div>
              <div className="text-xs text-gray-400 mt-1">Vivino</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <div className="text-2xl font-black text-emerald-600">{cp}</div>
              <div className="text-xs text-gray-400 mt-1">コスパ</div>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2"><Utensils className="w-4 h-4" />おすすめペアリング</h4>
            <div className="flex flex-wrap gap-2">
              {wine.f.map((food, i) => (
                <span key={i} className="px-3 py-1.5 bg-orange-50 text-orange-700 rounded-lg text-sm font-medium">{food}</span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2"><ShoppingBag className="w-4 h-4" />購入できるお店</h4>
            <div className="flex flex-wrap gap-2">
              {wine.s.map((store, i) => (
                <span key={i} className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium">{store}</span>
              ))}
            </div>
          </div>
          <button className="w-full py-3 rounded-xl font-bold text-white transition-all hover:opacity-90 flex items-center justify-center gap-2" style={{ background: "linear-gradient(135deg, #8B1A2B, #6B1525)" }}>
            <ExternalLink className="w-4 h-4" />楽天で探す
          </button>
        </div>
      </div>
    </div>
  );
};

const dinnerOptions = [
  { label: "ステーキ / 焼肉", icon: "🥩", keywords: ["ステーキ","肉料理","グリル肉","ローストビーフ","ラム","BBQ"] },
  { label: "パスタ / ピザ", icon: "🍝", keywords: ["パスタ","ピザ","トマトパスタ","ナポリタン","トマト煮込み"] },
  { label: "魚介 / 寿司", icon: "🐟", keywords: ["魚介","寿司","牡蠣","刺身","シーフード","魚料理","海鮮","白身魚","天ぷら","カルパッチョ"] },
  { label: "サラダ / 軽食", icon: "🥗", keywords: ["サラダ","生ハム","前菜","カルパッチョ","フルーツ"] },
  { label: "鶏肉料理", icon: "🍗", keywords: ["鶏肉","チキン","唐揚げ","ローストチキン","焼き鳥"] },
  { label: "チーズ", icon: "🧀", keywords: ["チーズ","モッツァレラ"] },
];
const DinnerMatcher = ({ onSelectWine }: { onSelectWine: (w: WineItem) => void }) => {
  const [selected, setSelected] = useState<number | null>(null);
  const matches = useMemo(() => {
    if (selected === null) return [];
    const kw = dinnerOptions[selected].keywords;
    return W.filter(w => w.f.some(food => kw.some(k => food.includes(k)))).sort((a, b) => cospaScore(b) - cospaScore(a)).slice(0, 6);
  }, [selected]);
  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm" style={{ border: "1px solid #f0ece8" }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #8B1A2B, #C4627A)" }}>
          <Utensils className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-black text-gray-900">今夜の献立からワインを探す</h3>
          <p className="text-xs text-gray-400">料理を選ぶだけで最適なワインをご提案</p>
        </div>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-6">
        {dinnerOptions.map((opt, i) => (
          <button
            key={i}
            onClick={() => setSelected(selected === i ? null : i)}
            className={`p-3 rounded-xl text-center transition-all ${selected === i ? "shadow-md scale-105" : "hover:bg-gray-50"}`}
            style={selected === i ? { backgroundColor: "#FDF2F4", border: "2px solid #8B1A2B" } : { border: "2px solid transparent" }}
          >
            <div className="text-2xl mb-1">{opt.icon}</div>
            <div className="text-xs font-medium text-gray-700">{opt.label}</div>
          </button>
        ))}
      </div>
      {matches.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 animate-fadeIn">
          {matches.map((w, i) => (
            <div key={i} onClick={() => onSelectWine(w)} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
              <span className="text-xl">{typeMap[w.t].icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-gray-900 truncate">{w.n}</div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold" style={{ color: "#8B1A2B" }}>{fmt(w.p)}</span>
                  {w.v && <StarRating score={w.v} />}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const PromoBanner = ({ type }: { type: string }) => {
  if (type === "store") {
    return (
      <div className="relative overflow-hidden rounded-2xl p-6 md:p-8" style={{ background: "linear-gradient(135deg, #1a365d, #2d3748)" }}>
        <div className="absolute top-2 right-3 text-xs text-white/40">PR</div>
        <div className="relative z-10">
          <Badge color="#93c5fd" bg="#1e3a5f" className="mb-3">STORE SPOTLIGHT</Badge>
          <h3 className="text-xl font-black text-white mb-2">成城石井のワインセレクション</h3>
          <p className="text-blue-200 text-sm mb-4">厳選されたワインを日常に。今月のおすすめワインをチェック</p>
          <button className="px-5 py-2 bg-white text-gray-900 rounded-lg font-bold text-sm hover:bg-gray-100 transition-colors flex items-center gap-2">
            おすすめを見る <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="absolute -right-4 -bottom-4 text-8xl opacity-10">🏪</div>
      </div>
    );
  }
  return (
    <div className="relative overflow-hidden rounded-2xl p-6 md:p-8" style={{ background: "linear-gradient(135deg, #7B2D3B, #4A0E1B)" }}>
      <div className="absolute top-2 right-3 text-xs text-white/40">PR</div>
      <div className="relative z-10">
        <Badge color="#fbbf24" bg="#7B2D3B" className="mb-3">PARTNER WINERY</Badge>
        <h3 className="text-xl font-black text-white mb-2">南アフリカワインの魅力を発見</h3>
        <p className="text-rose-200 text-sm mb-4">世界が注目するコスパ最強のワイン産地。この春おすすめの3本</p>
        <button className="px-5 py-2 bg-white/20 text-white rounded-lg font-bold text-sm hover:bg-white/30 transition-colors backdrop-blur-sm flex items-center gap-2">
          特集を読む <ArrowRight className="w-4 h-4" />
        </button>
      </div>
      <div className="absolute -right-4 -bottom-4 text-8xl opacity-10">🍇</div>
    </div>
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
        <div key={i} className="bg-white rounded-2xl overflow-hidden transition-all" style={{ border: "1px solid #f0ece8" }}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center gap-4 p-5 text-left hover:bg-gray-50 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#FDF2F4", color: "#8B1A2B" }}>
              {item.icon}
            </div>
            <span className="flex-1 font-bold text-gray-900">{item.q}</span>
            {open === i ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </button>
          {open === i && (
            <div className="px-5 pb-5 ml-14">
              <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default function App() {
  const [tab, setTab] = useState("all");
  const [sort, setSort] = useState("cospa");
  const [priceRange, setPriceRange] = useState("all");
  const [store, setStore] = useState("all");
  const [country, setCountry] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedWine, setSelectedWine] = useState<WineItem | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);
  const filtered = useMemo(() => {
    let list = [...W];
    if (tab !== "all") list = list.filter(w => w.t === tab);
    if (priceRange === "under1500") list = list.filter(w => w.p < 1500);
    else if (priceRange === "1500to2000") list = list.filter(w => w.p >= 1500 && w.p <= 2000);
    else if (priceRange === "over2000") list = list.filter(w => w.p > 2000);
    if (store !== "all") list = list.filter(w => w.s.includes(store));
    if (country !== "all") list = list.filter(w => w.c === country);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(w => w.n.toLowerCase().includes(q) || w.d.toLowerCase().includes(q) || w.g?.toLowerCase().includes(q) || w.f.some(f => f.includes(q)));
    }
    if (sort === "cospa") list.sort((a, b) => cospaScore(b) - cospaScore(a));
    else if (sort === "price_asc") list.sort((a, b) => a.p - b.p);
    else if (sort === "price_desc") list.sort((a, b) => b.p - a.p);
    else if (sort === "rating") list.sort((a, b) => (b.v || 0) - (a.v || 0));
    return list;
  }, [tab, sort, priceRange, store, country, search]);
  const stats = useMemo(() => ({
    total: W.length,
    avgPrice: Math.round(W.reduce((s, w) => s + w.p, 0) / W.length),
    countries: allCountries.length,
    stores: allStores.length,
  }), []);
  const randomWine = useCallback(() => {
    const pool = filtered.length > 0 ? filtered : W;
    setSelectedWine(pool[Math.floor(Math.random() * pool.length)]);
  }, [filtered]);
  const tabItems = [
    { id: "all", label: "すべて", count: W.length },
    { id: "red", label: "赤", icon: "🍷", count: W.filter(w => w.t === "red").length },
    { id: "white", label: "白", icon: "🥂", count: W.filter(w => w.t === "white").length },
    { id: "sparkling", label: "泡", icon: "🍾", count: W.filter(w => w.t === "sparkling").length },
    { id: "rose", label: "ロゼ", icon: "🌸", count: W.filter(w => w.t === "rose").length },
  ];
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FDFAF6" }}>
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
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 shadow-sm" style={{ borderBottom: "1px solid #f0ece8" }}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #8B1A2B, #C4627A)" }}>
              <Wine className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black" style={{ color: "#8B1A2B" }}>ご近所ワイン</h1>
              <p className="text-xs text-gray-400 -mt-0.5 hidden md:block">近所で買うべき最高のワイン</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            {tabItems.map(t => (
              <button key={t.id} onClick={() => { setTab(t.id); setVisibleCount(12); }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${tab === t.id ? "text-white shadow-sm" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"}`}
                style={tab === t.id ? { background: "linear-gradient(135deg, #8B1A2B, #6B1525)" } : {}}>
                {t.icon && <span className="mr-1">{t.icon}</span>}{t.label}
              </button>
            ))}
          </nav>
          <button onClick={randomWine} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:shadow-md min-h-[44px] active:scale-95" style={{ backgroundColor: "#FDF2F4", color: "#8B1A2B" }} aria-label="ランダムにワインを選ぶ">
            <Shuffle className="w-4 h-4" /> 運命の1本
          </button>
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
      <section className="bg-white shadow-sm" style={{ borderBottom: "1px solid #f0ece8" }}>
        <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: <Wine className="w-5 h-5" />, label: "厳選ワイン", value: `${stats.total}本`, color: "#8B1A2B" },
            { icon: <DollarSign className="w-5 h-5" />, label: "平均価格", value: fmt(stats.avgPrice), color: "#ca8a04" },
            { icon: <Globe className="w-5 h-5" />, label: "対象国", value: `${stats.countries}カ国`, color: "#2E7D6B" },
            { icon: <Store className="w-5 h-5" />, label: "取扱店", value: `${stats.stores}店舗`, color: "#4338ca" },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: s.color + "10", color: s.color }}>{s.icon}</div>
              <div>
                <div className="text-lg font-black text-gray-900">{s.value}</div>
                <div className="text-xs text-gray-400">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-10">
        <DinnerMatcher onSelectWine={setSelectedWine} />
        <PromoBanner type="winery" />
        <section id="wines">
          {/* Mobile tabs */}
          <div className="md:hidden flex gap-2 overflow-x-auto pb-3 mb-4 -mx-1 px-1">
            {tabItems.map(t => (
              <button key={t.id} onClick={() => { setTab(t.id); setVisibleCount(12); }}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-bold transition-all ${tab === t.id ? "text-white shadow-sm" : "text-gray-500 bg-white"}`}
                style={tab === t.id ? { background: "linear-gradient(135deg, #8B1A2B, #6B1525)" } : { border: "1px solid #f0ece8" }}>
                {t.icon && <span className="mr-1">{t.icon}</span>}{t.label}<span className="ml-1 text-xs opacity-70">{t.count}</span>
              </button>
            ))}
          </div>
          {/* Search + Filters */}
          <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm" style={{ border: "1px solid #f0ece8" }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="search" inputMode="search" value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="ワイン名・品種・料理名で検索..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 text-base md:text-sm outline-none focus:ring-2 focus:ring-rose-200 transition-all min-h-[44px]"
                  aria-label="ワインを検索"
                />
              </div>
              <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-50 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors min-h-[44px]" aria-expanded={showFilters} aria-label="絞り込みパネルを開閉">
                <Filter className="w-4 h-4" /> 絞り込み {showFilters ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>
            {showFilters && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-fadeIn">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">予算</label>
                  <select value={priceRange} onChange={e => setPriceRange(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-gray-50 text-sm outline-none">
                    <option value="all">すべて</option>
                    <option value="under1500">〜¥1,500</option>
                    <option value="1500to2000">¥1,500〜2,000</option>
                    <option value="over2000">¥2,000〜</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">お店</label>
                  <select value={store} onChange={e => setStore(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-gray-50 text-sm outline-none">
                    <option value="all">すべて</option>
                    {allStores.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">国</label>
                  <select value={country} onChange={e => setCountry(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-gray-50 text-sm outline-none">
                    <option value="all">すべて</option>
                    {allCountries.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">並び替え</label>
                  <select value={sort} onChange={e => setSort(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-gray-50 text-sm outline-none">
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
            <p className="text-sm text-gray-500"><span className="font-bold text-gray-900">{filtered.length}</span> 本のワインが見つかりました</p>
          </div>
          {/* Wine Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.slice(0, visibleCount).map((wine, i) => (
              <WineCard key={wine.n} wine={wine} index={i} onClick={setSelectedWine} isFeatured={i === 0 && tab === "all" && sort === "cospa"} />
            ))}
          </div>
          {/* Load more */}
          {filtered.length > visibleCount && (
            <div className="text-center mt-8">
              <button onClick={() => setVisibleCount(v => v + 12)} className="px-8 py-3 rounded-xl font-bold text-sm transition-all hover:shadow-md" style={{ backgroundColor: "#FDF2F4", color: "#8B1A2B" }}>
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
              <h3 className="text-xl font-black text-gray-900">ワイン選びガイド</h3>
              <p className="text-xs text-gray-400">初心者から中級者まで、知っておきたい基礎知識</p>
            </div>
          </div>
          <GuideSection />
        </section>
        {/* Newsletter */}
        <section className="bg-white rounded-3xl p-8 md:p-12 text-center shadow-sm" style={{ border: "1px solid #f0ece8" }}>
          <div className="max-w-md mx-auto">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "linear-gradient(135deg, #8B1A2B, #C4627A)" }}>
              <Mail className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">毎週おすすめワインをお届け</h3>
            <p className="text-sm text-gray-500 mb-6">新着ワイン・セール情報・季節のペアリングレシピを毎週金曜にお届けします</p>
            <div className="flex gap-2">
              <input type="email" placeholder="メールアドレス" className="flex-1 px-4 py-3 rounded-xl bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-rose-200" />
              <button className="px-6 py-3 rounded-xl font-bold text-white text-sm transition-all hover:shadow-lg" style={{ background: "linear-gradient(135deg, #8B1A2B, #6B1525)" }}>登録</button>
            </div>
            <p className="text-xs text-gray-400 mt-3">いつでも解除できます。スパムは送りません。</p>
          </div>
        </section>
        {/* Partner Section */}
        <section className="bg-white rounded-3xl p-6 md:p-8 shadow-sm" style={{ border: "1px solid #f0ece8" }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #059669, #34d399)" }}>
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-900">パートナー企業様へ</h3>
              <p className="text-xs text-gray-400">ユーザー無料・企業様からの広告で運営しています</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: <Store className="w-6 h-6" />, title: "ストアスポットライト", desc: "御社の店舗をフィーチャー。ワインと店舗を紐づけて認知向上", price: "月額 ¥30,000〜" },
              { icon: <Wine className="w-6 h-6" />, title: "ワイナリー特集", desc: "ワイナリー・インポーターの商品をネイティブ記事で紹介", price: "1記事 ¥50,000〜" },
              { icon: <Gift className="w-6 h-6" />, title: "タイアップ企画", desc: "季節キャンペーン・プレゼント企画で双方のファンを獲得", price: "企画ごとにご相談" },
            ].map((item, i) => (
              <div key={i} className="p-5 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: "#ecfdf5", color: "#059669" }}>{item.icon}</div>
                <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                <p className="text-xs text-gray-500 mb-3">{item.desc}</p>
                <span className="text-sm font-bold" style={{ color: "#059669" }}>{item.price}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
      {/* Footer */}
      <footer className="mt-16" style={{ backgroundColor: "#1A0A10" }}>
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
                  <button key={t.id} onClick={() => { setTab(t.id); setVisibleCount(12); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    className="block text-sm text-gray-400 hover:text-white transition-colors">{t.icon} {t.label}ワイン（{t.count}本）</button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold text-white mb-3">リンク</h4>
              <div className="space-y-2">
                {["ワイン選びガイド", "パートナー企業様へ", "プライバシーポリシー", "お問い合わせ"].map(l => (
                  <a key={l} href="#" className="block text-sm text-gray-400 hover:text-white transition-colors">{l}</a>
                ))}
              </div>
            </div>
          </div>
          <div className="pt-8 text-center" style={{ borderTop: "1px solid #2D1520" }}>
            <p className="text-xs text-gray-500">
              &copy; 2026 ご近所ワイン. 価格は参考値です。最新の価格は各店舗でご確認ください。
            </p>
            <p className="text-xs text-gray-600 mt-1">Vivinoスコアは各ワインのVivino公式ページの値を参照しています。</p>
          </div>
        </div>
      </footer>
      <WineModal wine={selectedWine} onClose={() => setSelectedWine(null)} />
      <AiSommelier />
    </div>
  );
}
