# Soudanyou Codex Operating System

## North Star
Make soudanyou faster to improve without losing reliability: small diffs, verified static builds, clean wine data, and reusable learning.

## Core Loop
1. Gather context from existing files, `docs/design/`, `content/wines/`, and `memory/`.
2. Update `PLAN.md` for non-trivial work.
3. Implement narrowly using existing components and data shapes.
4. Validate with the smallest useful command set.
5. Update `ASSUMPTIONS.md`, `CHANGELOG_LOCAL.md`, and relevant `memory/` files.

## Project Shape
| Area | Files |
|---|---|
| App routes | `src/app/` |
| UI components | `src/components/` |
| Wine data | `content/wines/*.yaml` |
| Generated catalog | `src/lib/__generated__/wines.json` |
| Build scripts | `scripts/` |
| Design notes/assets | `docs/design/`, `public/images/` |
| Static deploy | `.github/workflows/deploy.yml` |

## Validation Routing
| Change Type | Validation |
|---|---|
| Wine YAML | `npm run wines:build` |
| Type/data logic | `npm run wines:build`, `npm run lint` |
| UI/component | `npm run lint`, `npm run build` |
| Homepage/LP | build plus desktop/mobile browser QA |
| Deploy config | inspect GitHub Actions workflow and run build when possible |

## Website Rules
- Preserve GitHub Pages static export behavior.
- Confirm `/soudanyou` path expectations for local and published routes.
- Keep user-facing Japanese text as real text where possible.
- Do not use generated images as a substitute for accessible navigation, CTAs, or important copy.
- When touching wine detail pages, verify at least one representative route.

## Wine Research Rules
- Prefer official bodies, producer sheets, importers, and clearly dated sources.
- Store reusable research summaries in `memory/research/`.
- Separate facts, inference, uncertainty, and source URLs.
- Do not invent vintages, prices, shop availability, or awards.

## Monthly Maintenance
- Review repeated Codex mistakes and tighten `AGENTS.md`.
- Move reusable prompts into `memory/prompts/registry.md`.
- Refresh KPI baseline in `docs/codex/KPI_BENCHMARKS.md`.
