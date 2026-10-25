import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import {
  lessonSchema,
  moduleSchema,
  validateCatalog,
  validateReviews,
  validateCompatibility,
  validatePathways,
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
const pathways = validatePathways(
  JSON.parse(await readFile('content/pathways.json', 'utf8')),
  lessons,
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
  'os-practice',
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
  'requirements-boundaries',
  'api-contracts',
  'data-models',
  'database-indexes',
  'transactions-isolation',
  'service-delivery',
];
const rank = new Map(order.map((id, index) => [id, index]));
lessons.sort((a, b) => {
  const ar = rank.get(a.id),
    br = rank.get(b.id);
  if (ar !== undefined || br !== undefined) return (ar ?? order.length) - (br ?? order.length);
  const kindRank = (id: string) =>
    id.startsWith('capstone-') ? 3 : id.startsWith('case-') ? 2 : id.startsWith('track-') ? 1 : 0;
  return (
    a.level.localeCompare(b.level) ||
    kindRank(a.id) - kindRank(b.id) ||
    a.moduleId.localeCompare(b.moduleId) ||
    a.id.localeCompare(b.id)
  );
});
if (!process.argv.includes('--check')) {
  await mkdir('apps/web/src/generated', { recursive: true });
  await writeFile(
    'apps/web/src/generated/catalog.json',
    JSON.stringify(
      {
        modules,
        lessons,
        reviews,
        pathways,
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
  `Content validated: ${modules.length} modules, ${lessons.length} beta lessons, ${pathways.tracks.length} tracks, ${pathways.capstones.length} capstones, ${pathways.cases.length} design cases, ${reviews.length} integrated review. Mastery is not inferred.`,
);
