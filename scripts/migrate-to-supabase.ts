/**
 * YAML → Supabase 移行スクリプト
 *
 * 使い方:
 *   1. .env.local に NEXT_PUBLIC_SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEY を設定
 *   2. Supabase SQL Editor で supabase/migrations/001_initial_schema.sql を実行
 *   3. npx tsx scripts/migrate-to-supabase.ts
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { parse } from "yaml";
import { wineSchema } from "../src/lib/wine-schema";

const WINES_DIR = join(__dirname, "..", "content", "wines");

// Supabase service client
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("❌ .env.local に NEXT_PUBLIC_SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEY を設定してください");
  process.exit(1);
}

const supabase = createClient(url, key);

async function main() {
  const files = readdirSync(WINES_DIR).filter((f) => f.endsWith(".yaml"));
  console.log(`📦 ${files.length} 件のYAMLファイルを読み込み中...\n`);

  let success = 0;
  let failed = 0;

  for (const file of files) {
    const raw = readFileSync(join(WINES_DIR, file), "utf-8");
    const parsed = parse(raw);
    const result = wineSchema.safeParse(parsed);

    if (!result.success) {
      console.error(`❌ ${file}: バリデーションエラー`, result.error.format());
      failed++;
      continue;
    }

    const wine = result.data;

    // wines テーブルに upsert
    const { error: wineError } = await supabase.from("wines").upsert({
      id: wine.id,
      name: wine.name,
      name_ja: wine.nameJa,
      producer: wine.producer,
      country: wine.country,
      country_code: wine.countryCode,
      region: wine.region ?? null,
      type: wine.type,
      grape_varieties: wine.grapeVarieties,
      description: wine.description,
      price: wine.price,
      abv: wine.abv,
      serving_temp: wine.servingTemp,
      pairings: wine.pairings,
      tags: wine.tags,
      why_buy_now: wine.whyBuyNow,
      buzz_score: wine.buzzScore,
      vivino_score: wine.vivinoScore,
      cost_performance: wine.costPerformance,
      tweet_urls: wine.tweetUrls,
      status: "published",
    });

    if (wineError) {
      console.error(`❌ ${file}: wines INSERT エラー`, wineError.message);
      failed++;
      continue;
    }

    // wine_stores テーブル（既存削除→再挿入）
    await supabase.from("wine_stores").delete().eq("wine_id", wine.id);
    if (wine.stores.length > 0) {
      const { error: storeError } = await supabase.from("wine_stores").insert(
        wine.stores.map((s) => ({
          wine_id: wine.id,
          store_type: s.type,
          store_name: s.name,
          price: s.price,
          in_stock: s.inStock,
        }))
      );
      if (storeError) {
        console.error(`⚠️  ${file}: wine_stores INSERT エラー`, storeError.message);
      }
    }

    // buy_links テーブル
    await supabase.from("buy_links").delete().eq("wine_id", wine.id);
    if (wine.buyLinks.length > 0) {
      const { error: linkError } = await supabase.from("buy_links").insert(
        wine.buyLinks.map((b) => ({
          wine_id: wine.id,
          store: b.store,
          url: b.url,
          price: b.price,
        }))
      );
      if (linkError) {
        console.error(`⚠️  ${file}: buy_links INSERT エラー`, linkError.message);
      }
    }

    console.log(`✅ ${wine.id} (${wine.nameJa})`);
    success++;
  }

  console.log(`\n🎉 完了: ${success} 件成功, ${failed} 件失敗`);
}

main().catch(console.error);
