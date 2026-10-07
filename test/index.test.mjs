import test from 'node:test';
import assert from 'node:assert/strict';
import { BOOK, MANIFEST } from '../public/book.mjs';
import { estimateTokens, routeQuestion, indexContext, wholeBookTokens } from '../public/index.mjs';
import { QUESTIONS } from '../public/questions.mjs';

test('manifest is much smaller than the whole book', () => {
  const manifest = estimateTokens(MANIFEST);
  const book = wholeBookTokens();
  assert.ok(manifest < book / 4, `manifest ${manifest} should be << book ${book}`);
});

test('every scripted question routes to its expected chapter', () => {
  for (const q of QUESTIONS) {
    const { winner } = routeQuestion(q.label);
    assert.equal(winner?.chapter.id, q.expectChapter, q.id);
  }
});

test('index context = manifest + at most one leaf', () => {
  for (const q of QUESTIONS) {
    const ctx = indexContext(q.label);
    assert.equal(ctx.loaded[0].name, 'SKILL.md (manifest)');
    assert.ok(ctx.loaded.length <= 2, `loaded ${ctx.loaded.length} files`);
    assert.ok(ctx.totalTokens < wholeBookTokens());
  }
});

test('a question outside the map finds no route', () => {
  const { winner } = routeQuestion('What is the capital of France?');
  assert.equal(winner, null);
});
