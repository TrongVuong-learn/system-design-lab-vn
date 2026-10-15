import { test, expect, vi } from 'vitest';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';

test('quota failure deletes only the new pack; repair failure preserves old entries', async () => {
  const handlers = new Map<string, (event: unknown) => void>();
  const cache = {
    addAll: vi.fn().mockRejectedValue(new Error('QuotaExceededError')),
    match: vi.fn().mockResolvedValue({}),
  };
  const cacheStorage = {
    open: vi.fn().mockResolvedValue(cache),
    delete: vi.fn().mockResolvedValue(true),
  };
  const pack = {
    version: 'new',
    bytes: 20,
    assets: [{ url: '/index.html', integrity: 'sha256-test' }],
  };
  const source = (await readFile('scripts/offline-worker.template.js', 'utf8')).replace(
    '/* MANIFEST */ null',
    JSON.stringify(pack),
  );
  runInNewContext(source, {
    self: {
      addEventListener: (name: string, fn: (event: unknown) => void) => handlers.set(name, fn),
    },
    caches: cacheStorage,
    Request: class {
      constructor(
        public url: string,
        public init: unknown,
      ) {}
    },
  });
  let pending: Promise<unknown> = Promise.resolve();
  const waitUntil = (p: Promise<unknown>) => {
    pending = p;
  };
  handlers.get('install')!({ waitUntil });
  await expect(pending).rejects.toThrow('QuotaExceededError');
  expect(cacheStorage.delete.mock.calls).toEqual([['sdl-offline-new']]);
  cacheStorage.delete.mockClear();
  const reply = vi.fn();
  handlers.get('message')!({
    waitUntil,
    data: { type: 'SDL_PACK_REPAIR' },
    ports: [{ postMessage: reply }],
  });
  await pending;
  expect(reply).toHaveBeenCalledWith({
    error: 'Gói chưa tải đủ. Kiểm tra mạng hoặc dung lượng rồi thử lại.',
  });
  expect(cacheStorage.delete).not.toHaveBeenCalled();
});
