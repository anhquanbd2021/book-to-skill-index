import test from 'node:test';
import assert from 'node:assert/strict';
import { createStaticServer } from '../app/server.js';
import { once } from 'node:events';

async function withServer(fn) {
  const server = createStaticServer();
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    await fn(base);
  } finally {
    server.close();
  }
}

test('GET /health returns ok', async () => {
  await withServer(async (base) => {
    const res = await fetch(`${base}/health`);
    assert.equal(res.status, 200);
    assert.equal(await res.text(), 'ok');
  });
});

test('GET /version returns package metadata', async () => {
  await withServer(async (base) => {
    const res = await fetch(`${base}/version`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.name, 'book-to-skill-index-demo');
    assert.ok(body.version);
  });
});

test('GET / serves the lab, unknown + traversal paths 404', async () => {
  await withServer(async (base) => {
    assert.equal((await fetch(`${base}/`)).status, 200);
    assert.equal((await fetch(`${base}/nope`)).status, 404);
    assert.equal((await fetch(`${base}/../package.json`)).status, 404);
    assert.equal((await fetch(`${base}/app/server.js`)).status, 404);
  });
});
