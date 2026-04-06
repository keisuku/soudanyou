"use client";
import { useState, useMemo, useCallback } from "react";
import { Search, Wine, Star, ShoppingBag, ChevronDown, ChevronUp, X, Sparkles, ArrowRight, Filter, Globe, Store, Utensils, TrendingUp, Gift, Mail, ExternalLink, Shuffle, Clock, Award, DollarSign, BarChart3 } from "lucide-react";

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

const typeMap: Record<string, { label: string; color: string; bg: string; icon: string }> = { red: { label: "赤", color: "#7B2D3B", bg: "#F8F0F2", icon: "🍷" }, white: { label: "白", color: "#8A7A3E", bg: "#F8F6EE", icon: "🥂" }, sparkling: { label: "泡", color: "#3D7A8A", bg: "#EEF6F8", icon: "🍾" }, rose: { label: "ロゼ", color: "#9E5A6E", bg: "#F8EEF2", icon: "🌸" }};
const allStores = [...new Set(W.flatMap(w => w.s))].sort();
const allCountries = [...new Set(W.map(w => w.c))].sort();
const cospaScore = (w: typeof W[number]) => w.v ? Math.round((w.v / 5) * 100 * (3000 / w.p)) : Math.round(60 * (3000 / w.p));
const fmt = (p: number) => "¥" + p.toLocaleString();

const Badge = ({ children, color = "#7B2D3B", bg = "#F8F0F2", className = "" }: { children: React.ReactNode; color?: string; bg?: string; className?: string }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-semibold tracking-wide uppercase ${className}`} style={{ color, backgroundColor: bg }}>{children}</span>
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
  const color = clampedScore > 80 ? "#3d7a5a" : clampedScore > 60 ? "#9a7a2a" : "#a04040";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1 bg-stone-100 rounded overflow-hidden">
        <div className="h-full rounded transition-all duration-500" style={{ width: `${clampedScore}%`, backgroundColor: color }} />
      </div>
      <span className="text-[11px] font-bold tabular-nums" style={{ color }}>{clampedScore}</span>
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
      className={`group relative bg-white rounded-lg overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${isFeatured ? "md:col-span-2 md:row-span-2" : ""}`}
      style={{ border: "1px solid #e5ddd3" }}
    >
      {/* Top color accent line */}
      <div className="h-0.5" style={{ backgroundColor: ti.color }} />
      {isFeatured && (
        <div className="absolute top-4 left-4 z-10">
          <Badge color="#fff" bg="#7B2D3B"><Sparkles className="w-3 h-3 mr-1" />PICK</Badge>
        </div>
      )}
      {index !== undefined && (
        <div className="absolute top-4 right-4 z-10 text-[11px] font-bold tabular-nums" style={{ color: ti.color }}>
          #{index + 1}
        </div>
      )}
      <div className={`relative ${isFeatured ? "p-7" : "p-5"}`}>
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-2">
            <Badge color={ti.color} bg={ti.bg}>{ti.icon} {ti.label}</Badge>
            <span className="text-[11px] text-stone-400">{wine.a}%</span>
            <span className="text-[11px] text-stone-400">{wine.c}</span>
          </div>
          <h3 className={`font-bold text-stone-900 leading-snug group-hover:text-[#7B2D3B] transition-colors ${isFeatured ? "text-xl font-display" : "text-sm"}`}>
            {wine.n}
          </h3>
        </div>
        <p className={`text-stone-500 leading-relaxed mb-4 ${isFeatured ? "text-sm" : "text-xs line-clamp-2"}`}>{wine.d}</p>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {wine.f.map((food, i) => (
            <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50/80 text-amber-800 rounded text-[11px]">
              <Utensils className="w-2.5 h-2.5" />{food}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-1 mb-4">
          {wine.s.map((store, i) => (
            <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 bg-stone-50 text-stone-600 rounded text-[11px]">
              <Store className="w-2.5 h-2.5" />{store}
            </span>
          ))}
        </div>
        <div className="flex items-end justify-between pt-3 border-t border-stone-100">
          <div className="flex-1 mr-4">
            <div className="text-[10px] text-stone-400 mb-1 uppercase tracking-wider">コスパ</div>
            <CospaBar score={cp} />
          </div>
          <div className="text-right shrink-0">
            <div className="flex items-center gap-2 justify-end mb-1">
              {wine.v && <StarRating score={wine.v} />}
            </div>
            <div className={`font-black tabular-nums ${isFeatured ? "text-2xl" : "text-lg"}`} style={{ color: "#7B2D3B" }}>{fmt(wine.p)}</div>
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
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-3 z-10 w-8 h-8 rounded flex items-center justify-center bg-stone-100 hover:bg-stone-200 transition-colors">
          <X className="w-4 h-4 text-stone-500" />
        </button>
        <div className="p-5 border-b border-stone-100">
          <div className="flex items-center gap-2 mb-2">
            <Badge color={ti.color} bg={ti.bg}>{ti.icon} {ti.label}</Badge>
            <span className="text-[11px] text-stone-400">{wine.a}% ・ {wine.c}</span>
            {wine.g && <span className="text-[11px] text-stone-400">・ {wine.g}</span>}
          </div>
          <h2 className="text-xl font-display font-bold text-stone-900">{wine.n}</h2>
        </div>
        <div className="p-5 space-y-5">
          <p className="text-stone-600 text-sm leading-relaxed">{wine.d}</p>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-stone-50 rounded p-3 text-center">
              <div className="text-xl font-bold tabular-nums" style={{ color: "#7B2D3B" }}>{fmt(wine.p)}</div>
              <div className="text-[10px] text-stone-400 mt-1 uppercase tracking-wider">価格</div>
            </div>
            <div className="bg-stone-50 rounded p-3 text-center">
              <div className="text-xl font-bold text-amber-700 tabular-nums">{wine.v || "—"}</div>
              <div className="text-[10px] text-stone-400 mt-1 uppercase tracking-wider">Vivino</div>
            </div>
            <div className="bg-stone-50 rounded p-3 text-center">
              <div className="text-xl font-bold text-emerald-700 tabular-nums">{cp}</div>
              <div className="text-[10px] text-stone-400 mt-1 uppercase tracking-wider">コスパ</div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-stone-900 mb-2 text-sm flex items-center gap-2"><Utensils className="w-3.5 h-3.5" />おすすめペアリング</h4>
            <div className="flex flex-wrap gap-1.5">
              {wine.f.map((food, i) => (
                <span key={i} className="px-2.5 py-1 bg-amber-50/80 text-amber-800 rounded text-sm">{food}</span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-stone-900 mb-2 text-sm flex items-center gap-2"><ShoppingBag className="w-3.5 h-3.5" />購入できるお店</h4>
            <div className="flex flex-wrap gap-1.5">
              {wine.s.map((store, i) => (
                <span key={i} className="px-2.5 py-1 bg-stone-50 text-stone-700 rounded text-sm border border-stone-200">{store}</span>
              ))}
            </div>
          </div>
          <button className="w-full py-2.5 rounded font-semibold text-white text-sm transition-all hover:opacity-90 flex items-center justify-center gap-2" style={{ backgroundColor: "#7B2D3B" }}>
            <ExternalLink className="w-3.5 h-3.5" />楽天で探す
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
    <div className="bg-white rounded-lg p-6 md:p-8" style={{ border: "1px solid #e5ddd3" }}>
      <div className="mb-6">
        <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-stone-400 mb-1">PAIRING</p>
        <h3 className="text-lg font-display font-bold text-stone-900">今夜の献立からワインを探す</h3>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-6">
        {dinnerOptions.map((opt, i) => (
          <button
            key={i}
            onClick={() => setSelected(selected === i ? null : i)}
            className={`p-3 rounded-lg text-center transition-all ${selected === i ? "" : "hover:bg-stone-50"}`}
            style={selected === i ? { backgroundColor: "#F8F0F2", border: "1px solid #7B2D3B" } : { border: "1px solid #e5ddd3" }}
          >
            <div className="text-2xl mb-1">{opt.icon}</div>
            <div className="text-[11px] font-medium text-stone-700">{opt.label}</div>
          </button>
        ))}
      </div>
      {matches.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 animate-fadeIn">
          {matches.map((w, i) => (
            <div key={i} onClick={() => onSelectWine(w)} className="flex items-center gap-3 p-3 rounded-lg border border-stone-100 hover:border-stone-200 cursor-pointer transition-colors">
              <span className="text-lg">{typeMap[w.t].icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-stone-900 truncate">{w.n}</div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold tabular-nums" style={{ color: "#7B2D3B" }}>{fmt(w.p)}</span>
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
      <div className="relative overflow-hidden rounded-lg p-6 md:p-8" style={{ backgroundColor: "#1c2433" }}>
        <div className="absolute top-3 right-3 text-[10px] tracking-wider uppercase text-white/30">AD</div>
        <div className="relative z-10">
          <p className="text-[11px] font-semibold tracking-[0.15em] uppercase mb-3" style={{ color: "#7aa2c4" }}>STORE SPOTLIGHT</p>
          <h3 className="text-lg font-display font-bold text-white mb-2">成城石井のワインセレクション</h3>
          <p className="text-stone-400 text-sm mb-5">厳選されたワインを日常に。今月のおすすめワインをチェック</p>
          <button className="px-4 py-2 bg-white text-stone-900 rounded text-sm font-semibold hover:bg-stone-100 transition-colors flex items-center gap-2">
            おすすめを見る <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="relative overflow-hidden rounded-lg p-6 md:p-8" style={{ backgroundColor: "#2c1620" }}>
      <div className="absolute top-3 right-3 text-[10px] tracking-wider uppercase text-white/30">AD</div>
      <div className="relative z-10">
        <p className="text-[11px] font-semibold tracking-[0.15em] uppercase mb-3" style={{ color: "#c8956c" }}>PARTNER WINERY</p>
        <h3 className="text-lg font-display font-bold text-white mb-2">南アフリカワインの魅力を発見</h3>
        <p className="text-stone-400 text-sm mb-5">世界が注目するコスパ最強のワイン産地。この春おすすめの3本</p>
        <button className="px-4 py-2 border border-stone-600 text-white rounded text-sm font-semibold hover:bg-white/10 transition-colors flex items-center gap-2">
          特集を読む <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
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
    <div className="space-y-2">
      {guideItems.map((item, i) => (
        <div key={i} className="bg-white rounded-lg overflow-hidden transition-all" style={{ border: "1px solid #e5ddd3" }}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center gap-3 p-4 text-left hover:bg-stone-50 transition-colors"
          >
            <div className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0 text-stone-500 bg-stone-50">
              {item.icon}
            </div>
            <span className="flex-1 font-semibold text-stone-900 text-sm">{item.q}</span>
            {open === i ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
          </button>
          {open === i && (
            <div className="px-4 pb-4 ml-11">
              <p className="text-sm text-stone-500 leading-relaxed">{item.a}</p>
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
    <div className="min-h-screen" style={{ backgroundColor: "#faf8f5" }}>
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/90" style={{ borderBottom: "1px solid #e5ddd3" }}>
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Wine className="w-5 h-5" style={{ color: "#7B2D3B" }} />
            <span className="text-base font-bold font-display tracking-tight" style={{ color: "#7B2D3B" }}>ご近所ワイン</span>
          </div>
          <nav className="hidden md:flex items-center gap-0.5">
            {tabItems.map(t => (
              <button key={t.id} onClick={() => { setTab(t.id); setVisibleCount(12); }}
                className={`px-3 py-1.5 rounded text-sm transition-all ${tab === t.id ? "font-bold text-stone-900 bg-stone-100" : "text-stone-500 hover:text-stone-900"}`}>
                {t.icon && <span className="mr-1">{t.icon}</span>}{t.label}
              </button>
            ))}
          </nav>
          <button onClick={randomWine} className="flex items-center gap-1.5 px-3 py-1.5 rounded border text-sm font-medium transition-all hover:bg-stone-50" style={{ borderColor: "#e5ddd3", color: "#7B2D3B" }}>
            <Shuffle className="w-3.5 h-3.5" /> 運命の1本
          </button>
        </div>
      </header>
      {/* Hero */}
      <section className="relative overflow-hidden bg-texture" style={{ background: "#2c1620" }}>
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle at 20% 80%, #c8956c 0%, transparent 40%), radial-gradient(circle at 80% 20%, #7B2D3B 0%, transparent 40%)" }} />
        <div className="relative max-w-6xl mx-auto px-4 py-14 md:py-20">
          <div className="max-w-xl">
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#c8956c" }}>
              {stats.total} wines ・ {stats.countries} countries ・ {stats.stores} stores
            </p>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white leading-tight mb-4 tracking-tight">
              近所で買うべき、<br />最高のワイン。
            </h2>
            <p className="text-base text-stone-400 mb-8 leading-relaxed max-w-md">
              コンビニ・スーパーで手に入る厳選ワインを、コスパと話題度でランキング。今夜の1本がすぐ見つかる。
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#wines" className="px-5 py-2.5 rounded text-sm font-bold text-white flex items-center gap-2 transition-all hover:opacity-90" style={{ backgroundColor: "#7B2D3B" }}>
                ワインを探す <ArrowRight className="w-4 h-4" />
              </a>
              <a href="#guide" className="px-5 py-2.5 rounded text-sm font-medium text-stone-400 border border-stone-700 flex items-center gap-2 hover:text-white hover:border-stone-500 transition-all">
                初心者ガイド
              </a>
            </div>
          </div>
        </div>
      </section>
      {/* Stats Bar */}
      <section className="bg-white" style={{ borderBottom: "1px solid #e5ddd3" }}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-center gap-6 md:gap-10 text-sm">
          {[
            { label: "厳選", value: `${stats.total}本` },
            { label: "平均", value: fmt(stats.avgPrice) },
            { label: "産地", value: `${stats.countries}カ国` },
            { label: "取扱", value: `${stats.stores}店舗` },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span className="text-stone-400 text-xs">{s.label}</span>
              <span className="font-bold text-stone-800 tabular-nums">{s.value}</span>
            </div>
          ))}
        </div>
      </section>
      <main className="max-w-6xl mx-auto px-4 py-10 space-y-12">
        <DinnerMatcher onSelectWine={setSelectedWine} />
        <PromoBanner type="winery" />
        <section id="wines">
          {/* Mobile tabs */}
          <div className="md:hidden flex gap-1.5 overflow-x-auto pb-3 mb-4 -mx-1 px-1">
            {tabItems.map(t => (
              <button key={t.id} onClick={() => { setTab(t.id); setVisibleCount(12); }}
                className={`flex-shrink-0 px-3 py-1.5 rounded text-sm transition-all ${tab === t.id ? "font-bold text-white" : "text-stone-500 bg-white"}`}
                style={tab === t.id ? { backgroundColor: "#7B2D3B" } : { border: "1px solid #e5ddd3" }}>
                {t.icon && <span className="mr-1">{t.icon}</span>}{t.label}<span className="ml-1 text-xs opacity-60">{t.count}</span>
              </button>
            ))}
          </div>
          {/* Search + Filters */}
          <div className="bg-white rounded-lg p-4 mb-6" style={{ border: "1px solid #e5ddd3" }}>
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text" value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="ワイン名・品種・料理名で検索..."
                  className="w-full pl-10 pr-4 py-2 rounded border border-stone-200 bg-stone-50 text-sm outline-none focus:border-stone-400 transition-all"
                />
              </div>
              <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-1.5 px-3 py-2 rounded border border-stone-200 text-sm text-stone-600 hover:bg-stone-50 transition-colors">
                <Filter className="w-3.5 h-3.5" /> 絞り込み {showFilters ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>
            {showFilters && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 pt-3 border-t border-stone-100 animate-fadeIn">
                <div>
                  <label className="text-[11px] text-stone-400 mb-1 block uppercase tracking-wider">予算</label>
                  <select value={priceRange} onChange={e => setPriceRange(e.target.value)} className="w-full px-3 py-2 rounded border border-stone-200 bg-white text-sm outline-none">
                    <option value="all">すべて</option>
                    <option value="under1500">〜¥1,500</option>
                    <option value="1500to2000">¥1,500〜2,000</option>
                    <option value="over2000">¥2,000〜</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-stone-400 mb-1 block uppercase tracking-wider">お店</label>
                  <select value={store} onChange={e => setStore(e.target.value)} className="w-full px-3 py-2 rounded border border-stone-200 bg-white text-sm outline-none">
                    <option value="all">すべて</option>
                    {allStores.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-stone-400 mb-1 block uppercase tracking-wider">国</label>
                  <select value={country} onChange={e => setCountry(e.target.value)} className="w-full px-3 py-2 rounded border border-stone-200 bg-white text-sm outline-none">
                    <option value="all">すべて</option>
                    {allCountries.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-stone-400 mb-1 block uppercase tracking-wider">並び替え</label>
                  <select value={sort} onChange={e => setSort(e.target.value)} className="w-full px-3 py-2 rounded border border-stone-200 bg-white text-sm outline-none">
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
            <p className="text-sm text-stone-500"><span className="font-bold text-stone-800 tabular-nums">{filtered.length}</span> 本</p>
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
              <button onClick={() => setVisibleCount(v => v + 12)} className="px-6 py-2.5 rounded border text-sm font-semibold transition-all hover:bg-stone-50" style={{ borderColor: "#e5ddd3", color: "#7B2D3B" }}>
                もっと見る（残り {filtered.length - visibleCount} 本）
              </button>
            </div>
          )}
        </section>
        <PromoBanner type="store" />
        {/* Guide */}
        <section id="guide">
          <div className="mb-6">
            <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-stone-400 mb-1">GUIDE</p>
            <h3 className="text-lg font-display font-bold text-stone-900">ワイン選びガイド</h3>
          </div>
          <GuideSection />
        </section>
        {/* Newsletter */}
        <section className="bg-white rounded-lg p-8 md:p-10 text-center" style={{ border: "1px solid #e5ddd3" }}>
          <div className="max-w-sm mx-auto">
            <Mail className="w-5 h-5 mx-auto mb-4 text-stone-400" />
            <h3 className="text-lg font-display font-bold text-stone-900 mb-2">毎週おすすめワインをお届け</h3>
            <p className="text-sm text-stone-500 mb-6">新着・セール情報・ペアリングレシピを毎週金曜に。</p>
            <div className="flex gap-2">
              <input type="email" placeholder="メールアドレス" className="flex-1 px-4 py-2.5 rounded border border-stone-200 bg-stone-50 text-sm outline-none focus:border-stone-400" />
              <button className="px-5 py-2.5 rounded text-sm font-semibold text-white transition-all hover:opacity-90" style={{ backgroundColor: "#7B2D3B" }}>登録</button>
            </div>
            <p className="text-[11px] text-stone-400 mt-3">いつでも解除できます。</p>
          </div>
        </section>
        {/* Partner Section */}
        <section className="bg-white rounded-lg p-6 md:p-8" style={{ border: "1px solid #e5ddd3" }}>
          <div className="mb-6">
            <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-stone-400 mb-1">PARTNERSHIP</p>
            <h3 className="text-lg font-display font-bold text-stone-900">パートナー企業様へ</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: <Store className="w-5 h-5" />, title: "ストアスポットライト", desc: "御社の店舗をフィーチャー。ワインと店舗を紐づけて認知向上", price: "月額 ¥30,000〜" },
              { icon: <Wine className="w-5 h-5" />, title: "ワイナリー特集", desc: "ワイナリー・インポーターの商品をネイティブ記事で紹介", price: "1記事 ¥50,000〜" },
              { icon: <Gift className="w-5 h-5" />, title: "タイアップ企画", desc: "季節キャンペーン・プレゼント企画で双方のファンを獲得", price: "企画ごとにご相談" },
            ].map((item, i) => (
              <div key={i} className="p-5 rounded-lg bg-stone-50 hover:bg-stone-100 transition-colors">
                <div className="w-9 h-9 rounded flex items-center justify-center mb-3 text-stone-500 bg-white border border-stone-200">{item.icon}</div>
                <h4 className="font-semibold text-stone-900 mb-1 text-sm">{item.title}</h4>
                <p className="text-xs text-stone-500 mb-3">{item.desc}</p>
                <span className="text-sm font-bold" style={{ color: "#7B2D3B" }}>{item.price}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
      {/* Footer */}
      <footer className="mt-16 border-t" style={{ borderColor: "#e5ddd3", backgroundColor: "#faf8f5" }}>
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <Wine className="w-4 h-4" style={{ color: "#7B2D3B" }} />
                <span className="text-sm font-bold font-display" style={{ color: "#7B2D3B" }}>ご近所ワイン</span>
              </div>
              <p className="text-sm text-stone-500 leading-relaxed max-w-sm">
                コンビニ・スーパーで買える手頃なワインを、コスパと話題度で厳選して紹介するサイトです。
              </p>
            </div>
            <div>
              <h4 className="text-[11px] font-semibold tracking-[0.15em] uppercase text-stone-400 mb-3">カテゴリ</h4>
              <div className="space-y-2">
                {tabItems.slice(1).map(t => (
                  <button key={t.id} onClick={() => { setTab(t.id); setVisibleCount(12); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    className="block text-sm text-stone-500 hover:text-stone-900 transition-colors">{t.icon} {t.label}（{t.count}）</button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-[11px] font-semibold tracking-[0.15em] uppercase text-stone-400 mb-3">リンク</h4>
              <div className="space-y-2">
                {["ワイン選びガイド", "パートナー企業様へ", "プライバシーポリシー", "お問い合わせ"].map(l => (
                  <a key={l} href="#" className="block text-sm text-stone-500 hover:text-stone-900 transition-colors">{l}</a>
                ))}
              </div>
            </div>
          </div>
          <div className="pt-6 border-t border-stone-200 text-center">
            <p className="text-[11px] text-stone-400">
              &copy; 2026 ご近所ワイン — 価格は参考値です。Vivinoスコアは各ワインのVivino公式ページの値を参照しています。
            </p>
          </div>
        </div>
      </footer>
      <WineModal wine={selectedWine} onClose={() => setSelectedWine(null)} />
    </div>
  );
}
