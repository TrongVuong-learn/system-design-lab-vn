import { readFile, readdir, mkdir, writeFile, cp } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve, join, relative } from 'node:path';
import { pathToFileURL } from 'node:url';

/** Package only a complete, integrity-checked static artifact. No rebuild during upload. */
export async function prepareVercel(dist: string, output: string) {
  const manifest = JSON.parse(await readFile(join(dist, 'offline.json'), 'utf8')) as {
    version: string;
    assets: { url: string; integrity: string }[];
  };
  const expected = new Map(manifest.assets.map((a) => [a.url.slice(1), a.integrity]));
  expected.set('offline.json', '');
  expected.set('sw.js', '');
  async function walk(dir: string): Promise<string[]> {
    const entries = await readdir(dir, { withFileTypes: true });
    return (
      await Promise.all(
        entries.map((e) =>
          e.isDirectory() ? walk(join(dir, e.name)) : Promise.resolve([join(dir, e.name)]),
        ),
      )
    ).flat();
  }
  const files = await walk(dist);
  if (files.length !== expected.size) throw new Error('Unexpected or missing artifact files');
  const hashes: Record<string, string> = {};
  for (const file of files) {
    const name = relative(dist, file).split('\\').join('/');
    if (!expected.has(name)) throw new Error(`Unexpected artifact file: ${name}`);
    const body = await readFile(file);
    const integrity = 'sha256-' + createHash('sha256').update(body).digest('base64');
    if (expected.get(name) && expected.get(name) !== integrity)
      throw new Error(`Artifact integrity mismatch: ${name}`);
    hashes[name] = createHash('sha256').update(body).digest('hex');
  }
  // A fresh output prevents obsolete assets from a previous deployment leaking into this one.
  try {
    await readdir(output);
    throw new Error('Output exists: choose a fresh packaging directory');
  } catch (error) {
    if (!(error instanceof Error && 'code' in error && error.code === 'ENOENT')) throw error;
  }
  const sourceConfig = JSON.parse(
    await readFile(new URL('../vercel.json', import.meta.url), 'utf8'),
  ) as {
    headers: { source: string; headers: { key: string; value: string }[] }[];
  };
  type Route =
    | { src: string; headers: Record<string, string>; continue: true }
    | { handle: 'filesystem' };
  const routes: Route[] = sourceConfig.headers.map((rule) => ({
    src:
      rule.source === '/assets/(.*)'
        ? '^/assets/.*$'
        : '^' + rule.source.replaceAll('.', '\\.') + '$',
    headers: Object.fromEntries(rule.headers.map((h) => [h.key, h.value])),
    continue: true,
  }));
  routes.push({ handle: 'filesystem' });
  await mkdir(output, { recursive: true });
  await cp(dist, join(output, 'static'), { recursive: true });
  await writeFile(
    join(output, 'config.json'),
    JSON.stringify({ version: 3, routes }, null, 2) + '\n',
  );
  return { version: manifest.version, files: files.length, hashes };
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const dist = resolve(process.argv[2] ?? 'dist');
  const output = resolve(process.argv[3] ?? '.vercel/output');
  const result = await prepareVercel(dist, output);
  console.log(JSON.stringify({ version: result.version, files: result.files, output }));
}
