// CLI side-by-side report: run every scripted question through both modes
// and print what each paid in tokens and what each got right. Exits 1 if
// the demo's claims drift (the article quotes these numbers).

import { compareAll, wholeBookTokens } from '../public/modes.mjs';
import { estimateTokens } from '../public/index.mjs';
import { MANIFEST, BOOK } from '../public/book.mjs';
import { QUESTIONS } from '../public/questions.mjs';

const fmt = (n) => n.toLocaleString('en-US');

console.log('Book Index — side-by-side report');
console.log('================================');
console.log(`Corpus: "${BOOK.title}" — ${BOOK.chapters.length} chapters`);
console.log(`Whole book in context : ~${fmt(wholeBookTokens())} tokens (est., ~4 chars/token)`);
console.log(`Manifest always loaded: ~${fmt(estimateTokens(MANIFEST))} tokens\n`);

const results = compareAll(QUESTIONS);
let failures = 0;

for (const r of results) {
  console.log(`Q: ${r.question.label}`);
  console.log(`  routed to          : ${r.index.routedTo ? r.index.routedTo.file : '(no route)'}`);
  console.log(`  whole-book context : ~${fmt(r.whole.totalTokens)} tokens → ${r.whole.status}`);
  console.log(`  skill-index context: ~${fmt(r.index.totalTokens)} tokens → ${r.index.status} (${r.savingsX}x cheaper)`);
  if (r.escalated) {
    console.log(`  index + escalate   : ~${fmt(r.escalated.totalTokens)} tokens → ${r.escalated.status} (loaded ${r.escalated.source})`);
  }
  console.log(`  answer (index)     : ${r.index.answer}\n`);
}

// Claim checks — keep the article honest.
const book = results[0].whole.totalTokens;
const leafLoads = results.map((r) => r.index.totalTokens);
const claim1 = results.every((r) => r.index.totalTokens < r.whole.totalTokens);
const claim2 = results.filter((r) => r.index.status === 'correct').length >= 2;
const claim3 = results.some((r) => r.index.status === 'confident-miss');
const claim4 = results.every((r) => r.whole.status === 'correct');
const claim5 = results
  .filter((r) => r.index.status === 'confident-miss')
  .every((r) => r.escalated && r.escalated.status === 'correct' && r.escalated.totalTokens < r.whole.totalTokens);

const checks = [
  ['index mode pays less than whole-book on every question', claim1],
  ['index mode answers correctly when the leaf kept the fact (≥2 questions)', claim2],
  ['at least one question hits the lossy edge (confident-miss)', claim3],
  ['whole-book answers every scripted question', claim4],
  ['escalation recovers a dropped detail and still costs < whole book', claim5],
];

console.log('Claim checks');
console.log('------------');
for (const [label, ok] of checks) {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}`);
  if (!ok) failures += 1;
}
console.log(`\nMax index load: ~${fmt(Math.max(...leafLoads))} tokens vs ~${fmt(book)} for the whole book.`);
process.exit(failures === 0 ? 0 : 1);
