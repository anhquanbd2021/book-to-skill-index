import { BOOK, MANIFEST } from '/book.mjs';
import { QUESTIONS } from '/questions.mjs';
import { estimateTokens } from '/index.mjs';
import { compareQuestion } from '/modes.mjs';

const $ = (id) => document.getElementById(id);
const fmt = (n) => `~${n.toLocaleString('en-US')} tok`;

const STATUS_BADGE = {
  correct: 'pass',
  'confident-miss': 'danger',
  miss: 'warn',
};

function paintLoaded(listEl, loaded) {
  listEl.replaceChildren(...loaded.map((f) => {
    const li = document.createElement('li');
    li.className = 'loaded-file';
    li.innerHTML = `<code>${f.name}</code><span class="tok">${fmt(f.tokens)}</span>`;
    return li;
  }));
}

function paintAnswer(el, result) {
  el.replaceChildren();
  const badge = document.createElement('span');
  badge.className = `badge ${STATUS_BADGE[result.status] || 'info'}`;
  badge.textContent = result.status === 'confident-miss' ? 'confident miss' : result.status;
  const p = document.createElement('p');
  p.textContent = result.answer;
  el.append(badge, p);
  if (result.evidence) {
    const ev = document.createElement('p');
    ev.className = 'evidence';
    ev.textContent = `evidence (${result.source}): “${result.evidence}”`;
    el.append(ev);
  }
}

function paintMeter(el, tokens, max) {
  el.style.width = `${Math.max(3, Math.round((tokens / max) * 100))}%`;
}

function paintRouting(result) {
  const rows = result.scored.map(({ chapter, score, hits }) => {
    const li = document.createElement('li');
    li.className = 'route-row' + (result.routedTo && result.routedTo.id === chapter.id ? ' routed' : '');
    li.innerHTML = `<code>${chapter.file}</code><span class="hits">${hits.length ? hits.join(', ') : '—'}</span><span class="tok">${score} pt${score === 1 ? '' : 's'}</span>`;
    return li;
  });
  $('routing').replaceChildren(...rows);
  const b = $('route-badge');
  if (result.routedTo) {
    b.className = 'badge pass';
    b.textContent = `→ ${result.routedTo.file}`;
  } else {
    b.className = 'badge warn';
    b.textContent = 'no route';
  }
}

function paintCoverage() {
  $('coverage').replaceChildren(...QUESTIONS.map((q) => {
    const li = document.createElement('li');
    li.className = 'loaded-file' + (q.droppedFromDistill ? ' dropped' : '');
    li.innerHTML = `<code>${q.id}</code><span class="hits">${q.droppedFromDistill ? 'dropped by the distiller' : 'kept in the leaf'}</span>`;
    return li;
  }));
}

function run(q) {
  const r = compareQuestion(q);
  const max = r.whole.totalTokens;

  paintRouting(r.index);
  $('whole-tokens').textContent = fmt(r.whole.totalTokens);
  $('index-tokens').textContent = `${fmt(r.index.totalTokens)} · ${r.savingsX}x cheaper`;
  paintMeter($('whole-meter'), r.whole.totalTokens, max);
  paintMeter($('index-meter'), r.index.totalTokens, max);
  paintLoaded($('whole-loaded'), r.whole.loaded);
  paintLoaded($('index-loaded'), r.index.loaded);
  paintAnswer($('whole-answer'), r.whole);
  paintAnswer($('index-answer'), r.index);

  if (r.escalated) {
    $('escalation-block').hidden = false;
    $('escalated-tokens').textContent = fmt(r.escalated.totalTokens);
    paintMeter($('escalated-meter'), r.escalated.totalTokens, max);
    paintLoaded($('escalated-loaded'), r.escalated.loaded);
    paintAnswer($('escalated-answer'), r.escalated);
    paintCoverage();
  } else {
    $('escalation-block').hidden = true;
  }
}

// Question picker
for (const q of QUESTIONS) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'q-btn';
  btn.textContent = q.label;
  btn.addEventListener('click', () => {
    document.querySelectorAll('.q-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    run(q);
  });
  $('questions').append(btn);
}

// Corpus browser
$('book-files').replaceChildren(...BOOK.chapters.map((ch) => {
  const li = document.createElement('li');
  li.className = 'loaded-file';
  li.innerHTML = `<code>book/${ch.file}</code><span class="tok">${fmt(estimateTokens(ch.full))}</span>`;
  return li;
}));
$('skill-files').replaceChildren(
  (() => {
    const li = document.createElement('li');
    li.className = 'loaded-file';
    li.innerHTML = `<code>skill/SKILL.md</code><span class="tok">${fmt(estimateTokens(MANIFEST))} · always loaded</span>`;
    return li;
  })(),
  ...BOOK.chapters.map((ch) => {
    const li = document.createElement('li');
    li.className = 'loaded-file';
    li.innerHTML = `<code>skill/chapters/${ch.file}</code><span class="tok">${fmt(estimateTokens(ch.distilled))} · on demand</span>`;
    return li;
  }),
);

// Run the first question on load so the page shows the comparison.
document.querySelector('.q-btn')?.click();
