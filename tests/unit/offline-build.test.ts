import { test, expect } from 'vitest';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { buildOffline } from '../../scripts/offline';
test('offline manifest covers every built resource, verifies bytes, and changes only with artifact', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'sdl-offline-'));
  try {
    await mkdir(join(dir, 'assets'));
    await writeFile(join(dir, 'index.html'), '<main>Việt</main>');
    await writeFile(join(dir, 'assets', 'lesson.js'), 'lesson=1');
    const one = await buildOffline(dir);
    expect(one.assets.map((a) => a.url)).toEqual(['/assets/lesson.js', '/index.html']);
    for (const a of one.assets) {
      const body = await readFile(join(dir, a.url));
      expect(a.integrity).toBe('sha256-' + createHash('sha256').update(body).digest('base64'));
      expect(a.bytes).toBe(body.length);
    }
    expect(one.bytes).toBe(Buffer.byteLength('<main>Việt</main>lesson=1'));
    expect((await buildOffline(dir)).version).toBe(one.version);
    await writeFile(join(dir, 'assets', 'lesson.js'), 'lesson=2');
    expect((await buildOffline(dir)).version).not.toBe(one.version);
    const worker = await readFile(join(dir, 'sw.js'), 'utf8');
    expect(worker).not.toContain('/* MANIFEST */ null');
    expect(worker).not.toContain('self.skipWaiting(');
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
