# Book Index — companion demo

Interactive lab for the article *Your Book-to-Skill Conversion Is Really a
Retrieval Index*. A fixture book — *The Queue at the Edge*, six chapters —
gets answered three ways so the mechanics stay visible:

| Mode | Context loaded | What it shows |
|---|---|---|
| **whole-book** | all 6 full chapters (~2,257 est. tokens) | the baseline: pays the full bill every question |
| **skill-index** | `SKILL.md` manifest + one distilled leaf (~570–600) | the index: route via the manifest, load one file, answer |
| **index + escalate** | manifest + leaf + the leaf's source chapter | the fix for a miss: the leaf's `sourceRef` loads the real chapter once |

Three scripted questions cover the three cases: a kept fact (correct,
~4x cheaper), a kept headline number (correct, ~4x cheaper), and a detail
the distiller **dropped** — the Lisbon ring's node count — where index
mode reports a `confident-miss` and escalation recovers it.

Zero dependencies — Node 20+ only. The corpus, index, modes, and
questions are plain ES modules shared by the browser UI, the CLI, and
the test suite.

## What it proves

- **The file layout IS the index.** A small always-loaded manifest
  (core model + chapter map with `covers` phrases and `sourceRef`s) plus
  one file per chapter = progressive disclosure expressed as directories.
- **Selection is the cheap part.** Index context is ~25% of whole-book
  cost even at toy scale; on a real book the ratio widens because the
  manifest stays fixed while the book grows.
- **Distillation is lossy and quiet.** The leaf that drops a detail
  doesn't announce the drop — the miss arrives confidently.
- **Source refs turn a guess into a lookup.** Escalating through the
  leaf's `sourceRef` recovers the dropped fact for less than half the
  whole-book bill.

## Run it

```text
npm start        # serve the lab on :3000 (PORT env overrides)
npm test         # routing, modes, escalation, example-mirror, server
npm run report   # side-by-side CLI report (exits 1 if the claims drift)
npm run check    # both
```

## Layout

- `public/book.mjs` — the corpus: full chapters, distilled leaves, and
  the `SKILL.md`-shaped `MANIFEST`.
- `public/index.mjs` — token accounting (`estimateTokens`, ~4 chars/token)
  and manifest routing (`covers` phrase scoring).
- `public/modes.mjs` — `answerWholeBook` / `answerSkillIndex` /
  `answerWithEscalation` / `compareQuestion`.
- `public/questions.mjs` — the three scripted questions, their evidence
  markers, which fact the distiller dropped.
- `examples/book/*.md` + `examples/skill/SKILL.md` +
  `examples/skill/chapters/*.md` — the same corpus as inspectable files;
  `test/examples.test.mjs` asserts the embedded copy never drifts.
- `app/server.js` — allowlisted static server + `/health` + `/version`.
- `scripts/index-report.mjs` — CLI side-by-side with claim checks.

## Honest limits

- "Answering" is **evidence lookup**: a mode is correct iff its loaded
  context contains the question's marker string. No LLM is called — the
  lab demonstrates context cost and coverage, the parts the 24x claim is
  actually about.
- Token counts are **estimates** (~4 chars/token). Good enough to compare
  modes; not a billing meter.
- Routing is **substring scoring** over `covers` phrases, not model
  routing — chosen so the selection step is deterministic and inspectable.
- The corpus is a **fixture**: six ~400-word chapters. A real book inflates
  both context bills but *widens* the ratio — the manifest stays ~5K while
  the book grows unbounded.
- The distilled leaves were hand-written to be good distillations. Real
  converter output quality is the variable this lab cannot show — which is
  itself the point of the lossy-edge section.

Educational demo — not a converter, not an LLM, not production
infrastructure.
