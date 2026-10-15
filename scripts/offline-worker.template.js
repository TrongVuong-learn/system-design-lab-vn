/* Generated into dist/sw.js; no runtime or progress data is cached. */
const pack = /* MANIFEST */ null;
const prefix = 'sdl-offline-';
const cacheName = prefix + pack.version;
const urls = new Set(pack.assets.map((a) => a.url));
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(cacheName);
      try {
        await cache.addAll(
          pack.assets.map(
            (asset) =>
              new Request(asset.url, {
                cache: 'reload',
                credentials: 'same-origin',
                integrity: asset.integrity,
              }),
          ),
        );
      } catch (error) {
        await caches.delete(cacheName);
        throw error;
      }
    })(),
  );
});
// No skipWaiting: an update must not replace the version of an open lesson.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((k) => k.startsWith(prefix) && k !== cacheName).map((k) => caches.delete(k)),
      );
      await self.clients.claim();
    })(),
  );
});
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;
  // Only the app entry navigation, never unknown paths, identity or API responses.
  const navigation = request.mode === 'navigate' && ['/', '/index.html'].includes(url.pathname);
  if (!navigation && (url.search || !urls.has(url.pathname))) return;
  event.respondWith(
    (async () => {
      const cache = await caches.open(cacheName);
      const response = await cache.match(navigation ? '/index.html' : url.pathname);
      return response || fetch(request);
    })(),
  );
});
self.addEventListener('message', (event) => {
  if (!['SDL_PACK_STATUS', 'SDL_PACK_REPAIR'].includes(event.data?.type) || !event.ports[0]) return;
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(cacheName);
        if (event.data.type === 'SDL_PACK_REPAIR') {
          // Explicit user action only. addAll is atomic; a failed repair preserves existing entries.
          await cache.addAll(
            pack.assets.map(
              (asset) =>
                new Request(asset.url, {
                  cache: 'reload',
                  credentials: 'same-origin',
                  integrity: asset.integrity,
                }),
            ),
          );
        }
        const present = await Promise.all(pack.assets.map((asset) => cache.match(asset.url)));
        event.ports[0].postMessage({
          version: pack.version,
          bytes: pack.bytes,
          ready: present.every(Boolean),
          files: pack.assets.length,
        });
      } catch {
        event.ports[0].postMessage({
          error: 'Gói chưa tải đủ. Kiểm tra mạng hoặc dung lượng rồi thử lại.',
        });
      }
    })(),
  );
});
