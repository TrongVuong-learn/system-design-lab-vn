import { test, expect } from 'vitest';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { buildOffline } from '../../scripts/offline';
import { prepareVercel } from '../../scripts/vercel-output';
test('Vercel pack preserves exact static bytes and correctly scopes cache headers', async () => {
  const root = await mkdtemp(join(tmpdir(), 'sdl-vercel-'));
  try {
    const dist = join(root, 'dist'),
      out = join(root, 'output');
    await mkdir(join(dist, 'assets'), { recursive: true });
    await writeFile(join(dist, 'index.html'), '<main>study</main>');
    await writeFile(join(dist, 'assets', 'app-hash.js'), 'study=1');
    await buildOffline(dist);
    const result = await prepareVercel(dist, out);
    expect(result.files).toBe(4);
    expect(await readFile(join(out, 'static', 'assets', 'app-hash.js'), 'utf8')).toBe('study=1');
    const config = JSON.parse(await readFile(join(out, 'config.json'), 'utf8'));
    const route = (url: string) =>
      config.routes.find((r: { src?: string }) => r.src && new RegExp(r.src).test(url));
    expect(route('/assets/app-hash.js').headers['Cache-Control']).toContain('immutable');
    for (const url of ['/', '/index.html', '/sw.js', '/offline.json'])
      expect(route(url).headers['Cache-Control']).toContain('no-cache');
    expect(route('/swXjs')).toBeUndefined();
    expect(config.version).toBe(3);
    await expect(prepareVercel(dist, out)).rejects.toThrow('Output exists');
    await writeFile(join(dist, 'index.html'), 'tampered');
    await expect(prepareVercel(dist, join(root, 'other'))).rejects.toThrow('integrity mismatch');
    await writeFile(join(dist, '.env'), 'not-for-upload');
    await expect(prepareVercel(dist, join(root, 'extra'))).rejects.toThrow('Unexpected or missing');
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
