import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";
import { wineSchema } from "../src/lib/wine-schema";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.resolve(__dirname, "../content/wines");
const OUTPUT_FILE = path.resolve(__dirname, "../src/lib/__generated__/wines.json");

const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".yaml"));

if (files.length === 0) {
  console.error("No YAML files found in content/wines/");
  process.exit(1);
}

const wines: unknown[] = [];
const errors: string[] = [];

for (const file of files) {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf-8");
  const data = parse(raw);

  const result = wineSchema.safeParse(data);
  if (!result.success) {
    errors.push(`${file}: ${result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", ")}`);
  } else {
    wines.push(result.data);
  }
}

if (errors.length > 0) {
  console.error("Validation errors:");
  errors.forEach((e) => console.error(`  - ${e}`));
  process.exit(1);
}

fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(wines, null, 2));
console.log(`Built ${wines.length} wines → ${OUTPUT_FILE}`);
