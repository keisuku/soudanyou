# Soudanyou Prompt Library

## Homepage / LP Improvement
```text
Improve the soudanyou homepage while preserving the existing Next.js/Tailwind/component patterns.

Inputs:
- target user:
- page goal:
- section or route:
- required copy:
- reference image or design doc:
- KPI:

Required flow:
1. Read AGENTS.md and docs/design/.
2. Update PLAN.md.
3. Implement the smallest coherent change.
4. Run npm run lint and npm run build when feasible.
5. Inspect desktop and mobile browser output.
6. Update ASSUMPTIONS.md and CHANGELOG_LOCAL.md.
```

## Wine Data Addition
```text
Add or update a wine in soudanyou.

Inputs:
- wine name:
- producer:
- region/country:
- grapes:
- price range:
- shop/source:
- source URLs:

Rules:
- Edit content/wines/*.yaml, not src/lib/__generated__/wines.json.
- Run npm run wines:build.
- If facts are uncertain, record them in memory/research/ instead of presenting them as canon.
- Include source URLs and retrieved date.
```

## Wine Research
```text
Research this wine for soudanyou and separate facts from inference.

Output:
1. legal/region classification
2. producer
3. grapes
4. vinification/aging
5. likely taste profile
6. pairing and target user
7. buyability in Japan if sourced
8. source URLs
9. uncertainty
```

## Static Deploy Review
```text
Review soudanyou for GitHub Pages deployment safety.

Check:
- next.config.ts static export/base path behavior
- .github/workflows/deploy.yml
- npm run build output
- public asset paths
- routes that may break in static export
- any environment variables required at build time
```
