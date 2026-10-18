import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import {
  lessonSchema,
  moduleSchema,
  validateCatalog,
  validateReviews,
  validateCompatibility,
} from '../packages/content-schema/src/index';
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
const files = (await readdir('content/lessons/vi')).filter((f) => f.endsWith('.json')).sort();
const raw = (
  await Promise.all(
    files.map(
      async (f) => JSON.parse(await readFile(`content/lessons/vi/${f}`, 'utf8')) as unknown[],
    ),
  )
).flat();
const allLessons = raw.map((l) => lessonSchema.parse(l));
const { lessons, editorial, coverage } = validateCatalog(
  modules,
  allLessons,
  JSON.parse(await readFile('content/editorial.json', 'utf8')),
);
validateCompatibility(
  allLessons,
  JSON.parse(await readFile('content/compatibility-v1.json', 'utf8')),
);
const reviewFiles = (await readdir('content/reviews/vi')).filter((f) => f.endsWith('.json')).sort();
const reviews = validateReviews(
  (
    await Promise.all(
      reviewFiles.map(
        async (f) => JSON.parse(await readFile(`content/reviews/vi/${f}`, 'utf8')) as unknown[],
      ),
    )
  ).flat(),
  lessons.map((l) => l.id),
);
// Keep the familiar first lesson and order; the source files do not define navigation.
const order = [
  'request',
  'concurrency',
  'cpu-io',
  'address-space',
  'file-handles',
  'event-loop',
  'library-search',
  'hash-table',
  'search-tree',
  'priority-heap',
  'locality',
  'serialization',
  'compression',
  'metrics',
  'cache',
  'dns',
  'routing',
  'transport',
  'capacity',
  'http',
  'cookie-session',
  'reverse-proxy',
  'multiplexing',
  'tls',
  'network',
  'balance',
  'queue',
  'replica',
  'design',
];
lessons.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
if (!process.argv.includes('--check')) {
  await mkdir('apps/web/src/generated', { recursive: true });
  await writeFile(
    'apps/web/src/generated/catalog.json',
    JSON.stringify(
      {
        modules,
        lessons,
        reviews,
        editorial: {
          ...editorial,
          lessons: editorial.lessons.filter((r) => lessons.some((l) => l.id === r.lessonId)),
        },
        coverage,
      },
      null,
      2,
    ),
  );
}
console.log(
  `Content validated: ${modules.length} modules, ${lessons.length} available introductory lessons, ${reviews.length} integrated review. Full curriculum remains in development.`,
);
