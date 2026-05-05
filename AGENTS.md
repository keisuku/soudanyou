<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes - APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AGENTS.md

## Purpose
This repository powers `soudanyou`, a Next.js wine discovery site for GitHub Pages.
Treat Codex work here as a reproducible loop: plan, change narrowly, verify, and record the learning.

## Source Of Truth
- Wine data: `content/wines/*.yaml`
- Generated catalog: `src/lib/__generated__/wines.json`
- Wine schema/build logic: `src/lib/wine-schema.ts`, `scripts/build-wines.ts`
- Homepage design context: `docs/design/`
- Operations notes: `docs/`
- Codex operating docs: `docs/codex/`
- Durable memory: `memory/`

## Required Flow
1. For non-trivial work, update `PLAN.md` before editing.
2. Keep diffs small and reuse existing components, data shapes, design tokens, and Next.js conventions.
3. Do not edit generated wine JSON directly; update `content/wines/*.yaml` and run `npm run wines:build`.
4. Run validation that matches the change:
   - data change: `npm run wines:build`
   - code/UI change: `npm run lint` and usually `npm run build`
   - homepage/LP change: browser QA at desktop and mobile widths
5. Record assumptions in `ASSUMPTIONS.md`.
6. Record completed work and validation in `CHANGELOG_LOCAL.md`.

## Soudanyou-Specific Rules
- Preserve static export compatibility for GitHub Pages.
- Use `/soudanyou` as the local/base path expectation when checking routed pages.
- Keep real UI text in code/CSS, not baked into generated images.
- For wine research, prefer official sources, producer technical sheets, importers, and clearly labeled uncertainty.
- For Japanese copy, avoid mojibake and verify rendered output when touching user-facing text.
- Never commit real API keys or `.env.local`; use `.env.example` only for placeholder names.

## Defined Commands
- install: `npm ci`
- dev: `npm run dev`
- wine data build: `npm run wines:build`
- lint: `npm run lint`
- build: `npm run build`

## Done Means
- Diff is narrow.
- Generated data is refreshed when source wine YAML changes.
- Relevant checks pass or blocked checks are documented.
- Visual changes are inspected in a real browser.
- Assumptions and follow-up risks are written down.
