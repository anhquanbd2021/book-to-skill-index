// The skill-index machinery: token accounting + manifest routing.
//
// This is the whole point of the lab — the index is not a database, it is
// a file layout: a small always-loaded manifest (MANIFEST) plus one
// distilled leaf per chapter. Routing reads the manifest's `covers` lists
// (what a real SKILL.md carries in its chapter map) and picks the leaf the
// question lands on.

import { BOOK, MANIFEST } from './book.mjs';

// Rough token estimate: ~4 chars per token for English prose. Labeled an
// estimate everywhere it surfaces — the lab compares *relative* cost.
export const estimateTokens = (text) => Math.ceil(text.length / 4);

export const wholeBookTokens = () =>
  BOOK.chapters.reduce((sum, ch) => sum + estimateTokens(ch.full), 0);

// Score one manifest entry against a question: count how many of the
// entry's `covers` phrases appear in the question text. A real skill
// router does this with the model's own matching; substring scoring keeps
// the lab deterministic and inspectable.
export function scoreEntry(question, chapter) {
  const q = question.toLowerCase();
  let score = 0;
  const hits = [];
  for (const phrase of chapter.covers) {
    if (q.includes(phrase.toLowerCase())) {
      score += phrase.split(' ').length; // longer phrase = stronger signal
      hits.push(phrase);
    }
  }
  return { chapter, score, hits };
}

// Route a question through the manifest. Returns ranked candidates plus
// the winner (highest score; tie → first in map order — the map is the
// index, order is part of the heuristic).
export function routeQuestion(question, { threshold = 1 } = {}) {
  const scored = BOOK.chapters
    .map((ch) => scoreEntry(question, ch))
    .sort((a, b) => b.score - a.score);
  const winner = scored[0] && scored[0].score >= threshold ? scored[0] : null;
  return { scored, winner };
}

// What the index mode loads to answer: the manifest, always, then one
// leaf if routing found one. This is the entire context bill.
export function indexContext(question) {
  const loaded = [{ name: 'SKILL.md (manifest)', tokens: estimateTokens(MANIFEST) }];
  const { scored, winner } = routeQuestion(question);
  if (winner) {
    loaded.push({
      name: `chapters/${winner.chapter.file}`,
      tokens: estimateTokens(winner.chapter.distilled),
    });
  }
  return {
    loaded,
    totalTokens: loaded.reduce((s, f) => s + f.tokens, 0),
    routedTo: winner ? winner.chapter : null,
    scored,
  };
}
