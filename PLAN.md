# PLAN.md

## Current Goal
Install a reusable Codex OS layer for soudanyou so future GitHub work follows the same plan -> implement -> verify -> record loop.

## Checklist
- [x] Inspect repository structure and existing agent rules.
- [x] Preserve the existing Next.js warning in `AGENTS.md`.
- [x] Add repo-level `.codex/config.toml`.
- [x] Add Codex operating docs, prompts, memory namespaces, and health check.
- [x] Run `tools/codex-health-check.ps1`.
- [x] Run available project validation.
- [x] Commit and push branch `codex/codex-os-bootstrap`.
- [x] Open draft PR `https://github.com/keisuku/soudanyou/pull/38`.

## Project Validation Baseline
- `npm run wines:build`
- `npm run lint`
- `npm run build`

## Validation Results
- `tools/codex-health-check.ps1`: passed.
- `npm.cmd run wines:build`: passed after running outside sandbox because npm cache access was blocked in sandbox.
- `npm.cmd run lint`: passed.
- `npm.cmd run build`: passed.
- `npm.cmd ci`: completed; npm reported 4 existing dependency vulnerabilities, not changed in this rollout.

## Future Rollout
- Connect GitHub Pages/Actions status to Codex review.
- Add Playwright or browser QA for the homepage and `/wines/[id]` pages.
- Move durable wine research notes into `memory/research/`.
- Promote repeated homepage/LP work into a focused skill when stable.
