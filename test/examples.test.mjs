import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { BOOK, MANIFEST } from '../public/book.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const norm = (s) => s.replace(/\r\n/g, '\n').replace(/\n$/, '');

test('embedded book + skill mirror the examples/ fixtures on disk', async () => {
  const manifestFile = await readFile(`${root}examples/skill/SKILL.md`, 'utf8');
  assert.equal(norm(MANIFEST), norm(manifestFile));
  for (const ch of BOOK.chapters) {
    const full = await readFile(`${root}examples/book/${ch.file}`, 'utf8');
    const leaf = await readFile(`${root}examples/skill/chapters/${ch.file}`, 'utf8');
    assert.equal(norm(ch.full), norm(full), `book/${ch.file}`);
    assert.equal(norm(ch.distilled), norm(leaf), `skill/chapters/${ch.file}`);
  }
});
