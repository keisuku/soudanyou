---
name: lp-image-builder
description: Build high-converting image-based landing pages end-to-end from brief user input. Use when asked to create or automate LP production for products, events, campaigns, or services, including: (1) copy and section planning, (2) unified style guide creation, (3) paired desktop/mobile image generation prompts per section, (4) responsive HTML/CSS assembly with seamless section blending at image boundaries.
---

# LP Image Builder

## Execute the workflow in order

1. Create structure and copy.
2. Create a visual style guide.
3. Generate section images (desktop + mobile pair for every section).
4. Build responsive HTML/CSS with seamless transitions.

Do not skip steps unless the user explicitly provides completed artifacts.

## Step 1: Structure and copy

- Extract target audience, problem, desired outcome, offer, proof, CTA.
- Define LP concept in one sentence.
- Produce section outline in this order unless user requests otherwise:
  - Hero / First View
  - Empathy / Problem
  - Benefits
  - Solution
  - Features
  - Authority / Trust
  - Testimonials
  - Offer / Bonus
  - Pricing
  - Final CTA
- Write concise copy blocks for each section:
  - headline
  - subheadline
  - support bullets (2-4)
  - CTA text where relevant

## Step 2: Style guide (single source of truth)

Create a style guide before image generation. Include:

- Aspect ratios:
  - Desktop key visual: 16:9 or 3:2
  - Mobile key visual: 9:16 or 4:5
  - Long section canvases can use vertical crops with consistent margin rhythm
- Tone and manner: adjectives + forbidden styles
- Color system: primary/secondary/accent/background/text
- Typography direction: headline/body personality and weight balance
- Composition rules: spacing density, focal hierarchy, subject distance
- Image continuity rules: lighting direction, contrast level, grain/noise policy

Require every later prompt to restate or reference this style guide explicitly.

## Step 3: Image generation rules (desktop/mobile paired)

For each section from top to bottom:

- Always generate two variants with the same narrative tone:
  - Desktop layout image
  - Mobile layout image
- Keep content equivalent while optimizing composition for width.
- Product exposure policy:
  - Allow direct product visuals only in Hero and Product/Solution-intro sections.
  - In Empathy/Benefits/Proof sections, prioritize people, contexts, outcomes, and emotional scenes.
- For each image prompt, specify:
  - section goal
  - required text area safe-zones
  - subject, setting, action
  - camera distance/angle
  - palette from style guide
  - exclusions (no logo distortion, no extra text artifacts, no unrelated objects)

Output a section-by-section prompt table with columns:
`section | purpose | desktop prompt | mobile prompt | product exposure allowed (yes/no)`

## Step 4: HTML/CSS assembly

Implement a vertical image-based LP with responsive switching:

- Use `<picture>` or CSS media queries to switch desktop/mobile images automatically.
- Keep semantic wrappers per section.
- Ensure full-width responsive scaling with capped max-width container strategy when needed.

### Seam blending requirement (important)

At every section boundary, add a soft blending treatment so seams are visually natural:

- Add pseudo-elements (`::after` on previous section or `::before` on next).
- Use gradient + blur (`filter: blur(...)`) or masked overlay to soften the join.
- Keep overlap subtle (e.g., 24-64px depending on density) and avoid muddy text areas.
- Validate on both desktop and mobile breakpoints.

## Delivery format

Return outputs in this sequence:

1. LP strategy summary (audience/concept)
2. Section structure and copy draft
3. Style guide
4. Image prompt table (desktop/mobile paired)
5. Final HTML/CSS snippet with responsive swap + seam blending
6. Implementation checklist for user handoff

## Reusability and abstraction rules

- Remove product-specific assumptions from the process.
- Keep the workflow reusable for any domain (event, SaaS, D2C, B2B, education, local service).
- If user gives minimal input, proceed with reasonable defaults and clearly label assumptions.
- If user provides brand assets or photos, prioritize them and adapt prompts/layout accordingly.
