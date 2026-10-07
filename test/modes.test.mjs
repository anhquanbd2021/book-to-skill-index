import test from 'node:test';
import assert from 'node:assert/strict';
import { answerWholeBook, answerSkillIndex, answerWithEscalation, compareAll } from '../public/modes.mjs';
import { QUESTIONS } from '../public/questions.mjs';

const byId = (id) => QUESTIONS.find((q) => q.id === id);

test('whole-book mode answers every scripted question at full cost', () => {
  for (const q of QUESTIONS) {
    const r = answerWholeBook(q);
    assert.equal(r.status, 'correct', q.id);
    assert.equal(r.loaded.length, 6);
  }
});

test('index mode answers correctly when the leaf kept the fact', () => {
  for (const id of ['q-signals', 'q-flush-trigger']) {
    const r = answerSkillIndex(byId(id));
    assert.equal(r.status, 'correct', id);
    assert.ok(r.totalTokens < answerWholeBook(byId(id)).totalTokens, 'index must cost less');
  }
});

test('the dropped detail surfaces as a confident miss, not a correct guess', () => {
  const r = answerSkillIndex(byId('q-ring-size'));
  assert.equal(r.status, 'confident-miss');
  assert.equal(r.routedTo.id, 'ch02');
  assert.ok(!r.answer.includes('Fourteen'), 'answer must not contain the dropped fact');
});

test('escalation via the leaf source ref recovers the dropped detail', () => {
  const q = byId('q-ring-size');
  const r = answerWithEscalation(q);
  assert.equal(r.mode, 'skill-index+escalate');
  assert.equal(r.status, 'correct');
  assert.ok(r.loaded.some((f) => f.name.includes('escalated')));
  assert.ok(r.totalTokens < answerWholeBook(q).totalTokens, 'still cheaper than whole book');
});

test('side-by-side report: index pays less on every question', () => {
  for (const r of compareAll(QUESTIONS)) {
    assert.ok(r.index.totalTokens < r.whole.totalTokens, r.question.id);
    assert.ok(r.savingsX > 1, r.question.id);
  }
});
