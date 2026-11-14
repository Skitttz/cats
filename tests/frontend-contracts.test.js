import assert from 'node:assert/strict';
import test from 'node:test';
import { requestResult, requireSuccess } from '../src/Api/request.js';
import { hasLikeKey, isPrivateQuery, removePhotoFromFeed } from '../src/Utils/queryCache.js';
import { fetchChatMedia, isPrivateChatMedia } from '../src/Utils/chatMedia.js';
import { createCatDetector } from '../src/Components/Detector/catDetector.js';
import { lockScroll } from '../src/Utils/scrollLock.js';

test('HTTP failure cannot become form data or a successful React Query mutation', async () => {
  const result = await requestResult('/photo', {}, async () => new Response('{"message":"JWT expirado"}', { status: 401 }));
  assert.equal(result.ok, false);
  assert.equal(result.json, null);
  assert.equal(result.error.status, 401);
  assert.throws(() => requireSuccess(result), /JWT expirado/);
});

test('network and invalid JSON failures use the same explicit error contract', async () => {
  const offline = await requestResult('/photo', {}, async () => { throw new TypeError('Failed to fetch'); });
  assert.equal(offline.ok, false);
  assert.equal(offline.response, null);
  assert.throws(() => requireSuccess(offline), /Failed to fetch/);
  const invalid = await requestResult('/photo', {}, async () => new Response('<html>proxy error</html>'));
  assert.equal(invalid.ok, false);
  assert.equal(invalid.json, null);
  assert.throws(() => requireSuccess(invalid), /resposta inválida/);
});

test('successful JSON and empty DELETE responses remain valid', async () => {
  const result = await requestResult('/photo', {}, async () => new Response('{"post_id":42}'));
  assert.equal(requireSuccess(result).json.post_id, 42);
  const empty = await requestResult('/photo/42', {}, async () => new Response(null, { status: 204 }));
  assert.equal(requireSuccess(empty).json, null);
});

test('account-specific like keys cannot reuse another account cache entry', () => {
  assert.notDeepEqual(hasLikeKey(1, 42), hasLikeKey(2, 42));
  assert.deepEqual(hasLikeKey('1', '42'), hasLikeKey(1, 42));
  assert.equal(isPrivateQuery({ queryKey: hasLikeKey(1, 42) }), true);
  assert.equal(isPrivateQuery({ queryKey: ['photos', 0, 3] }), false);
});

test('deletion removes the photo across pages without mutating cache snapshots', () => {
  const photo = { id: 42 };
  const feed = { pages: [[{ id: 1 }, photo], [{ id: 2 }, photo]], pageParams: [1, 2] };
  const next = removePhotoFromFeed(feed, '42');
  assert.deepEqual(next.pages, [[{ id: 1 }], [{ id: 2 }]]);
  assert.deepEqual(next.pageParams, [1, 2]);
  assert.equal(feed.pages[0].length, 2);
  assert.deepEqual(removePhotoFromFeed([photo, { id: 2 }], 42), [{ id: 2 }]);
  assert.equal(removePhotoFromFeed(undefined, 42), undefined);
});

test('private media authenticates only against the configured API origin/path', async () => {
  const apiBase = 'https://api.example/json';
  const src = `${apiBase}/api/chat_media/2/photo.jpg`;
  assert.equal(isPrivateChatMedia(src, apiBase), true);
  assert.equal(isPrivateChatMedia('https://evil.example/json/api/chat_media/2/photo.jpg', apiBase), false);
  assert.equal(isPrivateChatMedia('blob:https://app.example/local', apiBase), false);
  let fetched = false;
  await assert.rejects(fetchChatMedia('https://evil.example/json/api/chat_media/2/photo.jpg', {
    apiBase, headers: { Authorization: 'Bearer private' }, fetchImpl: () => { fetched = true; },
  }), /Origem/);
  assert.equal(fetched, false);
  const blob = await fetchChatMedia(src, {
    apiBase, headers: { Authorization: 'Bearer private' },
    fetchImpl: async (url, options) => {
      assert.equal(url, src);
      assert.equal(options.cache, 'no-store');
      assert.equal(options.headers.Authorization, 'Bearer private');
      return new Response('image bytes', { headers: { 'Content-Type': 'image/jpeg' } });
    },
  });
  assert.equal(blob.type, 'image/jpeg');
});

function detectorFixture({ detect = async () => [{ class: 'cat' }], imageFails = false } = {}) {
  let loads = 0;
  let disposals = 0;
  const revoked = [];
  const detector = createCatDetector({
    loadModel: async () => { loads += 1; return { detect, dispose: () => { disposals += 1; } }; },
    createImage: () => ({ set src(value) { queueMicrotask(() => imageFails ? this.onerror() : this.onload()); } }),
    createObjectURL: (file) => `blob:${file}`,
    revokeObjectURL: (url) => revoked.push(url),
  });
  return { detector, revoked, loads: () => loads, disposals: () => disposals };
}

test('detector reuses a model across images, then disposes it once', async () => {
  const fixture = detectorFixture();
  assert.equal(await fixture.detector.detect('first'), true);
  assert.equal(await fixture.detector.detect('second'), true);
  assert.equal(fixture.loads(), 1);
  assert.deepEqual(fixture.revoked, ['blob:first', 'blob:second']);
  fixture.detector.dispose();
  fixture.detector.dispose();
  assert.equal(fixture.disposals(), 1);
  await assert.rejects(fixture.detector.detect('third'), /encerrado/);
});

test('detector releases object URLs when image decoding or prediction fails', async () => {
  const decode = detectorFixture({ imageFails: true });
  await assert.rejects(decode.detector.detect('bad'), /abrir a imagem/);
  assert.deepEqual(decode.revoked, ['blob:bad']);
  decode.detector.dispose();
  assert.equal(decode.disposals(), 1);
  const predict = detectorFixture({ detect: async () => { throw new Error('GPU error'); } });
  await assert.rejects(predict.detector.detect('failed'), /GPU error/);
  assert.deepEqual(predict.revoked, ['blob:failed']);
  predict.detector.dispose();
});

test('unmount waits for running prediction before disposing the model', async () => {
  let finish;
  let started;
  const predictionStarted = new Promise((resolve) => { started = resolve; });
  const fixture = detectorFixture({ detect: () => { started(); return new Promise((resolve) => { finish = resolve; }); } });
  const pending = fixture.detector.detect('pending');
  await predictionStarted;
  fixture.detector.dispose();
  assert.equal(fixture.disposals(), 0);
  finish([{ class: 'cat' }]);
  await pending;
  assert.equal(fixture.disposals(), 1);
  assert.deepEqual(fixture.revoked, ['blob:pending']);
});

test('closing nested dialogs in either order restores the original page scroll', () => {
  for (const reverse of [false, true]) {
    const body = { style: { overflow: 'auto' } };
    const releaseFirst = lockScroll(body);
    const releaseSecond = lockScroll(body);
    const releases = reverse ? [releaseSecond, releaseFirst] : [releaseFirst, releaseSecond];
    releases[0]();
    assert.equal(body.style.overflow, 'hidden');
    releases[1]();
    releases[1]();
    assert.equal(body.style.overflow, 'auto');
  }
});

test('selecting an image again retries a failed model download', async () => {
  let attempts = 0;
  const detector = createCatDetector({
    loadModel: async () => {
      attempts += 1;
      if (attempts === 1) throw new Error('offline');
      return { detect: async () => [{ class: 'cat' }], dispose() {} };
    },
    createImage: () => ({ set src(value) { queueMicrotask(() => this.onload()); } }),
    createObjectURL: () => 'blob:retry',
    revokeObjectURL() {},
  });
  await assert.rejects(detector.detect('photo'), /offline/);
  assert.equal(await detector.detect('photo'), true);
  assert.equal(attempts, 2);
  detector.dispose();
});
