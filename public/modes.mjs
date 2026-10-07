// The two answer modes the post compares — plus the escalation step the
// post omits and the article adds.
//
//   whole-book  : context = every chapter's full text. Pays the full bill
//                 every question, finds anything the book contains.
//   skill-index : context = manifest + one distilled leaf (routed). Pays
//                 ~manifest+leaf, finds only what the distiller kept.
//   escalate    : index mode's fix for a miss — the leaf carries a source
//                 ref, so load that chapter's full text and re-answer.
//                 Costs one full chapter, only when needed.
//
// "Answering" = evidence lookup for the question's marker, then the
// scripted answer text. The lab demonstrates context cost and coverage,
// not language-model behavior — see README honest limits.

import { BOOK } from './book.mjs';
import { estimateTokens, wholeBookTokens, indexContext } from './index.mjs';

const contains = (haystack, needle) =>
  haystack.toLowerCase().includes(needle.toLowerCase());

// Pull the sentence containing the marker, for display as evidence.
function evidenceIn(text, marker) {
  const lines = text.split('\n');
  const idx = lines.findIndex((l) => contains(l, marker));
  if (idx === -1) return null;
  // join the matched line with a continuation line if it wraps
  const seg = [lines[idx], lines[idx + 1] || ''].join(' ').trim();
  return seg.length > 220 ? `${seg.slice(0, 217)}…` : seg;
}

export function answerWholeBook(question) {
  const loaded = BOOK.chapters.map((ch) => ({
    name: `book/${ch.file}`,
    tokens: estimateTokens(ch.full),
  }));
  const hit = BOOK.chapters.find((ch) => contains(ch.full, question.marker));
  return {
    mode: 'whole-book',
    loaded,
    totalTokens: loaded.reduce((s, f) => s + f.tokens, 0),
    routedTo: null,
    status: hit ? 'correct' : 'miss',
    answer: hit ? question.answer : 'No chapter text supports an answer.',
    evidence: hit ? evidenceIn(hit.full, question.marker) : null,
    source: hit ? `full text of ${hit.file}` : null,
  };
}

export function answerSkillIndex(question) {
  const ctx = indexContext(question.label);
  const chapter = ctx.routedTo;
  if (!chapter) {
    return {
      mode: 'skill-index',
      loaded: ctx.loaded,
      totalTokens: ctx.totalTokens,
      routedTo: null,
      scored: ctx.scored,
      status: 'miss',
      answer: 'The manifest routes this question to no chapter — the index has nowhere to look.',
      evidence: null,
      source: null,
    };
  }
  if (contains(chapter.distilled, question.marker)) {
    return {
      mode: 'skill-index',
      loaded: ctx.loaded,
      totalTokens: ctx.totalTokens,
      routedTo: chapter,
      scored: ctx.scored,
      status: 'correct',
      answer: question.answer,
      evidence: evidenceIn(chapter.distilled, question.marker),
      source: `distilled ${chapter.file}`,
    };
  }
  // The lossy edge: the distilled leaf does not carry the fact. Nothing in
  // the context says "this was dropped" — the index answers (or guesses)
  // with the distilled remainder, confidently.
  return {
    mode: 'skill-index',
    loaded: ctx.loaded,
    totalTokens: ctx.totalTokens,
    routedTo: chapter,
    scored: ctx.scored,
    status: 'confident-miss',
    answer: question.partial || chapter.partialAnswer,
    evidence: null,
    source: `distilled ${chapter.file} (detail dropped)`,
  };
}

// The mitigation the article prescribes: leaf files carry source refs, so
// a miss can escalate — load the routed chapter's *full* text and retry.
export function answerWithEscalation(question) {
  const base = answerSkillIndex(question);
  if (base.status === 'correct' || !base.routedTo) return base;
  const chapter = base.routedTo;
  const loaded = [
    ...base.loaded,
    { name: `book/${chapter.file} (escalated via ${chapter.sourceRef})`, tokens: estimateTokens(chapter.full) },
  ];
  const hit = contains(chapter.full, question.marker);
  return {
    ...base,
    mode: 'skill-index+escalate',
    loaded,
    totalTokens: loaded.reduce((s, f) => s + f.tokens, 0),
    status: hit ? 'correct' : 'miss',
    answer: hit ? question.answer : 'Even the source chapter lacks it.',
    evidence: hit ? evidenceIn(chapter.full, question.marker) : null,
    source: hit ? `full text of ${chapter.file} via source ref ${chapter.sourceRef}` : null,
  };
}

// Side-by-side report for one question — used by the UI and the CLI.
export function compareQuestion(question) {
  const whole = answerWholeBook(question);
  const index = answerSkillIndex(question);
  const escalated = index.status === 'confident-miss' ? answerWithEscalation(question) : null;
  const savings = whole.totalTokens > 0 ? Math.round((whole.totalTokens / index.totalTokens) * 10) / 10 : 0;
  return { question, whole, index, escalated, savingsX: savings };
}

export function compareAll(questions) {
  return questions.map(compareQuestion);
}

export { wholeBookTokens };
