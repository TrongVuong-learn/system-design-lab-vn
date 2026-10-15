import { createHash } from 'node:crypto';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

/** Called only after Vite has written the immutable static artifact. */
export async function buildOffline(directory: string) {
  async function walk(dir: string): Promise<string[]> {
    const entries = await readdir(dir, { withFileTypes: true });
    const nested = await Promise.all(
      entries.map((e) =>
        e.isDirectory() ? walk(join(dir, e.name)) : Promise.resolve([join(dir, e.name)]),
      ),
    );
    return nested.flat();
  }
  const files = (await walk(directory))
    .filter((p) => !['sw.js', 'offline.json'].includes(relative(directory, p)))
    .sort();
  const assets = await Promise.all(
    files.map(async (path) => {
      const body = await readFile(path);
      return {
        url: '/' + relative(directory, path).split('\\').join('/'),
        bytes: body.length,
        integrity: 'sha256-' + createHash('sha256').update(body).digest('base64'),
      };
    }),
  );
  const template = await readFile(new URL('./offline-worker.template.js', import.meta.url), 'utf8');
  const version = createHash('sha256')
    .update(JSON.stringify(assets))
    .update(template)
    .digest('hex')
    .slice(0, 16);
  const manifest = { version, bytes: assets.reduce((n, a) => n + a.bytes, 0), assets };
  await writeFile(join(directory, 'offline.json'), JSON.stringify(manifest));
  await writeFile(
    join(directory, 'sw.js'),
    template.replace('/* MANIFEST */ null', JSON.stringify(manifest)),
  );
  return manifest;
}
