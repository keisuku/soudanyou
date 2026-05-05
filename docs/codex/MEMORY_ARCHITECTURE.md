# Memory Architecture

## Namespaces
| Namespace | Purpose |
|---|---|
| `memory/research/` | Wine facts, source logs, availability notes |
| `memory/metrics/` | Traffic, SEO, CWV, conversion, deployment health |
| `memory/prompts/` | Reusable prompts that worked well |
| `memory/canon/` | Site positioning, editorial rules, fixed brand decisions |

## Research Record Template
```text
Title:
Wine ID:
Namespace:
Summary:
Facts:
Inferences:
Uncertainties:
Sources:
Retrieved at:
Confidence:
Next action:
```

## Update Rules
- Keep raw source references; do not overwrite them with summaries only.
- Do not store secrets or private customer data.
- Do not treat generated or inferred wine facts as verified.
- For source wine data, update YAML and regenerate catalog instead of storing operational truth only in memory.

## Retrieval Guidance
- Wine names, regions, producers, and Japanese shop names need exact matching as well as semantic search.
- If this grows into a DB/RAG setup, use hybrid dense + sparse retrieval.
- Chunk long research notes around 600-900 tokens with source URL retained in each chunk.
