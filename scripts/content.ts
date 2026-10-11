import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { lessonSchema, moduleSchema } from '../packages/content-schema/src/index';
const source = await readFile('CURRICULUM_MAP.md', 'utf8');
const modules = [...source.matchAll(/^\| (L[0-5]\.[1-6]) \| ([^|]+) \|/gm)].map((m) => {
  const topics = m[2]!.trim();
  return moduleSchema.parse({
    id: m[1],
    level: m[1]!.slice(0, 2),
    title: topics.split(';')[0]!.trim(),
    topics,
  });
});
if (modules.length !== 36 || new Set(modules.map((m) => m.id)).size !== 36)
  throw new Error('Expected 36 unique curriculum modules');
const raw = JSON.parse(await readFile('content/lessons/vi/intro.json', 'utf8')) as unknown[];
const lessons = raw.map((l) => lessonSchema.parse(l));
if (new Set(lessons.map((l) => l.id)).size !== lessons.length)
  throw new Error('Duplicate lesson IDs');
for (const l of lessons)
  if (!modules.some((m) => m.id === l.moduleId)) throw new Error(`Unknown module ${l.moduleId}`);
if (!process.argv.includes('--check')) {
  await mkdir('apps/web/src/generated', { recursive: true });
  await writeFile(
    'apps/web/src/generated/catalog.json',
    JSON.stringify({ modules, lessons }, null, 2),
  );
}
console.log(
  `Content validated: ${modules.length} modules, ${lessons.length} available introductory lessons. Full curriculum remains in development.`,
);
